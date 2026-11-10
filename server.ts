import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { dbManager } from './src/server/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Track currently active session email
let currentSessionEmail = 'alex.johnson@mindsphere.edu';

// -------------------------------------------------------------
// AUTHENTICATION & SESSION ENDPOINTS
// -------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  const normalized = email.toLowerCase().trim();
  let user = dbManager.getUser(normalized);

  if (!user) {
    // Automatically create profile on first login with requested role
    const derivedName = normalized.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
    user = dbManager.upsertUser({
      email: normalized,
      name: derivedName,
      role: role || (normalized.includes('teacher') || normalized.includes('prof') ? 'teacher' : 'student'),
      password,
    });
  } else if (role && user.role !== role) {
    // If user explicitly picked a role during login, respect it
    user.role = role;
    dbManager.upsertUser(user);
  }

  currentSessionEmail = normalized;

  return res.json({
    success: true,
    data: user,
    token: `ms_session_${Date.now()}`,
  });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role, specialization } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }

  const normalized = email.toLowerCase().trim();
  const assignedRole = role === 'teacher' ? 'teacher' : 'student';

  const user = dbManager.upsertUser({
    name,
    email: normalized,
    role: assignedRole,
    specialization: specialization || (assignedRole === 'teacher' ? 'Interdisciplinary Research & Curriculum' : 'Computational & Humanities Scholar'),
    title: assignedRole === 'teacher' ? 'Course Instructor & Academic Author' : 'Undergraduate Scholar',
    password,
  });

  currentSessionEmail = normalized;

  return res.json({
    success: true,
    data: user,
    token: `ms_session_${Date.now()}`,
  });
});

app.get('/api/user', (req, res) => {
  const user = dbManager.getUser(currentSessionEmail) || Object.values(dbManager.getDb().users)[0];
  res.json({
    success: true,
    data: user,
  });
});

app.put('/api/user/profile', (req, res) => {
  const { name, bio, specialization, institution, website, role, avatarBg } = req.body;
  const user = dbManager.getUser(currentSessionEmail);

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (specialization !== undefined) user.specialization = specialization;
  if (institution !== undefined) user.institution = institution;
  if (website !== undefined) user.website = website;
  if (avatarBg) user.avatarBg = avatarBg;
  if (role && (role === 'student' || role === 'teacher')) {
    user.role = role;
  }

  const updated = dbManager.upsertUser(user);
  res.json({
    success: true,
    data: updated,
  });
});

app.post('/api/user/language', (req, res) => {
  const { language } = req.body;
  const user = dbManager.getUser(currentSessionEmail);
  if (user && language) {
    user.language = language;
    dbManager.upsertUser(user);
  }
  return res.json({
    success: true,
    data: user,
  });
});

app.post('/api/user/toggle-plan', (req, res) => {
  const user = dbManager.getUser(currentSessionEmail);
  if (user) {
    if (user.plan === 'Free Plan') {
      user.plan = 'MindSphere Pro';
      user.stats.dailyRequestsLimit = 200;
    } else {
      user.plan = 'Free Plan';
      user.stats.dailyRequestsLimit = 50;
    }
    dbManager.upsertUser(user);
    res.json({ success: true, data: user });
  } else {
    res.status(404).json({ success: false, error: 'User not found' });
  }
});

// -------------------------------------------------------------
// COURSE ENDPOINTS (STUDENTS & TEACHERS)
// -------------------------------------------------------------
app.get('/api/courses', (req, res) => {
  res.json({
    success: true,
    data: dbManager.getCourses(),
  });
});

