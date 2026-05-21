export const courseCategories = [
  "Software Engineering",
  "Artificial Intelligence",
  "Cyber Security",
  "Data Analytics",
  "Career Readiness",
];

export const courseCatalog = [
  {
    slug: "frontend-engineering-for-omani-graduates",
    category: "Software Engineering",
    level: "Beginner to Intermediate",
    price: "29 OMR",
    duration: "8 weeks",
    language: "English + Arabic support",
    en: {
      title: "Frontend Engineering For Omani Graduates",
      subtitle: "Build modern web interfaces with HTML, CSS, JavaScript, React, and portfolio projects.",
      summary:
        "A practical frontend path for graduates who need stronger web development skills before applying for junior software roles.",
      outcomes: [
        "Build responsive pages and React components",
        "Understand browser fundamentals and modern JavaScript",
        "Create portfolio projects for job applications",
      ],
      modules: [
        "HTML, CSS, and responsive layout foundations",
        "JavaScript fundamentals for real interfaces",
        "React components, routing, and state",
        "Portfolio project and deployment workflow",
      ],
    },
    ar: {
      title: "هندسة الواجهات الأمامية للخريجين في عُمان",
      subtitle: "بناء واجهات ويب حديثة باستخدام HTML وCSS وJavaScript وReact ومشاريع عملية.",
      summary:
        "مسار عملي للواجهات الأمامية للخريجين الذين يحتاجون إلى مهارات تطوير ويب أقوى قبل التقديم على وظائف برمجية للمبتدئين.",
      outcomes: [
        "بناء صفحات متجاوبة ومكونات React",
        "فهم أساسيات المتصفح وJavaScript الحديثة",
        "إنشاء مشاريع عملية لملف التقديم الوظيفي",
      ],
      modules: [
        "أساسيات HTML وCSS والتصميم المتجاوب",
        "أساسيات JavaScript للواجهات العملية",
        "مكونات React والتوجيه وإدارة الحالة",
        "مشروع عملي ونشره",
      ],
    },
  },
  {
    slug: "backend-api-development-with-database",
    category: "Software Engineering",
    level: "Intermediate",
    price: "35 OMR",
    duration: "7 weeks",
    language: "English",
    en: {
      title: "Backend API Development With Database",
      subtitle: "Learn databases, authentication, storage, and API workflows using a practical backend stack.",
      summary:
        "A backend course focused on the skills junior developers need when working with application data, users, and secure access.",
      outcomes: [
        "Design relational tables and API flows",
        "Use authentication and role-based access safely",
        "Connect frontend apps to backend services",
      ],
      modules: [
        "Backend architecture basics",
        "Database tables, relationships, and queries",
        "Authentication, roles, and policies",
        "Storage, uploads, and production checks",
      ],
    },
    ar: {
      title: "تطوير واجهات Backend API باستخدام database",
      subtitle: "تعلم قواعد البيانات والمصادقة والتخزين وسير عمل API من خلال تطبيق عملي.",
      summary:
        "دورة خلفية تركز على المهارات التي يحتاجها المطور المبتدئ للتعامل مع البيانات والمستخدمين والوصول الآمن.",
      outcomes: [
        "تصميم الجداول العلائقية وسير عمل API",
        "استخدام المصادقة والصلاحيات بأمان",
        "ربط تطبيقات الواجهة بخدمات الخلفية",
      ],
      modules: [
        "أساسيات بنية Backend",
        "الجداول والعلاقات والاستعلامات",
        "المصادقة والأدوار والسياسات",
        "التخزين ورفع الملفات وفحوصات الإنتاج",
      ],
    },
  },
  {
    slug: "applied-ai-for-business-and-productivity",
    category: "Artificial Intelligence",
    level: "Beginner",
    price: "25 OMR",
    duration: "5 weeks",
    language: "English + Arabic support",
    en: {
      title: "Applied AI For Business And Productivity",
      subtitle: "Use AI tools responsibly for research, automation, writing, analysis, and workplace productivity.",
      summary:
        "A practical AI literacy course for learners who want useful AI skills without needing advanced math first.",
      outcomes: [
        "Use AI tools for structured work tasks",
        "Design better prompts and review AI outputs",
        "Understand responsible and secure AI use",
      ],
      modules: [
        "AI foundations for non-specialists",
        "Prompting for research and productivity",
        "AI-assisted analysis and automation",
        "Risks, privacy, and responsible use",
      ],
    },
    ar: {
      title: "الذكاء الاصطناعي التطبيقي للأعمال والإنتاجية",
      subtitle: "استخدم أدوات AI بمسؤولية للبحث والأتمتة والكتابة والتحليل والإنتاجية.",
      summary:
        "دورة عملية في الثقافة الذكية للمتعلمين الذين يريدون مهارات AI مفيدة دون الحاجة إلى رياضيات متقدمة أولاً.",
      outcomes: [
        "استخدام أدوات AI في مهام عمل منظمة",
        "كتابة prompts أفضل ومراجعة مخرجات AI",
        "فهم الاستخدام المسؤول والآمن للذكاء الاصطناعي",
      ],
      modules: [
        "أساسيات AI لغير المتخصصين",
        "التوجيه الذكي للبحث والإنتاجية",
        "التحليل والأتمتة بمساعدة AI",
        "المخاطر والخصوصية والاستخدام المسؤول",
      ],
    },
  },
  {
    slug: "cyber-security-foundations-for-junior-roles",
    category: "Cyber Security",
    level: "Beginner",
    price: "32 OMR",
    duration: "6 weeks",
    language: "English",
    en: {
      title: "Cyber Security Foundations For Junior Roles",
      subtitle: "Learn security fundamentals, risk thinking, defensive basics, and practical entry-level workflows.",
      summary:
        "A foundation course for learners considering cyber security support, SOC, governance, or IT security roles.",
      outcomes: [
        "Understand common threats and controls",
        "Read security alerts and basic logs",
        "Explain risk, policy, and secure behavior",
      ],
      modules: [
        "Security principles and threat landscape",
        "Networks, identity, and access basics",
        "Defensive monitoring foundations",
        "Governance, risk, and incident thinking",
      ],
    },
    ar: {
      title: "أساسيات الأمن السيبراني للأدوار المبتدئة",
      subtitle: "تعلم أساسيات الأمن والتفكير بالمخاطر والدفاعيات وسير العمل للمبتدئين.",
      summary:
        "دورة تأسيسية للمتعلمين المهتمين بأدوار الدعم الأمني أو SOC أو الحوكمة أو أمن تقنية المعلومات.",
      outcomes: [
        "فهم التهديدات والضوابط الشائعة",
        "قراءة التنبيهات والسجلات الأساسية",
        "شرح المخاطر والسياسات والسلوك الآمن",
      ],
      modules: [
        "مبادئ الأمن ومشهد التهديدات",
        "أساسيات الشبكات والهوية والوصول",
        "أساسيات المراقبة الدفاعية",
        "الحوكمة والمخاطر والتعامل مع الحوادث",
      ],
    },
  },
  {
    slug: "data-analytics-with-excel-sql-and-dashboards",
    category: "Data Analytics",
    level: "Beginner to Intermediate",
    price: "30 OMR",
    duration: "6 weeks",
    language: "English + Arabic support",
    en: {
      title: "Data Analytics With Excel, SQL, And Dashboards",
      subtitle: "Turn raw data into useful reports, dashboards, and business insights.",
      summary:
        "A job-focused data analytics path for learners who want practical reporting and decision-support skills.",
      outcomes: [
        "Clean and analyze data in Excel",
        "Write useful SQL queries",
        "Build dashboard-style reports and explain insights",
      ],
      modules: [
        "Data cleaning and spreadsheet analysis",
        "SQL queries for business questions",
        "Charts, dashboards, and storytelling",
        "Portfolio analytics case study",
      ],
    },
    ar: {
      title: "تحليل البيانات باستخدام Excel وSQL ولوحات المعلومات",
      subtitle: "حوّل البيانات الخام إلى تقارير ولوحات معلومات ورؤى عملية.",
      summary:
        "مسار تحليلات بيانات موجه للوظائف للمتعلمين الذين يريدون مهارات تقارير ودعم قرارات عملية.",
      outcomes: [
        "تنظيف وتحليل البيانات في Excel",
        "كتابة استعلامات SQL مفيدة",
        "بناء تقارير ولوحات معلومات وشرح الرؤى",
      ],
      modules: [
        "تنظيف البيانات وتحليل الجداول",
        "استعلامات SQL لأسئلة الأعمال",
        "الرسوم ولوحات المعلومات وسرد النتائج",
        "دراسة حالة عملية للملف المهني",
      ],
    },
  },
  {
    slug: "graduate-tech-job-readiness",
    category: "Career Readiness",
    level: "Beginner",
    price: "18 OMR",
    duration: "4 weeks",
    language: "English + Arabic support",
    en: {
      title: "Graduate Tech Job Readiness",
      subtitle: "Prepare your CV, portfolio, interviews, LinkedIn, and junior tech role strategy.",
      summary:
        "A career-readiness course for graduates who need to present their skills more clearly to employers.",
      outcomes: [
        "Improve your CV and LinkedIn profile",
        "Prepare for entry-level technical interviews",
        "Plan a realistic junior tech job search",
      ],
      modules: [
        "CV and LinkedIn for tech graduates",
        "Portfolio and GitHub presentation",
        "Interview preparation and communication",
        "Oman tech job search strategy",
      ],
    },
    ar: {
      title: "الجاهزية الوظيفية للخريجين في التقنية",
      subtitle: "جهز السيرة الذاتية والملف العملي والمقابلات وLinkedIn واستراتيجية البحث عن وظيفة تقنية.",
      summary:
        "دورة جاهزية مهنية للخريجين الذين يحتاجون إلى عرض مهاراتهم بوضوح أكبر لأصحاب العمل.",
      outcomes: [
        "تحسين السيرة الذاتية وملف LinkedIn",
        "الاستعداد للمقابلات التقنية للمبتدئين",
        "تخطيط بحث واقعي عن وظيفة تقنية مبتدئة",
      ],
      modules: [
        "السيرة الذاتية وLinkedIn لخريجي التقنية",
        "عرض الملف العملي وGitHub",
        "الاستعداد للمقابلات والتواصل",
        "استراتيجية البحث عن وظائف تقنية في عُمان",
      ],
    },
  },
];

export function findCourseBySlug(slug) {
  return courseCatalog.find((course) => course.slug === slug);
}
