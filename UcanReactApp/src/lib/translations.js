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
    footer: "Copyright {year} Ucan Oman. Free learning support for everyone.",
    fieldsRequired: "Fields marked with * are required.",
    acceptedFiles: "Accepted files: {types}. Maximum size: {size} MB per file.",
    close: "Close",
    notAvailable: "Not available",
  },
  ar: {
    footer: "حقوق النشر {year} يوكان عمان. دعم تعليمي مجاني للجميع.",
    fieldsRequired: "الحقول المشار إليها بعلامة * مطلوبة.",
    acceptedFiles: "الملفات المقبولة: {types}. الحد الأقصى: {size} ميجابايت لكل ملف.",
    close: "إغلاق",
    notAvailable: "غير متوفر",
  },
};

export const translations = {
  en: {
    brand: {
      kicker: "Free Learning",
      name: "Ucan Oman",
    },
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      contact: "Contact",
      policies: "Policies",
      studentAccess: "Student Access",
      tutorAccess: "Tutor Access",
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
    },
    common: shared.en,
    home: {
      heroKicker: "Welcome to Ucan Oman",
      heroTitle: "Rooted in Omani heritage and built for a modern student community.",
      heroText:
        "Ucan Oman is an online platform that brings students together to support each other in college courses through free tutoring, shared resources, and course communities.",
      exploreServices: "Explore Services",
      cardKicker: "Omani Spirit, Modern Learning",
      cardTitle:
        "A learning platform shaped by generosity, belonging, and ambitious study culture.",
      stats: [
        { number: "100%", label: "free access for all students" },
        { number: "1:1", label: "individual tutoring sessions" },
        { number: "Group", label: "shared tutoring and course communities" },
      ],
      featuresKicker: "Why Choose Ucan Oman",
      featuresTitle:
        "A free support network that feels culturally grounded and academically useful.",
      features: [
        {
          title: "Free For Everyone",
          description:
            "Ucan Oman is completely free of charge, so every college student can access help without worrying about cost.",
        },
        {
          title: "Student Community",
          description:
            "The platform hosts an online community of college students helping each other in college courses every day.",
        },
        {
          title: "Better Course Support",
          description:
            "Students can find tutoring, study materials, useful videos, and course WhatsApp groups in one place.",
        },
      ],
      howKicker: "How It Works",
      howTitle: "Three simple ways to get better support in your courses.",
      steps: [
        {
          title: "Join The Community",
          description:
            "Connect with college students who are ready to help each other understand assignments, lectures, and exams.",
        },
        {
          title: "Book Free Tutoring",
          description:
            "Schedule individualized tutoring sessions for free or attend free group tutoring sessions for shared learning.",
        },
        {
          title: "Study Smarter",
          description:
            "Access documents, useful videos, and course-based WhatsApp groups to improve your understanding of course material.",
        },
      ],
      toolsKicker: "Tutoring Tools",
      toolsTitle: "Familiar platforms that make online tutoring easier to run.",
      toolsText:
        "Ucan Oman tutoring can be supported through meeting and collaboration tools that help students connect, explain concepts, and work through course material clearly.",
      toolGroups: [
        {
          title: "Live Session Platforms",
          description:
            "Run tutoring sessions smoothly through trusted meeting tools for video, voice, and screen sharing.",
        },
        {
          title: "Collaboration Tools",
          description:
            "Explain ideas visually, organize tutoring workflows, and brainstorm concepts together in real time.",
        },
      ],
      tutorKicker: "Join Our Tutor Team",
      tutorTitle: "Become a Tutor and join a growing network of free academic support.",
      tutorText:
        "We are welcoming more tutors from different institutes to help students through private tutoring, group tutoring, and shared academic support.",
      tutorAccess: "Tutor Access",
      tutorCardTitle: "Log in or sign up to create your tutor account.",
      tutorCardText:
        "Use the tutor page to register, enter your protected dashboard, and prepare to serve students across supported courses.",
      tutorButton: "Tutor Login / Sign Up",
      studentKicker: "Student Access",
      studentTitle: "Join as a student and access tutoring support with your own account.",
      studentText:
        "Students can create an account to log in, access tutoring services, and stay connected with academic support, resources, and course communities across the platform.",
      studentCardTitle: "Log in or sign up to create your student account.",
      studentCardText:
        "Use the student account page to create your profile and get ready to use the Ucan Oman platform more easily.",
      studentButton: "Student Login / Sign Up",
      ctaKicker: "Start For Free",
      ctaTitle:
        "Join a learning hub where tutoring, resources, and community support cost nothing.",
      ctaText:
        "Ucan Oman gives students free access to individualized tutoring, group sessions, helpful documents, useful videos, and course WhatsApp groups.",
      ctaButton: "Join Now",
    },
    about: {
      heroKicker: "About Ucan Oman",
      heroTitle:
        "A learning platform inspired by Omani generosity, heritage, and student ambition.",
      heroText:
        "Ucan Oman hosts an online community where college students help each other understand course material, prepare for classes, and stay supported throughout the semester.",
      ucf: "University of Central Florida",
      ucfText:
        "We imagine academic support as something warm, dignified, and shared across a real community.",
      founderKicker: "Meet Our Founder",
      founderName: "Ahmed Mohammed Al Ruqaishi",
      founderTextOne:
        "Grew up in UK... Migrated to USA... and now in Oman. You know the rest of the story ... LETS GO EVERYONE!!",
      founderTextTwo:
        'Ahmed is a 25 year old beginner software developer who was inspired by the movie "The Social Network" to create this platform to better enhance the college experience academically, socially, and most importantly psychologically.',
      founderLocation: "Qurum Beach, Muscat, Oman.",
      highlights: [
        { number: "Free", label: "individual and group tutoring" },
        { number: "Shared", label: "documents and useful videos" },
        { number: "Connected", label: "course-based WhatsApp groups" },
      ],
      missionKicker: "Our Mission",
      missionTitle: "Make course help free and community-driven for every college student.",
      missionTextOne:
        "Ucan Oman exists to give students a free place to find support for their college courses through community help, tutoring, and better study resources.",
      missionTextTwo:
        "The platform combines free individualized tutoring sessions, free group tutoring sessions, a library of documents and useful videos, and collections of course-based WhatsApp group chats.",
      valuesKicker: "Core Values",
      valuesTitle: "The ideas shaping how Ucan Oman supports students.",
      values: [
        {
          title: "Free Access",
          description:
            "Everything on Ucan Oman is designed to be free of charge so every student can reach support more easily.",
        },
        {
          title: "Students Helping Students",
          description:
            "The platform is built around an online community of college students helping each other in college courses.",
        },
        {
          title: "Practical Support",
          description:
            "We focus on tutoring, study resources, useful videos, and course communities that improve understanding.",
        },
      ],
      communityKicker: "Our Community",
      communityTitle:
        "Students, tutors, and course communities working together to make learning easier.",
      communityText:
        "Ucan Oman is built for college students who want better explanations, free support, and stronger connections around the courses they are taking.",
    },
    contact: {
      heroKicker: "Contact Ucan Oman",
      heroTitle:
        "Reach a support platform that feels welcoming, local, and student-centered.",
      heroText:
        "Whether you want help finding tutoring, study resources, or the right course community, here are the best ways to reach Ucan Oman.",
      heroCardText:
        "We want the platform to feel as dependable and recognizable as the landmarks that shape Oman's identity.",
      formKicker: "Contact Form",
      formTitle: "Send your message directly to Ucan Oman.",
      formText:
        "Fill in the form below and your message will be saved in Supabase so the team can review it properly.",
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
      roleStudent: "Student",
      roleTutor: "Tutor",
      feedbackTitle: "Contact form update",
      submitting: "Submitting...",
      submit: "Submit Contact Form",
      notConfigured:
        "Supabase is not configured yet, so the contact form cannot submit right now.",
      success:
        "Your message was submitted successfully. We will review it through Supabase.",
      error: "We could not submit your message right now.",
      methodsKicker: "Other Ways to Reach Us",
      methodsTitle: "Clear ways to connect with the Ucan Oman team.",
      methods: [
        {
          title: "Email",
          value: "20258971@mcbs.edu.om",
          description:
            "Reach out with questions about tutoring, study resources, or joining the Ucan Oman student community.",
        },
        {
          title: "Location",
          value: "Qurum Beach, Muscat, Oman",
          description:
            "Ucan Oman serves students online while supporting a growing college learning community from Oman.",
        },
      ],
      ctaKicker: "We Are Here to Help",
      ctaTitle: "Reach out whenever you need better support for your college courses.",
      ctaText:
        "Ucan Oman is here to help students connect with free tutoring, stronger learning resources, and course communities that make studying easier.",
    },
    servicesPage: {
      heroKicker: "Our Services",
      heroTitle:
        "Free tutoring and student support presented through a full-stack learning hub.",
      heroText:
        "Ucan Oman now loads tutor offerings from the community-based platform updated regularly with our rapidly increasing fan base!",
      heroCardText:
        "Explore private tutoring, group sessions, and live course offerings to enhance your understanding and get better grades confidently.",
      highlights: [
        { number: "Live", label: "tutors, courses, and filters loaded from Supabase" },
        { number: "2", label: "session types for private and group support" },
        { number: "Saved", label: "tutoring requests stored in the database" },
      ],
      cards: [
        {
          kicker: "Tutor Directory",
          title: "Browse live tutors by institute and course.",
          text:
            "Every tutor card below is regularly updated depending on the new tutors in every institute.",
        },
        {
          kicker: "Student Requests",
          title: "Send a tutoring request directly to the tutor.",
          text:
            "Logged-in students can submit their request details, and tutors can then follow up directly.",
        },
        {
          kicker: "Dynamic Environment",
          title:
            "Adding more tutors from different institutes covering a wide range of diversified courses collection.",
          text: "New tutors, institutes, and courses will slot directly into this directory structure.",
        },
      ],
      directoryStatus: "Directory Status",
      requestAccess: "Request Access",
      requestAccessText:
        "You can explore the tutor directory freely, but you need to log in before sending a tutoring request.",
      studentLogin: "Student Login",
      tutorLogin: "Tutor Login",
      private: {
        label: "Private Tutoring",
        title: "Find available tutors for private one-on-one support.",
        description:
          "Select an institute and course to see which private tutors are currently available.",
      },
      group: {
        label: "Group Tutoring",
        title: "Find available tutors for free group tutoring sessions.",
        description:
          "Use the same filters to explore group tutoring options for supported institutes and courses.",
      },
      tutorSection: {
        institute: "Institute",
        course: "Course",
        selectUniversity: "Select university",
        selectUniversityFirst: "Select a university first",
        noCourses: "No courses available yet",
        allCourses: "All Courses",
        availableNow: "Available Now",
        tutorsAvailable: "{count} tutor{plural} available for {title}",
        courseOfferings: "{count} course offering{plural} currently match your selected filters.",
        profileRequiredTitle: "Complete your student profile to view available tutors",
        profileRequiredText:
          "Add your student name and university name in your dashboard before sending a tutoring request.",
        profileRequiredButton: "Complete Student Profile",
        loginTitle: "Please login / sign up to view available tutors",
        loginText:
          "Create an account or log in first to access the private and group tutoring directory and send a tutoring request.",
        loadingTitle: "Loading tutor directory...",
        loadingText: "Fetching tutors, courses, and available session types from Supabase.",
        selectInstituteTitle: "Select a university to view courses",
        selectInstituteText:
          "Course options and tutor cards will appear only after a university is selected.",
        profileLabel: "Free tutoring tutor profile",
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
          "Please log in to your student or tutor account before sending a tutoring session.",
        emptyTitle: "No tutor listed yet for this selection",
        emptyText:
          "Once more tutors and course offerings are added in Supabase, this directory will update automatically.",
      },
      otherKicker: "What Else We Offer",
      otherTitle: "More free ways for students to study better and support each other.",
      services: [
        {
          title: "Free Individual Tutoring",
          description:
            "Students can schedule individualized tutoring sessions for free when they need focused help in a course.",
        },
        {
          title: "Free Group Tutoring",
          description:
            "Students can attend group tutoring sessions for free and learn together around shared course topics.",
        },
        {
          title: "Online Student Community",
          description:
            "College students can ask questions, explain ideas, and help each other understand coursework in a supportive space.",
        },
        {
          title: "Document Library",
          description:
            "Access a free library of documents that helps students review lessons, assignments, and course concepts more clearly.",
        },
        {
          title: "Useful Videos",
          description:
            "Find useful videos that improve understanding of college course material and make difficult topics easier to follow.",
        },
        {
          title: "Course WhatsApp Groups",
          description:
            "Access collections of WhatsApp group chats made for specific college courses so students can get help more easily.",
        },
      ],
      whyKicker: "Why It Matters",
      whyTitle:
        "Students need support that is free, practical, and connected to real coursework.",
      whyTextOne:
        "Our tutor directory can grow from the database as new tutors, institutes, and courses are added.",
      whyTextTwo: "Student tutoring requests are submitted, tracked, and returned.",
      ctaKicker: "Start Your Journey",
      ctaTitle: "Explore free tutoring, resources, and course communities today.",
      ctaText:
        "Ucan Oman is built to help students find support faster and improve their understanding across the courses they are taking.",
      ctaButton: "Explore Courses",
      requestModal: {
        kicker: "Tutoring Request",
        title: "Send a tutoring request to {name}",
        intro:
          "Please save your tutoring request below and attach any helpful files so the tutor can contact you directly and arrange the session with you.",
        studentAccount: "Student account",
        name: "Name:",
        email: "Email:",
        accountNote:
          "These details are pulled automatically from your logged-in student account and shown to the tutor with this request.",
        titleLabel: "Title",
        titlePlaceholder: "Example: Help with MAT255 midterm review",
        instituteLabel: "Student university name",
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
          "Supabase is not configured yet. Add your environment variables before using the live tutor directory.",
        loginAndCourse: "Please log in and choose a course before submitting a request.",
        requiredTitleInstitute: "Please complete the required title and student institute fields.",
        attachmentRequired:
          "Please attach at least one file before submitting your tutoring request.",
        validCourse: "Please choose a valid course for this tutor.",
        requestSuccess:
          "Your tutoring request was saved successfully. The tutor can now contact you directly to arrange the session.",
        requestError: "We could not save your tutoring request.",
      },
    },
    terms: {
      heroKicker: "Platform Policies",
      heroTitle: "Ucan Oman Platform Policies",
      heroText:
        "These policies apply to student access, tutor applications, academic support, and responsible use of the Ucan Oman platform.",
      heroCardText:
        "Please review these policies carefully before creating a student account or applying to become a tutor.",
      documentKicker: "Policy Document",
      documentTitle: "Read the platform rules and responsibilities",
      policies: [
        {
          title: "Professional Conduct Policy",
          body:
            "All tutors registered under Ucan Oman are expected to maintain professional behavior while interacting with students, administrators, and other tutors.",
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
                "Engage in behavior that damages the reputation of Ucan Oman.",
              ],
            },
          ],
          closing:
            "Violation of this policy may result in suspension or permanent removal from the Ucan Oman platform.",
        },
        {
          title: "Anti-Harassment Policy",
          body:
            "Ucan Oman is committed to providing a safe, respectful, and inclusive environment for all users. Harassment of any kind is strictly prohibited.",
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
                "Users may report incidents directly to the Ucan Oman administration team. All reports will be treated seriously and investigated confidentially.",
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
          body: "Ucan Oman promotes ethical learning and academic integrity.",
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
          body: "Ucan Oman respects the privacy of all users and protects submitted information.",
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
              title: "Ucan Oman Will",
              items: [
                "Use submitted documents only for tutor verification purposes.",
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
        "Student users must agree before creating a student account.",
        "Tutor applicants must agree before submitting the tutor application form.",
      ],
    },
    accessPages: {
      student: {
        audienceLabel: "Student Access",
        title: "Log in or sign up to access student support on Ucan Oman.",
        description:
          "This page is designed for students who want to create an account, log in, and access tutoring, course support, and the wider learning community.",
        signupHeading: "Create a student account",
        imageAlt: "Middle East College campus in Oman",
      },
      tutor: {
        audienceLabel: "Tutor Access",
        title: "Log in or apply to join the Ucan Oman tutor team.",
        description:
          "This page is designed for tutors who already have approved tutor access, while new applicants should complete the separate tutor application form first.",
        signupHeading: "Tutor application",
        imageAlt: "Sohar University campus in Oman",
      },
      admin: {
        audienceLabel: "Admin Access",
        title: "Log in to manage Ucan Oman as an administrator.",
        description:
          "This page is for platform administrators who need access to contact submissions, account oversight, and future admin tools.",
        imageAlt: "Admin access card for platform administrators",
      },
    },
    authAccess: {
      recoveryStart: "Enter a new password below to finish resetting your account.",
      supabaseMissing:
        "Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.",
      studentSignupFirst:
        "We could not find a student account with those login details. Please sign up first if you have not created an account yet.",
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
        "Supabase is not configured yet. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local` before testing auth.",
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
      termsAgreementLink: "Ucan Oman Platform Policies",
      openingGoogle: "Opening Google...",
      continueWithGoogle: "Continue with Google",
      or: "Or",
      creatingAccount: "Creating Account...",
      createAccount: "Create Account",
    },
    tutorApplicationPanel: {
      kicker: "Tutor Application",
      title: "Apply before creating a tutor account",
      text:
        "Tutor signup is now handled through a separate application review process. Submit your academic details and required documents first, then approved tutors can be onboarded into the platform.",
      needsTitle: "You will need",
      needs: [
        "Full name and university details",
        "Your desired tutoring courses",
        "University email and WhatsApp phone number",
        "Transcript, Omani ID, and university ID attachments",
      ],
      button: "Open Tutor Application Form",
    },
    studentDashboard: {
      fallbackName: "Student",
      heroKicker: "Student Dashboard",
      welcome: "Welcome, {name}",
      heroText:
        "Complete your student profile first, then use this protected dashboard as your home base for tutoring access and academic support.",
      profileKicker: "Student Profile",
      profileComplete: "Profile complete",
      completeProfile: "Complete your profile",
      profileText: "Enter your student name and university name before sending tutoring requests.",
      feedbackTitle: "Student profile update",
      studentName: "Student name",
      studentNamePlaceholder: "Enter your full name",
      universityName: "University name",
      universityPlaceholder: "Example: MCBS",
      email: "Email:",
      role: "Role:",
      roleStudent: "Student",
      notSet: "Not set",
      saving: "Saving Profile...",
      save: "Save Student Profile",
      actionsKicker: "Student Actions",
      lockedTitle: "Complete your profile to unlock tutoring requests",
      lockedText:
        "Save your student name and university name first, then tutoring request tools will become available.",
      messages: {
        notConfigured: "Your student profile cannot be saved until Supabase is configured.",
        required: "Please enter your student name and university name to complete your profile.",
        success: "Your student profile was saved. You can now send tutoring requests.",
        error: "We could not save your student profile right now.",
      },
      quickLinks: [
        {
          title: "Explore Tutoring",
          description: "Browse private and group tutoring options available on the platform.",
          action: "Open Services",
        },
        {
          title: "Contact Support",
          description: "Reach out if you need guidance finding the right course support.",
          action: "Contact Ucan Oman",
        },
      ],
    },
    tutorDashboard: {
      fallbackName: "Tutor",
      notSet: "Not set yet",
      heroKicker: "Tutor Dashboard",
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
      role: "Tutor",
      actionsKicker: "Tutor Actions",
      emptyTitle: "No tutor actions available yet",
      emptyText: "Tutor tools will appear here as your dashboard expands.",
      actions: [
        {
          title: "Submitted Tutoring Requests",
          description:
            "Open a separate tutor page to review your assigned requests, update their status, and download attached files.",
          action: "View Tutoring Requests",
        },
      ],
      instructionsKicker: "Tutoring Request Instructions",
      instructionsTitle: "How to handle student tutoring requests",
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
      supabaseNotConfigured: "Supabase is not configured.",
      diagnosticsError: "Unable to load tutor directory diagnostics right now.",
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
          title: "Tutor Applications",
          description:
            "Open a separate admin page to review people applying to become tutors and check their verification documents.",
          action: "View Tutor Applications",
        },
        {
          title: "Submitted Tutoring Requests",
          description:
            "Open a separate admin page to review tutoring requests and download any submitted attachments.",
          action: "View Tutoring Requests",
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
        "1. Review new student requests and attachments.",
        "2. Move to reviewed after checking the course/topic details.",
        "3. Use scheduled once the session is arranged.",
        "4. Mark completed or cancelled when the workflow ends.",
      ],
      diagnosticsTitle: "Tutor Directory Diagnostics",
      diagnosticsText:
        "Internal status for the Services directory so you can troubleshoot offerings without showing debug data to public users.",
      noDataTitle: "No tutor directory data yet",
      noDataText:
        "Supabase is connected, but no active tutor offerings are available to report yet.",
      diagnosticLabels: {
        configured: "Supabase configured:",
        loading: "Loading:",
        raw: "Raw offerings:",
        privateCards: "Private tutor cards:",
        groupCards: "Group tutor cards:",
        institutes: "Visible institutes:",
        error: "Directory error:",
      },
    },
    resetPasswordPage: {
      recoveryPrompt: "Enter your new password below to complete the reset.",
      supabaseMissing: "Supabase is not configured yet.",
      shortPassword: "Your new password must be at least 6 characters.",
      success: "Your password was updated successfully. You can now log in.",
      heroKicker: "Password Reset",
      heroTitle: "Create a new password for your Ucan Oman account.",
      heroText: "Use this page after opening the Supabase password recovery email.",
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
      heroKicker: "Tutor Application",
      heroTitle: "Apply separately before joining the Ucan Oman tutor team.",
      heroText:
        "Complete this form with your university details, tutoring courses, and supporting documents so the platform can review your tutor application properly.",
      heroCardText:
        "Tutor applications are reviewed using your academic information and required supporting documents.",
      formKicker: "Application Form",
      formTitle: "Submit your tutor application",
      back: "Back to Tutor Access",
      feedbackTitle: "Tutor application update",
      fullName: "Full name",
      universityName: "University Name",
      universityId: "University ID",
      majorName: "Major Name",
      desiredCourses: "Desired Tutoring Courses",
      courseNote: "Please highlight course code (for example: CPT 220)",
      coursePlaceholder: "List the courses you want to become a tutor in.",
      universityEmail: "University Email",
      phoneNumber: "Phone number (WhatsApp)",
      requiredAttachments: "Required Attachments",
      attachFiles: "Attach files",
      termsPrefix: "I have read and agree to the",
      termsLink: "Ucan Oman Platform Policies",
      submitting: "Submitting Application...",
      submit: "Submit Tutor Application",
      attachments: [
        "Academic transcript proving a minimum grade of B+ in the selected course(s) to tutor in",
        "Copy of your Omani ID card",
        "Copy of your university ID card",
      ],
      messages: {
        terms: "Please read and agree to the Ucan Oman Platform Policies before submitting your tutor application.",
        notConfigured: "Supabase is not configured yet, so the tutor application cannot submit right now.",
        files: "Please attach the required supporting documents before submitting your tutor application.",
        success:
          "Your tutor application was submitted successfully. The Ucan Oman team can now review your form and attachments. You will receive a reply in less than 24 hours.",
        error: "We could not submit your tutor application right now.",
        applicationSubmittedBy: "Tutor application submitted by {name}.",
        university: "University: {university}",
        desired: "Desired tutoring courses: {courses}",
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
      notProvidedStudent: "Unknown student",
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
        loadingText: "Fetching the latest submissions from Supabase.",
        errorTitle: "Unable to load messages",
        emptyTitle: "No active contact messages",
        emptyText:
          "Completed contact messages are hidden from the dashboard, but still kept in Supabase.",
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
        kicker: "Tutor Records",
        title: "Submitted Tutoring Requests",
        description:
          "Open your assigned tutoring requests in separate popup windows, update their status, and download the attached study files directly from this page.",
        back: "Back to Tutor Dashboard",
        feedbackTitle: "Tutor request update",
        loadingTitle: "Loading tutoring requests...",
        loadingText: "Fetching the latest student requests assigned to your tutor account.",
        errorTitle: "Unable to load tutoring requests",
        emptyTitle: "No active tutoring requests",
        emptyText:
          "Completed and cancelled tutoring requests are hidden from the dashboard, but still remain stored in Supabase.",
        studentLine: "Student {name} via {email}",
        student: "Student:",
        studentInstitute: "Student institute:",
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
      kicker: "تعلم مجاني",
      name: "يوكان عُمان",
    },
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      services: "الخدمات",
      contact: "تواصل معنا",
      policies: "السياسات",
      studentAccess: "دخول الطلاب",
      tutorAccess: "دخول المدرسين",
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
    },
    common: shared.ar,
    home: {
      heroKicker: "مرحباً بك في يوكان عُمان",
      heroTitle: "من روح التراث العُماني إلى مجتمع طلابي حديث.",
      heroText:
        "يوكان عُمان منصة إلكترونية تجمع الطلاب لدعم بعضهم في المقررات الجامعية من خلال التدريس المجاني والموارد المشتركة ومجتمعات المقررات.",
      exploreServices: "استكشف الخدمات",
      cardKicker: "روح عُمانية، تعلم حديث",
      cardTitle: "منصة تعليمية تقوم على الكرم والانتماء وثقافة الدراسة الطموحة.",
      stats: [
        { number: "100%", label: "وصول مجاني لجميع الطلاب" },
        { number: "1:1", label: "جلسات تدريس فردية" },
        { number: "جماعي", label: "تدريس مشترك ومجتمعات للمقررات" },
      ],
      featuresKicker: "لماذا تختار يوكان عُمان",
      featuresTitle: "شبكة دعم مجانية مرتبطة بالثقافة ومفيدة أكاديمياً.",
      features: [
        {
          title: "مجاني للجميع",
          description:
            "يوكان عُمان مجاني بالكامل حتى يتمكن كل طالب جامعي من الوصول إلى المساعدة دون القلق بشأن التكلفة.",
        },
        {
          title: "مجتمع طلابي",
          description:
            "تستضيف المنصة مجتمعاً إلكترونياً من طلاب الجامعات يساعدون بعضهم يومياً في المقررات الجامعية.",
        },
        {
          title: "دعم أفضل للمقررات",
          description:
            "يمكن للطلاب العثور على التدريس والمواد الدراسية والفيديوهات المفيدة ومجموعات واتساب للمقررات في مكان واحد.",
        },
      ],
      howKicker: "كيف تعمل المنصة",
      howTitle: "ثلاث طرق بسيطة للحصول على دعم أفضل في مقرراتك.",
      steps: [
        {
          title: "انضم إلى المجتمع",
          description:
            "تواصل مع طلاب جامعيين مستعدين لمساعدة بعضهم في فهم الواجبات والمحاضرات والاختبارات.",
        },
        {
          title: "احجز تدريساً مجانياً",
          description:
            "احجز جلسات تدريس فردية مجانية أو شارك في جلسات جماعية مجانية للتعلم المشترك.",
        },
        {
          title: "ذاكر بذكاء",
          description:
            "استفد من المستندات والفيديوهات المفيدة ومجموعات واتساب الخاصة بالمقررات لتحسين فهمك.",
        },
      ],
      toolsKicker: "أدوات التدريس",
      toolsTitle: "منصات مألوفة تجعل التدريس عبر الإنترنت أسهل.",
      toolsText:
        "يمكن دعم جلسات يوكان عُمان بأدوات الاجتماعات والتعاون التي تساعد الطلاب على التواصل وشرح المفاهيم والعمل على مواد المقرر بوضوح.",
      toolGroups: [
        {
          title: "منصات الجلسات المباشرة",
          description:
            "إدارة الجلسات بسلاسة من خلال أدوات موثوقة للفيديو والصوت ومشاركة الشاشة.",
        },
        {
          title: "أدوات التعاون",
          description:
            "شرح الأفكار بصرياً وتنظيم العمل ومناقشة المفاهيم معاً في الوقت الفعلي.",
        },
      ],
      tutorKicker: "انضم إلى فريق المدرسين",
      tutorTitle: "كن مدرساً وانضم إلى شبكة متنامية من الدعم الأكاديمي المجاني.",
      tutorText:
        "نرحب بمدرسين من مؤسسات مختلفة لمساعدة الطلاب من خلال التدريس الفردي والجماعي والدعم الأكاديمي المشترك.",
      tutorAccess: "دخول المدرسين",
      tutorCardTitle: "سجل الدخول أو أنشئ حساب مدرس.",
      tutorCardText:
        "استخدم صفحة المدرسين للتسجيل والدخول إلى لوحتك المحمية والاستعداد لخدمة الطلاب في المقررات المدعومة.",
      tutorButton: "دخول / تسجيل مدرس",
      studentKicker: "دخول الطلاب",
      studentTitle: "انضم كطالب واحصل على دعم التدريس من خلال حسابك.",
      studentText:
        "يمكن للطلاب إنشاء حساب للدخول إلى خدمات التدريس والبقاء على اتصال بالدعم الأكاديمي والموارد ومجتمعات المقررات.",
      studentCardTitle: "سجل الدخول أو أنشئ حساب طالب.",
      studentCardText:
        "استخدم صفحة حساب الطالب لإنشاء ملفك والاستعداد لاستخدام منصة يوكان عُمان بسهولة أكبر.",
      studentButton: "دخول / تسجيل طالب",
      ctaKicker: "ابدأ مجاناً",
      ctaTitle: "انضم إلى مركز تعلم يوفر التدريس والموارد والدعم المجتمعي مجاناً.",
      ctaText:
        "يوفر يوكان عُمان للطلاب وصولاً مجانياً إلى التدريس الفردي والجلسات الجماعية والمستندات المفيدة والفيديوهات ومجموعات واتساب للمقررات.",
      ctaButton: "انضم الآن",
    },
    about: {
      heroKicker: "عن يوكان عُمان",
      heroTitle: "منصة تعليمية مستوحاة من الكرم العُماني والتراث وطموح الطلاب.",
      heroText:
        "يستضيف يوكان عُمان مجتمعاً إلكترونياً يساعد فيه طلاب الجامعات بعضهم على فهم مواد المقررات والاستعداد للدراسة والبقاء مدعومين طوال الفصل.",
      ucf: "جامعة سنترال فلوريدا",
      ucfText: "نرى الدعم الأكاديمي شيئاً دافئاً وكريماً ومشتركاً داخل مجتمع حقيقي.",
      founderKicker: "تعرف على المؤسس",
      founderName: "أحمد محمد الرقيشي",
      founderTextOne:
        "نشأ في المملكة المتحدة... وانتقل إلى الولايات المتحدة... والآن في عُمان. وأنتم تعرفون بقية القصة... هيا بنا جميعاً!!",
      founderTextTwo:
        'أحمد مطور برمجيات مبتدئ عمره 25 عاماً، ألهمه فيلم "The Social Network" لإنشاء هذه المنصة لتحسين التجربة الجامعية أكاديمياً واجتماعياً ونفسياً قبل كل شيء.',
      founderLocation: "شاطئ القرم، مسقط، عُمان.",
      highlights: [
        { number: "مجاني", label: "تدريس فردي وجماعي" },
        { number: "مشترك", label: "مستندات وفيديوهات مفيدة" },
        { number: "متصل", label: "مجموعات واتساب حسب المقرر" },
      ],
      missionKicker: "رسالتنا",
      missionTitle: "جعل المساعدة في المقررات مجانية ومجتمعية لكل طالب جامعي.",
      missionTextOne:
        "يوجد يوكان عُمان ليمنح الطلاب مكاناً مجانياً للحصول على دعم لمقرراتهم من خلال مساعدة المجتمع والتدريس وموارد الدراسة الأفضل.",
      missionTextTwo:
        "تجمع المنصة بين جلسات تدريس فردية مجانية وجلسات جماعية مجانية ومكتبة مستندات وفيديوهات مفيدة ومجموعات واتساب خاصة بالمقررات.",
      valuesKicker: "القيم الأساسية",
      valuesTitle: "الأفكار التي تشكل طريقة دعم يوكان عُمان للطلاب.",
      values: [
        {
          title: "وصول مجاني",
          description:
            "كل شيء في يوكان عُمان مصمم ليكون مجانياً حتى يصل كل طالب إلى الدعم بسهولة أكبر.",
        },
        {
          title: "طلاب يساعدون طلاباً",
          description:
            "تقوم المنصة على مجتمع إلكتروني من طلاب الجامعات يساعدون بعضهم في المقررات الجامعية.",
        },
        {
          title: "دعم عملي",
          description:
            "نركز على التدريس وموارد الدراسة والفيديوهات المفيدة ومجتمعات المقررات التي تحسن الفهم.",
        },
      ],
      communityKicker: "مجتمعنا",
      communityTitle: "طلاب ومدرسون ومجتمعات مقررات يعملون معاً لتسهيل التعلم.",
      communityText:
        "يوكان عُمان مخصص لطلاب الجامعات الذين يريدون شرحاً أفضل ودعماً مجانياً وروابط أقوى حول المقررات التي يدرسونها.",
    },
    contact: {
      heroKicker: "تواصل مع يوكان عُمان",
      heroTitle: "تواصل مع منصة دعم مرحبة ومحلية ومتمحورة حول الطالب.",
      heroText:
        "سواء كنت تريد المساعدة في العثور على تدريس أو موارد دراسية أو مجتمع مقرر مناسب، فهذه أفضل طرق التواصل مع يوكان عُمان.",
      heroCardText:
        "نريد للمنصة أن تكون موثوقة وقريبة مثل المعالم التي تشكل هوية عُمان.",
      formKicker: "نموذج التواصل",
      formTitle: "أرسل رسالتك مباشرة إلى يوكان عُمان.",
      formText:
        "املأ النموذج أدناه وسيتم حفظ رسالتك في Supabase حتى يتمكن الفريق من مراجعتها بشكل مناسب.",
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
      roleStudent: "طالب",
      roleTutor: "مدرس",
      feedbackTitle: "تحديث نموذج التواصل",
      submitting: "جارٍ الإرسال...",
      submit: "إرسال نموذج التواصل",
      notConfigured: "لم يتم إعداد Supabase بعد، لذلك لا يمكن إرسال نموذج التواصل حالياً.",
      success: "تم إرسال رسالتك بنجاح. سنراجعها من خلال Supabase.",
      error: "تعذر إرسال رسالتك حالياً.",
      methodsKicker: "طرق أخرى للتواصل",
      methodsTitle: "طرق واضحة للتواصل مع فريق يوكان عُمان.",
      methods: [
        {
          title: "البريد الإلكتروني",
          value: "20258971@mcbs.edu.om",
          description:
            "تواصل معنا بخصوص التدريس أو الموارد الدراسية أو الانضمام إلى مجتمع يوكان عُمان الطلابي.",
        },
        {
          title: "الموقع",
          value: "شاطئ القرم، مسقط، عُمان",
          description:
            "يخدم يوكان عُمان الطلاب عبر الإنترنت ويدعم مجتمعاً تعليمياً جامعياً متنامياً من عُمان.",
        },
      ],
      ctaKicker: "نحن هنا للمساعدة",
      ctaTitle: "تواصل معنا كلما احتجت إلى دعم أفضل لمقرراتك الجامعية.",
      ctaText:
        "يوكان عُمان هنا لمساعدة الطلاب على الوصول إلى التدريس المجاني وموارد تعلم أقوى ومجتمعات مقررات تجعل الدراسة أسهل.",
    },
    servicesPage: {
      heroKicker: "خدماتنا",
      heroTitle: "تدريس مجاني ودعم طلابي من خلال مركز تعلم متكامل.",
      heroText:
        "يعرض يوكان عُمان الآن عروض المدرسين من منصة المجتمع التي يتم تحديثها بانتظام مع نمو قاعدة المستخدمين بسرعة!",
      heroCardText:
        "استكشف التدريس الفردي والجلسات الجماعية وعروض المقررات المباشرة لتعزيز فهمك وتحسين درجاتك بثقة.",
      highlights: [
        { number: "مباشر", label: "مدرسون ومقررات ومرشحات محملة من Supabase" },
        { number: "2", label: "نوعان من الجلسات للدعم الفردي والجماعي" },
        { number: "محفوظ", label: "طلبات التدريس محفوظة في قاعدة البيانات" },
      ],
      cards: [
        {
          kicker: "دليل المدرسين",
          title: "تصفح المدرسين حسب المؤسسة والمقرر.",
          text: "يتم تحديث كل بطاقة مدرس بانتظام حسب المدرسين الجدد في كل مؤسسة.",
        },
        {
          kicker: "طلبات الطلاب",
          title: "أرسل طلب تدريس مباشرة إلى المدرس.",
          text:
            "يمكن للطلاب المسجلين إرسال تفاصيل الطلب، ثم يتابع المدرسون معهم مباشرة.",
        },
        {
          kicker: "بيئة ديناميكية",
          title: "إضافة مدرسين أكثر من مؤسسات مختلفة لتغطية مجموعة واسعة من المقررات.",
          text: "سيتم إدراج المدرسين والمؤسسات والمقررات الجديدة مباشرة في هذا الدليل.",
        },
      ],
      directoryStatus: "حالة الدليل",
      requestAccess: "الوصول إلى الطلبات",
      requestAccessText:
        "يمكنك استكشاف دليل المدرسين بحرية، لكن يجب تسجيل الدخول قبل إرسال طلب تدريس.",
      studentLogin: "دخول الطالب",
      tutorLogin: "دخول المدرس",
      private: {
        label: "تدريس فردي",
        title: "ابحث عن مدرسين متاحين للدعم الفردي.",
        description: "اختر المؤسسة والمقرر لرؤية المدرسين الفرديين المتاحين حالياً.",
      },
      group: {
        label: "تدريس جماعي",
        title: "ابحث عن مدرسين متاحين لجلسات التدريس الجماعية المجانية.",
        description:
          "استخدم نفس المرشحات لاستكشاف خيارات التدريس الجماعي للمؤسسات والمقررات المدعومة.",
      },
      tutorSection: {
        institute: "المؤسسة",
        course: "المقرر",
        selectUniversity: "اختر الجامعة",
        selectUniversityFirst: "اختر الجامعة أولاً",
        noCourses: "لا توجد مقررات متاحة بعد",
        allCourses: "كل المقررات",
        availableNow: "متاح الآن",
        tutorsAvailable: "{count} مدرس متاح لـ {title}",
        courseOfferings: "{count} عرض مقرر يطابق المرشحات المحددة حالياً.",
        profileRequiredTitle: "أكمل ملف الطالب لعرض المدرسين المتاحين",
        profileRequiredText:
          "أضف اسم الطالب واسم الجامعة في لوحة التحكم قبل إرسال طلب تدريس.",
        profileRequiredButton: "إكمال ملف الطالب",
        loginTitle: "يرجى تسجيل الدخول / إنشاء حساب لعرض المدرسين المتاحين",
        loginText:
          "أنشئ حساباً أو سجل الدخول أولاً للوصول إلى دليل التدريس الفردي والجماعي وإرسال طلب تدريس.",
        loadingTitle: "جارٍ تحميل دليل المدرسين...",
        loadingText: "يتم جلب المدرسين والمقررات وأنواع الجلسات المتاحة من Supabase.",
        selectInstituteTitle: "اختر جامعة لعرض المقررات",
        selectInstituteText: "ستظهر خيارات المقررات وبطاقات المدرسين فقط بعد اختيار جامعة.",
        profileLabel: "ملف مدرس للتدريس المجاني",
        multiInstitute: "عدة مؤسسات",
        sessionType: "نوع الجلسة",
        privateSession: "تدريس فردي خاص",
        groupSession: "جلسة تدريس جماعية",
        availability: "التوفر",
        courses: "المقررات",
        offered: "{count} معروض",
        sendRequest: "إرسال طلب تدريس",
        loginToSend: "سجل الدخول لإرسال طلب تدريس",
        loginNote: "يرجى تسجيل الدخول إلى حساب الطالب أو المدرس قبل إرسال جلسة تدريس.",
        emptyTitle: "لا يوجد مدرس لهذا الاختيار بعد",
        emptyText:
          "عند إضافة المزيد من المدرسين وعروض المقررات في Supabase، سيتم تحديث هذا الدليل تلقائياً.",
      },
      otherKicker: "ماذا نقدم أيضاً",
      otherTitle: "طرق مجانية أكثر لمساعدة الطلاب على الدراسة بشكل أفضل ودعم بعضهم.",
      services: [
        {
          title: "تدريس فردي مجاني",
          description:
            "يمكن للطلاب حجز جلسات تدريس فردية مجاناً عندما يحتاجون إلى مساعدة مركزة في مقرر.",
        },
        {
          title: "تدريس جماعي مجاني",
          description:
            "يمكن للطلاب حضور جلسات تدريس جماعية مجاناً والتعلم معاً حول موضوعات مشتركة.",
        },
        {
          title: "مجتمع طلابي إلكتروني",
          description:
            "يمكن لطلاب الجامعات طرح الأسئلة وشرح الأفكار ومساعدة بعضهم على فهم المقررات في مساحة داعمة.",
        },
        {
          title: "مكتبة مستندات",
          description:
            "الوصول إلى مكتبة مجانية من المستندات تساعد الطلاب على مراجعة الدروس والواجبات ومفاهيم المقررات بوضوح.",
        },
        {
          title: "فيديوهات مفيدة",
          description:
            "اعثر على فيديوهات مفيدة تحسن فهم مواد المقررات الجامعية وتجعل الموضوعات الصعبة أسهل.",
        },
        {
          title: "مجموعات واتساب للمقررات",
          description:
            "الوصول إلى مجموعات واتساب مخصصة لمقررات جامعية معينة حتى يحصل الطلاب على المساعدة بسهولة أكبر.",
        },
      ],
      whyKicker: "لماذا هذا مهم",
      whyTitle: "يحتاج الطلاب إلى دعم مجاني وعملي ومرتبط بالمقررات الحقيقية.",
      whyTextOne:
        "يمكن أن ينمو دليل المدرسين من قاعدة البيانات كلما تمت إضافة مدرسين ومؤسسات ومقررات جديدة.",
      whyTextTwo: "يتم إرسال طلبات التدريس الطلابية وتتبعها وإرجاعها.",
      ctaKicker: "ابدأ رحلتك",
      ctaTitle: "استكشف التدريس المجاني والموارد ومجتمعات المقررات اليوم.",
      ctaText:
        "بُني يوكان عُمان لمساعدة الطلاب على العثور على الدعم بسرعة وتحسين فهمهم في المقررات التي يدرسونها.",
      ctaButton: "استكشف المقررات",
      requestModal: {
        kicker: "طلب تدريس",
        title: "أرسل طلب تدريس إلى {name}",
        intro:
          "احفظ طلب التدريس أدناه وأرفق أي ملفات مفيدة حتى يتمكن المدرس من التواصل معك مباشرة وترتيب الجلسة.",
        studentAccount: "حساب الطالب",
        name: "الاسم:",
        email: "البريد الإلكتروني:",
        accountNote:
          "يتم جلب هذه التفاصيل تلقائياً من حساب الطالب المسجل وتظهر للمدرس مع هذا الطلب.",
        titleLabel: "العنوان",
        titlePlaceholder: "مثال: مراجعة اختبار MAT255",
        instituteLabel: "اسم جامعة الطالب",
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
          "لم يتم إعداد Supabase بعد. أضف متغيرات البيئة قبل استخدام دليل المدرسين المباشر.",
        loginAndCourse: "يرجى تسجيل الدخول واختيار مقرر قبل إرسال الطلب.",
        requiredTitleInstitute: "يرجى إكمال حقلي العنوان واسم المؤسسة التعليمية المطلوبين.",
        attachmentRequired: "يرجى إرفاق ملف واحد على الأقل قبل إرسال طلب التدريس.",
        validCourse: "يرجى اختيار مقرر صالح لهذا المدرس.",
        requestSuccess:
          "تم حفظ طلب التدريس بنجاح. يمكن للمدرس الآن التواصل معك مباشرة لترتيب الجلسة.",
        requestError: "تعذر حفظ طلب التدريس.",
      },
    },
    terms: {
      heroKicker: "سياسات المنصة",
      heroTitle: "سياسات منصة يوكان عُمان",
      heroText:
        "تنطبق هذه السياسات على دخول الطلاب وطلبات المدرسين والدعم الأكاديمي والاستخدام المسؤول لمنصة يوكان عُمان.",
      heroCardText: "يرجى مراجعة هذه السياسات بعناية قبل إنشاء حساب طالب أو التقديم كمدرس.",
      documentKicker: "وثيقة السياسات",
      documentTitle: "اقرأ قواعد المنصة والمسؤوليات",
      policies: [
        {
          title: "سياسة السلوك المهني",
          body:
            "يتوقع من جميع المدرسين المسجلين في يوكان عُمان الحفاظ على سلوك مهني عند التعامل مع الطلاب والإدارة والمدرسين الآخرين.",
          columns: [
            {
              title: "يجب على المدرسين",
              items: [
                "معاملة جميع الطلاب باحترام ومهنية.",
                "التواصل بأدب وبشكل مناسب في جميع الأوقات.",
                "الحضور في الوقت المحدد لجلسات التدريس.",
                "تقديم دعم أكاديمي صادق قدر الإمكان.",
                "الحفاظ على بيئة تعلم إيجابية وداعمة.",
                "الظهور والتصرف بشكل مناسب أثناء الجلسات الإلكترونية أو الحضورية.",
                "اتباع قواعد وأنظمة المؤسسة التعليمية.",
              ],
            },
            {
              title: "يجب على المدرسين عدم",
              items: [
                "استخدام لغة مسيئة أو تمييزية أو غير مناسبة.",
                "مشاركة محتوى ضار أو غير قانوني أو غير أخلاقي.",
                "تضليل الطلاب بشأن المؤهلات أو القدرات الأكاديمية.",
                "طلب معلومات شخصية غير مناسبة من الطلاب.",
                "القيام بسلوك يضر بسمعة يوكان عُمان.",
              ],
            },
          ],
          closing:
            "قد يؤدي انتهاك هذه السياسة إلى الإيقاف أو الإزالة الدائمة من منصة يوكان عُمان.",
        },
        {
          title: "سياسة مكافحة التحرش",
          body:
            "يلتزم يوكان عُمان بتوفير بيئة آمنة ومحترمة وشاملة لجميع المستخدمين. ويُمنع التحرش بجميع أشكاله منعاً باتاً.",
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
                "يمكن للمستخدمين الإبلاغ عن الحوادث مباشرة إلى فريق إدارة يوكان عُمان. سيتم التعامل مع جميع البلاغات بجدية والتحقيق فيها بسرية.",
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
          body: "يشجع يوكان عُمان التعلم الأخلاقي والنزاهة الأكاديمية.",
          sections: [
            {
              title: "يجب على المدرسين",
              items: [
                "إرشاد الطلاب إلى فهم المفاهيم الأكاديمية.",
                "تشجيع التعلم المستقل وحل المشكلات.",
                "تجنب إنجاز الواجبات أو الاختبارات أو الكويزات نيابة عن الطلاب.",
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
          body: "يحترم يوكان عُمان خصوصية جميع المستخدمين ويحمي المعلومات المقدمة.",
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
              title: "يلتزم يوكان عُمان بـ",
              items: [
                "استخدام المستندات المقدمة فقط لأغراض التحقق من المدرسين.",
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
                "احترام خصوصية الطلاب والمدرسين.",
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
        "يجب على الطلاب الموافقة قبل إنشاء حساب طالب.",
        "يجب على المتقدمين للتدريس الموافقة قبل إرسال نموذج طلب المدرس.",
      ],
    },
    accessPages: {
      student: {
        audienceLabel: "دخول الطلاب",
        title: "سجل الدخول أو أنشئ حساباً للوصول إلى دعم الطلاب في يوكان عُمان.",
        description:
          "هذه الصفحة مخصصة للطلاب الذين يريدون إنشاء حساب أو تسجيل الدخول والوصول إلى التدريس ودعم المقررات ومجتمع التعلم.",
        signupHeading: "إنشاء حساب طالب",
        imageAlt: "حرم كلية الشرق الأوسط في عُمان",
      },
      tutor: {
        audienceLabel: "دخول المدرسين",
        title: "سجل الدخول أو تقدم للانضمام إلى فريق مدرسي يوكان عُمان.",
        description:
          "هذه الصفحة مخصصة للمدرسين الذين لديهم وصول معتمد، أما المتقدمون الجدد فعليهم إكمال نموذج طلب المدرس أولاً.",
        signupHeading: "طلب المدرس",
        imageAlt: "حرم جامعة صحار في عُمان",
      },
      admin: {
        audienceLabel: "دخول الإدارة",
        title: "سجل الدخول لإدارة يوكان عُمان كمسؤول.",
        description:
          "هذه الصفحة لمسؤولي المنصة الذين يحتاجون إلى الوصول إلى رسائل التواصل ومتابعة الحسابات وأدوات الإدارة القادمة.",
        imageAlt: "بطاقة دخول الإدارة لمسؤولي المنصة",
      },
    },
    authAccess: {
      recoveryStart: "أدخل كلمة مرور جديدة أدناه لإكمال إعادة تعيين حسابك.",
      supabaseMissing:
        "لم يتم إعداد Supabase بعد. أضف VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملف .env.local.",
      studentSignupFirst:
        "لم نتمكن من العثور على حساب طالب بهذه البيانات. يرجى إنشاء حساب أولاً إذا لم تكن قد أنشأت حساباً بعد.",
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
        "لم يتم إعداد Supabase بعد. أضف `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` إلى `.env.local` قبل اختبار المصادقة.",
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
      termsAgreementLink: "سياسات منصة يوكان عُمان",
      openingGoogle: "جارٍ فتح Google...",
      continueWithGoogle: "المتابعة باستخدام Google",
      or: "أو",
      creatingAccount: "جارٍ إنشاء الحساب...",
      createAccount: "إنشاء الحساب",
    },
    tutorApplicationPanel: {
      kicker: "طلب المدرس",
      title: "تقدم أولاً قبل إنشاء حساب مدرس",
      text:
        "يتم الآن تسجيل المدرسين من خلال عملية مراجعة طلب منفصلة. أرسل بياناتك الأكاديمية والمستندات المطلوبة أولاً، ثم يمكن إضافة المدرسين المعتمدين إلى المنصة.",
      needsTitle: "ستحتاج إلى",
      needs: [
        "الاسم الكامل وبيانات الجامعة",
        "المقررات التي ترغب في تدريسها",
        "البريد الجامعي ورقم واتساب",
        "كشف الدرجات والبطاقة الشخصية العُمانية والبطاقة الجامعية",
      ],
      button: "فتح نموذج طلب المدرس",
    },
    studentDashboard: {
      fallbackName: "طالب",
      heroKicker: "لوحة الطالب",
      welcome: "مرحباً، {name}",
      heroText:
        "أكمل ملف الطالب أولاً، ثم استخدم هذه اللوحة المحمية كمركز للوصول إلى التدريس والدعم الأكاديمي.",
      profileKicker: "ملف الطالب",
      profileComplete: "الملف مكتمل",
      completeProfile: "أكمل ملفك",
      profileText: "أدخل اسم الطالب واسم الجامعة قبل إرسال طلبات التدريس.",
      feedbackTitle: "تحديث ملف الطالب",
      studentName: "اسم الطالب",
      studentNamePlaceholder: "أدخل اسمك الكامل",
      universityName: "اسم الجامعة",
      universityPlaceholder: "مثال: MCBS",
      email: "البريد الإلكتروني:",
      role: "الدور:",
      roleStudent: "طالب",
      notSet: "غير محدد",
      saving: "جارٍ حفظ الملف...",
      save: "حفظ ملف الطالب",
      actionsKicker: "إجراءات الطالب",
      lockedTitle: "أكمل ملفك لفتح طلبات التدريس",
      lockedText:
        "احفظ اسم الطالب واسم الجامعة أولاً، ثم ستصبح أدوات طلب التدريس متاحة.",
      messages: {
        notConfigured: "لا يمكن حفظ ملف الطالب حتى يتم إعداد Supabase.",
        required: "يرجى إدخال اسم الطالب واسم الجامعة لإكمال ملفك.",
        success: "تم حفظ ملف الطالب. يمكنك الآن إرسال طلبات التدريس.",
        error: "تعذر حفظ ملف الطالب حالياً.",
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
          action: "تواصل مع يوكان عُمان",
        },
      ],
    },
    tutorDashboard: {
      fallbackName: "مدرس",
      notSet: "غير محدد بعد",
      heroKicker: "لوحة المدرس",
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
      role: "مدرس",
      actionsKicker: "إجراءات المدرس",
      emptyTitle: "لا توجد إجراءات للمدرس حالياً",
      emptyText: "ستظهر أدوات المدرس هنا مع توسع لوحة التحكم.",
      actions: [
        {
          title: "طلبات التدريس المقدمة",
          description:
            "افتح صفحة منفصلة للمدرس لمراجعة الطلبات المسندة إليك وتحديث حالتها وتنزيل الملفات المرفقة.",
          action: "عرض طلبات التدريس",
        },
      ],
      instructionsKicker: "تعليمات طلبات التدريس",
      instructionsTitle: "كيفية التعامل مع طلبات التدريس من الطلاب",
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
      supabaseNotConfigured: "لم يتم إعداد Supabase.",
      diagnosticsError: "تعذر تحميل تشخيصات دليل المدرسين حالياً.",
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
          title: "طلبات المدرسين",
          description:
            "افتح صفحة إدارة منفصلة لمراجعة المتقدمين للتدريس وفحص مستندات التحقق.",
          action: "عرض طلبات المدرسين",
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
        "1. راجع طلبات الطلاب الجديدة والمرفقات.",
        "2. انقلها إلى تمت المراجعة بعد فحص تفاصيل المقرر والموضوع.",
        "3. استخدم مجدولة بعد ترتيب الجلسة.",
        "4. ضعها مكتملة أو ملغية عند انتهاء سير العمل.",
      ],
      diagnosticsTitle: "تشخيصات دليل المدرسين",
      diagnosticsText:
        "حالة داخلية لدليل الخدمات حتى تتمكن من حل مشكلات العروض دون إظهار بيانات التشخيص للمستخدمين.",
      noDataTitle: "لا توجد بيانات لدليل المدرسين بعد",
      noDataText:
        "Supabase متصل، لكن لا توجد عروض مدرسين نشطة للإبلاغ عنها حالياً.",
      diagnosticLabels: {
        configured: "Supabase معد:",
        loading: "جارٍ التحميل:",
        raw: "العروض الخام:",
        privateCards: "بطاقات المدرسين الفرديين:",
        groupCards: "بطاقات المدرسين الجماعيين:",
        institutes: "المؤسسات الظاهرة:",
        error: "خطأ الدليل:",
      },
    },
    resetPasswordPage: {
      recoveryPrompt: "أدخل كلمة المرور الجديدة أدناه لإكمال إعادة التعيين.",
      supabaseMissing: "لم يتم إعداد Supabase بعد.",
      shortPassword: "يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.",
      success: "تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.",
      heroKicker: "إعادة تعيين كلمة المرور",
      heroTitle: "أنشئ كلمة مرور جديدة لحسابك في يوكان عُمان.",
      heroText: "استخدم هذه الصفحة بعد فتح بريد استعادة كلمة المرور من Supabase.",
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
      heroKicker: "طلب المدرس",
      heroTitle: "تقدم بشكل منفصل قبل الانضمام إلى فريق مدرسي يوكان عُمان.",
      heroText:
        "أكمل هذا النموذج ببيانات جامعتك والمقررات التي ترغب في تدريسها والمستندات الداعمة حتى تتم مراجعة طلبك بشكل مناسب.",
      heroCardText:
        "تتم مراجعة طلبات المدرسين باستخدام معلوماتك الأكاديمية والمستندات الداعمة المطلوبة.",
      formKicker: "نموذج الطلب",
      formTitle: "إرسال طلب المدرس",
      back: "العودة إلى دخول المدرسين",
      feedbackTitle: "تحديث طلب المدرس",
      fullName: "الاسم الكامل",
      universityName: "اسم الجامعة",
      universityId: "الرقم الجامعي",
      majorName: "اسم التخصص",
      desiredCourses: "المقررات المرغوب تدريسها",
      courseNote: "يرجى إبراز رمز المقرر (مثال: CPT 220)",
      coursePlaceholder: "اكتب المقررات التي تريد أن تصبح مدرساً فيها.",
      universityEmail: "البريد الجامعي",
      phoneNumber: "رقم الهاتف (واتساب)",
      requiredAttachments: "المرفقات المطلوبة",
      attachFiles: "إرفاق الملفات",
      termsPrefix: "لقد قرأت وأوافق على",
      termsLink: "سياسات منصة يوكان عُمان",
      submitting: "جارٍ إرسال الطلب...",
      submit: "إرسال طلب المدرس",
      attachments: [
        "كشف درجات أكاديمي يثبت الحصول على B+ على الأقل في المقرر أو المقررات المختارة للتدريس",
        "نسخة من البطاقة الشخصية العُمانية",
        "نسخة من البطاقة الجامعية",
      ],
      messages: {
        terms: "يرجى قراءة سياسات منصة يوكان عُمان والموافقة عليها قبل إرسال طلب المدرس.",
        notConfigured: "لم يتم إعداد Supabase بعد، لذلك لا يمكن إرسال طلب المدرس حالياً.",
        files: "يرجى إرفاق المستندات الداعمة المطلوبة قبل إرسال طلب المدرس.",
        success:
          "تم إرسال طلب المدرس بنجاح. يمكن لفريق يوكان عُمان الآن مراجعة النموذج والمرفقات. ستتلقى رداً خلال أقل من 24 ساعة.",
        error: "تعذر إرسال طلب المدرس حالياً.",
        applicationSubmittedBy: "تم إرسال طلب المدرس بواسطة {name}.",
        university: "الجامعة: {university}",
        desired: "المقررات المرغوب تدريسها: {courses}",
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
      notProvidedStudent: "طالب غير معروف",
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
        loadingText: "يتم جلب أحدث الرسائل من Supabase.",
        errorTitle: "تعذر تحميل الرسائل",
        emptyTitle: "لا توجد رسائل تواصل نشطة",
        emptyText:
          "يتم إخفاء رسائل التواصل المكتملة من لوحة التحكم، لكنها تبقى محفوظة في Supabase.",
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
        kicker: "سجلات المدرس",
        title: "طلبات التدريس المقدمة",
        description:
          "افتح طلبات التدريس المسندة إليك في نوافذ منبثقة منفصلة، وحدّث حالتها، ونزّل ملفات الدراسة المرفقة من هذه الصفحة.",
        back: "العودة إلى لوحة المدرس",
        feedbackTitle: "تحديث طلب المدرس",
        loadingTitle: "جارٍ تحميل طلبات التدريس...",
        loadingText: "يتم جلب أحدث طلبات الطلاب المسندة إلى حساب المدرس.",
        errorTitle: "تعذر تحميل طلبات التدريس",
        emptyTitle: "لا توجد طلبات تدريس نشطة",
        emptyText:
          "يتم إخفاء طلبات التدريس المكتملة والملغية من لوحة التحكم، لكنها تبقى محفوظة في Supabase.",
        studentLine: "الطالب {name} عبر {email}",
        student: "الطالب:",
        studentInstitute: "مؤسسة الطالب:",
        sessionType: "نوع الجلسة:",
        openHint: "اضغط لفتح طلب التدريس هذا في نافذة منبثقة منفصلة.",
        popupKicker: "طلب تدريس",
        topics: "الموضوعات التي تحتاج مساعدة",
        courseFallback: "المقرر",
      },
    },
  },
};
