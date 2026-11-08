import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Course, Article, UserProfile, LeaderboardUser, StudyTeam, TeacherProfile, ArticleComment } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface StoredUser extends UserProfile {
  password?: string;
}

export interface DatabaseSchema {
  users: Record<string, StoredUser>;
  courses: Course[];
  articles: Article[];
  teachers: TeacherProfile[];
  leaderboard: LeaderboardUser[];
  teams: StudyTeam[];
}

const DEFAULT_TEACHERS: TeacherProfile[] = [
  {
    id: 'teacher-thorne',
    name: 'Dr. Aris Thorne',
    role: 'Professor of Genomic Biology',
    institution: 'Harvard Department of Stem Cell & Regenerative Biology',
    bio: 'Pioneering CRISPR epigenome remodeling and synthetic mitochondrial bioenergetics.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    specialization: 'Genomics & Molecular Medicine',
    coursesCount: 2,
    articlesCount: 4,
    followersCount: 1420,
  },
  {
    id: 'teacher-rostova',
    name: 'Hon. Elena Rostova',
    role: 'Former Appellate Jurist & Jurisprudence Chair',
    institution: 'Oxford Faculty of Law & Constitutional Studies',
    bio: 'Author of landmark treatises on strict scrutiny tiers and algorithmic due process.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
    specialization: 'Constitutional Law & Jurisprudence',
    coursesCount: 1,
    articlesCount: 3,
    followersCount: 980,
  },
  {
    id: 'teacher-ramanujan',
    name: 'Dr. Sanjay Ramanujan',
    role: 'Principal Researcher',
    institution: 'Institute for Advanced Study, Princeton',
    bio: 'Investigating high-dimensional spectral decompositions and non-commutative geometry.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    specialization: 'Spectral Mathematics & Vector Spaces',
    coursesCount: 2,
    articlesCount: 5,
    followersCount: 1890,
  },
  {
    id: 'teacher-laurent',
    name: 'Prof. Camille Laurent',
    role: 'Curator & Beaux-Arts Scholar',
    institution: 'École des Beaux-Arts, Paris',
    bio: 'Specialist in 17th-century Caravaggesque chiaroscuro and spatial aesthetic theory.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
    specialization: 'Classical Visual Theory & Modernism',
    coursesCount: 1,
    articlesCount: 3,
    followersCount: 840,
  },
];

