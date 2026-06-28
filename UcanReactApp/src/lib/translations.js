export const supportedLanguages = {
  en: {
    label: "English",
    shortLabel: "EN",
    dir: "ltr",
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
        audienceLabel: "Instructor Publishing",
        title: "Create practical courses for Oman's future tech workforce.",
        description:
          "Approved instructors can log in here, while new instructors can apply with course ideas built around employability, practical projects, and career-ready technology skills.",
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
        "This protected dashboard is your instructor home base for Ucan course publishing, content preparation, and platform updates.",
      profileKicker: "Profile",
      labels: {
        fullName: "Full name:",
        email: "Email:",
        institute: "Institute:",
        role: "Role:",
      },
      role: "Instructor",
    },
    adminDashboard: {
      fallbackName: "Admin",
      notSet: "Not set yet",
      heroKicker: "Admin Dashboard",
      welcome: "Welcome, {name}",
      heroText:
        "This protected dashboard gives you one operating hub for Ucan content, learners, enrollments, market signals, and platform performance.",
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
          title: "Courses Management",
          description:
            "Create, edit, publish, unpublish, and organize live Ucan courses.",
          action: "Manage Courses",
        },
        {
          title: "Enrollments",
          description:
            "Review learner course enrollments, payment readiness, progress status, and access issues.",
          action: "View Enrollments",
        },
        {
          title: "Learner Accounts",
          description:
            "Review learner profiles, account completion, access status, and support needs.",
          action: "View Learners",
        },
        {
          title: "Market Insights",
          description:
            "Track Omani job-market signals that should influence future course topics and learning paths.",
          action: "View Insights",
        },
        {
          title: "SEO/Course Performance",
          description:
            "Monitor course visibility, search positioning, page performance, and conversion signals.",
          action: "View Performance",
        },
      ],
      workflowTitle: "Simple Admin Workflow",
      workflowText:
        "Use the dashboard as a compact control center for content quality, learner support, and market alignment.",
      contactWorkflowTitle: "Contact Messages",
      contactWorkflow: [
        "1. Open pending messages first.",
        "2. Mark as reviewed after reading and deciding the next step.",
        "3. Mark as scheduled if follow-up is arranged.",
        "4. Mark as completed once the issue is fully handled.",
      ],
      platformWorkflowTitle: "Platform Operations",
      platformWorkflow: [
        "1. Review instructor applications and course proposals.",
        "2. Keep live courses accurate, published, and aligned with learner demand.",
        "3. Monitor enrollments and learner account readiness.",
        "4. Use market and SEO signals to decide what Ucan should improve next.",
      ],
      statusTags: [
        "pending",
        "reviewed",
        "scheduled",
        "completed",
        "cancelled",
        "draft",
        "published",
      ],
    },
    adminPlaceholderPages: {
      enrollments: {
        kicker: "Admin Records",
        title: "Enrollments",
        text:
          "This section is reserved for reviewing learner course enrollments, payment readiness, course access, and completion progress.",
      },
      learnerAccounts: {
        kicker: "Admin Records",
        title: "Learner Accounts",
        text:
          "This section is reserved for reviewing learner profiles, account completion, access support, and role-related account checks.",
      },
      marketInsights: {
        kicker: "Market Intelligence",
        title: "Market Insights",
        text:
          "This section is reserved for future AI/data work using Oman employment and education signals to guide course priorities.",
      },
      seoPerformance: {
        kicker: "Growth Analytics",
        title: "SEO/Course Performance",
        text:
          "This section is reserved for tracking course visibility, organic search performance, learner conversion signals, and content gaps.",
      },
      back: "Back to Admin Dashboard",
      comingSoon: "Workspace prepared",
      comingSoonText:
        "The dashboard route is ready. The next implementation step is connecting live database metrics and admin actions for this section.",
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
};
