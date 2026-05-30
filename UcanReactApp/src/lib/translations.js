export const supportedLanguages = {
  en: {
    label: "English",
    shortLabel: "EN",
    dir: "ltr",
  },
  ar: {
    label: "العربية",
    shortLabel: "ع",
    dir: "rtl",
  },
};

const shared = {
  en: {
    footer: "Copyright {year} Ucan. Career-focused e-learning for Oman.",
    fieldsRequired: "Fields marked with * are required.",
    acceptedFiles: "Accepted files: {types}. Maximum size: {size} MB per file.",
    close: "Close",
    notAvailable: "Not available",
  },
  ar: {
    footer: "حقوق النشر {year} يوكان. تعليم مهني رقمي مخصص لعُمان.",
    fieldsRequired: "الحقول المشار إليها بعلامة * مطلوبة.",
    acceptedFiles: "الملفات المقبولة: {types}. الحد الأقصى: {size} ميجابايت لكل ملف.",
    close: "إغلاق",
    notAvailable: "غير متوفر",
  },
};

export const translations = {
  en: {
    brand: {
      kicker: "Career E-Learning",
      name: "Ucan",
    },
    nav: {
      home: "Home",
      about: "About",
      services: "Courses",
      contact: "Contact",
      policies: "Policies",
      studentAccess: "Learner Access",
      tutorAccess: "Instructor Access",
      adminAccess: "Admin Access",
      dashboard: "Dashboard",
      adminDashboard: "Admin Dashboard",
      logout: "Logout",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    language: {
      switchToArabic: "Switch to Arabic",
      switchToEnglish: "Switch to English",
    },
    feedback: {
      sessionUpdate: "Session update",
      loggedOut: "You have logged out successfully.",
    },
    roles: {
      member: "member",
      learner: "learner",
      instructor: "instructor",
      admin: "admin",
    },
    common: shared.en,
    home: {
      heroKicker: "Welcome to Ucan",
      heroTitle: "Career-focused e-learning built for Oman’s next generation of tech talent.",
      heroText:
        "Ucan helps fresh graduates and job seekers build practical skills for Oman’s technology sector through structured courses in software engineering, AI, cyber security, data analytics, and job readiness.",
      exploreServices: "Explore Courses",
      cardKicker: "Omani Market, Modern Skills",
      cardTitle:
        "A commercial learning platform shaped around employability, practical portfolios, and high-demand digital careers.",
      stats: [
        { number: "Tech", label: "courses aligned with in-demand career paths" },
        { number: "AI", label: "future recommendations shaped by market signals" },
        { number: "Oman", label: "content tailored to local graduate employment needs" },
      ],
      featuresKicker: "Why Choose Ucan",
      featuresTitle:
        "A practical e-learning platform for graduates who need job-ready technology skills.",
      features: [
        {
          title: "Career-Focused Courses",
          description:
            "Courses are designed around practical skills that help learners prepare for entry-level technology jobs.",
        },
        {
          title: "Built For Oman",
          description:
            "Ucan focuses on the needs of Omani graduates, diploma holders, and job seekers entering the local tech sector.",
        },
        {
          title: "Data-Informed Direction",
          description:
            "The platform is being prepared to use AI, SEO, and open-data insights to identify high-demand learning paths.",
        },
      ],
      howKicker: "How It Works",
      howTitle: "Three simple steps from learning to employability.",
      steps: [
        {
          title: "Choose A Career Path",
          description:
            "Explore practical paths such as frontend development, backend engineering, AI, cyber security, and data analytics.",
        },
        {
          title: "Learn Practical Skills",
          description:
            "Study structured courses that focus on applied projects, tools, workflows, and concepts employers expect.",
        },
        {
          title: "Build Job Readiness",
          description:
            "Use your learning to strengthen your portfolio, confidence, interview preparation, and workplace readiness.",
        },
      ],
      toolsKicker: "Learning Tools",
      toolsTitle: "Digital tools that support online learning and professional collaboration.",
      toolsText:
        "Ucan courses can use modern meeting, planning, and collaboration tools to help learners practice the same workflows used in real technology teams.",
      toolGroups: [
        {
          title: "Live Learning Platforms",
          description:
            "Support live workshops, mentoring sessions, screen sharing, and instructor-led learning.",
        },
        {
          title: "Collaboration Tools",
          description:
            "Organize projects, explain technical ideas visually, and collaborate around practical career tasks.",
        },
      ],
      tutorKicker: "Join Our Instructor Team",
      tutorTitle: "Become an instructor and help prepare Oman’s next tech workforce.",
      tutorText:
        "Ucan will welcome instructors and industry practitioners who can teach practical, employment-focused digital skills.",
      tutorAccess: "Instructor Access",
      tutorCardTitle: "Log in or apply to create your instructor account.",
      tutorCardText:
        "Use the instructor page to apply, enter your protected dashboard, and prepare courses for learners.",
      tutorButton: "Instructor Login / Apply",
      studentKicker: "Learner Access",
      studentTitle: "Join as a learner and start building job-ready tech skills.",
      studentText:
        "Learners can create an account to access career-focused courses, learning resources, and future personalized recommendations.",
      studentCardTitle: "Log in or sign up to create your learner account.",
      studentCardText:
        "Use the learner account page to create your profile and prepare for the Ucan course marketplace.",
      studentButton: "Learner Login / Sign Up",
      ctaKicker: "Start Learning",
      ctaTitle:
        "Build the skills needed for Oman’s growing technology sector.",
      ctaText:
        "Ucan is transforming into a commercial e-learning platform for software engineering, AI, cyber security, data analytics, and job readiness.",
      ctaButton: "Explore Courses",
    },
    about: {
      heroKicker: "About Ucan",
      heroTitle:
        "An e-learning platform focused on Oman’s graduate employability gap.",
      heroText:
        "Ucan is being built to help computer science graduates, diploma holders, and job seekers move from academic knowledge into practical, market-ready technology skills.",
      ucf: "University of Central Florida",
      ucfText:
        "We imagine digital education as practical, dignified, locally relevant, and connected to real employment outcomes.",
      founderKicker: "Meet Our Founder",
      founderName: "Ahmed Mohammed Al Ruqaishi",
      founderTextOne:
        "Grew up in UK... Migrated to USA... and now in Oman. You know the rest of the story ... LETS GO EVERYONE!!",
      founderTextTwo:
        'Ahmed is a 25 year old beginner software developer who was inspired by the movie "The Social Network" to create this platform to better enhance the college experience academically, socially, and most importantly psychologically.',
      founderLocation: "Qurum Beach, Muscat, Oman.",
      highlights: [
        { number: "Career", label: "learning paths for technology roles" },
        { number: "Data", label: "future insights from labor market signals" },
        { number: "Local", label: "skills tailored to Oman’s employment needs" },
      ],
      missionKicker: "Our Mission",
      missionTitle: "Help Omani tech graduates become more employable through practical online courses.",
      missionTextOne:
        "Ucan exists to bridge the gap between academic study and entry-level technology work by focusing on practical skills, projects, tools, and career readiness.",
      missionTextTwo:
        "The long-term vision is to use AI, SEO, and Oman open-data sources to identify what learners should study and which course topics matter most for the market.",
      valuesKicker: "Core Values",
      valuesTitle: "The ideas shaping Ucan’s e-learning marketplace.",
      values: [
        {
          title: "Employability First",
          description:
            "Courses should help learners build real capabilities that improve their chances in Oman’s technology job market.",
        },
        {
          title: "Local Market Fit",
          description:
            "Learning paths should reflect the skills employers actually need from junior technology talent in Oman.",
        },
        {
          title: "AI-Guided Growth",
          description:
            "Future platform intelligence should help recommend courses, identify skill gaps, and guide new course creation.",
        },
      ],
      communityKicker: "Our Learners",
      communityTitle:
        "Graduates, job seekers, instructors, and employers connected by practical digital skills.",
      communityText:
        "Ucan is built for learners who want more than certificates: they need confidence, project experience, and skills that make sense in Oman’s job market.",
    },
    contact: {
      heroKicker: "Contact Ucan",
      heroTitle:
        "Reach a career-focused e-learning platform built for Oman.",
      heroText:
        "Whether you are a learner, instructor, employer, or partner, use this page to contact Ucan about courses, skills, and digital learning opportunities.",
      heroCardText:
        "We want the platform to feel as dependable and recognizable as the landmarks that shape Oman's identity.",
      formKicker: "Contact Form",
      formTitle: "Send your message directly to Ucan.",
      formText:
        "Fill in the form below and your message will be saved in database so the team can review it properly.",
      labels: {
        fullName: "Full name",
        email: "Email",
        institute: "Institute",
        role: "Role",
        subject: "Subject",
        message: "Message",
        attachmentNotes: "Attachment Notes",
        attachFiles: "Attach Files",
      },
      placeholders: {
        institute: "Example: MCBS",
        role: "Select your role",
        subject: "How can we help you?",
        message: "Write your message here...",
        attachmentNotes: "Optional: add a short note about the files you attached.",
      },
      roleStudent: "Learner",
      roleTutor: "Instructor",
      feedbackTitle: "Contact form update",
      submitting: "Submitting...",
      submit: "Submit Contact Form",
      notConfigured:
        "database is not configured yet, so the contact form cannot submit right now.",
      success:
        "Your message was submitted successfully. We will review it through database.",
      error: "We could not submit your message right now.",
      methodsKicker: "Other Ways to Reach Us",
      methodsTitle: "Clear ways to connect with the Ucan team.",
      methods: [
        {
          title: "Email",
          value: "20258971@mcbs.edu.om",
          description:
            "Reach out with questions about courses, instructor opportunities, partnerships, or the Ucan learning platform.",
        },
        {
          title: "Location",
          value: "Qurum Beach, Muscat, Oman",
          description:
            "Ucan serves learners online while focusing on Oman’s graduate employment and digital skills needs.",
        },
      ],
      ctaKicker: "We Are Here to Help",
      ctaTitle: "Reach out whenever you need better support for your college courses.",
      ctaText:
        "Ucan is here to help learners build practical digital skills for stronger career opportunities.",
    },
    servicesPage: {
      heroKicker: "Courses",
      heroTitle:
        "Career-focused courses for Oman’s technology job market.",
      heroText:
        "Ucan is transforming this page into a course marketplace for software engineering, AI, machine learning, cyber security, data analytics, and job readiness.",
      heroCardText:
        "Explore the first course categories and learning paths that will shape the future Ucan marketplace.",
      highlights: [
        { number: "Skills", label: "learning paths for high-demand digital fields" },
        { number: "AI", label: "future recommendations based on market statistics" },
        { number: "Oman", label: "course strategy tailored to local employment needs" },
      ],
      cards: [
        {
          kicker: "Course Marketplace",
          title: "Browse career-focused courses by field and skill level.",
          text:
            "This section will evolve from the old instructor directory into a commercial course catalog.",
        },
        {
          kicker: "Learner Progress",
          title: "Prepare for structured learning paths and course enrollment.",
          text:
            "Learners will eventually enroll in courses, track progress, and build practical portfolios.",
        },
        {
          kicker: "Market Intelligence",
          title:
            "Use AI and open-data signals to guide which courses Ucan should create and promote.",
          text: "Future course planning can respond to actual labor-market demand and learner preferences.",
        },
      ],
      directoryStatus: "Directory Status",
      requestAccess: "Learner Access",
      requestAccessText:
        "You can explore the future course direction freely, but learner accounts will be needed for enrollment and personalized recommendations.",
      studentLogin: "Learner Login",
      tutorLogin: "Instructor Login",
      private: {
        label: "Software Engineering",
        title: "Explore practical software engineering learning paths.",
        description:
          "This area will become a course catalog for frontend, backend, and full-stack development.",
      },
      group: {
        label: "Advanced Digital Skills",
        title: "Explore future courses in AI, data, cyber security, and cloud skills.",
        description:
          "These subjects will support learners preparing for high-demand technology roles in Oman.",
      },
      tutorSection: {
        institute: "Institute",
        course: "Course",
        selectUniversity: "Select university",
        selectUniversityFirst: "Select a university first",
        noCourses: "No courses available yet",
        allCourses: "All Courses",
        availableNow: "Available Now",
        tutorsAvailable: "{count} instructor{plural} available for {title}",
        courseOfferings: "{count} course offering{plural} currently match your selected filters.",
        profileRequiredTitle: "Complete your learner profile to view available instructors",
        profileRequiredText:
          "Add your learner name and university name in your dashboard before sending a course request.",
        profileRequiredButton: "Complete Learner Profile",
        loginTitle: "Please login / sign up to view available instructors",
        loginText:
          "Create an account or log in first to access the private and group instructor directory and send a course request.",
        loadingTitle: "Loading instructor directory...",
        loadingText: "Fetching instructors, courses, and available session types from database.",
        selectInstituteTitle: "Select a university to view courses",
        selectInstituteText:
          "Course options and instructor cards will appear only after a university is selected.",
        profileLabel: "Instructor profile",
        multiInstitute: "Multi Institute",
        sessionType: "Session Type",
        privateSession: "Private one-on-one tutoring",
        groupSession: "Group tutoring session",
        availability: "Availability",
        courses: "Courses",
        offered: "{count} offered",
        sendRequest: "Send Tutoring Request",
        loginToSend: "Log in to send tutoring request",
        loginNote:
          "Please log in to your learner or instructor account before sending a tutoring session.",
        emptyTitle: "No instructor listed yet for this selection",
        emptyText:
          "Once more instructors and course offerings are added in database, this directory will update automatically.",
      },
      otherKicker: "Future Course Areas",
      otherTitle: "High-demand subjects Ucan can develop for Oman’s digital workforce.",
      services: [
        {
          title: "Frontend Software Engineering",
          description:
            "Courses can cover HTML, CSS, JavaScript, React, responsive design, accessibility, and practical portfolio projects.",
        },
        {
          title: "Backend Software Engineering",
          description:
            "Learning paths can cover APIs, databases, authentication, cloud deployment, testing, and production workflows.",
        },
        {
          title: "AI And Machine Learning",
          description:
            "Courses can help learners understand Python, ML foundations, applied AI tools, model workflows, and responsible use.",
        },
        {
          title: "Cyber Security",
          description:
            "Cyber security courses can focus on fundamentals, defensive skills, governance, risk, and entry-level security practice.",
        },
        {
          title: "Data Analytics",
          description:
            "Data courses can cover Excel, SQL, dashboards, Python analytics, visualization, and business reporting.",
        },
        {
          title: "Graduate Job Readiness",
          description:
            "Career courses can support CVs, portfolios, interviews, workplace communication, and junior tech role preparation.",
        },
      ],
      whyKicker: "Why It Matters",
      whyTitle:
        "Many graduates need practical skills that match real entry-level technology work.",
      whyTextOne:
        "Ucan can use course data, learner behavior, SEO signals, and Oman open-data statistics to decide which learning paths matter most.",
      whyTextTwo: "The current platform will be gradually transformed from service requests into courses, enrollments, and learning progress.",
      ctaKicker: "Start Your Career Path",
      ctaTitle: "Explore the first course categories for Oman’s digital economy.",
      ctaText:
        "Ucan is becoming a marketplace where learners can buy focused courses that improve employability in technology fields.",
      ctaButton: "Explore Courses",
      requestModal: {
        kicker: "Tutoring Request",
        title: "Send a tutoring request to {name}",
        intro:
          "Please save your tutoring request below and attach any helpful files so the instructor can contact you directly and arrange the session with you.",
        studentAccount: "Learner account",
        name: "Name:",
        email: "Email:",
        accountNote:
          "These details are pulled automatically from your logged-in learner account and shown to the instructor with this request.",
        titleLabel: "Title",
        titlePlaceholder: "Example: Help with MAT255 midterm review",
        instituteLabel: "Learner university name",
        institutePlaceholder: "Example: MCBS",
        courseLabel: "Course",
        topicsLabel: "Topics need help with",
        topicsPlaceholder:
          "Describe the topics, concepts, assignments, or exam areas you need help with.",
        attachFiles: "Attach files",
        attachmentNotes: "Attachment notes",
        attachmentPlaceholder:
          "Mention any files, screenshots, or notes you plan to include in your email.",
        feedbackTitle: "Tutoring request update",
        saving: "Saving Request...",
        save: "Save Tutoring Request",
      },
      messages: {
        directoryNotConfigured:
          "database is not configured yet. Add your environment variables before using the live instructor directory.",
        loginAndCourse: "Please log in and choose a course before submitting a request.",
        requiredTitleInstitute: "Please complete the required title and learner institute fields.",
        attachmentRequired:
          "Please attach at least one file before submitting your tutoring request.",
        validCourse: "Please choose a valid course for this instructor.",
        requestSuccess:
          "Your tutoring request was saved successfully. The instructor can now contact you directly to arrange the session.",
        requestError: "We could not save your tutoring request.",
      },
    },
    terms: {
      heroKicker: "Platform Policies",
      heroTitle: "Ucan Platform Policies",
      heroText:
        "These policies apply to learner access, instructor applications, course participation, and responsible use of the Ucan platform.",
      heroCardText:
        "Please review these policies carefully before creating a learner account or applying to become an instructor.",
      documentKicker: "Policy Document",
      documentTitle: "Read the platform rules and responsibilities",
      policies: [
        {
          title: "Professional Conduct Policy",
          body:
            "All instructors registered under Ucan are expected to maintain professional behavior while interacting with learners, administrators, and other instructors.",
          columns: [
            {
              title: "Tutors Must",
              items: [
                "Treat all students respectfully and professionally.",
                "Communicate politely and appropriately at all times.",
                "Arrive on time for tutoring sessions.",
                "Provide honest academic support to the best of their abilities.",
                "Maintain a positive and supportive learning environment.",
                "Dress and behave appropriately during online or physical sessions.",
                "Follow the rules and regulations of their educational institution.",
              ],
            },
            {
              title: "Tutors Must Not",
              items: [
                "Use offensive, discriminatory, or inappropriate language.",
                "Share harmful, illegal, or unethical content.",
                "Mislead students regarding qualifications or academic abilities.",
                "Request inappropriate personal information from students.",
                "Engage in behavior that damages the reputation of Ucan.",
              ],
            },
          ],
          closing:
            "Violation of this policy may result in suspension or permanent removal from the Ucan platform.",
        },
        {
          title: "Anti-Harassment Policy",
          body:
            "Ucan is committed to providing a safe, respectful, and inclusive environment for all users. Harassment of any kind is strictly prohibited.",
          sections: [
            {
              title: "Prohibited Behavior Includes",
              items: [
                "Bullying or intimidation",
                "Sexual harassment or inappropriate comments",
                "Discriminatory remarks related to gender, nationality, religion, race, or disability",
                "Repeated unwanted communication",
                "Threats, abusive language, or hostile behavior",
                "Sharing offensive or explicit content",
              ],
            },
            {
              title: "Reporting Harassment",
              text:
                "Users may report incidents directly to the Ucan administration team. All reports will be treated seriously and investigated confidentially.",
            },
            {
              title: "Consequences",
              items: [
                "Warning notices",
                "Temporary suspension",
                "Permanent account termination",
                "Reporting to educational institutions if necessary",
              ],
            },
          ],
        },
        {
          title: "Academic Honesty Policy",
          body: "Ucan promotes ethical learning and professional integrity.",
          sections: [
            {
              title: "Tutors Must",
              items: [
                "Guide students in understanding academic concepts.",
                "Encourage independent learning and problem solving.",
                "Avoid completing assignments, exams, or quizzes on behalf of students.",
                "Avoid sharing unauthorized exam materials or answer keys.",
                "Provide accurate and truthful academic assistance.",
              ],
            },
          ],
          closing:
            "Academic dishonesty, cheating assistance, plagiarism, or exam misconduct is strictly prohibited. Violations may lead to immediate removal from the platform.",
        },
        {
          title: "Privacy & Confidentiality Policy",
          body: "Ucan respects the privacy of all users and protects submitted information.",
          columns: [
            {
              title: "Collected Information May Include",
              items: [
                "Omani ID",
                "University ID",
                "Academic transcripts",
                "Contact information",
                "Tutoring qualifications",
              ],
            },
            {
              title: "Ucan Will",
              items: [
                "Use submitted documents only for instructor verification purposes.",
                "Restrict access to sensitive information to authorized administrators only.",
                "Avoid sharing personal information with third parties without permission.",
                "Take reasonable measures to protect user data and confidentiality.",
              ],
            },
          ],
          sections: [
            {
              title: "Users Must",
              items: [
                "Respect the privacy of students and tutors.",
                "Avoid recording or sharing tutoring sessions without permission.",
                "Avoid distributing personal or academic information belonging to others.",
              ],
            },
          ],
          closing: "Violation of confidentiality expectations may result in disciplinary action.",
        },
      ],
      requiredTitle: "When agreement is required",
      requiredItems: [
        "Learner users must agree before creating a learner account.",
        "Instructor applicants must agree before submitting the instructor application form.",
      ],
    },
    accessPages: {
      student: {
        audienceLabel: "Learner Access",
        title: "Log in or sign up to access Ucan learner features.",
        description:
          "This page is designed for learners who want to create an account, access courses, and prepare for practical technology careers.",
        signupHeading: "Create a learner account",
        imageAlt: "Middle East College campus in Oman",
      },
      tutor: {
        audienceLabel: "Instructor Access",
        title: "Log in or apply to join the Ucan instructor team.",
        description:
          "This page is designed for approved instructors, while new applicants should complete the instructor application form first.",
        signupHeading: "Instructor application",
        imageAlt: "Sohar University campus in Oman",
      },
      admin: {
        audienceLabel: "Admin Access",
        title: "Log in to manage Ucan as an administrator.",
        description:
          "This page is for platform administrators who need access to submissions, account oversight, and future course marketplace tools.",
        imageAlt: "Admin access card for platform administrators",
      },
    },
    authAccess: {
      recoveryStart: "Enter a new password below to finish resetting your account.",
      supabaseMissing:
        "database is not configured yet. Add your database environment variables in .env.local.",
      studentSignupFirst:
        "We could not find a learner account with those login details. Please sign up first if you have not created an account yet.",
      profileLoadError: "We could not load your account profile yet. Please try again in a moment.",
      wrongRole:
        "This account is registered as a {role}. Please use the {role} access page instead.",
      loginSuccess: "Login successful.",
      resetCooldown: "Please wait {seconds} seconds before requesting another reset email.",
      enterEmailFirst: "Enter your email first, then click forgot password again.",
      resetSent:
        "A password reset link was sent to {email}. Please check your email and spam folder.",
      shortPassword: "Your new password must be at least 6 characters.",
      passwordUpdated: "Your password was updated successfully. You can now log in.",
      confirmationEmailFirst: "Enter your email first so we can resend the confirmation link.",
      confirmationResent:
        "A new confirmation email was sent to {email}. Please also check your spam folder.",
      termsRequired: "Please read and agree to the Terms of Service before creating your account.",
      termsRequiredGoogle:
        "Please read and agree to the Terms of Service before continuing with Google.",
      existingAccount:
        "An account with {email} already exists. Please log in with your existing account instead.",
      profileSyncFailed: "Account created, but profile sync failed: {message}",
      accountCreated: "Account created successfully.",
      accountCreatedConfirm:
        "Account created. Check {email} for your confirmation email before logging in.",
      supabaseNotice:
        "database is not configured yet. Add your database environment variables to `.env.local` before testing auth.",
      feedbackErrorTitle: "Authentication update",
      feedbackRecoveryTitle: "Password recovery update",
      feedbackAccessTitle: "Account access update",
      confirmationQuestion: "Did not receive the confirmation email for",
      resending: "Resending...",
      resendConfirmation: "Resend Confirmation Email",
      resetPassword: "Reset Password",
      logIn: "Log In",
      createNewPassword: "Create a new password",
      welcomeBack: "Welcome back",
      newPassword: "New Password",
      newPasswordPlaceholder: "Enter a new password",
      updatingPassword: "Updating Password...",
      updatePassword: "Update Password",
      email: "Email",
      emailPlaceholder: "Enter your email",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      loggingIn: "Logging In...",
      sendingReset: "Sending Reset Link...",
      tryAgain: "Try again in {seconds}s",
      forgotPassword: "Forgot password?",
      signUp: "Sign Up",
      fullName: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      institute: "Institute",
      institutePlaceholder: "Enter your institute name",
      createPasswordPlaceholder: "Create a password",
      termsAgreementPrefix: "I have read and agree to the",
      termsAgreementLink: "Ucan Platform Policies",
      openingGoogle: "Opening Google...",
      continueWithGoogle: "Continue with Google",
      or: "Or",
      creatingAccount: "Creating Account...",
      createAccount: "Create Account",
    },
    tutorApplicationPanel: {
      kicker: "Instructor Application",
      title: "Apply before creating an instructor account",
      text:
        "Instructor signup is handled through a separate application review process. Submit your background, proposed teaching areas, and supporting documents first, then approved instructors can be onboarded into the platform.",
      needsTitle: "You will need",
      needs: [
        "Full name and professional or academic background",
        "Your proposed course topics",
        "Email and WhatsApp phone number",
        "Supporting documents or portfolio links",
      ],
      button: "Open Instructor Application Form",
    },
    studentDashboard: {
      fallbackName: "Learner",
      heroKicker: "Learner Dashboard",
      welcome: "Welcome, {name}",
      heroText:
        "Complete your learner profile first, then use this protected dashboard as your home base for courses and career-focused learning.",
      profileKicker: "Learner Profile",
      profileComplete: "Profile complete",
      completeProfile: "Complete your profile",
      profileText: "Enter your learner name and university name before enrolling in courses.",
      feedbackTitle: "Learner profile update",
      studentName: "Learner name",
      studentNamePlaceholder: "Enter your full name",
      universityName: "University name",
      universityPlaceholder: "Example: MCBS",
      email: "Email:",
      role: "Role:",
      roleStudent: "Learner",
      notSet: "Not set",
      saving: "Saving Profile...",
      save: "Save Learner Profile",
      actionsKicker: "Learner Actions",
      lockedTitle: "Complete your profile to unlock learner tools",
      lockedText:
        "Save your learner name and university name first, then course tools will become available.",
      messages: {
        notConfigured: "Your learner profile cannot be saved until database is configured.",
        required: "Please enter your learner name and university name to complete your profile.",
        success: "Your learner profile was saved. You can now enroll in courses.",
        error: "We could not save your learner profile right now.",
      },
      quickLinks: [
        {
          title: "Explore Courses",
          description: "Browse career-focused learning paths planned for Oman tech graduates.",
          action: "Open Courses",
        },
        {
          title: "Contact Support",
          description: "Reach out if you need guidance finding the right course support.",
          action: "Contact Ucan",
        },
      ],
    },
    tutorDashboard: {
      fallbackName: "Instructor",
      notSet: "Not set yet",
      heroKicker: "Instructor Dashboard",
      welcome: "Welcome, {name}",
      heroText:
        "This protected dashboard gives you a clean place to manage your tutoring request workflow, review how your tutoring appears, and coordinate platform updates.",
      profileKicker: "Profile",
      labels: {
        fullName: "Full name:",
        email: "Email:",
        institute: "Institute:",
        role: "Role:",
      },
      role: "Instructor",
      actionsKicker: "Instructor Actions",
      emptyTitle: "No instructor actions available yet",
      emptyText: "Instructor tools will appear here as your dashboard expands.",
      actions: [
        {
          title: "Submitted Tutoring Requests",
          description:
            "Open a separate instructor page to review your assigned requests, update their status, and download attached files.",
          action: "View Tutoring Requests",
        },
      ],
      instructionsKicker: "Tutoring Request Instructions",
      instructionsTitle: "How to handle learner tutoring requests",
      step: "Step {number}",
      instructions: [
        "Open the tutoring request.",
        "Review the content of the request and study the attachments.",
        "Contact the sender by email to arrange a tutoring session on Google Meet, and use a teaching tool like Microsoft Whiteboard.",
        'Mark the tutoring request as "completed" or "cancelled" after the request is handled.',
      ],
    },
    adminDashboard: {
      fallbackName: "Admin",
      notSet: "Not set yet",
      yes: "Yes",
      no: "No",
      none: "None",
      supabaseNotConfigured: "database is not configured.",
      diagnosticsError: "Unable to load instructor directory diagnostics right now.",
      heroKicker: "Admin Dashboard",
      welcome: "Welcome, {name}",
      heroText:
        "This protected dashboard gives you a clean place to review contact form submissions, tutoring requests, and the next stage of platform administration.",
      profileKicker: "Profile",
      labels: {
        fullName: "Full name:",
        email: "Email:",
        institute: "Institute:",
        role: "Role:",
      },
      role: "Admin",
      toolsKicker: "Admin Tools",
      tools: [
        {
          title: "Submitted Contact Messages",
          description:
            "Open a separate admin page to review contact submissions and download any attached files.",
          action: "View Contact Messages",
        },
        {
          title: "Instructor Applications",
          description:
            "Open a separate admin page to review people applying to become instructors and check their verification documents.",
          action: "View Instructor Applications",
        },
        {
          title: "Submitted Tutoring Requests",
          description:
            "Open a separate admin page to review tutoring requests and download any submitted attachments.",
          action: "View Tutoring Requests",
        },
        {
          title: "Course Management",
          description:
            "Create, edit, publish, and unpublish Ucan courses from one admin workspace.",
          action: "Manage Courses",
        },
      ],
      workflowTitle: "Simple Admin Workflow",
      workflowText:
        "Use the same status flow for contact messages and tutoring requests so nothing gets lost.",
      contactWorkflowTitle: "Contact Messages",
      contactWorkflow: [
        "1. Open pending messages first.",
        "2. Mark as reviewed after reading and deciding the next step.",
        "3. Mark as scheduled if follow-up is arranged.",
        "4. Mark as completed once the issue is fully handled.",
      ],
      tutoringWorkflowTitle: "Tutoring Requests",
      tutoringWorkflow: [
        "1. Review new learner requests and attachments.",
        "2. Move to reviewed after checking the course/topic details.",
        "3. Use scheduled once the session is arranged.",
        "4. Mark completed or cancelled when the workflow ends.",
      ],
      diagnosticsTitle: "Instructor Directory Diagnostics",
      diagnosticsText:
        "Internal status for the Services directory so you can troubleshoot offerings without showing debug data to public users.",
      noDataTitle: "No instructor directory data yet",
      noDataText:
        "database is connected, but no active instructor offerings are available to report yet.",
      diagnosticLabels: {
        configured: "database configured:",
        loading: "Loading:",
        raw: "Raw offerings:",
        privateCards: "Private instructor cards:",
        groupCards: "Group instructor cards:",
        institutes: "Visible institutes:",
        error: "Directory error:",
      },
    },
    resetPasswordPage: {
      recoveryPrompt: "Enter your new password below to complete the reset.",
      supabaseMissing: "database is not configured yet.",
      shortPassword: "Your new password must be at least 6 characters.",
      success: "Your password was updated successfully. You can now log in.",
      heroKicker: "Password Reset",
      heroTitle: "Create a new password for your Ucan account.",
      heroText: "Use this page after opening the database password recovery email.",
      formKicker: "New Password",
      formTitle: "Reset your password",
      feedbackTitle: "Password reset update",
      label: "New Password",
      placeholder: "Enter your new password",
      updating: "Updating Password...",
      update: "Update Password",
      back: "Back to Login",
    },
    tutorApplicationPage: {
      heroKicker: "Instructor Application",
      heroTitle: "Apply separately before joining the Ucan instructor team.",
      heroText:
        "Complete this form with your professional background, proposed course topic, portfolio, and sample material so the platform can review your instructor application properly.",
      heroCardText:
        "Instructor applications are reviewed using your experience, proposed course idea, public work samples, and teaching evidence.",
      formKicker: "Application Form",
      formTitle: "Submit your instructor application",
      back: "Back to Instructor Access",
      feedbackTitle: "Instructor application update",
      fullName: "Full name",
      email: "Email",
      professionalBackground: "Professional background",
      professionalBackgroundPlaceholder:
        "Summarize your work experience, technical expertise, certifications, and the audience you can teach.",
      portfolioUrl: "LinkedIn, GitHub, or portfolio link",
      portfolioUrlPlaceholder: "https://linkedin.com/in/your-name or https://github.com/username",
      courseTopicProposal: "Course topic proposal",
      courseTopicPlaceholder:
        "Example: Frontend development for Omani CS graduates, including React projects, deployment, and portfolio preparation.",
      teachingExperience: "Teaching experience",
      teachingExperiencePlaceholder:
        "Mention previous teaching, mentoring, workshops, tutoring, training, public speaking, or content creation experience.",
      paymentDetails: "Bank/payment details later",
      paymentDetailsPlaceholder:
        "Optional for now. You can add payment details later after approval.",
      requiredAttachments: "Required Attachments",
      attachFiles: "Attach files",
      termsPrefix: "I have read and agree to the",
      termsLink: "Ucan Platform Policies",
      submitting: "Submitting Application...",
      submit: "Submit Instructor Application",
      attachments: [
        "Sample teaching video, course outline, portfolio PDF, or other file that shows your ability to teach this topic",
      ],
      messages: {
        terms: "Please read and agree to the Ucan Platform Policies before submitting your instructor application.",
        notConfigured: "database is not configured yet, so the instructor application cannot submit right now.",
        files: "Please attach at least one sample video or file before submitting your instructor application.",
        success:
          "Your instructor application was submitted successfully. The Ucan team can now review your form and attachments. You will receive a reply in less than 24 hours.",
        error: "We could not submit your instructor application right now.",
        applicationSubmittedBy: "Instructor application submitted by {name}.",
        email: "Email: {email}",
        courseTopic: "Course topic proposal: {topic}",
        portfolio: "Portfolio: {portfolio}",
      },
    },
    records: {
      unknown: "Unknown",
      close: "Close",
      total: "Total",
      pending: "Pending",
      private: "Private",
      institutes: "Institutes",
      notProvided: "Not provided",
      notProvidedStudent: "Unknown learner",
      noEmail: "No email",
      submitted: "Submitted:",
      status: "Status:",
      email: "Email:",
      institute: "Institute:",
      role: "Role:",
      from: "From:",
      attachments: "Attachments:",
      statusWorkflow: "Status Workflow",
      updateStatus: "Update status",
      saving: "Saving...",
      saveStatus: "Save Status",
      downloaded: "Downloaded {fileName} successfully.",
      attachment: "attachment",
      downloadError: "Unable to download this attachment right now.",
      contact: {
        fetchError: "Unable to load contact messages right now.",
        statusSaved: "Contact message marked as {status}.",
        statusError: "Unable to update this contact message status right now.",
        kicker: "Admin Records",
        title: "Submitted Contact Messages",
        description:
          "Review messages from the public contact form and download any submitted files directly from this page.",
        back: "Back to Admin Dashboard",
        feedbackTitle: "Contact records update",
        workflowTitle: "Message Workflow",
        workflowText:
          "Start with pending messages, move them to reviewed after checking them, then use scheduled or completed to reflect the outcome.",
        filter: "Filter by status",
        allStatuses: "All statuses",
        loadingTitle: "Loading contact messages...",
        loadingText: "Fetching the latest submissions from database.",
        errorTitle: "Unable to load messages",
        emptyTitle: "No active contact messages",
        emptyText:
          "Completed contact messages are hidden from the dashboard, but still kept in database.",
        noFilteredTitle: "No {status} messages",
        noFilteredText: "Try another status filter to continue processing contact submissions.",
        fromLine: "From {name} via {email}",
        openHint: "Click to open this message in a separate popup window.",
        popupKicker: "Contact Submission",
        message: "Message",
      },
      tutoring: {
        fetchError: "Unable to load tutoring requests right now.",
        statusSaved: "Tutoring request marked as {status}.",
        statusError: "Unable to update this tutoring request status right now.",
        kicker: "Instructor Records",
        title: "Submitted Tutoring Requests",
        description:
          "Open your assigned tutoring requests in separate popup windows, update their status, and download the attached study files directly from this page.",
        back: "Back to Instructor Dashboard",
        feedbackTitle: "Instructor request update",
        loadingTitle: "Loading tutoring requests...",
        loadingText: "Fetching the latest learner requests assigned to your instructor account.",
        errorTitle: "Unable to load tutoring requests",
        emptyTitle: "No active tutoring requests",
        emptyText:
          "Completed and cancelled tutoring requests are hidden from the dashboard, but still remain stored in database.",
        studentLine: "Learner {name} via {email}",
        student: "Learner:",
        studentInstitute: "Learner institute:",
        sessionType: "Session Type:",
        openHint: "Click to open this tutoring request in a separate popup window.",
        popupKicker: "Tutoring Request",
        topics: "Topics Need Help With",
        courseFallback: "Course",
      },
    },
  },
  ar: {
    brand: {
      kicker: "تعليم مهني رقمي",
      name: "يوكان",
    },
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      services: "الدورات",
      contact: "تواصل معنا",
      policies: "السياسات",
      studentAccess: "دخول المتعلمين",
      tutorAccess: "دخول المدربين",
      adminAccess: "دخول الإدارة",
      dashboard: "لوحة التحكم",
      adminDashboard: "لوحة الإدارة",
      logout: "تسجيل الخروج",
      openMenu: "فتح القائمة",
      closeMenu: "إغلاق القائمة",
    },
    language: {
      switchToArabic: "التبديل إلى العربية",
      switchToEnglish: "Switch to English",
    },
    feedback: {
      sessionUpdate: "تحديث الجلسة",
      loggedOut: "تم تسجيل خروجك بنجاح.",
    },
    roles: {
      member: "عضو",
      learner: "متعلم",
      instructor: "مدرب",
      admin: "مسؤول",
    },
    common: shared.ar,
    home: {
      heroKicker: "مرحباً بك في يوكان",
      heroTitle: "تعليم مهني رقمي مخصص لجيل عُمان القادم من المواهب التقنية.",
      heroText:
        "يساعد يوكان الخريجين الجدد والباحثين عن عمل على بناء مهارات عملية لسوق التقنية في عُمان من خلال دورات في هندسة البرمجيات والذكاء الاصطناعي والأمن السيبراني وتحليل البيانات والاستعداد الوظيفي.",
      exploreServices: "استكشف الدورات",
      cardKicker: "السوق العُماني، مهارات حديثة",
      cardTitle: "منصة تعليمية تجارية تركز على التوظيف والمشاريع العملية والمسارات الرقمية المطلوبة.",
      stats: [
        { number: "تقنية", label: "دورات مرتبطة بمسارات مهنية مطلوبة" },
        { number: "AI", label: "توصيات مستقبلية مبنية على إشارات السوق" },
        { number: "عُمان", label: "محتوى مخصص لاحتياجات توظيف الخريجين محلياً" },
      ],
      featuresKicker: "لماذا تختار يوكان",
      featuresTitle: "منصة تعليم عملي للخريجين الذين يحتاجون إلى مهارات تقنية جاهزة للعمل.",
      features: [
        {
          title: "دورات موجهة للمهنة",
          description:
            "تصمم الدورات حول مهارات عملية تساعد المتعلمين على الاستعداد لوظائف تقنية للمبتدئين.",
        },
        {
          title: "مصمم لعُمان",
          description:
            "يركز يوكان على احتياجات الخريجين وحملة الدبلوم والباحثين عن عمل في قطاع التقنية العُماني.",
        },
        {
          title: "توجه مدعوم بالبيانات",
          description:
            "تتهيأ المنصة لاستخدام الذكاء الاصطناعي وSEO والبيانات المفتوحة لتحديد مسارات التعلم المطلوبة.",
        },
      ],
      howKicker: "كيف تعمل المنصة",
      howTitle: "ثلاث خطوات بسيطة من التعلم إلى الجاهزية الوظيفية.",
      steps: [
        {
          title: "اختر مساراً مهنياً",
          description:
            "استكشف مسارات مثل تطوير الواجهات، هندسة الخلفية، الذكاء الاصطناعي، الأمن السيبراني، وتحليل البيانات.",
        },
        {
          title: "تعلم مهارات عملية",
          description:
            "ادرس دورات منظمة تركز على المشاريع والأدوات وسير العمل والمفاهيم التي يتوقعها أصحاب العمل.",
        },
        {
          title: "ابنِ جاهزيتك للعمل",
          description:
            "استخدم تعلمك لتقوية ملفك العملي وثقتك واستعدادك للمقابلات وبيئة العمل.",
        },
      ],
      toolsKicker: "أدوات التعلم",
      toolsTitle: "أدوات رقمية تدعم التعلم عبر الإنترنت والتعاون المهني.",
      toolsText:
        "يمكن أن تستخدم دورات يوكان أدوات الاجتماعات والتخطيط والتعاون الحديثة لمساعدة المتعلمين على ممارسة أساليب العمل المستخدمة في فرق التقنية.",
      toolGroups: [
        {
          title: "منصات التعلم المباشر",
          description:
            "دعم الورش المباشرة وجلسات الإرشاد ومشاركة الشاشة والتعلم بقيادة المدرب.",
        },
        {
          title: "أدوات التعاون",
          description:
            "تنظيم المشاريع وشرح الأفكار التقنية بصرياً والتعاون حول مهام مهنية عملية.",
        },
      ],
      tutorKicker: "انضم إلى فريق المدربين",
      tutorTitle: "كن مدرباً وساهم في إعداد الجيل التقني القادم في عُمان.",
      tutorText:
        "سيرحب يوكان بالمدربين والممارسين في القطاع الذين يستطيعون تعليم مهارات رقمية عملية وموجهة للتوظيف.",
      tutorAccess: "دخول المدربين",
      tutorCardTitle: "سجل الدخول أو تقدم لإنشاء حساب مدرب.",
      tutorCardText:
        "استخدم صفحة المدربين للتقديم والدخول إلى لوحتك المحمية والاستعداد لإطلاق الدورات.",
      tutorButton: "دخول / تقديم مدرب",
      studentKicker: "دخول المتعلمين",
      studentTitle: "انضم كمتعلم وابدأ بناء مهارات تقنية جاهزة للعمل.",
      studentText:
        "يمكن للمتعلمين إنشاء حساب للوصول إلى الدورات المهنية والموارد التعليمية والتوصيات الشخصية مستقبلاً.",
      studentCardTitle: "سجل الدخول أو أنشئ حساب متعلم.",
      studentCardText:
        "استخدم صفحة حساب المتعلم لإنشاء ملفك والاستعداد لسوق دورات يوكان.",
      studentButton: "دخول / تسجيل متعلم",
      ctaKicker: "ابدأ التعلم",
      ctaTitle: "ابنِ المهارات المطلوبة لقطاع التقنية المتنامي في عُمان.",
      ctaText:
        "يتحول يوكان إلى منصة تعليم إلكتروني تجارية لهندسة البرمجيات والذكاء الاصطناعي والأمن السيبراني وتحليل البيانات والاستعداد الوظيفي.",
      ctaButton: "استكشف الدورات",
    },
    about: {
      heroKicker: "عن يوكان",
      heroTitle: "منصة تعليم إلكتروني تركز على فجوة توظيف الخريجين في عُمان.",
      heroText:
        "يُبنى يوكان لمساعدة خريجي علوم الحاسب وحملة الدبلوم والباحثين عن عمل على الانتقال من المعرفة الأكاديمية إلى مهارات تقنية عملية مناسبة للسوق.",
      ucf: "جامعة سنترال فلوريدا",
      ucfText: "نرى التعليم الرقمي عملياً وكريماً ومرتبطاً بعُمان وبنتائج توظيف حقيقية.",
      founderKicker: "تعرف على المؤسس",
      founderName: "أحمد محمد الرقيشي",
      founderTextOne:
        "نشأ في المملكة المتحدة... وانتقل إلى الولايات المتحدة... والآن في عُمان. وأنتم تعرفون بقية القصة... هيا بنا جميعاً!!",
      founderTextTwo:
        'أحمد مطور برمجيات مبتدئ عمره 25 عاماً، ألهمه فيلم "The Social Network" لإنشاء هذه المنصة لتحسين التجربة الجامعية أكاديمياً واجتماعياً ونفسياً قبل كل شيء.',
      founderLocation: "شاطئ القرم، مسقط، عُمان.",
      highlights: [
        { number: "مهنة", label: "مسارات تعلم لأدوار تقنية" },
        { number: "بيانات", label: "رؤى مستقبلية من إشارات سوق العمل" },
        { number: "محلي", label: "مهارات مخصصة لاحتياجات التوظيف في عُمان" },
      ],
      missionKicker: "رسالتنا",
      missionTitle: "مساعدة خريجي التقنية في عُمان على أن يصبحوا أكثر جاهزية للتوظيف من خلال دورات عملية.",
      missionTextOne:
        "يوجد يوكان لسد الفجوة بين الدراسة الأكاديمية والعمل التقني للمبتدئين من خلال التركيز على المهارات العملية والمشاريع والأدوات والاستعداد المهني.",
      missionTextTwo:
        "الرؤية طويلة المدى هي استخدام الذكاء الاصطناعي وSEO ومصادر البيانات المفتوحة في عُمان لتحديد ما يجب أن يتعلمه المستخدمون وما هي موضوعات الدورات الأكثر أهمية للسوق.",
      valuesKicker: "القيم الأساسية",
      valuesTitle: "الأفكار التي تشكل سوق يوكان التعليمي.",
      values: [
        {
          title: "التوظيف أولاً",
          description:
            "يجب أن تساعد الدورات المتعلمين على بناء قدرات حقيقية تحسن فرصهم في سوق وظائف التقنية في عُمان.",
        },
        {
          title: "ملاءمة السوق المحلي",
          description:
            "يجب أن تعكس مسارات التعلم المهارات التي يحتاجها أصحاب العمل فعلاً من المواهب التقنية المبتدئة في عُمان.",
        },
        {
          title: "نمو موجه بالذكاء الاصطناعي",
          description:
            "يجب أن تساعد ذكاء المنصة مستقبلاً في اقتراح الدورات وتحديد فجوات المهارات وتوجيه إنشاء الدورات الجديدة.",
        },
      ],
      communityKicker: "متعلمونا",
      communityTitle: "خريجون وباحثون عن عمل ومدربون وجهات توظيف يجمعهم هدف المهارات الرقمية العملية.",
      communityText:
        "يوكان مخصص للمتعلمين الذين يريدون أكثر من الشهادات: يحتاجون إلى ثقة ومشاريع وخبرة مهارية تناسب سوق العمل العُماني.",
    },
    contact: {
      heroKicker: "تواصل مع يوكان",
      heroTitle: "تواصل مع منصة تعليم مهني رقمي مبنية لعُمان.",
      heroText:
        "سواء كنت متعلماً أو مدرباً أو جهة توظيف أو شريكاً، استخدم هذه الصفحة للتواصل مع يوكان حول الدورات والمهارات وفرص التعلم الرقمي.",
      heroCardText:
        "نريد للمنصة أن تكون موثوقة وقريبة مثل المعالم التي تشكل هوية عُمان.",
      formKicker: "نموذج التواصل",
      formTitle: "أرسل رسالتك مباشرة إلى يوكان.",
      formText:
        "املأ النموذج أدناه وسيتم حفظ رسالتك في database حتى يتمكن الفريق من مراجعتها بشكل مناسب.",
      labels: {
        fullName: "الاسم الكامل",
        email: "البريد الإلكتروني",
        institute: "المؤسسة التعليمية",
        role: "الدور",
        subject: "الموضوع",
        message: "الرسالة",
        attachmentNotes: "ملاحظات المرفقات",
        attachFiles: "إرفاق ملفات",
      },
      placeholders: {
        institute: "مثال: MCBS",
        role: "اختر دورك",
        subject: "كيف يمكننا مساعدتك؟",
        message: "اكتب رسالتك هنا...",
        attachmentNotes: "اختياري: أضف ملاحظة قصيرة عن الملفات المرفقة.",
      },
      roleStudent: "متعلم",
      roleTutor: "مدرب",
      feedbackTitle: "تحديث نموذج التواصل",
      submitting: "جارٍ الإرسال...",
      submit: "إرسال نموذج التواصل",
      notConfigured: "لم يتم إعداد database بعد، لذلك لا يمكن إرسال نموذج التواصل حالياً.",
      success: "تم إرسال رسالتك بنجاح. سنراجعها من خلال database.",
      error: "تعذر إرسال رسالتك حالياً.",
      methodsKicker: "طرق أخرى للتواصل",
      methodsTitle: "طرق واضحة للتواصل مع فريق يوكان.",
      methods: [
        {
          title: "البريد الإلكتروني",
          value: "20258971@mcbs.edu.om",
          description:
            "تواصل معنا بخصوص الدورات أو فرص المدربين أو الشراكات أو منصة يوكان التعليمية.",
        },
        {
          title: "الموقع",
          value: "شاطئ القرم، مسقط، عُمان",
          description:
            "يخدم يوكان المتعلمين عبر الإنترنت مع التركيز على توظيف الخريجين والمهارات الرقمية في عُمان.",
        },
      ],
      ctaKicker: "نحن هنا للمساعدة",
      ctaTitle: "تواصل معنا كلما احتجت إلى دعم أفضل لمقرراتك الجامعية.",
      ctaText:
        "يوكان هنا لمساعدة المتعلمين على بناء مهارات رقمية عملية لفرص مهنية أقوى.",
    },
    servicesPage: {
      heroKicker: "الدورات",
      heroTitle: "دورات مهنية مخصصة لسوق وظائف التقنية في عُمان.",
      heroText:
        "يتحول يوكان إلى سوق دورات لهندسة البرمجيات والذكاء الاصطناعي وتعلم الآلة والأمن السيبراني وتحليل البيانات والاستعداد الوظيفي.",
      heroCardText:
        "استكشف أول فئات الدورات ومسارات التعلم التي ستشكل سوق يوكان القادم.",
      highlights: [
        { number: "مهارات", label: "مسارات تعلم لمجالات رقمية عالية الطلب" },
        { number: "AI", label: "توصيات مستقبلية مبنية على إحصاءات السوق" },
        { number: "عُمان", label: "استراتيجية دورات مخصصة لاحتياجات التوظيف المحلية" },
      ],
      cards: [
        {
          kicker: "سوق الدورات",
          title: "تصفح دورات مهنية حسب المجال ومستوى المهارة.",
          text: "سيتحول هذا القسم من دليل المدربين القديم إلى كتالوج دورات تجاري.",
        },
        {
          kicker: "تقدم المتعلم",
          title: "استعد لمسارات تعلم منظمة والتسجيل في الدورات.",
          text:
            "سيتمكن المتعلمون لاحقاً من التسجيل في الدورات وتتبع التقدم وبناء ملفات عملية.",
        },
        {
          kicker: "ذكاء السوق",
          title: "استخدام الذكاء الاصطناعي والبيانات المفتوحة لتوجيه إنشاء الدورات وتسويقها.",
          text: "يمكن لتخطيط الدورات مستقبلاً أن يستجيب لطلب سوق العمل الفعلي وتفضيلات المتعلمين.",
        },
      ],
      directoryStatus: "حالة الدليل",
      requestAccess: "دخول المتعلمين",
      requestAccessText:
        "يمكنك استكشاف توجه الدورات القادم بحرية، لكن حساب المتعلم سيكون مطلوباً للتسجيل والتوصيات الشخصية.",
      studentLogin: "دخول المتعلم",
      tutorLogin: "دخول المدرب",
      private: {
        label: "هندسة البرمجيات",
        title: "استكشف مسارات تعلم عملية في هندسة البرمجيات.",
        description: "سيتحول هذا الجزء إلى كتالوج دورات للواجهات والخلفية والتطوير الكامل.",
      },
      group: {
        label: "مهارات رقمية متقدمة",
        title: "استكشف دورات مستقبلية في الذكاء الاصطناعي والبيانات والأمن السيبراني والسحابة.",
        description:
          "ستدعم هذه المجالات المتعلمين الذين يستعدون لأدوار تقنية مطلوبة في عُمان.",
      },
      tutorSection: {
        institute: "المؤسسة",
        course: "المقرر",
        selectUniversity: "اختر الجامعة",
        selectUniversityFirst: "اختر الجامعة أولاً",
        noCourses: "لا توجد مقررات متاحة بعد",
        allCourses: "كل المقررات",
        availableNow: "متاح الآن",
        tutorsAvailable: "{count} مدرب متاح لـ {title}",
        courseOfferings: "{count} عرض مقرر يطابق المرشحات المحددة حالياً.",
        profileRequiredTitle: "أكمل ملف المتعلم لعرض المدربين المتاحين",
        profileRequiredText:
          "أضف اسم المتعلم واسم الجامعة في لوحة التحكم قبل إرسال طلب تعلم.",
        profileRequiredButton: "إكمال ملف المتعلم",
        loginTitle: "يرجى تسجيل الدخول / إنشاء حساب لعرض المدربين المتاحين",
        loginText:
          "أنشئ حساباً أو سجل الدخول أولاً للوصول إلى دليل التدريس الفردي والجماعي وإرسال طلب تدريس.",
        loadingTitle: "جارٍ تحميل دليل المدربين...",
        loadingText: "يتم جلب المدربين والمقررات وأنواع الجلسات المتاحة من database.",
        selectInstituteTitle: "اختر جامعة لعرض المقررات",
        selectInstituteText: "ستظهر خيارات المقررات وبطاقات المدربين فقط بعد اختيار جامعة.",
        profileLabel: "ملف مدرب للتدريس المجاني",
        multiInstitute: "عدة مؤسسات",
        sessionType: "نوع الجلسة",
        privateSession: "تدريس فردي خاص",
        groupSession: "جلسة تدريس جماعية",
        availability: "التوفر",
        courses: "المقررات",
        offered: "{count} معروض",
        sendRequest: "إرسال طلب تدريس",
        loginToSend: "سجل الدخول لإرسال طلب تدريس",
        loginNote: "يرجى تسجيل الدخول إلى حساب المتعلم أو المدرب قبل إرسال جلسة تدريس.",
        emptyTitle: "لا يوجد مدرب لهذا الاختيار بعد",
        emptyText:
          "عند إضافة المزيد من المدربين وعروض المقررات في database، سيتم تحديث هذا الدليل تلقائياً.",
      },
      otherKicker: "مجالات الدورات المستقبلية",
      otherTitle: "موضوعات عالية الطلب يمكن ليوكان تطويرها للقوى الرقمية العاملة في عُمان.",
      services: [
        {
          title: "هندسة الواجهات الأمامية",
          description:
            "يمكن أن تغطي الدورات HTML وCSS وJavaScript وReact والتصميم المتجاوب وإمكانية الوصول ومشاريع عملية.",
        },
        {
          title: "هندسة الخلفية",
          description:
            "يمكن أن تغطي المسارات واجهات API وقواعد البيانات والمصادقة والنشر السحابي والاختبار وسير العمل الإنتاجي.",
        },
        {
          title: "الذكاء الاصطناعي وتعلم الآلة",
          description:
            "تساعد الدورات المتعلمين على فهم Python وأساسيات ML وأدوات AI العملية وسير عمل النماذج والاستخدام المسؤول.",
        },
        {
          title: "الأمن السيبراني",
          description:
            "يمكن أن تركز دورات الأمن على الأساسيات والمهارات الدفاعية والحوكمة والمخاطر والممارسة للمبتدئين.",
        },
        {
          title: "تحليل البيانات",
          description:
            "يمكن أن تغطي دورات البيانات Excel وSQL ولوحات المعلومات وتحليلات Python والتصور وإعداد التقارير.",
        },
        {
          title: "الاستعداد الوظيفي للخريجين",
          description:
            "يمكن لدورات المسار المهني دعم السيرة الذاتية والملفات العملية والمقابلات والتواصل المهني والاستعداد للأدوار التقنية.",
        },
      ],
      whyKicker: "لماذا هذا مهم",
      whyTitle: "يحتاج كثير من الخريجين إلى مهارات عملية تناسب العمل التقني للمبتدئين.",
      whyTextOne:
        "يمكن ليوكان استخدام بيانات الدورات وسلوك المتعلمين وإشارات SEO وإحصاءات البيانات المفتوحة في عُمان لتحديد أهم مسارات التعلم.",
      whyTextTwo: "سيتم تحويل المنصة تدريجياً من طلبات الخدمات إلى دورات وتسجيلات وتتبع تقدم.",
      ctaKicker: "ابدأ مسارك المهني",
      ctaTitle: "استكشف أول فئات الدورات للاقتصاد الرقمي في عُمان.",
      ctaText:
        "يتحول يوكان إلى سوق يمكن للمتعلمين فيه شراء دورات مركزة تحسن قابلية التوظيف في المجالات التقنية.",
      ctaButton: "استكشف المقررات",
      requestModal: {
        kicker: "طلب تدريس",
        title: "أرسل طلب تدريس إلى {name}",
        intro:
          "احفظ طلب التدريس أدناه وأرفق أي ملفات مفيدة حتى يتمكن المدرب من التواصل معك مباشرة وترتيب الجلسة.",
        studentAccount: "حساب المتعلم",
        name: "الاسم:",
        email: "البريد الإلكتروني:",
        accountNote:
          "يتم جلب هذه التفاصيل تلقائياً من حساب المتعلم المسجل وتظهر للمدرب مع هذا الطلب.",
        titleLabel: "العنوان",
        titlePlaceholder: "مثال: مراجعة اختبار MAT255",
        instituteLabel: "اسم جامعة المتعلم",
        institutePlaceholder: "مثال: MCBS",
        courseLabel: "المقرر",
        topicsLabel: "الموضوعات التي تحتاج مساعدة فيها",
        topicsPlaceholder:
          "صف الموضوعات أو المفاهيم أو الواجبات أو أجزاء الاختبار التي تحتاج مساعدة فيها.",
        attachFiles: "إرفاق الملفات",
        attachmentNotes: "ملاحظات المرفقات",
        attachmentPlaceholder:
          "اذكر أي ملفات أو صور شاشة أو ملاحظات تخطط لإرفاقها في بريدك.",
        feedbackTitle: "تحديث طلب التدريس",
        saving: "جارٍ حفظ الطلب...",
        save: "حفظ طلب التدريس",
      },
      messages: {
        directoryNotConfigured:
          "لم يتم إعداد database بعد. أضف متغيرات البيئة قبل استخدام دليل المدربين المباشر.",
        loginAndCourse: "يرجى تسجيل الدخول واختيار مقرر قبل إرسال الطلب.",
        requiredTitleInstitute: "يرجى إكمال حقلي العنوان واسم المؤسسة التعليمية المطلوبين.",
        attachmentRequired: "يرجى إرفاق ملف واحد على الأقل قبل إرسال طلب التدريس.",
        validCourse: "يرجى اختيار مقرر صالح لهذا المدرب.",
        requestSuccess:
          "تم حفظ طلب التدريس بنجاح. يمكن للمدرب الآن التواصل معك مباشرة لترتيب الجلسة.",
        requestError: "تعذر حفظ طلب التدريس.",
      },
    },
    terms: {
      heroKicker: "سياسات المنصة",
      heroTitle: "سياسات منصة يوكان",
      heroText:
        "تنطبق هذه السياسات على دخول المتعلمين وطلبات المدربين والمشاركة في الدورات والاستخدام المسؤول لمنصة يوكان.",
      heroCardText: "يرجى مراجعة هذه السياسات بعناية قبل إنشاء حساب متعلم أو التقديم كمدرب.",
      documentKicker: "وثيقة السياسات",
      documentTitle: "اقرأ قواعد المنصة والمسؤوليات",
      policies: [
        {
          title: "سياسة السلوك المهني",
          body:
            "يتوقع من جميع المدربين المسجلين في يوكان الحفاظ على سلوك مهني عند التعامل مع المتعلمين والإدارة والمدربين الآخرين.",
          columns: [
            {
              title: "يجب على المدربين",
              items: [
                "معاملة جميع المتعلمين باحترام ومهنية.",
                "التواصل بأدب وبشكل مناسب في جميع الأوقات.",
                "الحضور في الوقت المحدد لجلسات التدريس.",
                "تقديم دعم أكاديمي صادق قدر الإمكان.",
                "الحفاظ على بيئة تعلم إيجابية وداعمة.",
                "الظهور والتصرف بشكل مناسب أثناء الجلسات الإلكترونية أو الحضورية.",
                "اتباع قواعد وأنظمة المؤسسة التعليمية.",
              ],
            },
            {
              title: "يجب على المدربين عدم",
              items: [
                "استخدام لغة مسيئة أو تمييزية أو غير مناسبة.",
                "مشاركة محتوى ضار أو غير قانوني أو غير أخلاقي.",
                "تضليل المتعلمين بشأن المؤهلات أو القدرات الأكاديمية.",
                "طلب معلومات شخصية غير مناسبة من المتعلمين.",
                "القيام بسلوك يضر بسمعة يوكان.",
              ],
            },
          ],
          closing:
            "قد يؤدي انتهاك هذه السياسة إلى الإيقاف أو الإزالة الدائمة من منصة يوكان.",
        },
        {
          title: "سياسة مكافحة التحرش",
          body:
            "يلتزم يوكان بتوفير بيئة آمنة ومحترمة وشاملة لجميع المستخدمين. ويُمنع التحرش بجميع أشكاله منعاً باتاً.",
          sections: [
            {
              title: "تشمل السلوكيات المحظورة",
              items: [
                "التنمر أو الترهيب",
                "التحرش الجنسي أو التعليقات غير المناسبة",
                "ملاحظات تمييزية مرتبطة بالجنس أو الجنسية أو الدين أو العرق أو الإعاقة",
                "التواصل المتكرر غير المرغوب فيه",
                "التهديدات أو اللغة المسيئة أو السلوك العدائي",
                "مشاركة محتوى مسيء أو صريح",
              ],
            },
            {
              title: "الإبلاغ عن التحرش",
              text:
                "يمكن للمستخدمين الإبلاغ عن الحوادث مباشرة إلى فريق إدارة يوكان. سيتم التعامل مع جميع البلاغات بجدية والتحقيق فيها بسرية.",
            },
            {
              title: "العواقب",
              items: [
                "تنبيهات تحذيرية",
                "إيقاف مؤقت",
                "إنهاء دائم للحساب",
                "إبلاغ المؤسسات التعليمية عند الضرورة",
              ],
            },
          ],
        },
        {
          title: "سياسة الأمانة الأكاديمية",
          body: "يشجع يوكان التعلم الأخلاقي والنزاهة المهنية.",
          sections: [
            {
              title: "يجب على المدربين",
              items: [
                "إرشاد المتعلمين إلى فهم المفاهيم الأكاديمية.",
                "تشجيع التعلم المستقل وحل المشكلات.",
                "تجنب إنجاز الواجبات أو الاختبارات أو الكويزات نيابة عن المتعلمين.",
                "تجنب مشاركة مواد اختبارات أو مفاتيح إجابات غير مصرح بها.",
                "تقديم مساعدة أكاديمية دقيقة وصادقة.",
              ],
            },
          ],
          closing:
            "المساعدة على الغش أو الانتحال أو سوء السلوك في الاختبارات ممنوعة منعاً باتاً. وقد تؤدي المخالفات إلى الإزالة الفورية من المنصة.",
        },
        {
          title: "سياسة الخصوصية والسرية",
          body: "يحترم يوكان خصوصية جميع المستخدمين ويحمي المعلومات المقدمة.",
          columns: [
            {
              title: "قد تشمل المعلومات التي يتم جمعها",
              items: [
                "البطاقة الشخصية العُمانية",
                "البطاقة الجامعية",
                "السجلات الأكاديمية",
                "معلومات التواصل",
                "مؤهلات التدريس",
              ],
            },
            {
              title: "يلتزم يوكان بـ",
              items: [
                "استخدام المستندات المقدمة فقط لأغراض التحقق من المدربين.",
                "حصر الوصول إلى المعلومات الحساسة على الإداريين المصرح لهم فقط.",
                "عدم مشاركة المعلومات الشخصية مع أطراف ثالثة دون إذن.",
                "اتخاذ إجراءات معقولة لحماية بيانات المستخدمين وسريتها.",
              ],
            },
          ],
          sections: [
            {
              title: "يجب على المستخدمين",
              items: [
                "احترام خصوصية المتعلمين والمدربين.",
                "عدم تسجيل أو مشاركة جلسات التدريس دون إذن.",
                "عدم توزيع معلومات شخصية أو أكاديمية تخص الآخرين.",
              ],
            },
          ],
          closing: "قد يؤدي انتهاك توقعات السرية إلى إجراءات تأديبية.",
        },
      ],
      requiredTitle: "متى تكون الموافقة مطلوبة",
      requiredItems: [
        "يجب على المتعلمين الموافقة قبل إنشاء حساب متعلم.",
        "يجب على المتقدمين للتدريس الموافقة قبل إرسال نموذج طلب المدرب.",
      ],
    },
    accessPages: {
      student: {
        audienceLabel: "دخول المتعلمين",
        title: "سجل الدخول أو أنشئ حساباً للوصول إلى مزايا المتعلم في يوكان.",
        description:
          "هذه الصفحة مخصصة للمتعلمين الذين يريدون إنشاء حساب والوصول إلى الدورات والاستعداد لمسارات تقنية عملية.",
        signupHeading: "إنشاء حساب متعلم",
        imageAlt: "حرم كلية الشرق الأوسط في عُمان",
      },
      tutor: {
        audienceLabel: "دخول المدربين",
        title: "سجل الدخول أو تقدم للانضمام إلى فريق مدربي يوكان.",
        description:
          "هذه الصفحة مخصصة للمدربين المعتمدين، أما المتقدمون الجدد فعليهم إكمال نموذج طلب المدرب أولاً.",
        signupHeading: "طلب المدرب",
        imageAlt: "حرم جامعة صحار في عُمان",
      },
      admin: {
        audienceLabel: "دخول الإدارة",
        title: "سجل الدخول لإدارة يوكان كمسؤول.",
        description:
          "هذه الصفحة لمسؤولي المنصة الذين يحتاجون إلى الوصول إلى الطلبات ومتابعة الحسابات وأدوات سوق الدورات القادمة.",
        imageAlt: "بطاقة دخول الإدارة لمسؤولي المنصة",
      },
    },
    authAccess: {
      recoveryStart: "أدخل كلمة مرور جديدة أدناه لإكمال إعادة تعيين حسابك.",
      supabaseMissing:
        "لم يتم إعداد database بعد. أضف متغيرات بيئة قاعدة البيانات في ملف .env.local.",
      studentSignupFirst:
        "لم نتمكن من العثور على حساب متعلم بهذه البيانات. يرجى إنشاء حساب أولاً إذا لم تكن قد أنشأت حساباً بعد.",
      profileLoadError: "تعذر تحميل ملف حسابك حالياً. يرجى المحاولة بعد قليل.",
      wrongRole: "هذا الحساب مسجل كـ {role}. يرجى استخدام صفحة دخول {role} بدلاً من ذلك.",
      loginSuccess: "تم تسجيل الدخول بنجاح.",
      resetCooldown: "يرجى الانتظار {seconds} ثانية قبل طلب بريد إعادة تعيين آخر.",
      enterEmailFirst: "أدخل بريدك الإلكتروني أولاً، ثم اضغط نسيت كلمة المرور مرة أخرى.",
      resetSent:
        "تم إرسال رابط إعادة تعيين كلمة المرور إلى {email}. يرجى التحقق من بريدك ومجلد الرسائل غير المرغوبة.",
      shortPassword: "يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.",
      passwordUpdated: "تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.",
      confirmationEmailFirst: "أدخل بريدك الإلكتروني أولاً حتى نتمكن من إعادة إرسال رابط التأكيد.",
      confirmationResent:
        "تم إرسال بريد تأكيد جديد إلى {email}. يرجى أيضاً التحقق من مجلد الرسائل غير المرغوبة.",
      termsRequired: "يرجى قراءة شروط الخدمة والموافقة عليها قبل إنشاء الحساب.",
      termsRequiredGoogle:
        "يرجى قراءة شروط الخدمة والموافقة عليها قبل المتابعة باستخدام Google.",
      existingAccount:
        "يوجد حساب بالبريد {email}. يرجى تسجيل الدخول باستخدام حسابك الحالي بدلاً من ذلك.",
      profileSyncFailed: "تم إنشاء الحساب، لكن مزامنة الملف فشلت: {message}",
      accountCreated: "تم إنشاء الحساب بنجاح.",
      accountCreatedConfirm:
        "تم إنشاء الحساب. تحقق من {email} للحصول على بريد التأكيد قبل تسجيل الدخول.",
      supabaseNotice:
        "لم يتم إعداد database بعد. أضف متغيرات بيئة قاعدة البيانات إلى `.env.local` قبل اختبار المصادقة.",
      feedbackErrorTitle: "تحديث المصادقة",
      feedbackRecoveryTitle: "تحديث استعادة كلمة المرور",
      feedbackAccessTitle: "تحديث الوصول للحساب",
      confirmationQuestion: "لم تستلم بريد التأكيد لـ",
      resending: "جارٍ إعادة الإرسال...",
      resendConfirmation: "إعادة إرسال بريد التأكيد",
      resetPassword: "إعادة تعيين كلمة المرور",
      logIn: "تسجيل الدخول",
      createNewPassword: "إنشاء كلمة مرور جديدة",
      welcomeBack: "مرحباً بعودتك",
      newPassword: "كلمة المرور الجديدة",
      newPasswordPlaceholder: "أدخل كلمة مرور جديدة",
      updatingPassword: "جارٍ تحديث كلمة المرور...",
      updatePassword: "تحديث كلمة المرور",
      email: "البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      password: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة المرور",
      loggingIn: "جارٍ تسجيل الدخول...",
      sendingReset: "جارٍ إرسال رابط الإعادة...",
      tryAgain: "حاول مرة أخرى خلال {seconds}ث",
      forgotPassword: "نسيت كلمة المرور؟",
      signUp: "إنشاء حساب",
      fullName: "الاسم الكامل",
      fullNamePlaceholder: "أدخل اسمك الكامل",
      institute: "المؤسسة التعليمية",
      institutePlaceholder: "أدخل اسم مؤسستك التعليمية",
      createPasswordPlaceholder: "أنشئ كلمة مرور",
      termsAgreementPrefix: "لقد قرأت وأوافق على",
      termsAgreementLink: "سياسات منصة يوكان",
      openingGoogle: "جارٍ فتح Google...",
      continueWithGoogle: "المتابعة باستخدام Google",
      or: "أو",
      creatingAccount: "جارٍ إنشاء الحساب...",
      createAccount: "إنشاء الحساب",
    },
    tutorApplicationPanel: {
      kicker: "طلب المدرب",
      title: "تقدم أولاً قبل إنشاء حساب مدرب",
      text:
        "يتم تسجيل المدربين من خلال عملية مراجعة طلب منفصلة. أرسل خلفيتك ومجالات التدريس المقترحة والمستندات الداعمة أولاً، ثم يمكن إضافة المدربين المعتمدين إلى المنصة.",
      needsTitle: "ستحتاج إلى",
      needs: [
        "الاسم الكامل والخلفية المهنية أو الأكاديمية",
        "موضوعات الدورات التي تقترحها",
        "البريد الإلكتروني ورقم واتساب",
        "مستندات داعمة أو روابط أعمال",
      ],
      button: "فتح نموذج طلب المدرب",
    },
    studentDashboard: {
      fallbackName: "متعلم",
      heroKicker: "لوحة المتعلم",
      welcome: "مرحباً، {name}",
      heroText:
        "أكمل ملف المتعلم أولاً، ثم استخدم هذه اللوحة المحمية كمركز للوصول إلى الدورات والدعم التعليمي.",
      profileKicker: "ملف المتعلم",
      profileComplete: "الملف مكتمل",
      completeProfile: "أكمل ملفك",
      profileText: "أدخل اسم المتعلم واسم الجامعة قبل الالتحاق بالدورات.",
      feedbackTitle: "تحديث ملف المتعلم",
      studentName: "اسم المتعلم",
      studentNamePlaceholder: "أدخل اسمك الكامل",
      universityName: "اسم الجامعة",
      universityPlaceholder: "مثال: MCBS",
      email: "البريد الإلكتروني:",
      role: "الدور:",
      roleStudent: "متعلم",
      notSet: "غير محدد",
      saving: "جارٍ حفظ الملف...",
      save: "حفظ ملف المتعلم",
      actionsKicker: "إجراءات المتعلم",
      lockedTitle: "أكمل ملفك لفتح أدوات التعلم",
      lockedText:
        "احفظ اسم المتعلم واسم الجامعة أولاً، ثم ستصبح أدوات التعلم متاحة.",
      messages: {
        notConfigured: "لا يمكن حفظ ملف المتعلم حتى يتم إعداد database.",
        required: "يرجى إدخال اسم المتعلم واسم الجامعة لإكمال ملفك.",
        success: "تم حفظ ملف المتعلم. يمكنك الآن الالتحاق بالدورات.",
        error: "تعذر حفظ ملف المتعلم حالياً.",
      },
      quickLinks: [
        {
          title: "استكشف التدريس",
          description: "تصفح خيارات التدريس الفردي والجماعي المتاحة في المنصة.",
          action: "فتح الخدمات",
        },
        {
          title: "تواصل مع الدعم",
          description: "تواصل معنا إذا احتجت إلى إرشاد لاختيار الدعم المناسب للمقرر.",
          action: "تواصل مع يوكان",
        },
      ],
    },
    tutorDashboard: {
      fallbackName: "مدرب",
      notSet: "غير محدد بعد",
      heroKicker: "لوحة المدرب",
      welcome: "مرحباً، {name}",
      heroText:
        "تمنحك هذه اللوحة المحمية مكاناً واضحاً لإدارة طلبات التدريس ومراجعة ظهور خدماتك وتنسيق تحديثات المنصة.",
      profileKicker: "الملف",
      labels: {
        fullName: "الاسم الكامل:",
        email: "البريد الإلكتروني:",
        institute: "المؤسسة:",
        role: "الدور:",
      },
      role: "مدرب",
      actionsKicker: "إجراءات المدرب",
      emptyTitle: "لا توجد إجراءات للمدرب حالياً",
      emptyText: "ستظهر أدوات المدرب هنا مع توسع لوحة التحكم.",
      actions: [
        {
          title: "طلبات التدريس المقدمة",
          description:
            "افتح صفحة منفصلة للمدرب لمراجعة الطلبات المسندة إليك وتحديث حالتها وتنزيل الملفات المرفقة.",
          action: "عرض طلبات التدريس",
        },
      ],
      instructionsKicker: "تعليمات طلبات التدريس",
      instructionsTitle: "كيفية التعامل مع طلبات التدريس من المتعلمين",
      step: "الخطوة {number}",
      instructions: [
        "افتح طلب التدريس.",
        "راجع محتوى الطلب وادرس المرفقات.",
        "تواصل مع المرسل عبر البريد الإلكتروني لترتيب جلسة على Google Meet، واستخدم أداة تعليمية مثل Microsoft Whiteboard.",
        'ضع حالة الطلب "مكتمل" أو "ملغي" بعد التعامل معه.',
      ],
    },
    adminDashboard: {
      fallbackName: "مسؤول",
      notSet: "غير محدد بعد",
      yes: "نعم",
      no: "لا",
      none: "لا يوجد",
      supabaseNotConfigured: "لم يتم إعداد database.",
      diagnosticsError: "تعذر تحميل تشخيصات دليل المدربين حالياً.",
      heroKicker: "لوحة الإدارة",
      welcome: "مرحباً، {name}",
      heroText:
        "تمنحك هذه اللوحة المحمية مكاناً واضحاً لمراجعة رسائل التواصل وطلبات التدريس والمرحلة التالية من إدارة المنصة.",
      profileKicker: "الملف",
      labels: {
        fullName: "الاسم الكامل:",
        email: "البريد الإلكتروني:",
        institute: "المؤسسة:",
        role: "الدور:",
      },
      role: "مسؤول",
      toolsKicker: "أدوات الإدارة",
      tools: [
        {
          title: "رسائل التواصل المقدمة",
          description:
            "افتح صفحة إدارة منفصلة لمراجعة رسائل التواصل وتنزيل أي ملفات مرفقة.",
          action: "عرض رسائل التواصل",
        },
        {
          title: "طلبات المدربين",
          description:
            "افتح صفحة إدارة منفصلة لمراجعة المتقدمين للتدريس وفحص مستندات التحقق.",
          action: "عرض طلبات المدربين",
        },
        {
          title: "طلبات التدريس المقدمة",
          description:
            "افتح صفحة إدارة منفصلة لمراجعة طلبات التدريس وتنزيل أي مرفقات مقدمة.",
          action: "عرض طلبات التدريس",
        },
      ],
      workflowTitle: "سير عمل إداري بسيط",
      workflowText:
        "استخدم نفس تدفق الحالة لرسائل التواصل وطلبات التدريس حتى لا يضيع أي شيء.",
      contactWorkflowTitle: "رسائل التواصل",
      contactWorkflow: [
        "1. افتح الرسائل المعلقة أولاً.",
        "2. ضعها كمراجعة بعد القراءة وتحديد الخطوة التالية.",
        "3. ضعها كمجدولة إذا تم ترتيب المتابعة.",
        "4. ضعها كمكتملة بعد التعامل مع الموضوع بالكامل.",
      ],
      tutoringWorkflowTitle: "طلبات التدريس",
      tutoringWorkflow: [
        "1. راجع طلبات المتعلمين الجديدة والمرفقات.",
        "2. انقلها إلى تمت المراجعة بعد فحص تفاصيل المقرر والموضوع.",
        "3. استخدم مجدولة بعد ترتيب الجلسة.",
        "4. ضعها مكتملة أو ملغية عند انتهاء سير العمل.",
      ],
      diagnosticsTitle: "تشخيصات دليل المدربين",
      diagnosticsText:
        "حالة داخلية لدليل الخدمات حتى تتمكن من حل مشكلات العروض دون إظهار بيانات التشخيص للمستخدمين.",
      noDataTitle: "لا توجد بيانات لدليل المدربين بعد",
      noDataText:
        "database متصل، لكن لا توجد عروض مدربين نشطة للإبلاغ عنها حالياً.",
      diagnosticLabels: {
        configured: "database معد:",
        loading: "جارٍ التحميل:",
        raw: "العروض الخام:",
        privateCards: "بطاقات المدربين الفرديين:",
        groupCards: "بطاقات المدربين الجماعيين:",
        institutes: "المؤسسات الظاهرة:",
        error: "خطأ الدليل:",
      },
    },
    resetPasswordPage: {
      recoveryPrompt: "أدخل كلمة المرور الجديدة أدناه لإكمال إعادة التعيين.",
      supabaseMissing: "لم يتم إعداد database بعد.",
      shortPassword: "يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.",
      success: "تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.",
      heroKicker: "إعادة تعيين كلمة المرور",
      heroTitle: "أنشئ كلمة مرور جديدة لحسابك في يوكان.",
      heroText: "استخدم هذه الصفحة بعد فتح بريد استعادة كلمة المرور من database.",
      formKicker: "كلمة مرور جديدة",
      formTitle: "إعادة تعيين كلمة المرور",
      feedbackTitle: "تحديث إعادة تعيين كلمة المرور",
      label: "كلمة المرور الجديدة",
      placeholder: "أدخل كلمة المرور الجديدة",
      updating: "جارٍ تحديث كلمة المرور...",
      update: "تحديث كلمة المرور",
      back: "العودة إلى تسجيل الدخول",
    },
    tutorApplicationPage: {
      heroKicker: "طلب المدرب",
      heroTitle: "تقدم بشكل منفصل قبل الانضمام إلى فريق مدربي يوكان.",
      heroText:
        "أكمل هذا النموذج بخلفيتك المهنية وموضوع الدورة المقترح ورابط أعمالك وعينة تعليمية حتى تتم مراجعة طلبك بشكل مناسب.",
      heroCardText:
        "تتم مراجعة طلبات المدربين بناءً على الخبرة وفكرة الدورة والأعمال المنشورة والأدلة التعليمية.",
      formKicker: "نموذج الطلب",
      formTitle: "إرسال طلب المدرب",
      back: "العودة إلى دخول المدربين",
      feedbackTitle: "تحديث طلب المدرب",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      professionalBackground: "الخلفية المهنية",
      professionalBackgroundPlaceholder:
        "لخص خبرتك العملية ومهاراتك التقنية والشهادات والجمهور الذي يمكنك تدريبه.",
      portfolioUrl: "رابط LinkedIn أو GitHub أو ملف الأعمال",
      portfolioUrlPlaceholder: "https://linkedin.com/in/your-name أو https://github.com/username",
      courseTopicProposal: "موضوع الدورة المقترحة",
      courseTopicPlaceholder:
        "مثال: تطوير الواجهات لخريجي علوم الحاسوب في عُمان، مع مشاريع React والنشر وتجهيز ملف الأعمال.",
      teachingExperience: "الخبرة في التدريس",
      teachingExperiencePlaceholder:
        "اذكر التدريس أو الإرشاد أو الورش أو التدريب أو التحدث العام أو إنشاء المحتوى.",
      paymentDetails: "تفاصيل البنك/الدفع لاحقاً",
      paymentDetailsPlaceholder:
        "اختياري حالياً. يمكن إضافة تفاصيل الدفع لاحقاً بعد الموافقة.",
      requiredAttachments: "المرفقات المطلوبة",
      attachFiles: "إرفاق الملفات",
      termsPrefix: "لقد قرأت وأوافق على",
      termsLink: "سياسات منصة يوكان",
      submitting: "جارٍ إرسال الطلب...",
      submit: "إرسال طلب المدرب",
      attachments: [
        "فيديو تعليمي تجريبي أو مخطط دورة أو ملف أعمال PDF أو أي ملف يوضح قدرتك على تدريس هذا الموضوع",
      ],
      messages: {
        terms: "يرجى قراءة سياسات منصة يوكان والموافقة عليها قبل إرسال طلب المدرب.",
        notConfigured: "لم يتم إعداد database بعد، لذلك لا يمكن إرسال طلب المدرب حالياً.",
        files: "يرجى إرفاق فيديو أو ملف تجريبي واحد على الأقل قبل إرسال طلب المدرب.",
        success:
          "تم إرسال طلب المدرب بنجاح. يمكن لفريق يوكان الآن مراجعة النموذج والمرفقات. ستتلقى رداً خلال أقل من 24 ساعة.",
        error: "تعذر إرسال طلب المدرب حالياً.",
        applicationSubmittedBy: "تم إرسال طلب المدرب بواسطة {name}.",
        email: "البريد الإلكتروني: {email}",
        courseTopic: "موضوع الدورة المقترحة: {topic}",
        portfolio: "رابط الأعمال: {portfolio}",
      },
    },
    records: {
      unknown: "غير معروف",
      close: "إغلاق",
      total: "الإجمالي",
      pending: "قيد الانتظار",
      private: "فردي",
      institutes: "المؤسسات",
      notProvided: "غير مقدم",
      notProvidedStudent: "متعلم غير معروف",
      noEmail: "لا يوجد بريد",
      submitted: "تاريخ الإرسال:",
      status: "الحالة:",
      email: "البريد الإلكتروني:",
      institute: "المؤسسة:",
      role: "الدور:",
      from: "من:",
      attachments: "المرفقات:",
      statusWorkflow: "سير حالة الطلب",
      updateStatus: "تحديث الحالة",
      saving: "جارٍ الحفظ...",
      saveStatus: "حفظ الحالة",
      downloaded: "تم تنزيل {fileName} بنجاح.",
      attachment: "المرفق",
      downloadError: "تعذر تنزيل هذا المرفق حالياً.",
      contact: {
        fetchError: "تعذر تحميل رسائل التواصل حالياً.",
        statusSaved: "تم وضع رسالة التواصل كـ {status}.",
        statusError: "تعذر تحديث حالة رسالة التواصل حالياً.",
        kicker: "سجلات الإدارة",
        title: "رسائل التواصل المقدمة",
        description:
          "راجع رسائل نموذج التواصل العام ونزل أي ملفات مقدمة مباشرة من هذه الصفحة.",
        back: "العودة إلى لوحة الإدارة",
        feedbackTitle: "تحديث سجلات التواصل",
        workflowTitle: "سير عمل الرسائل",
        workflowText:
          "ابدأ بالرسائل قيد الانتظار، ثم انقلها إلى تمت المراجعة بعد فحصها، واستخدم مجدولة أو مكتملة حسب النتيجة.",
        filter: "تصفية حسب الحالة",
        allStatuses: "كل الحالات",
        loadingTitle: "جارٍ تحميل رسائل التواصل...",
        loadingText: "يتم جلب أحدث الرسائل من database.",
        errorTitle: "تعذر تحميل الرسائل",
        emptyTitle: "لا توجد رسائل تواصل نشطة",
        emptyText:
          "يتم إخفاء رسائل التواصل المكتملة من لوحة التحكم، لكنها تبقى محفوظة في database.",
        noFilteredTitle: "لا توجد رسائل بحالة {status}",
        noFilteredText: "جرّب حالة أخرى لمتابعة معالجة رسائل التواصل.",
        fromLine: "من {name} عبر {email}",
        openHint: "اضغط لفتح هذه الرسالة في نافذة منبثقة منفصلة.",
        popupKicker: "رسالة تواصل",
        message: "الرسالة",
      },
      tutoring: {
        fetchError: "تعذر تحميل طلبات التدريس حالياً.",
        statusSaved: "تم وضع طلب التدريس كـ {status}.",
        statusError: "تعذر تحديث حالة طلب التدريس حالياً.",
        kicker: "سجلات المدرب",
        title: "طلبات التدريس المقدمة",
        description:
          "افتح طلبات التدريس المسندة إليك في نوافذ منبثقة منفصلة، وحدّث حالتها، ونزّل ملفات الدراسة المرفقة من هذه الصفحة.",
        back: "العودة إلى لوحة المدرب",
        feedbackTitle: "تحديث طلب المدرب",
        loadingTitle: "جارٍ تحميل طلبات التدريس...",
        loadingText: "يتم جلب أحدث طلبات المتعلمين المسندة إلى حساب المدرب.",
        errorTitle: "تعذر تحميل طلبات التدريس",
        emptyTitle: "لا توجد طلبات تدريس نشطة",
        emptyText:
          "يتم إخفاء طلبات التدريس المكتملة والملغية من لوحة التحكم، لكنها تبقى محفوظة في database.",
        studentLine: "المتعلم {name} عبر {email}",
        student: "المتعلم:",
        studentInstitute: "مؤسسة المتعلم:",
        sessionType: "نوع الجلسة:",
        openHint: "اضغط لفتح طلب التدريس هذا في نافذة منبثقة منفصلة.",
        popupKicker: "طلب تدريس",
        topics: "الموضوعات التي تحتاج مساعدة",
        courseFallback: "المقرر",
      },
    },
  },
};