const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-cr-01',
    title: 'Beyond DNA Cleavage: Precision Transcriptome Rewriting with Cas13 & Epigenetic Modifiers',
    slug: 'beyond-dna-cleavage-cas13',
    summary: 'Why catalytic inactivation of nucleases paired with methyltransferase effectors enables transient, zero-off-target gene expression control in human tissues.',
    content: `For a decade, molecular biotechnology focused predominantly on double-stranded DNA breaks introduced by Streptococcus pyogenes Cas9. However, the subsequent repair pathways—principally Non-Homologous End Joining (NHEJ)—introduce heterogeneous indels and potential translocations.

Recent clinical milestones leverage 'Dead Cas' (dCas9) fused with epigenetic effectors such as DNMT3A or TET1. By tuning chromatin compaction without breaking phosphodiester backbones, we achieve durable transcriptional silencing or robust upregulation that endures mitotic cycles without genomic scars.

Key Architectural Principles:
1. Catalytic Deactivation: Mutations (D10A, H840A) preserve sgRNA binding while suppressing nuclease cleavage.
2. Localized Epigenetic Remodeling: Recruitment of histone acetyltransferases (p300 core) relaxes chromatin over target promoter CpG islands.
3. Therapeutic Reversibility: Unlike permanent DNA excision, epigenetic marks can be calibrated or reversed as clinical indications evolve.`,
    category: 'Science',
    tags: ['Genomics', 'CRISPR', 'Epigenetics', 'Biotech'],
    readTime: '6 min read',
    publishedAt: '2 days ago',
    authorId: 'teacher-thorne',
    authorName: 'Dr. Aris Thorne',
    authorRole: 'Professor of Genomic Biology, Harvard',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    likesCount: 142,
    likedBy: ['alex.johnson@mindsphere.edu'],
    comments: [
      {
        id: 'c-1',
        articleId: 'art-cr-01',
        authorId: 'user-alex',
        authorName: 'Alex Johnson',
        authorRole: 'student',
        content: 'Dr. Thorne, how do delivery vehicles like lipid nanoparticles (LNPs) avoid immunogenicity when transporting dCas-effector fusion complexes?',
        createdAt: '1 day ago',
      },
      {
        id: 'c-2',
        articleId: 'art-cr-01',
        authorId: 'teacher-thorne',
        authorName: 'Dr. Aris Thorne',
        authorRole: 'teacher',
        content: 'Great question Alex! Ionizable lipids with biodegradable ester linkages dramatically lower hepatic accumulation and immunogenic toll-like receptor activation.',
        createdAt: '18 hours ago',
      },
    ],
  },
  {
    id: 'art-law-02',
    title: 'The Tiers of Scrutiny in the Algorithmic Age: Rethinking Equal Protection for Automated Decisions',
    slug: 'tiers-of-scrutiny-algorithmic-age',
    summary: 'Examining how modern appellate courts must adapt strict scrutiny and rational basis doctrines when state actions rely on black-box neural networks.',
    content: `When Justice Stone articulated Footnote Four in Carolene Products (1938), constitutional doctrine separated standard economic regulation from state intrusions upon discrete and insular minorities. 

Today, public administrations deploy automated risk assessment instruments in bail determinations, zoning approvals, and child welfare allocations. The legal paradox emerges: if a predictive algorithm exhibits disparate impact, but its hidden weight matrices preclude human intentionality, does it evade strict scrutiny?

Our jurisprudence must establish an 'Explainability Requisite': if a state actor deprives liberty based on statistical inference, procedural due process demands mathematical auditability and human counterfactual validation.`,
    category: 'Law',
    tags: ['Jurisprudence', 'Constitutional Law', 'AI Ethics', 'Due Process'],
    readTime: '8 min read',
    publishedAt: '4 days ago',
    authorId: 'teacher-rostova',
    authorName: 'Hon. Elena Rostova',
    authorRole: 'Former Appellate Jurist & Jurisprudence Chair',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
    likesCount: 98,
    likedBy: [],
    comments: [
      {
        id: 'c-3',
        articleId: 'art-law-02',
        authorId: 'user-marcus',
        authorName: 'Marcus Chen',
        authorRole: 'student',
        content: 'This directly intersects with Title VII disparate impact doctrine. Highly illuminating framework, Judge Rostova.',
        createdAt: '3 days ago',
      },
    ],
  },
  {
    id: 'art-math-03',
    title: 'Spectral Graph Theory: Why the Laplacian Matrix Governs Cluster Detection in Massive Networks',
    slug: 'spectral-graph-theory-laplacian',
    summary: 'A geometric walk through the eigenvalues of graph Laplacians, Cheeger inequalities, and their direct manifestation in modern graph neural networks.',
    content: `Consider an undirected graph G = (V, E) with adjacency matrix A and degree matrix D. The unnormalized graph Laplacian L = D - A encodes not just topological connectivity, but the discrete analog of the Laplace-Beltrami differential operator on smooth Riemannian manifolds.

Why do the smallest non-zero eigenvalues matter?
By the Cheeger Inequality, the second smallest eigenvalue λ₂ (the algebraic connectivity or Fiedler vector) bounds the minimum conductance of graph cuts. In practical terms: calculating λ₂ allows us to segment clusters in social graphs, protein-protein interaction networks, and circuit designs with polynomial-time guarantees.`,
    category: 'Mathematics',
    tags: ['Spectral Theory', 'Linear Algebra', 'Graph Theory', 'Data Science'],
    readTime: '7 min read',
    publishedAt: '5 days ago',
    authorId: 'teacher-ramanujan',
    authorName: 'Dr. Sanjay Ramanujan',
    authorRole: 'Principal Researcher, IAS',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    likesCount: 187,
    likedBy: ['alex.johnson@mindsphere.edu'],
    comments: [],
  },
  {
    id: 'art-art-04',
    title: 'Tenebrism as Psychological Architecture: Darkness as Spatial Entity in Caravaggio and Gentileschi',
    slug: 'tenebrism-psychological-architecture',
    summary: 'Analyzing how radical light-dark contrasts transformed 17th-century European painting from balanced Renaissance geometry into visceral existential drama.',
    content: `In High Renaissance compositions by Raphael and Leonardo, space was harmonized by linear perspective and atmospheric sfumato. The world was intelligible, illuminated, and rational.

Enter Michelangelo Merisi da Caravaggio in Rome, 1600. In The Martyrdom of Saint Matthew, the background is not an architectural piazza; it is an impenetrable, suffocating black void. Light does not gently reveal form—it attacks it.

Artemisia Gentileschi weaponized this technique further in Judith Slaying Holofernes, using directional raking light to force the spectator into physical proximity with somatic struggle. Darkness is no longer the absence of light; it is a palpable physical participant.`,
    category: 'Arts',
    tags: ['Fine Arts', 'Caravaggio', 'Baroque', 'Aesthetic Theory'],
    readTime: '5 min read',
    publishedAt: '1 week ago',
    authorId: 'teacher-laurent',
    authorName: 'Prof. Camille Laurent',
    authorRole: 'Curator & Beaux-Arts Scholar',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
    likesCount: 114,
    likedBy: [],
    comments: [],
  },
];