app.post('/api/courses', (req, res) => {
  try {
    const { title, category, description, hours, difficulty, color, bgGradient, modules, sampleQuiz } = req.body;
    const user = dbManager.getUser(currentSessionEmail);

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, error: 'Title, category, and description are required' });
    }

    const iconMap: Record<string, any> = {
      Science: 'biology',
      Law: 'law',
      Arts: 'arts',
      Mathematics: 'math',
      Business: 'business',
      Music: 'music',
      Technology: 'code',
    };

    const newCourse = dbManager.addCourse(
      {
        title,
        category,
        description,
        hours: Number(hours) || 20,
        progress: 0,
        color: color || '#8B5CF6',
        bgGradient: bgGradient || 'from-purple-600 to-indigo-700',
        iconName: iconMap[category] || 'general',
        difficulty: difficulty || 'Intermediate',
        authorId: user?.id || 'teacher-custom',
        instructor: {
          id: user?.id || 'teacher-custom',
          name: user?.name || 'Faculty Member',
          role: user?.title || 'Course Creator & Scholar',
          avatar: user?.avatarUrl,
        },
        totalStudents: 1,
        rating: 5.0,
        modules: modules && modules.length > 0 ? modules : [
          {
            id: `mod-${Date.now()}-1`,
            title: 'Course Introduction & Core Foundations',
            lessons: [
              {
                id: `les-${Date.now()}-1`,
                title: 'Overview of Core Principles',
                duration: '15 min',
                completed: false,
                summary: 'Welcome and primary conceptual framework.',
                keyTakeaways: ['Foundational concepts', 'Application methodology', 'Key terminology'],
                content: `Welcome to ${title}. This course is designed to guide you from foundational principles to rigorous practical application.`,
              },
            ],
          },
        ],
        sampleQuiz: sampleQuiz || [
          {
            id: `q-${Date.now()}`,
            question: `What is the core principle taught in ${title}?`,
            options: ['Foundational Synthesis', 'Empirical Verification', 'Systemic Feedback', 'All of the above'],
            correctIndex: 3,
            explanation: 'All options embody the comprehensive analytical method presented in this course.',
          },
        ],
      },
      currentSessionEmail
    );

    res.json({
      success: true,
      data: newCourse,
      message: 'Course created and published successfully to MindSphere catalog!',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to create course' });
  }
});

app.post('/api/courses/:id/progress', (req, res) => {
  const { id } = req.params;
  const { progressDelta, lessonId, hoursAdded } = req.body;
  const courses = dbManager.getCourses();
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }

  if (typeof progressDelta === 'number') {
    course.progress = Math.min(100, Math.max(0, course.progress + progressDelta));
  }
  if (typeof hoursAdded === 'number') {
    course.hours += hoursAdded;
  }
  if (lessonId) {
    for (const mod of course.modules) {
      for (const les of mod.lessons) {
        if (les.id === lessonId) {
          les.completed = true;
        }
      }
    }
  }

  const user = dbManager.getUser(currentSessionEmail);
  if (user) {
    if (typeof hoursAdded === 'number') user.stats.studyHours += hoursAdded;
    user.stats.totalXp += 50;
    const totalProg = courses.reduce((acc, c) => acc + c.progress, 0);
    user.stats.completionRate = Math.round(totalProg / courses.length);
    dbManager.upsertUser(user);
  }

  dbManager.saveDb(dbManager.getDb());

  res.json({
    success: true,
    data: course,
    userStats: user?.stats,
  });
});

// Attach or update a video lecture for a specific lesson
app.post('/api/courses/:id/lessons/:lessonId/video', (req, res) => {
  const { id, lessonId } = req.params;
  const { moduleId, video } = req.body;

  if (!video || !video.url) {
    return res.status(400).json({ success: false, error: 'Valid video object with url is required' });
  }

  const result = dbManager.updateLessonVideo(id, moduleId, lessonId, video);
  if (!result) {
    return res.status(404).json({ success: false, error: 'Course or lesson not found' });
  }

  res.json({
    success: true,
    data: result,
    message: 'Lesson video updated successfully',
  });
});

// -------------------------------------------------------------
// PLATFORM SETTINGS ENDPOINTS
// -------------------------------------------------------------
app.get('/api/settings', (req, res) => {
  res.json({
    success: true,
    data: dbManager.getSettings(),
  });
});

app.put('/api/settings', (req, res) => {
  try {
    const updated = dbManager.updateSettings(req.body);
    res.json({
      success: true,
      data: updated,
      message: 'Platform settings updated successfully',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to update settings' });
  }
});


// -------------------------------------------------------------
// ARTICLES & BLOG POSTS (TEACHER PUBLISHING + STUDENT LIKES & COMMENTS)
// -------------------------------------------------------------
app.get('/api/articles', (req, res) => {
  res.json({
    success: true,
    data: dbManager.getArticles(),
  });
});

app.post('/api/articles', (req, res) => {
  try {
    const { title, summary, content, category, tags, readTime } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ success: false, error: 'Title, category, and content are required' });
    }

    const newArticle = dbManager.addArticle({
      title,
      summary: summary || content.slice(0, 160) + '...',
      content,
      category,
      tags: Array.isArray(tags) ? tags : [category],
      readTime: readTime || '5 min read',
      authorEmail: currentSessionEmail,
    });

    res.json({
      success: true,
      data: newArticle,
      message: 'Article published to Faculty Research Feed!',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to publish article' });
  }
});

app.post('/api/articles/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const result = dbManager.toggleArticleLike(id, currentSessionEmail);
    res.json({
      success: true,
      liked: result.liked,
      likesCount: result.likesCount,
      article: result.article,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/articles/:id/comments', (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Comment content cannot be empty' });
    }

    const comment = dbManager.addArticleComment(id, currentSessionEmail, content.trim());
    res.json({
      success: true,
      data: comment,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// TEACHER DIRECTORY & FOLLOWING
// -------------------------------------------------------------
app.get('/api/teachers', (req, res) => {
  res.json({
    success: true,
    data: dbManager.getTeachers(),
  });
});

app.post('/api/teachers/:id/follow', (req, res) => {
  try {
    const { id } = req.params;
    const result = dbManager.toggleFollowTeacher(currentSessionEmail, id);
    res.json({
      success: true,
      isFollowing: result.isFollowing,
      followersCount: result.followersCount,
      followedTeachers: result.followedTeachers,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// LEADERBOARD & TEAMS
// -------------------------------------------------------------
app.get('/api/leaderboard', (req, res) => {
  res.json({
    success: true,
    data: dbManager.getDb().leaderboard,
  });
});

app.get('/api/teams', (req, res) => {
  res.json({
    success: true,
    data: dbManager.getDb().teams,
  });
});

app.post('/api/teams/toggle-join', (req, res) => {
  const { teamId } = req.body;
  const db = dbManager.getDb();
  const team = db.teams.find((t) => t.id === teamId);
  if (team) {
    team.isJoined = !team.isJoined;
    team.membersCount += team.isJoined ? 1 : -1;
    dbManager.saveDb(db);
    res.json({ success: true, data: team });
  } else {
    res.status(404).json({ success: false, error: 'Team not found' });
  }
});

// -------------------------------------------------------------
// DEFAULT CONVERSATION ANSWERS (NO EXTERNAL AI API REQUIRED)
// -------------------------------------------------------------
app.post('/api/ai/ask', (req, res) => {
  const { prompt, courseContext, language } = req.body;
  if (!prompt) {
    return res.status(400).json({ success: false, error: 'Prompt is required' });
  }

  const user = dbManager.getUser(currentSessionEmail);
  const currentLang = language || user?.language || 'en';

  if (user) {
    user.stats.dailyRequestsUsed += 1;
    user.stats.totalXp += 15;
    dbManager.upsertUser(user);
  }

  const answer = generateSocraticResponse(prompt, courseContext, currentLang);
  return res.json({
    success: true,
    answer,
    dailyRequestsUsed: user?.stats.dailyRequestsUsed || 1,
    dailyRequestsLimit: user?.stats.dailyRequestsLimit || 50,
  });
});

app.post('/api/ai/quiz', (req, res) => {
  const { topic, courseTitle } = req.body;
  const query = (topic || courseTitle || 'general').toLowerCase();

  const quiz = generateSmartQuiz(query);
  return res.json({ success: true, quiz });
});

function generateSocraticResponse(prompt: string, context?: string, lang: string = 'en'): string {
  const p = prompt.toLowerCase();

  // Multi-lingual Socratic Knowledge Base
  if (lang === 'uz') {
    if (p.includes('crispr') || p.includes('dna') || p.includes('bio') || context === 'Biology') {
      return `### CRISPR va Genom Muhandisligi Bo'yicha Pedagogik Tahlil

**CRISPR-Cas9** tizimini hujayraning eng aniq "Qidirish va Almashtirish" molekulyar vositasi deb tasavvur qiling:

1. **Yo'naltiruvchi RNK (sgRNA):** 20 ta nukleotidli spaser aniq maqsadli DNK ketma-ketligini topadi.
2. **PAM Blokirovkasi (NGG):** Cas9 fermenti DNK spiralini ochishdan oldin maxsus 5'-NGG-3' motifini tekshiradi.
3. **Molekulyar Kesish (Cas9):** HNH va RuvC domenlari PAMdan 3 asos jufti yuqorida toza ikki zanjirli uzilish hosil qiladi.
4. **Hujayraviy Qayta Tiklash:** Hujayra DNKsi NHEJ (genni o'chirish) yoki HDR (yangi ketma-ketlik kiritish) orqali tiklanadi.

### Tavsiya etilgan keyingi savollar
- Cas12 fermenti qanday qilib yopishqoq uchlar hosil qiladi?
- Epigenetik tahrirlashda dCas9 qanday qo'llaniladi?`;
    }

    if (p.includes('law') || p.includes('huquq') || p.includes('sud') || context === 'Law & Justice') {
      return `### Konstitutsiyaviy Nazorat va Sud Nazorati Tahlili

**Marbury v. Madison (1803)** ishi zamonaviy huquqiy davlat poydevorini belgilab bergan:

- **Asosiy Qoida:** Konstitutsiya oddiy qonunlardan ustun turuvchi oliy huquqiy hujjatdir.
- **Sud Huquqi:** Sudlar qonun chiqaruvchi organ qabul qilgan aktning Konstitutsiyaga muvofiqligini baholash va zid bo'lganini bekor qilish vakolatiga ega.
- **Tekshirish Darajalari:** Qattiq nazorat (Strict Scrutiny) davlatdan majburiy manfaat va eng kam cheklovchi usulni isbotlashni talab qiladi.

### Tavsiya etilgan keyingi savollar
- O'zbekiston Konstitutsiyaviy Sudi qanday ishlarni ko'rib chiqadi?
- Rational basis testi qachon qo'llaniladi?`;
    }

    return `### Fundamental Kontseptual Tahlil

Ajoyib ilmiy savol! MindSphere ko'p tarmoqli akademiyasida muammolarni tizimli tahlil qilish tavsiya etiladi:

- **Birinchi tamoyillar:** Murakkab hodisalarni asosiy isbotlangan aksiomalarga ajrating.
- **Tizimli bog'liqlik:** Sabab-oqibat aloqalarini va chegara shartlarini aniqlang.
- **Amaliy xulosa:** Nazariy modelni amaliy tajriba bilan mustahkamlang.

### Tavsiya etilgan keyingi savollar
- Ushbu mavzu bo'yicha 3 ta test savoli bilan bilimlarni sinab ko'rish
- Aniq matematik yoki amaliy misolni qadamma-qadam ko'rish`;
  }

  if (lang === 'ru') {
    if (p.includes('crispr') || p.includes('dna') || p.includes('bio') || context === 'Biology') {
      return `### Разбор CRISPR-Cas9 и эпигенетической инженерии

Представьте **CRISPR-Cas9** как высокоточный редактор генома с функцией «Найти и заменить»:

1. **Направляющая РНК (sgRNA):** Несет 20-нуклеотидный спейсер, комплементарный точному участку ДНК.
2. **Мотив PAM (NGG):** Замок безопасности; фермент Cas9 расплетает ДНК только при наличии 5'-NGG-3'.
3. **Каталитический разрез:** Нуклеазные домены RuvC и HNH вносят чистый двунитевой разрыв на 3 пары нуклеотидов выше PAM.
4. **Репарация клетки:** Клеточные пути NHEJ (нокаут гена) или HDR (точечная вставка) завершают редактирование.

### Рекомендуемые направления
- Чем механизм Cas12 отличается от традиционного Cas9?
- Как dCas9 используется для модуляции транскрипции без разрезов?`;
    }

    if (p.includes('law') || p.includes('право') || p.includes('суд') || context === 'Law & Justice') {
      return `### Доктрина судебного конституционного контроля

В прецеденте **Марбери против Мэдисона (1803)** председатель суда Джон Маршалл закрепил принцип равенства судебной власти:

- **Иерархия норм:** Конституция является фундаментальным законом, превосходящим ординарные законы парламента.
- **Судебный надзор:** Суды обязаны отказывать в применении законодательным актам, нарушающим конституционный текст.
- **Стандарты проверки:** Строгий надзор (Strict Scrutiny) требует доказывания неотложного государственного интереса.

### Рекомендуемые направления
- В чем различие между Strict Scrutiny и Rational Basis?
- Каковы пределы юрисдикции при политических вопросах?`;
    }

    return `### Системный педагогический разбор

Превосходный вопрос! В академической методологии MindSphere мы объединяем фундаментальные принципы с эмпирическим анализом:

- **Первоосновы:** Деконструкция задачи до неоспоримых базовых элементов.
- **Динамика системы:** Анализ обратных связей и предельных условий.
- **Синтез:** Верификация гипотезы на конкретных кейсах.

### Рекомендуемые направления
- Пройти экспресс-тест из 3 вопросов по теме
- Разобрать математическую формулировку шаг за шагом`;
  }

  // English (Default)
  if (p.includes('crispr') || p.includes('dna') || p.includes('gene') || p.includes('bio') || context === 'Biology') {
    return `### Understanding CRISPR & Molecular Precision

Think of **CRISPR-Cas9** as a word processor's "Find and Replace" engine designed for double-stranded DNA:

1. **The Search Query (sgRNA):** A synthetic single-guide RNA carries a 20-nucleotide spacer complementary to the genomic locus.
2. **The Verification Keyhole (PAM):** Before unzipping DNA, Cas9 checks for a 3-base Protospacer Adjacent Motif (5'-NGG-3'). Without this key, cleavage never occurs.
3. **The Scissors (Cas9 Endonuclease):** The HNH and RuvC domains introduce a blunt double-strand cut exactly 3 base pairs upstream of PAM.
4. **The Cellular Edit:** The cell's endogenous repair pathways take over: Non-Homologous End Joining (NHEJ) disrupts target genes, or Homology-Directed Repair (HDR) integrates custom donor templates.

*Pedagogical Insight:* Dead Cas9 (dCas9) fused to epigenetic modifiers enables reversible transcriptional control without permanent DNA cuts.

### Suggested Follow-ups
- How does Cas12 differ in producing staggered cuts with 5' overhangs?
- What lipid nanoparticle (LNP) formulations best deliver ribonucleoprotein complexes in vivo?`;
  }

  if (p.includes('marbury') || p.includes('law') || p.includes('justice') || p.includes('court') || context === 'Law & Justice') {
    return `### The Architecture of Judicial Review

In **Marbury v. Madison (1803)**, Chief Justice John Marshall established the cornerstone doctrine of modern constitutional governance:

- **The Paradox:** Marshall recognized that ordering Secretary of State Madison to deliver commissions would be defied, weakening the court; while declining would appear toothless.
- **The Solution:** Marshall held that Marbury possessed a legal right to his commission, but Section 13 of the Judiciary Act of 1789 unconstitutionally expanded original Supreme Court jurisdiction beyond Article III.
- **The Core Rule:** When an Act of Congress conflicts with the Constitution, the judiciary is duty-bound to uphold the Constitution and declare the statute void.

> *"It is emphatically the province and duty of the judicial department to say what the law is."*

### Suggested Follow-ups
- How does strict scrutiny differ from rational basis in Equal Protection jurisprudence?
- What are the operational limits of the Political Question doctrine?`;
  }

  if (p.includes('eigen') || p.includes('math') || p.includes('vector') || p.includes('matrix') || context === 'Mathematics') {
    return `### Geometric Intuition of Eigenvalues & Eigenvectors

When an arbitrary matrix $A$ transforms vector space, most vectors change both length and direction.

- **Eigenvectors ($\\mathbf{v}$):** The special invariant axes that do **not** rotate. They only stretch, compress, or reverse direction along their original trajectory.
- **Eigenvalues ($\\lambda$):** The precise scalar factor of elongation or compression:
  $$A\\mathbf{v} = \\lambda\\mathbf{v}$$
- **Real-World Impact:** 
  - In Google's PageRank, the web graph's stationary distribution is the principal eigenvector ($\\lambda = 1$).
  - In Principal Component Analysis (PCA), maximum variance directions are the eigenvectors of the covariance matrix.

### Suggested Follow-ups
- Why are eigenvalues of real symmetric matrices always guaranteed to be real?
- How does Singular Value Decomposition (SVD) extend eigendecomposition to non-square matrices?`;
  }

  if (p.includes('art') || p.includes('tenebrism') || p.includes('light') || context === 'Fine Arts') {
    return `### Caravaggio & The Psychology of Tenebrism

**Tenebrism** (from Italian *tenebroso*, meaning dark or murky) fundamentally reorganized European painting at the turn of the 17th century:

- **Contrast with Renaissance Balance:** Where Leonardo and Raphael utilized balanced atmospheric sfumato, Caravaggio submerged compositions into opaque black voids.
- **Raking Light:** A single, intense, theatrical beam illuminates pivotal gestures, forcing the spectator's gaze directly into the psychological climax.
- **Spatial Violence:** In Caravaggio and Artemisia Gentileschi, shadow is not passive absence; it is an active somatic presence that heightens existential drama.

### Suggested Follow-ups
- How did Rembrandt adapt tenebrism with warm atmospheric glazes?
- Analyze the directional light source in Caravaggio's *The Calling of Saint Matthew*.`;
  }

  return `### Comprehensive Scholarly Synthesis

Welcome! In the multi-disciplinary MindSphere curriculum, true mastery emerges when foundational principles in natural science, analytical mathematics, and legal philosophy reinforce one another.

- **Deconstruct to Axioms:** Identify the immutable core constraints governing the system.
- **Trace the Feedback Loops:** Analyze equilibrium conditions, rates of change, and threshold states.
- **Empirical Validation:** Cross-reference conceptual hypotheses with observable real-world behavior.

Would you like to test your active recall on this topic with a quick 3-question conceptual quiz, or shall we explore a targeted case study together?

### Suggested Follow-ups
- Generate an active-recall assessment quiz
- Deepen this inquiry with real-world case studies`;
}

function generateSmartQuiz(query: string) {
  if (query.includes('bio') || query.includes('gene') || query.includes('crispr')) {
    return [
      {
        id: `q-b1-${Date.now()}`,
        question: "What is the mandatory Protospacer Adjacent Motif (PAM) sequence for SpCas9?",
        options: ["5'-AAT-3'", "5'-NGG-3'", "5'-TTA-3'", "5'-CCG-3'"],
        correctIndex: 1,
        explanation: "Streptococcus pyogenes Cas9 recognizes a 5'-NGG-3' motif adjacent to the protospacer before initiating DNA unwinding.",
      },
      {
        id: `q-b2-${Date.now()}`,
        question: "What directly drives ATP synthesis via the rotational mechanics of ATP synthase?",
        options: ["Direct GTP cleavage", "Electrochemical proton gradient across inner membrane", "Active electron tunneling in matrix", "Cytoplasmic glycolysis flux"],
        correctIndex: 1,
        explanation: "Protons translocating through the stator channel down their electrochemical gradient exert torque on the rotor c-ring.",
      },
      {
        id: `q-b3-${Date.now()}`,
        question: "Which cellular repair pathway results in blunt-end insertions/deletions (indels) after Cas9 cleavage?",
        options: ["Homology-Directed Repair (HDR)", "Non-Homologous End Joining (NHEJ)", "Base Excision Repair", "Mismatch Proofreading"],
        correctIndex: 1,
        explanation: "NHEJ ligates broken DNA ends without an exogenous homologous template, frequently producing frameshift indels.",
      },
    ];
  }

  if (query.includes('law') || query.includes('justice') || query.includes('court')) {
    return [
      {
        id: `q-l1-${Date.now()}`,
        question: "Which historic ruling solidified the doctrine of Judicial Review in constitutional law?",
        options: ["Brown v. Board of Education", "Marbury v. Madison (1803)", "McCulloch v. Maryland", "Lochner v. New York"],
        correctIndex: 1,
        explanation: "Chief Justice John Marshall held in Marbury v. Madison that courts have inherent authority to declare contrary legislative statutes void.",
      },
      {
        id: `q-l2-${Date.now()}`,
        question: "Under Strict Scrutiny, the contested government measure must be:",
        options: ["Reasonably related to legitimate welfare", "Narrowly tailored to achieve a compelling state interest", "Approved by two-thirds legislative vote", "Financially revenue-neutral"],
        correctIndex: 1,
        explanation: "Strict scrutiny requires the state to prove a compelling interest using the least restrictive, narrowly tailored means.",
      },
    ];
  }

  // Default multi-disciplinary quiz
  return [
    {
      id: `q-g1-${Date.now()}`,
      question: "In Av = λv, what does the scalar λ represent?",
      options: ["Determinant", "Eigenvalue", "Trace", "Frobenius norm"],
      correctIndex: 1,
      explanation: "λ is the scalar eigenvalue indicating the stretch factor along the eigenvector v axis.",
    },
    {
      id: `q-g2-${Date.now()}`,
      question: "Which artistic technique relies on extreme contrast between deep darkness and spotlit subjects?",
      options: ["Sfumato", "Tenebrism", "Impasto", "Encaustic"],
      correctIndex: 1,
      explanation: "Tenebrism uses heightened chiaroscuro where dark voids dominate the pictorial space.",
    },
  ];
}

// Serve Vite in dev, static dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`MindSphere persistent server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