const INITIAL_COURSES: Course[] = [
  {
    id: 'bio-101',
    title: 'Biology',
    category: 'Science',
    description: 'Cellular mechanics, molecular genetics, and CRISPR genome regulation.',
    hours: 34,
    progress: 78,
    color: '#10B981',
    bgGradient: 'from-emerald-500 to-teal-600',
    iconName: 'biology',
    difficulty: 'Intermediate',
    authorId: 'teacher-thorne',
    instructor: {
      id: 'teacher-thorne',
      name: 'Dr. Aris Thorne',
      role: 'Professor of Genomic Biology, Harvard',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    },
    totalStudents: 14200,
    rating: 4.9,
    modules: [
      {
        id: 'bio-m1',
        title: 'Cellular Respiration & ATP Synthase',
        lessons: [
          {
            id: 'bio-l1',
            title: 'The Electron Transport Chain Dynamics',
            duration: '24 min',
            completed: true,
            summary: 'How proton gradients drive the ATP synthase rotor turbine across the mitochondrial membrane.',
            keyTakeaways: [
              'NADH and FADH2 donate electrons through Complex I-IV',
              'Chemiosmosis creates an electrochemical proton gradient (pmf)',
              'ATP synthase generates ~30-32 ATP molecules per oxidized glucose',
            ],
            content: `The mitochondrial electron transport chain (ETC) is a marvel of cellular bioenergetics. Electrons harvested from metabolic breakdown flow through four multiprotein complexes embedded in the inner mitochondrial membrane. As electrons transfer down redox gradients to molecular oxygen (the terminal electron acceptor), protons are actively translocated into the intermembrane space. This produces a stark proton motive force that drives the rotational mechanics of ATP synthase, converting ADP and inorganic phosphate into cellular fuel (ATP).`,
          },
          {
            id: 'bio-l2',
            title: 'CRISPR-Cas9 Gene Editing Mechanisms',
            duration: '32 min',
            completed: true,
            summary: 'Single-guide RNA (sgRNA) targeting, PAM recognition, and double-strand break repair.',
            keyTakeaways: [
              'Cas9 endonuclease requires a Protospacer Adjacent Motif (NGG)',
              'sgRNA directs blunt-end double-strand DNA cleavage 3bp upstream of PAM',
              'Repair occurs via Non-Homologous End Joining (NHEJ) or Homology-Directed Repair (HDR)',
            ],
            content: `CRISPR-Cas9 originated as a bacterial adaptive immune system against bacteriophages. In modern molecular engineering, a synthetic single-guide RNA (sgRNA) pairs with genomic DNA complementary to its ~20-nucleotide spacer. Upon locating a matching Protospacer Adjacent Motif (PAM sequence 'NGG' in S. pyogenes), the Cas9 endonuclease activates its RuvC and HNH nuclease domains, introducing a precise double-stranded break.`,
          },
        ],
      },
      {
        id: 'bio-m2',
        title: 'Epigenetic Regulation & Chromatin Structure',
        lessons: [
          {
            id: 'bio-l3',
            title: 'DNA Methylation & Histone Acetylation',
            duration: '28 min',
            completed: false,
            summary: 'Transcriptional silencing versus activation mediated by chromatin remodeling complexes.',
            keyTakeaways: [
              'DNA methyltransferases (DNMTs) add methyl groups to CpG islands',
              'Histone acetyltransferases (HATs) neutralize positive charges to relax chromatin',
              'Histone deacetylases (HDACs) condense chromatin into heterochromatin',
            ],
            content: `Epigenetics controls how genes are expressed without modifying the underlying nucleotide sequence. Heterochromatin represents tightly wound, transcriptionally silent DNA, whereas euchromatin is accessible to RNA polymerase II. By balancing histone acetylation via HATs and HDACs, cells dynamically toggle between active gene transcription and repression across developmental lineages.`,
          },
        ],
      },
    ],
    sampleQuiz: [
      {
        id: 'q1',
        question: 'What is the required Protospacer Adjacent Motif (PAM) sequence for Streptococcus pyogenes Cas9?',
        options: ['AAT', 'NGG', 'TTA', 'CCG'],
        correctIndex: 1,
        explanation: "SpCas9 recognizes a 5'-NGG-3' motif immediately downstream of the target DNA protospacer sequence before initiating unwinding and cleavage.",
      },
      {
        id: 'q2',
        question: 'What directly powers the rotation of the c-ring subunit in mitochondrial ATP synthase?',
        options: ['Direct ATP hydrolysis', 'Flow of protons down their electrochemical gradient', 'GTP cleavage in matrix', 'Electron tunneling'],
        correctIndex: 1,
        explanation: 'Protons moving through the stationary a-subunit channel into the rotor c-ring subunits drive rotational torque via electrostatic neutralization.',
      },
    ],
  },
  {
    id: 'law-101',
    title: 'Law & Justice',
    category: 'Law',
    description: 'Constitutional jurisprudence, contractual frameworks, and judicial precedents.',
    hours: 48,
    progress: 45,
    color: '#3B82F6',
    bgGradient: 'from-blue-600 to-indigo-700',
    iconName: 'law',
    difficulty: 'Advanced',
    authorId: 'teacher-rostova',
    instructor: {
      id: 'teacher-rostova',
      name: 'Hon. Elena Rostova',
      role: 'Former Appellate Jurist & Jurisprudence Chair',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
    },
    totalStudents: 11800,
    rating: 4.8,
    modules: [
      {
        id: 'law-m1',
        title: 'Foundations of Constitutional Review',
        lessons: [
          {
            id: 'law-l1',
            title: 'Marbury v. Madison & Judicial Review Doctrine',
            duration: '35 min',
            completed: true,
            summary: 'Establishing the constitutional authority of courts to invalidate legislative statutes.',
            keyTakeaways: [
              'Chief Justice John Marshall established judicial review in 1803',
              'The Constitution is paramount law superior to ordinary legislative acts',
              'Courts possess inherent jurisdiction to interpret statutory constitutionality',
            ],
            content: `In Marbury v. Madison (1803), the United States Supreme Court solidified Judicial Review. Marshall held that Article III does not permit Congress to expand original Supreme Court jurisdiction beyond constitutional text. When an Act of the Legislature violates the Supreme Law of the Land, the judiciary is bound to enforce the Constitution and declare the contrary statute void.`,
          },
        ],
      },
    ],
    sampleQuiz: [
      {
        id: 'q-law-1',
        question: 'Under strict scrutiny analysis, the contested governmental policy must be:',
        options: [
          'Reasonably related to a permissible state objective',
          'Narrowly tailored to achieve a compelling state interest',
          'Supported by majority legislative consensus',
          'Economically revenue-neutral over 5 years',
        ],
        correctIndex: 1,
        explanation: 'Strict scrutiny is the most rigorous legal standard; the government must prove both a compelling state interest and that the law is narrowly tailored using the least restrictive means.',
      },
    ],
  },
  {
    id: 'art-101',
    title: 'Fine Arts',
    category: 'Arts',
    description: 'Visual theory, modernist movements, chromatic composition, and exhibition analysis.',
    hours: 21,
    progress: 92,
    color: '#EC4899',
    bgGradient: 'from-pink-500 to-rose-600',
    iconName: 'arts',
    difficulty: 'Beginner',
    authorId: 'teacher-laurent',
    instructor: {
      id: 'teacher-laurent',
      name: 'Prof. Camille Laurent',
      role: 'Curator & Beaux-Arts Scholar',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
    },
    totalStudents: 9400,
    rating: 4.95,
    modules: [
      {
        id: 'art-m1',
        title: 'Chiaroscuro & The Anatomy of Light',
        lessons: [
          {
            id: 'art-l1',
            title: 'Caravaggio and Tenebrism',
            duration: '22 min',
            completed: true,
            summary: 'Dramatic tonal contrast, deep dark voids, and theatrical lighting.',
            keyTakeaways: [
              'Tenebrism intensifies chiaroscuro into extreme light-dark contrast',
              'Caravaggio used directional candle lantern light to amplify emotional tension',
              'Influenced Baroque masters including Rembrandt, Gentileschi, and Velázquez',
            ],
            content: `Tenebrism heightened Renaissance chiaroscuro into visceral, high-stakes theatrical illumination. Pitch-black voids envelop subjects, pierced by a razor-sharp beam of light that guides the viewer's eye directly to pivotal psychological gestures.`,
          },
        ],
      },
    ],
    sampleQuiz: [
      {
        id: 'q-art-1',
        question: 'Which visual technique is characterized by extreme, theatrical contrasts between dark voids and bright highlights?',
        options: ['Sfumato', 'Tenebrism', 'Impasto', 'Pointillism'],
        correctIndex: 1,
        explanation: 'Tenebrism is characterized by heightened, dramatic chiaroscuro where darkness dominates and subjects appear spotlit.',
      },
    ],
  },
  {
    id: 'math-101',
    title: 'Mathematics',
    category: 'Mathematics',
    description: 'Multivariable calculus, linear algebra vector spaces, and Fourier transformations.',
    hours: 52,
    progress: 64,
    color: '#8B5CF6',
    bgGradient: 'from-purple-600 to-violet-700',
    iconName: 'math',
    difficulty: 'Advanced',
    authorId: 'teacher-ramanujan',
    instructor: {
      id: 'teacher-ramanujan',
      name: 'Dr. Sanjay Ramanujan',
      role: 'Principal Researcher, Institute for Advanced Study',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    },
    totalStudents: 18900,
    rating: 4.85,
    modules: [
      {
        id: 'math-m1',
        title: 'Spectral Theory & Eigenvector Decompositions',
        lessons: [
          {
            id: 'math-l1',
            title: 'The Geometric Intuition of Eigenvalues',
            duration: '30 min',
            completed: true,
            summary: 'Invariance of direction under linear transformations: Av = λv.',
            keyTakeaways: [
              'Eigenvectors preserve direction during matrix transformation',
              'Eigenvalues determine scaling factor λ along the eigenvector axis',
              'Forms the computational core of Principal Component Analysis (PCA) and PageRank',
            ],
            content: `When a matrix transforms a vector space, most vectors are rotated and scaled. Special vectors only experience pure stretching or shrinking without changing their span direction: these are eigenvectors, defined by the fundamental relationship Av = λv.`,
          },
        ],
      },
    ],
    sampleQuiz: [
      {
        id: 'q-math-1',
        question: 'If vector v satisfies Av = 3v for matrix A, what is 3 known as?',
        options: ['Determinant', 'Eigenvalue', 'Matrix trace', 'Singular value'],
        correctIndex: 1,
        explanation: 'In Av = λv, λ is the eigenvalue scalar corresponding to eigenvector v.',
      },
    ],
  },
  {
    id: 'bus-101',
    title: 'Business Strategy & Venture Finance',
    category: 'Business',
    description: 'Venture finance, unit economics, strategic positioning, and platform network effects.',
    hours: 36,
    progress: 81,
    color: '#F97316',
    bgGradient: 'from-orange-500 to-amber-600',
    iconName: 'business',
    difficulty: 'Intermediate',
    instructor: {
      name: 'Victoria Vance',
      role: 'Managing Partner, Apex Ventures',
    },
    totalStudents: 16100,
    rating: 4.9,
    modules: [
      {
        id: 'bus-m1',
        title: 'Platform Economics & Two-Sided Network Effects',
        lessons: [
          {
            id: 'bus-l1',
            title: 'Direct vs Cross-Side Network Effects',
            duration: '26 min',
            completed: true,
            summary: 'How platform value scales superlinearly with user and creator adoption.',
            keyTakeaways: [
              "Metcalfe's Law: Network value scales proportional to n squared",
              'Cross-side network effects create defensible marketplace moats',
              'Subsidizing the price-sensitive side optimizes platform liquidity',
            ],
            content: `Modern tech monopolies thrive on two-sided network effects. When the addition of a user on one side of the platform directly enhances value for participants on the opposing side, positive feedback loops generate formidable competitive defensibility.`,
          },
        ],
      },
    ],
    sampleQuiz: [
      {
        id: 'q-bus-1',
        question: 'What occurs when the addition of buyers to a platform directly increases the value proposition for sellers?',
        options: ['Direct network effect', 'Cross-side (indirect) network effect', 'Diseconomies of scale', 'Arbitrage margin compression'],
        correctIndex: 1,
        explanation: 'Cross-side network effects occur when value to one distinct participant group grows as the complementary group expands.',
      },
    ],
  },
  {
    id: 'mus-101',
    title: 'Music Analysis & Harmonic Architecture',
    category: 'Music',
    description: 'Harmonic structures, modal counterpoint, spectral acoustic timbre, and rhythmic syncopation.',
    hours: 27,
    progress: 35,
    color: '#06B6D4',
    bgGradient: 'from-cyan-500 to-blue-600',
    iconName: 'music',
    difficulty: 'Intermediate',
    instructor: {
      name: 'Maestro Julian Sterling',
      role: 'Orchestrator & Musicologist',
    },
    totalStudents: 8100,
    rating: 4.88,
    modules: [
      {
        id: 'mus-m1',
        title: 'Voice Leading & Modal Counterpoint',
        lessons: [
          {
            id: 'mus-l1',
            title: 'The Circle of Fifths & Modulation Techniques',
            duration: '25 min',
            completed: true,
            summary: 'Geometric navigation between tonalities and pivot chord modulation.',
            keyTakeaways: [
              'Each step clockwise adds one sharp (dominant relationship)',
              'Each step counter-clockwise adds one flat (subdominant relationship)',
              'Pivot chords bridge adjacent keys seamlessly by sharing identical pitches',
            ],
            content: `The Circle of Fifths is the harmonic GPS of Western music theory. Organizing the 12 chromatic pitches into successive perfect fifth intervals, it geometrically maps tonal proximity.`,
          },
        ],
      },
    ],
    sampleQuiz: [
      {
        id: 'q-mus-1',
        question: 'Moving one step clockwise on the Circle of Fifths adds which accidental to the key signature?',
        options: ['One Flat (♭)', 'One Sharp (♯)', 'Two Sharps (♯♯)', 'A Natural (♮)'],
        correctIndex: 1,
        explanation: 'Each clockwise step advances by a Perfect 5th and adds one sharp (or subtracts one flat) from the key signature.',
      },
    ],
  },
];

const INITIAL_USERS: Record<string, StoredUser> = {
  'alex.johnson@mindsphere.edu': {
    id: 'user-alex',
    name: 'Alex Johnson',
    email: 'alex.johnson@mindsphere.edu',
    role: 'student',
    title: 'Undergraduate Polymath Scholar',
    bio: 'Interdisciplinary scholar focusing on computational biology, constitutional jurisprudence, and algebraic geometry.',
    specialization: 'Computational Biology & Applied Math',
    institution: 'MindSphere Global Academy',
    language: 'en',
    plan: 'Free Plan',
    avatarBg: 'bg-gradient-to-tr from-fuchsia-600 to-purple-600',
    followedTeachers: ['teacher-thorne', 'teacher-ramanujan'],
    stats: {
      activeCourses: 6,
      studyHours: 218,
      completionRate: 62,
      achievements: 24,
      streakDays: 18,
      totalXp: 4820,
      dailyRequestsUsed: 42,
      dailyRequestsLimit: 50,
      coursesCreated: 0,
      articlesPublished: 0,
    },
    achievementsList: [
      { id: 'ach-1', title: 'Polymath Velocity', description: 'Enrolled in 5+ distinct disciplines concurrently', category: 'Growth', unlockedAt: 'Nov 2026', icon: 'zap' },
      { id: 'ach-2', title: 'Deep Work Sprint', description: 'Surpassed 200 total hours of focused study', category: 'Mastery', unlockedAt: 'Oct 2026', icon: 'clock' },
      { id: 'ach-3', title: 'Pedagogical Dialogue', description: 'Completed 100+ deep conceptual learning sessions', category: 'Recall', unlockedAt: 'Nov 2026', icon: 'bot' },
      { id: 'ach-4', title: '18-Day Streak', description: 'Daily active learning unbroken for nearly three weeks', category: 'Dedication', unlockedAt: 'Nov 2026', icon: 'flame' },
      { id: 'ach-5', title: 'Perfect Recall', description: 'Scored 100% on three consecutive practice quizzes', category: 'Accuracy', unlockedAt: 'Oct 2026', icon: 'award' },
      { id: 'ach-6', title: 'Cross-Domain Synthesis', description: 'Connected concepts across Biology and Mathematics', category: 'Insight', unlockedAt: 'Sep 2026', icon: 'sparkles' },
    ],
  },
  'thorne.educator@mindsphere.edu': {
    id: 'teacher-thorne',
    name: 'Dr. Aris Thorne',
    email: 'thorne.educator@mindsphere.edu',
    role: 'teacher',
    title: 'Professor of Genomic Biology & CRISPR Director',
    bio: 'Pioneering CRISPR epigenome remodeling, RNA-targeted enzymes, and synthetic mitochondrial bioenergetics.',
    specialization: 'Genomic Biology & Epigenetics',
    institution: 'Harvard Stem Cell Institute',
    language: 'en',
    plan: 'Campus Enterprise',
    avatarBg: 'bg-gradient-to-tr from-emerald-600 to-teal-600',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    followedTeachers: [],
    stats: {
      activeCourses: 2,
      studyHours: 850,
      completionRate: 98,
      achievements: 42,
      streakDays: 45,
      totalXp: 18450,
      dailyRequestsUsed: 12,
      dailyRequestsLimit: 500,
      coursesCreated: 2,
      totalStudentsEnrolled: 14200,
      articlesPublished: 4,
      totalArticleLikes: 420,
      followersCount: 1420,
    },
    achievementsList: [
      { id: 'ach-t1', title: 'Master Educator', description: 'Published accredited courses with over 10,000 enrolled scholars', category: 'Teaching', unlockedAt: 'Jan 2026', icon: 'award' },
      { id: 'ach-t2', title: 'Prolific Author', description: 'Authored multi-disciplinary research articles read worldwide', category: 'Publication', unlockedAt: 'Mar 2026', icon: 'book' },
    ],
  },
};

const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Dr. Sophie Lin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', xp: 7420, streak: 34, coursesCompleted: 12, role: 'teacher' },
  { rank: 2, name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', xp: 6180, streak: 26, coursesCompleted: 9, role: 'student' },
  { rank: 3, name: 'Amara Okafor', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', xp: 5540, streak: 21, coursesCompleted: 8, role: 'student' },
  { rank: 4, name: 'Alex Johnson', avatar: '', xp: 4820, streak: 18, coursesCompleted: 6, role: 'student', isCurrentUser: true },
  { rank: 5, name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', xp: 4310, streak: 15, coursesCompleted: 5, role: 'teacher' },
  { rank: 6, name: 'Liam Gallagher', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', xp: 3950, streak: 12, coursesCompleted: 4, role: 'student' },
];

const INITIAL_TEAMS: StudyTeam[] = [
  {
    id: 'team-1',
    name: 'BioTech Synthesizers',
    category: 'Natural Sciences & Genomics',
    membersCount: 28,
    weeklyXp: 18450,
    description: 'Investigating CRISPR, molecular biology, and computational genomics pipelines.',
    isJoined: true,
  },
  {
    id: 'team-2',
    name: 'Jurisprudence & Ethics Circle',
    category: 'Law & Governance',
    membersCount: 19,
    weeklyXp: 14200,
    description: 'Weekly appellate case law debates, constitutional scrutiny, and legal theory.',
    isJoined: false,
  },
  {
    id: 'team-3',
    name: 'Spectral Mathematics Group',
    category: 'Pure & Applied Math',
    membersCount: 34,
    weeklyXp: 22100,
    description: 'Vector spaces, dynamical systems, Fourier analysis, and tensor calculus.',
    isJoined: false,
  },
  {
    id: 'team-4',
    name: 'Modernist Visual Theorists',
    category: 'Fine Arts & Aesthetics',
    membersCount: 15,
    weeklyXp: 9800,
    description: 'Deconstructing composition, chiaroscuro, spatial depth, and historical movements.',
    isJoined: false,
  },
];

class DatabaseManager {
  private cache: DatabaseSchema | null = null;

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (!fs.existsSync(DB_FILE)) {
        const initialData: DatabaseSchema = {
          users: INITIAL_USERS,
          courses: INITIAL_COURSES,
          articles: INITIAL_ARTICLES,
          teachers: DEFAULT_TEACHERS,
          leaderboard: INITIAL_LEADERBOARD,
          teams: INITIAL_TEAMS,
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
        this.cache = initialData;
      } else {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        this.cache = JSON.parse(content);
      }
    } catch (err) {
      console.error('Error initializing database file:', err);
      // In-memory fallback if disk error
      this.cache = {
        users: INITIAL_USERS,
        courses: INITIAL_COURSES,
        articles: INITIAL_ARTICLES,
        teachers: DEFAULT_TEACHERS,
        leaderboard: INITIAL_LEADERBOARD,
        teams: INITIAL_TEAMS,
      };
    }
  }

  public getDb(): DatabaseSchema {
    if (!this.cache) {
      this.ensureInitialized();
    }
    return this.cache!;
  }

  public saveDb(data: DatabaseSchema): void {
    this.cache = data;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file to disk:', e);
    }
  }

  // User Operations
  public getUser(email: string): StoredUser | undefined {
    const db = this.getDb();
    const normalized = email.toLowerCase().trim();
    return db.users[normalized];
  }

  public upsertUser(user: Partial<StoredUser> & { email: string; name: string }): StoredUser {
    const db = this.getDb();
    const normalized = user.email.toLowerCase().trim();
    const existing = db.users[normalized];

    const updated: StoredUser = {
      id: existing?.id || `user-${Date.now()}`,
      name: user.name || existing?.name || 'MindSphere Scholar',
      email: normalized,
      role: user.role || existing?.role || 'student',
      title: user.title || existing?.title || (user.role === 'teacher' ? 'Course Instructor & Researcher' : 'Polymath Scholar'),
      bio: user.bio || existing?.bio || 'Learning and exploring multi-disciplinary horizons.',
      specialization: user.specialization || existing?.specialization || 'General Studies',
      institution: user.institution || existing?.institution || 'MindSphere Global Academy',
      website: user.website || existing?.website || '',
      language: user.language || existing?.language || 'en',
      plan: user.plan || existing?.plan || 'Free Plan',
      avatarBg: user.avatarBg || existing?.avatarBg || (user.role === 'teacher' ? 'bg-gradient-to-tr from-emerald-600 to-teal-600' : 'bg-gradient-to-tr from-fuchsia-600 to-purple-600'),
      avatarUrl: user.avatarUrl || existing?.avatarUrl || '',
      followedTeachers: existing?.followedTeachers || user.followedTeachers || ['teacher-thorne'],
      stats: {
        activeCourses: existing?.stats?.activeCourses ?? 6,
        studyHours: existing?.stats?.studyHours ?? 120,
        completionRate: existing?.stats?.completionRate ?? 45,
        achievements: existing?.stats?.achievements ?? 12,
        streakDays: existing?.stats?.streakDays ?? 5,
        totalXp: existing?.stats?.totalXp ?? 1800,
        dailyRequestsUsed: existing?.stats?.dailyRequestsUsed ?? 0,
        dailyRequestsLimit: existing?.stats?.dailyRequestsLimit ?? (user.role === 'teacher' ? 200 : 50),
        coursesCreated: existing?.stats?.coursesCreated ?? (user.role === 'teacher' ? 1 : 0),
        totalStudentsEnrolled: existing?.stats?.totalStudentsEnrolled ?? (user.role === 'teacher' ? 250 : 0),
        articlesPublished: existing?.stats?.articlesPublished ?? (user.role === 'teacher' ? 1 : 0),
        totalArticleLikes: existing?.stats?.totalArticleLikes ?? (user.role === 'teacher' ? 45 : 0),
        followersCount: existing?.stats?.followersCount ?? (user.role === 'teacher' ? 120 : 0),
      },
      achievementsList: existing?.achievementsList || [
        { id: 'ach-reg', title: 'Joined MindSphere', description: 'Initiated academic journey', category: 'Growth', unlockedAt: 'Nov 2026', icon: 'zap' }
      ],
      password: user.password || existing?.password,
    };

    db.users[normalized] = updated;

    // If teacher, also ensure entry in teachers directory
    if (updated.role === 'teacher') {
      const teacherIdx = db.teachers.findIndex((t) => t.id === updated.id || t.name === updated.name);
      const teacherObj: TeacherProfile = {
        id: updated.id || `teacher-${Date.now()}`,
        name: updated.name,
        role: updated.title || 'Course Instructor',
        institution: updated.institution || 'MindSphere Academy',
        bio: updated.bio || '',
        avatar: updated.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
        specialization: updated.specialization || 'Interdisciplinary Studies',
        coursesCount: updated.stats.coursesCreated || 1,
        articlesCount: updated.stats.articlesPublished || 0,
        followersCount: updated.stats.followersCount || 10,
      };

      if (teacherIdx >= 0) {
        db.teachers[teacherIdx] = { ...db.teachers[teacherIdx], ...teacherObj };
      } else {
        db.teachers.push(teacherObj);
      }
    }

    this.saveDb(db);
    return updated;
  }

  // Course Operations
  public getCourses(): Course[] {
    return this.getDb().courses;
  }

  public addCourse(course: Omit<Course, 'id'>, authorEmail?: string): Course {
    const db = this.getDb();
    const newCourse: Course = {
      ...course,
      id: `course-${Date.now()}`,
      progress: course.progress || 0,
      totalStudents: course.totalStudents || 1,
      rating: course.rating || 5.0,
      modules: course.modules || [],
      sampleQuiz: course.sampleQuiz || [],
    };

    db.courses.unshift(newCourse);

    // Update teacher stats if author email provided
    if (authorEmail && db.users[authorEmail.toLowerCase()]) {
      const user = db.users[authorEmail.toLowerCase()];
      user.stats.coursesCreated = (user.stats.coursesCreated || 0) + 1;
      user.stats.activeCourses = (user.stats.activeCourses || 0) + 1;
      user.stats.totalXp += 200;
    }

    this.saveDb(db);
    return newCourse;
  }

  // Article Operations
  public getArticles(): Article[] {
    return this.getDb().articles;
  }

  public addArticle(articleData: {
    title: string;
    summary: string;
    content: string;
    category: Article['category'];
    tags: string[];
    readTime: string;
    authorEmail: string;
  }): Article {
    const db = this.getDb();
    const author = db.users[articleData.authorEmail.toLowerCase()] || Object.values(db.users)[0];

    const newArticle: Article = {
      id: `art-${Date.now()}`,
      title: articleData.title,
      summary: articleData.summary,
      content: articleData.content,
      category: articleData.category,
      tags: articleData.tags.length > 0 ? articleData.tags : [articleData.category, 'Education'],
      readTime: articleData.readTime || '4 min read',
      publishedAt: 'Just now',
      authorId: author.id || 'teacher-author',
      authorName: author.name,
      authorRole: author.title || (author.role === 'teacher' ? 'Instructor & Scholar' : 'Student Contributor'),
      authorAvatar: author.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      likesCount: 0,
      likedBy: [],
      comments: [],
    };

    db.articles.unshift(newArticle);

    // Update author stats
    if (author) {
      author.stats.articlesPublished = (author.stats.articlesPublished || 0) + 1;
      author.stats.totalXp += 150;
    }

    // Update teacher directory article count
    const tMatch = db.teachers.find((t) => t.id === author.id || t.name === author.name);
    if (tMatch) {
      tMatch.articlesCount += 1;
    }

    this.saveDb(db);
    return newArticle;
  }

  public toggleArticleLike(articleId: string, userEmail: string): { liked: boolean; likesCount: number; article: Article } {
    const db = this.getDb();
    const article = db.articles.find((a) => a.id === articleId);
    if (!article) {
      throw new Error('Article not found');
    }

    const normEmail = userEmail.toLowerCase().trim();
    const idx = article.likedBy.indexOf(normEmail);
    let liked = false;

    if (idx >= 0) {
      // Unlike
      article.likedBy.splice(idx, 1);
      article.likesCount = Math.max(0, article.likesCount - 1);
      liked = false;
    } else {
      // Like
      article.likedBy.push(normEmail);
      article.likesCount += 1;
      liked = true;

      // Reward liking scholar with XP
      if (db.users[normEmail]) {
        db.users[normEmail].stats.totalXp += 10;
      }
    }

    this.saveDb(db);
    return { liked, likesCount: article.likesCount, article };
  }

  public addArticleComment(articleId: string, authorEmail: string, content: string): ArticleComment {
    const db = this.getDb();
    const article = db.articles.find((a) => a.id === articleId);
    if (!article) {
      throw new Error('Article not found');
    }

    const author = db.users[authorEmail.toLowerCase()] || Object.values(db.users)[0];
    const newComment: ArticleComment = {
      id: `comm-${Date.now()}`,
      articleId,
      authorId: author.id || 'user-anon',
      authorName: author.name,
      authorRole: author.role,
      authorAvatar: author.avatarUrl,
      content,
      createdAt: 'Just now',
    };

    article.comments.push(newComment);

    if (author) {
      author.stats.totalXp += 25;
    }

    this.saveDb(db);
    return newComment;
  }

  public toggleFollowTeacher(studentEmail: string, teacherId: string): { isFollowing: boolean; followersCount: number; followedTeachers: string[] } {
    const db = this.getDb();
    const student = db.users[studentEmail.toLowerCase()];
    const teacher = db.teachers.find((t) => t.id === teacherId);

    if (!student) {
      throw new Error('Student user not found');
    }

    const idx = student.followedTeachers.indexOf(teacherId);
    let isFollowing = false;

    if (idx >= 0) {
      student.followedTeachers.splice(idx, 1);
      if (teacher) teacher.followersCount = Math.max(0, teacher.followersCount - 1);
      isFollowing = false;
    } else {
      student.followedTeachers.push(teacherId);
      if (teacher) teacher.followersCount += 1;
      isFollowing = true;
    }

    this.saveDb(db);
    return {
      isFollowing,
      followersCount: teacher?.followersCount || 0,
      followedTeachers: student.followedTeachers,
    };
  }

  public getTeachers(): TeacherProfile[] {
    return this.getDb().teachers;
  }
}

export const dbManager = new DatabaseManager();
