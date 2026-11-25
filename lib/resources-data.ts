export type ResourceCategory =
  | "resume-examples"
  | "cover-letter-examples"
  | "writing-guides";

export type CareerStage =
  | "High School"
  | "College & Internship"
  | "No Experience"
  | "Recent Graduate"
  | "Mid-Level & Professional";

export interface ResourceFAQ {
  q: string;
  a: string;
}

export interface StructureNote {
  section: string;
  whyItWorks: string;
}

export interface CustomizerOptions {
  defaultRole: string;
  defaultCompany?: string;
  experienceToggleDefault: boolean;
  activityChoices: string[];
  skillChoices: string[];
  activityLabel: string;
}

export interface ResourceItem {
  slug: string;
  category: ResourceCategory;
  title: string;
  shortTitle: string;
  metaDescription: string;
  stage: CareerStage;
  profession: string;
  readTime: string;
  recommendedTemplate: string;
  recommendedTemplateLabel: string;
  relatedSlug?: { category: ResourceCategory; slug: string; label: string };
  intro: string;
  exampleHeader: {
    name: string;
    role: string;
    location: string;
    email: string;
    phone: string;
    linkedin?: string;
  };
  exampleBody: {
    summary?: string;
    experience?: string;
    education?: string;
    skills?: string;
    achievements?: string;
    certifications?: string;
    openingParagraph?: string;
    bodyParagraph1?: string;
    bodyParagraph2?: string;
    closingParagraph?: string;
    guideSections?: { heading: string; body: string; bullets?: string[] }[];
  };
  structureBreakdown: StructureNote[];
  keySkills: string[];
  writingTips: string[];
  commonMistakes: string[];
  faqs: ResourceFAQ[];
  customizer?: CustomizerOptions;
}

export const CATEGORY_META: Record<
  ResourceCategory,
  { label: string; description: string; badge: string }
> = {
  "resume-examples": {
    label: "Resume Examples",
    description:
      "Complete, realistic resume samples by profession and career stage with interactive personalization.",
    badge: "Resume Example",
  },
  "cover-letter-examples": {
    label: "Cover Letter Examples",
    description:
      "Structured cover letter templates for students, entry-level applicants, and experienced specialists.",
    badge: "Cover Letter Example",
  },
  "writing-guides": {
    label: "Writing & Career Guides",
    description:
      "Practical formatting, structure, and job-application advice without guesswork.",
    badge: "Career Guide",
  },
};

export const RESOURCES: ResourceItem[] = [
  // ── RESUME EXAMPLES ────────────────────────────────────────────────────────
  {
    slug: "high-school-student",
    category: "resume-examples",
    title: "High School Student Resume Example & Guide",
    shortTitle: "High School Student Resume",
    metaDescription:
      "Build a clear high school student resume with school activities, coursework, volunteering, and transferable skills—even with no formal job history.",
    stage: "High School",
    profession: "Student / Entry-Level",
    readTime: "4 min read",
    recommendedTemplate: "minimal",
    recommendedTemplateLabel: "ATS Minimal",
    relatedSlug: {
      category: "cover-letter-examples",
      slug: "high-school-student",
      label: "High School Student Cover Letter Example",
    },
    intro:
      "Hiring managers for part-time jobs, summer internships, and youth programs do not expect a long work history from high school applicants. They look for reliability, willingness to learn, clear communication, and consistent involvement in school or community activities.",
    exampleHeader: {
      name: "Jordan Kamali",
      role: "High School Student | Retail & Customer Support Applicant",
      location: "Kigali, Rwanda",
      email: "jordan.kamali@example.com",
      phone: "+250 788 123 456",
    },
    exampleBody: {
      summary:
        "Dependable high school senior with strong organization, teamwork, and customer communication skills developed through student council event coordination and weekend library volunteering. Seeking a part-time customer service or store associate role.",
      experience:
        "Community Youth Library | Weekend Volunteer | 2025 – Present\n• Assisted visitors with finding books, registering library cards, and keeping reading areas organized.\n• Helped catalog incoming book donations using a shared spreadsheet with high accuracy.\n\nSchool Student Council | Event Committee Member | 2024 – Present\n• Coordinated check-in tables and schedules for 4 school assemblies and parent open days.\n• Handled ticket tracking and basic cash-box reconciliation alongside a faculty advisor.",
      education:
        "Green Hills Secondary School | Expected Graduation: 2027\n• Relevant Coursework: Computer Applications, Mathematics, Business Studies",
      skills:
        "Customer Communication, Cash Handling Basics, Time Management, Microsoft Word & Excel, Teamwork, Organization",
      achievements:
        "• Maintained consistent attendance record and honor-roll standing across consecutive terms.\n• Recognized by school staff for organizing the annual student book drive.",
      certifications: "Basic First Aid Workshop Certificate",
    },
    structureBreakdown: [
      {
        section: "Short Objective Summary",
        whyItWorks:
          "States your availability and core strengths upfront so managers immediately understand what role you want.",
      },
      {
        section: "Volunteering & School Roles as Experience",
        whyItWorks:
          "Shows punctuality, teamwork, and responsibility even when you have never held a paid job.",
      },
      {
        section: "Education & Relevant Coursework",
        whyItWorks:
          "Places your current schooling and practical subjects where employers can quickly verify your level.",
      },
    ],
    keySkills: [
      "Punctuality & Reliability",
      "Customer Service",
      "Team Collaboration",
      "Basic Spreadsheets & Documents",
      "Event Support",
      "Problem Solving",
    ],
    writingTips: [
      "Keep your resume strictly to one clean page.",
      "Use specific action verbs for school clubs, sports teams, tutoring, or family business help.",
      "Use a simple, professional email address (first.last@domain.com).",
    ],
    commonMistakes: [
      "Leaving the Experience section blank instead of listing volunteering, clubs, or informal work.",
      "Adding personal information employers do not need (such as full home street address or unrelated hobbies).",
      "Exaggerating responsibilities—honest, clear descriptions build more trust.",
    ],
    faqs: [
      {
        q: "Can I write a high school resume with zero paid jobs?",
        a: "Yes. Include volunteering, school leadership roles, tutoring, sports teamwork, or helping with community events under an Experience & Activities heading.",
      },
      {
        q: "Should I include my GPA or grades?",
        a: "Include your GPA or academic honors if they are strong and relevant to the scholarship, internship, or employer. Otherwise, listing your school, expected graduation year, and practical coursework is enough.",
      },
    ],
    customizer: {
      defaultRole: "Part-Time Store Associate",
      experienceToggleDefault: false,
      activityLabel: "Select your real school or community activities",
      activityChoices: [
        "Student council or class representative",
        "Community or library volunteering",
        "School sports team or club coordination",
        "Peer tutoring or study group support",
        "Helping with a family shop or local event",
      ],
      skillChoices: [
        "Customer Communication",
        "Time Management",
        "Teamwork",
        "Microsoft Office / Google Docs",
        "Organization",
        "Cash Handling Basics",
      ],
    },
  },
  {
    slug: "no-experience",
    category: "resume-examples",
    title: "Resume With No Work Experience Example & Guide",
    shortTitle: "No Experience Resume",
    metaDescription:
      "Learn how to write a strong resume with no prior work experience by highlighting projects, training, volunteering, and transferable skills.",
    stage: "No Experience",
    profession: "Entry-Level / Career Starter",
    readTime: "5 min read",
    recommendedTemplate: "grid",
    recommendedTemplateLabel: "Two-Column Grid",
    relatedSlug: {
      category: "cover-letter-examples",
      slug: "no-experience",
      label: "No Experience Cover Letter Example",
    },
    intro:
      "Having no formal work experience does not mean you have nothing to offer. A well-structured entry-level resume shifts focus toward practical coursework, hands-on projects, certifications, volunteering, and dependable soft skills.",
    exampleHeader: {
      name: "Aline Uwimana",
      role: "Entry-Level Operations & Office Support Applicant",
      location: "Nairobi, Kenya",
      email: "aline.uwimana@example.com",
      phone: "+254 700 456 789",
      linkedin: "linkedin.com/in/alineuwimana",
    },
    exampleBody: {
      summary:
        "Organized, fast-learning entry-level candidate with practical training in spreadsheet reporting, document management, and customer communication. Built strong attention to detail through academic group projects and community event logistics.",
      experience:
        "Capstone Operations Project | Student Coordinator | 2025\n• Built a shared inventory and task tracker in Google Sheets for a 5-person university team project.\n• Compiled weekly status updates and presented final project findings clearly to faculty reviewers.\n\nCommunity Career Fair | Registration Volunteer | 2025\n• Welcomed attendees, verified registration lists, and directed visitors to employer booths.\n• Maintained accurate attendance logs and assisted speakers with room setup.",
      education:
        "Strathmore University | Diploma in Business Administration | 2023 – 2025",
      skills:
        "Google Workspace, Microsoft Excel, Scheduling & Documentation, Written Communication, Customer Support, Data Entry Accuracy",
      achievements:
        "• Completed Google Workspace productivity coursework with top practical assessment marks.\n• Consistently met every team project deadline across four academic semesters.",
      certifications: "Google Digital Skills Certificate, Excel Essentials",
    },
    structureBreakdown: [
      {
        section: "Skills-Forward Summary",
        whyItWorks:
          "Frames you around the exact tools and habits needed on day one rather than apologizing for limited work history.",
      },
      {
        section: "Academic Projects & Volunteering",
        whyItWorks:
          "Provides concrete proof that you can organize tasks, use office tools, and collaborate reliably.",
      },
      {
        section: "Certifications & Practical Tools",
        whyItWorks:
          "Short, verifiable training certificates help close the gap between education and workplace readiness.",
      },
    ],
    keySkills: [
      "Spreadsheet & Document Tools",
      "Written & Verbal Communication",
      "Attention to Detail",
      "Scheduling & Coordination",
      "Adaptability",
      "Customer Orientation",
    ],
    writingTips: [
      "Place Education and Core Skills near the top if they are stronger than your work history.",
      "Describe real projects using the same bullet-point format used for paid jobs.",
      "Match your skill labels honestly to the terminology used in the job description.",
    ],
    commonMistakes: [
      "Writing 'No experience' anywhere on the resume—focus on what you have actually done.",
      "Listing vague buzzwords ('hard worker', 'fast learner') without pointing to a real project or activity.",
      "Submitting the exact same unedited resume to unrelated roles.",
    ],
    faqs: [
      {
        q: "Which resume format works best with no experience?",
        a: "A skills-first or hybrid format works well because it highlights your training, tools, and projects right below your summary while keeping your timeline transparent.",
      },
      {
        q: "Should I include unpaid internships or freelance help?",
        a: "Yes—unpaid internships, capstone projects, and volunteer roles count as real experience when described accurately.",
      },
    ],
    customizer: {
      defaultRole: "Junior Administrative Assistant",
      experienceToggleDefault: false,
      activityLabel: "Select your real projects, training, or volunteering",
      activityChoices: [
        "University or college capstone project",
        "Event registration or community volunteering",
        "Online certification coursework (Excel, Digital Skills, Coding)",
        "Student association logistics or finance tracking",
        "Self-directed portfolio or technical project",
      ],
      skillChoices: [
        "Microsoft Excel & Google Sheets",
        "Document Organization",
        "Customer Communication",
        "Data Entry Accuracy",
        "Research & Reporting",
        "Team Collaboration",
      ],
    },
  },
  {
    slug: "recent-graduate",
    category: "resume-examples",
    title: "Recent Graduate Resume Example & Writing Guide",
    shortTitle: "Recent Graduate Resume",
    metaDescription:
      "See how recent college and university graduates structure degrees, internships, academic projects, and technical skills to land entry-level interviews.",
    stage: "Recent Graduate",
    profession: "Graduate / Entry-Level",
    readTime: "5 min read",
    recommendedTemplate: "richard",
    recommendedTemplateLabel: "Executive Sidebar",
    relatedSlug: {
      category: "cover-letter-examples",
      slug: "internship",
      label: "Internship & Entry-Level Cover Letter Example",
    },
    intro:
      "As a recent graduate, your biggest strengths are fresh technical knowledge, internship exposure, and capstone execution. Organizing your degree, relevant projects, and hands-on tools cleanly helps recruiters see how quickly you can contribute.",
    exampleHeader: {
      name: "David Nshimiyimana",
      role: "Business & Operations Graduate",
      location: "Kigali, Rwanda",
      email: "david.nshimiyimana@example.com",
      phone: "+250 788 555 019",
      linkedin: "linkedin.com/in/davidnshimiyimana",
    },
    exampleBody: {
      summary:
        "Analytical Business Administration graduate with internship experience in reporting workflows, vendor tracking, and stakeholder coordination. Skilled in Excel, Google Sheets, and clear documentation, ready to contribute in an entry-level operations or analyst role.",
      experience:
        "East Africa Trade Services | Operations Intern | Jan 2026 – Jun 2026\n• Maintained weekly supplier delivery logs in Excel and flagged delayed shipments to coordinators.\n• Standardized onboarding checklists for incoming seasonal assistants, reducing repeated questions.\n• Assisted with preparing monthly summary slides for internal operations reviews.\n\nUniversity Business Society | Program Coordinator | 2024 – 2025\n• Organized logistics, speaker schedules, and registration forms for 5 campus career workshops.",
      education:
        "University of Rwanda | B.Sc. in Business Administration | 2022 – 2026\n• Relevant Coursework: Operations Management, Quantitative Methods, Financial Accounting",
      skills:
        "Microsoft Excel (Pivot Tables, VLOOKUP), Google Sheets, Process Documentation, Project Coordination, Stakeholder Communication, PowerPoint",
      achievements:
        "• Completed senior thesis analyzing inventory scheduling practices for local SMEs.\n• Coordinated student logistics team for the annual university career symposium.",
      certifications: "Google Project Management Foundations",
    },
    structureBreakdown: [
      {
        section: "Internship-Anchored Experience",
        whyItWorks:
          "Highlights real workplace habits—reporting, documentation, and coordination—rather than generic classroom duties.",
      },
      {
        section: "Specific Tool Proficiency",
        whyItWorks:
          "Naming concrete capabilities like Pivot Tables and process documentation beats simply writing 'Microsoft Office'.",
      },
    ],
    keySkills: [
      "Excel & Reporting",
      "Process Documentation",
      "Project Coordination",
      "Research & Analysis",
      "Presentation Skills",
      "Cross-Team Communication",
    ],
    writingTips: [
      "Move Education below Experience once you have 1–2 solid internships; keep it prominent if your degree is your primary qualification.",
      "Focus bullets on what you produced (checklists, dashboards, schedules, reports).",
      "Include your LinkedIn or portfolio link only if it is up to date.",
    ],
    commonMistakes: [
      "Listing every single university course instead of 3–4 relevant ones.",
      "Stretching a recent graduate resume onto two mostly empty pages.",
      "Using passive phrases like 'duties included' instead of clear action verbs.",
    ],
    faqs: [
      {
        q: "How long should a recent graduate resume be?",
        a: "One well-balanced page is the standard expectation for recent graduates.",
      },
      {
        q: "Should I still include part-time non-career jobs?",
        a: "Yes, if they demonstrate reliability, customer service, or leadership—just keep the descriptions concise so your relevant internship and projects get the most space.",
      },
    ],
    customizer: {
      defaultRole: "Junior Operations Analyst",
      experienceToggleDefault: true,
      activityLabel: "Select your real graduate highlights",
      activityChoices: [
        "Completed a 3–6 month professional internship",
        "Led a final-year capstone or thesis project",
        "Held a student association or campus leadership role",
        "Completed industry-recognized online certifications",
      ],
      skillChoices: [
        "Excel & Google Sheets",
        "Reporting & Presentations",
        "Project Coordination",
        "SQL / Data Fundamentals",
        "Stakeholder Communication",
        "Process Documentation",
      ],
    },
  },
  {
    slug: "data-analyst",
    category: "resume-examples",
    title: "Data Analyst Resume Example & Guide",
    shortTitle: "Data Analyst Resume",
    metaDescription:
      "Data Analyst resume example showcasing KPI dashboards, database validation, market intelligence, SQL, Excel, and clear executive reporting.",
    stage: "Mid-Level & Professional",
    profession: "Data & Analytics",
    readTime: "6 min read",
    recommendedTemplate: "minimal",
    recommendedTemplateLabel: "ATS Minimal",
    relatedSlug: {
      category: "cover-letter-examples",
      slug: "data-analyst",
      label: "Data Analyst Cover Letter Example",
    },
    intro:
      "Data Analyst hiring managers evaluate two things immediately: technical accuracy (how you clean, validate, and query data) and business clarity (how your dashboards or reports help decision-makers act).",
    exampleHeader: {
      name: "Samuel Mugisha",
      role: "Data & Market Intelligence Analyst",
      location: "Kigali, Rwanda",
      email: "samuel.mugisha@example.com",
      phone: "+250 788 220 411",
      linkedin: "linkedin.com/in/samuelmugisha",
    },
    exampleBody: {
      summary:
        "Detail-oriented Data Analyst experienced in cross-departmental KPI dashboarding, CRM and member database hygiene, and verified market intelligence tracking. Skilled in transforming fragmented spreadsheet records into reliable reporting systems.",
      experience:
        "Regional Clean Energy Network | Data Analyst | 2025 – Present\n• Built and maintained cross-departmental KPI dashboards in Google Sheets and Excel to track membership activity and project pipelines.\n• Implemented multi-pass URL and contact verification checks to remove duplicate records and standardize directory fields.\n• Automated web form lead routing into email marketing lists, reducing manual weekly CSV imports.\n\nMetro Events & Operations | Operations & Data Coordinator | 2023 – 2025\n• Standardized equipment inventory logs and post-event reporting templates across multiple venues.\n• Audited shared cloud drive archives to remove duplicate media folders and organize project files.",
      education:
        "Kigali Independent University | Advanced Diploma in Electrical Technology | 2021 – 2025",
      skills:
        "Excel & Google Sheets, KPI Dashboards, Data Cleaning & Validation, SQL, Python Basics, CRM Management, Workflow Automation, Market Research",
      achievements:
        "• Reorganized shared organizational storage and cleared redundant archive files through a structured storage audit.\n• Established a repeatable source-verification checklist for regional project databases.",
      certifications: "Microsoft Azure Cloud Fundamentals",
    },
    structureBreakdown: [
      {
        section: "Workflow-Focused Bullets",
        whyItWorks:
          "Explains not just what tools you know, but what messy data problem you solved (deduplication, automation, KPI visibility).",
      },
      {
        section: "Grouped Technical Skills",
        whyItWorks:
          "Makes core tools (Excel, Google Sheets, SQL, Automation) easy to verify within seconds.",
      },
    ],
    keySkills: [
      "Excel & Google Sheets",
      "SQL & Querying",
      "KPI Dashboard Design",
      "Data Cleaning & Validation",
      "Workflow Automation",
      "Stakeholder Reporting",
    ],
    writingTips: [
      "Only cite metrics you can genuinely back up in an interview—if you do not have an exact percentage, describe the concrete operational improvement clearly.",
      "Highlight data quality work (validation, deduplication, audit trails), which employers value highly.",
      "Link to a clean portfolio or GitHub repository if you have public analysis projects.",
    ],
    commonMistakes: [
      "Listing 25 tools you barely touched instead of focusing on tools you can actually use live in a test.",
      "Describing technical steps without explaining who used the dashboard or report.",
    ],
    faqs: [
      {
        q: "Can I become a Data Analyst with an engineering or non-CS degree?",
        a: "Yes. Technical diplomas and engineering degrees pair naturally with data analysis—emphasize your analytical coursework, spreadsheet modeling, database hygiene, and real reporting projects.",
      },
    ],
    customizer: {
      defaultRole: "Data Analyst",
      experienceToggleDefault: true,
      activityLabel: "Select areas reflected in your real work",
      activityChoices: [
        "KPI dashboard creation in Excel, Google Sheets, or Power BI",
        "Database cleaning, deduplication, and contact verification",
        "Market research and regional project tracking",
        "Automating form-to-CRM or spreadsheet workflows",
      ],
      skillChoices: [
        "Microsoft Excel",
        "Google Sheets",
        "SQL",
        "Power BI / Looker Studio",
        "Python",
        "Data Validation & Cleaning",
        "Workflow Automation",
      ],
    },
  },
  {
    slug: "electrical-engineer",
    category: "resume-examples",
    title: "Electrical Engineer & Technologist Resume Example",
    shortTitle: "Electrical Engineer Resume",
    metaDescription:
      "Electrical Engineer and Electrical Technology resume example featuring industrial wiring, diagnostics, solar/embedded systems, CCTV, and safety compliance.",
    stage: "Mid-Level & Professional",
    profession: "Engineering & Technical",
    readTime: "6 min read",
    recommendedTemplate: "split",
    recommendedTemplateLabel: "Modern Split",
    relatedSlug: {
      category: "cover-letter-examples",
      slug: "electrical-engineer",
      label: "Electrical Engineer Cover Letter Example",
    },
    intro:
      "Technical hiring managers in electrical engineering, energy, and facilities operations look for clear evidence of hands-on diagnostics, safety discipline, load calculation, and hardware/system reliability.",
    exampleHeader: {
      name: "Eric Habimana",
      role: "Electrical Technologist & Systems Support Specialist",
      location: "Kigali, Rwanda",
      email: "eric.habimana@example.com",
      phone: "+250 788 331 904",
      linkedin: "linkedin.com/in/erichabimana",
    },
    exampleBody: {
      summary:
        "Hands-on Electrical Technologist experienced in industrial wiring diagnostics, commercial CCTV and access-control installation, live-event electrical setups, and embedded solar-tracking prototypes. Committed to electrical safety standards and reliable troubleshooting.",
      experience:
        "Apex Events & Production | Technical Assistant | 2024 – 2025\n• Installed and tested power distribution wiring, stage lighting circuits, LED screens, and audio cabling for large-venue events.\n• Conducted pre-event continuity and safety checks alongside senior technicians to prevent live-show power faults.\n\nHighland Hospitality Resort | Operations & Technical Support | 2023 – 2024\n• Directed site layout, cable calculations, and installation for property-wide CCTV and electrical circuits.\n• Handled frontline technical diagnostics, access-control maintenance, and routine electrical safety inspections.",
      education:
        "Kigali Independent University | Advanced Diploma in Electrical Technology | 2021 – 2025",
      skills:
        "Industrial Electrical Wiring, Fault Diagnostics, CCTV & Access Control, Solar Systems Basics, Arduino & ESP32 Prototyping, Electrical Safety Protocols, Load Calculation",
      achievements:
        "• Designed and wired an Arduino-based solar tracking prototype using dual LDR dividers, servo actuation, and LCD telemetry.\n• Built an IoT laser security prototype integrating keypad access, PIR detection, and GSM alert messaging.",
      certifications: "Sustainable Solar Refrigeration Training",
    },
    structureBreakdown: [
      {
        section: "Safety & Diagnostics First",
        whyItWorks:
          "Shows field employers that you respect safety checks, load calculations, and structured fault finding.",
      },
      {
        section: "Hardware Prototypes in Achievements",
        whyItWorks:
          "Demonstrates independent engineering initiative with microcontrollers, sensors, and circuits.",
      },
    ],
    keySkills: [
      "Industrial Wiring & Diagnostics",
      "Electrical Safety Compliance",
      "Load & Circuit Calculations",
      "CCTV & Access Control",
      "Solar & Clean Energy Systems",
      "Arduino / ESP32 Embedded Systems",
    ],
    writingTips: [
      "Specify system types (e.g., power distribution, CCTV, solar refrigeration, microcontrollers) rather than generic 'electrical work'.",
      "Include relevant technical certifications and practical lab or hardware projects.",
    ],
    commonMistakes: [
      "Forgetting to mention safety protocols, testing, or preventive maintenance.",
      "Burying hands-on field work under overly academic jargon.",
    ],
    faqs: [
      {
        q: "Should I include personal Arduino or solar prototypes on an engineering resume?",
        a: "Yes—especially early in your career. Briefly state the hardware components and the engineering problem the prototype solved.",
      },
    ],
    customizer: {
      defaultRole: "Electrical Technician / Engineer",
      experienceToggleDefault: true,
      activityLabel: "Select your real technical experience",
      activityChoices: [
        "Industrial or commercial electrical wiring and diagnostics",
        "CCTV, networking, or access-control installation",
        "Solar energy or sustainable cooling systems training",
        "Arduino, ESP32, or IoT hardware prototyping",
        "Live-venue lighting, audio, and power distribution setup",
      ],
      skillChoices: [
        "Electrical Diagnostics",
        "Industrial Wiring",
        "Safety Compliance",
        "CCTV & Access Control",
        "Solar PV / Cooling",
        "Arduino & ESP32",
      ],
    },
  },
  {
    slug: "software-developer",
    category: "resume-examples",
    title: "Software Developer Resume Example & Guide",
    shortTitle: "Software Developer Resume",
    metaDescription:
      "Clean Software Developer resume example highlighting Next.js, React, TypeScript, backend APIs, deployment workflows, and verifiable projects.",
    stage: "Mid-Level & Professional",
    profession: "Software & Engineering",
    readTime: "5 min read",
    recommendedTemplate: "minimal",
    recommendedTemplateLabel: "ATS Minimal",
    intro:
      "Engineering leads skim developer resumes for stack depth, ownership of deployed systems, code reliability, and clean communication. A single-column layout with clear links to GitHub or live projects keeps technical details easy to evaluate.",
    exampleHeader: {
      name: "Daniel Okafor",
      role: "Full-Stack Web Developer",
      location: "London, UK",
      email: "daniel.okafor@example.com",
      phone: "+44 7700 900412",
      linkedin: "linkedin.com/in/danielokafor",
    },
    exampleBody: {
      summary:
        "Full-Stack Web Developer building responsive web applications with TypeScript, React, Next.js, and REST APIs. Focused on maintainable component architecture, clean UI states, and reliable GitHub-to-Vercel deployment workflows.",
      experience:
        "Veridian Web Labs | Full-Stack Developer | 2024 – Present\n• Built modular Next.js App Router interfaces and API routes with strict TypeScript validation.\n• Implemented client-side state persistence, form validation, and accessible responsive layouts across desktop and mobile.\n• Maintained CI checks and automated preview deployments via GitHub and Vercel.\n\nCloudBridge Digital | Junior Frontend Developer | 2022 – 2024\n• Developed reusable Tailwind CSS UI components and resolved cross-browser layout bugs.\n• Collaborated with designers to simplify multi-step onboarding forms.",
      education:
        "University of Manchester | B.Sc. in Computer Science | 2019 – 2022",
      skills:
        "TypeScript, JavaScript, React, Next.js, HTML & CSS, Tailwind CSS, Node.js, Git & GitHub, Vercel, REST APIs, Python",
      achievements:
        "• Built and deployed an interactive web resume builder supporting multi-template rendering and print-to-PDF export.\n• Configured custom domain DNS routing and automated CI checks on GitHub.",
      certifications: "Cloud Architecture Fundamentals",
    },
    structureBreakdown: [
      {
        section: "Concrete Stack & Deployment Mentions",
        whyItWorks:
          "Pairing languages with real workflows (GitHub, CI, API routes, responsive UI) signals production readiness.",
      },
      {
        section: "Deployed Projects in Achievements",
        whyItWorks:
          "Live, testable web projects carry strong weight for developers at every level.",
      },
    ],
    keySkills: [
      "TypeScript & JavaScript",
      "React & Next.js",
      "Tailwind CSS",
      "REST APIs & Backend Routes",
      "Git & CI Workflows",
      "Debugging & Performance",
    ],
    writingTips: [
      "Group skills cleanly by category or priority rather than an unorganized wall of acronyms.",
      "Explain the technical problem each project solved, not just the stack used.",
    ],
    commonMistakes: [
      "Listing technologies you only watched a tutorial on.",
      "Omitting links to working repositories or live demos when you have them.",
    ],
    faqs: [
      {
        q: "Should self-taught or junior developers include personal web projects?",
        a: "Definitely. Describe what the app does, the stack used, and specific technical challenges you solved.",
      },
    ],
    customizer: {
      defaultRole: "Frontend / Full-Stack Developer",
      experienceToggleDefault: true,
      activityLabel: "Select your real engineering work",
      activityChoices: [
        "Built and deployed React or Next.js applications on Vercel",
        "Created backend API routes and third-party integrations",
        "Built Python automation or desktop tools",
        "Managed GitHub repositories, branches, and CI checks",
      ],
      skillChoices: [
        "TypeScript",
        "React",
        "Next.js",
        "Tailwind CSS",
        "Node.js",
        "Python",
        "Git & GitHub",
      ],
    },
  },

  // ── COVER LETTER EXAMPLES ──────────────────────────────────────────────────
  {
    slug: "high-school-student",
    category: "cover-letter-examples",
    title: "High School Student Cover Letter Example & Customizer",
    shortTitle: "High School Student Cover Letter",
    metaDescription:
      "Write an honest, confident high school student cover letter using school activities, volunteering, and reliability—even with no prior work history.",
    stage: "High School",
    profession: "Student / First Job",
    readTime: "4 min read",
    recommendedTemplate: "cl-modern",
    recommendedTemplateLabel: "Modern",
    relatedSlug: {
      category: "resume-examples",
      slug: "high-school-student",
      label: "High School Student Resume Example",
    },
    intro:
      "A strong high school cover letter stays concise (three to four short paragraphs), shows genuine interest in the workplace, and points to real habits—like punctuality, teamwork, or volunteering—that prove you will be dependable.",
    exampleHeader: {
      name: "Jordan Kamali",
      role: "High School Student",
      location: "Kigali, Rwanda",
      email: "jordan.kamali@example.com",
      phone: "+250 788 123 456",
    },
    exampleBody: {
      openingParagraph:
        "I am writing to apply for the Part-Time Store Associate position at City Books & Stationery. As a reliable high school senior who visits your store regularly, I would value the opportunity to support your customers and learn from your retail team.",
      bodyParagraph1:
        "While this would be my first formal retail job, I have built strong customer communication and organization habits through weekend volunteering at my community library and coordinating student council events. In both roles, I greet visitors warmly, keep shared spaces neat, and follow instructions carefully.",
      bodyParagraph2:
        "I am available after school on weekdays and throughout weekends, and I take pride in showing up on time and working cooperatively with others. My coursework in computer applications and business studies has also given me comfort with basic spreadsheets and accurate record-keeping.",
      closingParagraph:
        "Thank you for considering my application. I would welcome the chance to meet in person and discuss how I can contribute reliably to your team.",
    },
    structureBreakdown: [
      {
        section: "Direct, Enthusiastic Opening",
        whyItWorks:
          "Names the exact position and shows you actually know the business you are applying to.",
      },
      {
        section: "Honest Experience Bridge",
        whyItWorks:
          "Acknowledges student status confidently and immediately backs up your work ethic with volunteering or school activities.",
      },
      {
        section: "Clear Availability",
        whyItWorks:
          "Managers hiring students always need to know when you can work around school hours.",
      },
    ],
    keySkills: [
      "Reliability & Punctuality",
      "Friendly Communication",
      "Willingness to Learn",
      "Organization",
      "Teamwork",
    ],
    writingTips: [
      "Keep the entire letter between 180 and 260 words.",
      "Mention your real schedule availability (after school, weekends, holidays).",
      "Never apologize for being a student—focus on your energy and dependability.",
    ],
    commonMistakes: [
      "Copying a generic corporate letter full of stiff buzzwords.",
      "Forgetting to change the company name between applications.",
    ],
    faqs: [
      {
        q: "Do high school students really need a cover letter?",
        a: "Even when optional, a short, thoughtful cover letter helps first-time applicants stand out because most other student candidates skip it.",
      },
    ],
    customizer: {
      defaultRole: "Part-Time Customer Service Associate",
      defaultCompany: "City Books & Stationery",
      experienceToggleDefault: false,
      activityLabel: "Select your real school, club, or volunteer background",
      activityChoices: [
        "Volunteering at a community center, church, or library",
        "Helping organize school events or student council activities",
        "Participating in a school sports team or debate club",
        "Tutoring younger students or helping classmates",
        "Assisting with a family business or local shop",
      ],
      skillChoices: [
        "Friendly customer communication",
        "Punctuality and reliability",
        "Organization and attention to detail",
        "Basic computer and spreadsheet skills",
        "Positive teamwork",
      ],
    },
  },
  {
    slug: "no-experience",
    category: "cover-letter-examples",
    title: "Cover Letter With No Experience Example & Guide",
    shortTitle: "No Experience Cover Letter",
    metaDescription:
      "How to write an effective cover letter with no work experience by connecting transferable skills, training, and real motivation to the job.",
    stage: "No Experience",
    profession: "Entry-Level",
    readTime: "4 min read",
    recommendedTemplate: "cl-minimal",
    recommendedTemplateLabel: "Minimal",
    relatedSlug: {
      category: "resume-examples",
      slug: "no-experience",
      label: "No Experience Resume Example",
    },
    intro:
      "When you lack direct job titles, your cover letter is your strongest tool. It lets you connect the dots between your coursework, volunteering, or self-taught skills and the practical problems the employer needs help solving.",
    exampleHeader: {
      name: "Aline Uwimana",
      role: "Entry-Level Administrative Applicant",
      location: "Nairobi, Kenya",
      email: "aline.uwimana@example.com",
      phone: "+254 700 456 789",
    },
    exampleBody: {
      openingParagraph:
        "I am writing to apply for the Junior Administrative Assistant position at Horizon Advisory. With recent training in office systems, spreadsheet organization, and professional communication, I am eager to support your team's daily operations.",
      bodyParagraph1:
        "Although I am entering my first full-time office role, I have practiced the exact habits this position requires through academic team coordination and event registration volunteering. Managing attendance logs, building shared Google Sheets trackers, and keeping project files tidy taught me how much smooth administration matters.",
      bodyParagraph2:
        "I admire Horizon Advisory's structured approach to client service and would bring careful attention to detail, fast learning, and steady follow-through to scheduling, inbox support, and document preparation.",
      closingParagraph:
        "Thank you for your time and consideration. I would appreciate the opportunity to discuss how my organizational skills and enthusiasm can support your office.",
    },
    structureBreakdown: [
      {
        section: "Value-Focused Framing",
        whyItWorks:
          "Focuses on what the employer gets (accurate files, reliable support) instead of dwelling on missing titles.",
      },
      {
        section: "Concrete Proof from Non-Job Settings",
        whyItWorks:
          "Specific examples like registration logs and shared trackers make your transferable skills believable.",
      },
    ],
    keySkills: [
      "Organization",
      "Clear Writing",
      "Office & Spreadsheet Tools",
      "Fast Learning",
      "Dependability",
    ],
    writingTips: [
      "Pick 2–3 requirements from the job posting and connect each one to something real you have done.",
      "Proofread aloud to make sure the tone sounds natural and confident.",
    ],
    commonMistakes: [
      "Opening with 'I know I don't have much experience, but...'.",
      "Repeating your resume word-for-word instead of adding context.",
    ],
    faqs: [
      {
        q: "How do I address the letter if no hiring manager name is listed?",
        a: "'Dear Hiring Manager,' or 'Dear [Department] Hiring Team,' is clean, standard, and professional.",
      },
    ],
    customizer: {
      defaultRole: "Junior Administrative Assistant",
      defaultCompany: "Horizon Advisory",
      experienceToggleDefault: false,
      activityLabel: "Select real experiences that show your readiness",
      activityChoices: [
        "Completed coursework or certifications in office/technical tools",
        "Coordinated group projects and shared team trackers",
        "Volunteered at community events or registration desks",
        "Built personal practice projects to sharpen practical skills",
      ],
      skillChoices: [
        "Organization & scheduling",
        "Spreadsheet & document accuracy",
        "Clear written communication",
        "Customer support mindset",
        "Consistent follow-through",
      ],
    },
  },
  {
    slug: "internship",
    category: "cover-letter-examples",
    title: "Internship Cover Letter Example & Guide",
    shortTitle: "Internship Cover Letter",
    metaDescription:
      "Write a compelling internship cover letter connecting your coursework, technical projects, and curiosity to the host organization.",
    stage: "College & Internship",
    profession: "Student / Intern",
    readTime: "4 min read",
    recommendedTemplate: "cl-executive",
    recommendedTemplateLabel: "Executive",
    relatedSlug: {
      category: "resume-examples",
      slug: "recent-graduate",
      label: "Recent Graduate Resume Example",
    },
    intro:
      "Internship coordinators hire for curiosity, foundational competence, and coachability. Show that you understand what the organization does and connect 1–2 relevant academic or hands-on projects directly to their work.",
    exampleHeader: {
      name: "David Nshimiyimana",
      role: "Business & Analytics Student",
      location: "Kigali, Rwanda",
      email: "david.nshimiyimana@example.com",
      phone: "+250 788 555 019",
    },
    exampleBody: {
      openingParagraph:
        "I am excited to apply for the Operations & Analytics Internship at Meridian Partners. As a final-year Business Administration student focused on quantitative reporting and workflow organization, I admire your team's practical work supporting growing enterprises.",
      bodyParagraph1:
        "In my recent coursework and university society projects, I built structured Excel trackers, organized multi-session event schedules, and summarized survey results for faculty and student organizers. These projects strengthened my accuracy with spreadsheets and my comfort turning raw notes into clear summaries.",
      bodyParagraph2:
        "What draws me most to Meridian Partners is the chance to learn structured operational analysis from experienced practitioners while contributing dependable day-to-day support in data cleaning, reporting, and documentation.",
      closingParagraph:
        "Thank you for reviewing my application. I would welcome the chance to discuss how I can contribute during the upcoming internship term.",
    },
    structureBreakdown: [
      {
        section: "Academic-to-Practical Bridge",
        whyItWorks:
          "Translates classroom work into tangible office deliverables (trackers, summaries, schedules).",
      },
      {
        section: "Two-Way Value Statement",
        whyItWorks:
          "Balances what you hope to learn with the dependable support you can contribute immediately.",
      },
    ],
    keySkills: [
      "Coachability",
      "Foundational Technical Tools",
      "Research & Documentation",
      "Meeting Deadlines",
    ],
    writingTips: [
      "Mention one real detail about the company's mission, product, or recent project.",
      "State your exact internship availability window.",
    ],
    commonMistakes: [
      "Talking only about what you want to gain without mentioning how you will help the team.",
    ],
    faqs: [
      {
        q: "How long should an internship cover letter be?",
        a: "Keep it to half a page to three-quarters of a page (around 220–300 words).",
      },
    ],
    customizer: {
      defaultRole: "Operations & Data Intern",
      defaultCompany: "Meridian Partners",
      experienceToggleDefault: false,
      activityLabel: "Select your real academic or student highlights",
      activityChoices: [
        "Hands-on lab, research, or capstone project",
        "Student club or campus event coordination",
        "Online certification or technical bootcamp",
        "Part-time campus or volunteer work",
      ],
      skillChoices: [
        "Excel & Google Sheets",
        "Research & report writing",
        "Technical troubleshooting",
        "Cross-team communication",
        "Fast learning & documentation",
      ],
    },
  },
  {
    slug: "data-analyst",
    category: "cover-letter-examples",
    title: "Data Analyst Cover Letter Example & Guide",
    shortTitle: "Data Analyst Cover Letter",
    metaDescription:
      "Data Analyst cover letter example demonstrating KPI reporting, database quality, automation, and clear business communication.",
    stage: "Mid-Level & Professional",
    profession: "Data & Analytics",
    readTime: "5 min read",
    recommendedTemplate: "cl-corporate",
    recommendedTemplateLabel: "Corporate",
    relatedSlug: {
      category: "resume-examples",
      slug: "data-analyst",
      label: "Data Analyst Resume Example",
    },
    intro:
      "A sharp Data Analyst cover letter proves you can communicate clearly in plain English—not just write formulas or queries. Show how your data cleaning, dashboards, and market tracking help teams make faster, better-informed choices.",
    exampleHeader: {
      name: "Samuel Mugisha",
      role: "Data & Market Intelligence Analyst",
      location: "Kigali, Rwanda",
      email: "samuel.mugisha@example.com",
      phone: "+250 788 220 411",
    },
    exampleBody: {
      openingParagraph:
        "I am writing to apply for the Data Analyst position at ClearView Energy Insights. My work focuses on turning scattered operational spreadsheets and market intelligence records into clean, decision-ready KPI dashboards.",
      bodyParagraph1:
        "In my current role, I maintain cross-departmental dashboards, run multi-step contact and source verification pipelines to eliminate duplicate records, and automate web form routing into CRM audiences. That combination of data governance and practical automation ensures leadership works from accurate numbers rather than stale files.",
      bodyParagraph2:
        "ClearView Energy Insights' commitment to verifiable regional market reporting aligns closely with how I approach analytics. I would be excited to bring disciplined data validation, clear visual reporting, and cross-functional collaboration to your team.",
      closingParagraph:
        "Thank you for your time and consideration. I would welcome the opportunity to discuss how my analytical background can support your reporting goals.",
    },
    structureBreakdown: [
      {
        section: "Plain-English Value Proposition",
        whyItWorks:
          "Demonstrates that you understand analytics exists to support business decisions.",
      },
      {
        section: "Concrete Workflow Examples",
        whyItWorks:
          "Citing dashboards, deduplication, and form-to-CRM automation proves real hands-on ownership.",
      },
    ],
    keySkills: [
      "KPI Dashboarding",
      "Database Validation",
      "Excel, Google Sheets & SQL",
      "Executive Communication",
    ],
    writingTips: [
      "Highlight one real workflow you cleaned up or automated from end to end.",
      "Match the specific analytics tools mentioned in the vacancy if you actually use them.",
    ],
    commonMistakes: [
      "Turning the cover letter into a dry list of software names without context.",
    ],
    faqs: [
      {
        q: "Should I attach dashboard screenshots or link a portfolio?",
        a: "Include a link to a clean public portfolio or sample workbook in your header rather than pasting large images into the letter.",
      },
    ],
    customizer: {
      defaultRole: "Data Analyst",
      defaultCompany: "ClearView Energy Insights",
      experienceToggleDefault: true,
      activityLabel: "Select real analytics work you want to highlight",
      activityChoices: [
        "Building KPI dashboards for cross-functional teams",
        "Cleaning and verifying CRM or member databases",
        "Tracking market intelligence and regional project pipelines",
        "Automating form submissions and reporting workflows",
      ],
      skillChoices: [
        "Excel & Google Sheets",
        "SQL & Data Querying",
        "Data Quality & Validation",
        "KPI Reporting",
        "Workflow Automation",
      ],
    },
  },
  {
    slug: "electrical-engineer",
    category: "cover-letter-examples",
    title: "Electrical Engineer Cover Letter Example & Guide",
    shortTitle: "Electrical Engineer Cover Letter",
    metaDescription:
      "Electrical Engineer and Technologist cover letter example highlighting diagnostics, wiring installations, safety protocols, and solar/embedded systems.",
    stage: "Mid-Level & Professional",
    profession: "Engineering & Technical",
    readTime: "5 min read",
    recommendedTemplate: "cl-executive",
    recommendedTemplateLabel: "Executive",
    relatedSlug: {
      category: "resume-examples",
      slug: "electrical-engineer",
      label: "Electrical Engineer Resume Example",
    },
    intro:
      "Engineering employers value clarity, reliability, and practical field awareness. Use your cover letter to connect your formal training, installation/diagnostic work, and safety mindset directly to the company's projects.",
    exampleHeader: {
      name: "Eric Habimana",
      role: "Electrical Technologist",
      location: "Kigali, Rwanda",
      email: "eric.habimana@example.com",
      phone: "+250 788 331 904",
    },
    exampleBody: {
      openingParagraph:
        "I am writing to express my interest in the Electrical Technician / Systems Engineer role at SunGrid Infrastructure. Holding an Advanced Diploma in Electrical Technology along with hands-on field installation and diagnostics experience, I bring a safety-first approach to every project.",
      bodyParagraph1:
        "Across hospitality operations and large-scale live event productions, I have calculated circuit requirements, installed CCTV and access-control infrastructure, and managed power distribution setups under tight timelines. Alongside field work, I continue building embedded hardware prototypes—including dual-sensor solar tracking and automated security circuits.",
      bodyParagraph2:
        "SunGrid Infrastructure's work expanding reliable power and clean energy installations matches both my formal electrical training and my sustainable solar refrigeration background. I would be proud to contribute dependable troubleshooting and clean installation standards to your engineering crew.",
      closingParagraph:
        "Thank you for reviewing my application. I look forward to the opportunity to discuss how my technical skills can support your upcoming deployments.",
    },
    structureBreakdown: [
      {
        section: "Credentials + Safety Mindset Upfront",
        whyItWorks:
          "Immediately reassures technical reviewers that you combine formal education with disciplined field practice.",
      },
      {
        section: "Field Work + Continuous Technical Growth",
        whyItWorks:
          "Connecting job-site reliability with hands-on prototyping shows strong initiative.",
      },
    ],
    keySkills: [
      "Electrical Wiring & Troubleshooting",
      "Safety Compliance",
      "CCTV & Access Control",
      "Solar & Clean Energy Systems",
    ],
    writingTips: [
      "Mention specific environments you have worked in (commercial facilities, events, solar, industrial panels).",
      "Keep technical explanations clear enough for both HR recruiters and lead engineers.",
    ],
    commonMistakes: [
      "Using overly dense textbook terminology without describing practical field outcomes.",
    ],
    faqs: [
      {
        q: "Should electrical technologists mention certifications like solar or safety training?",
        a: "Yes—industry training certificates directly reinforce job readiness for energy and infrastructure roles.",
      },
    ],
    customizer: {
      defaultRole: "Electrical Systems Technician",
      defaultCompany: "SunGrid Infrastructure",
      experienceToggleDefault: true,
      activityLabel: "Select your real electrical or technical background",
      activityChoices: [
        "Commercial or industrial electrical wiring and fault diagnostics",
        "CCTV, access control, and facility technical support",
        "Large-venue power, lighting, and AV setup",
        "Sustainable solar energy or embedded hardware prototyping",
      ],
      skillChoices: [
        "Industrial Electrical Diagnostics",
        "Safety & Testing Protocols",
        "Circuit & Load Calculation",
        "Solar & Clean Energy Basics",
        "Arduino / ESP32 Prototyping",
      ],
    },
  },

  // ── WRITING & CAREER GUIDES ────────────────────────────────────────────────
  {
    slug: "how-to-choose-a-resume-format",
    category: "writing-guides",
    title: "How to Choose the Right Resume Format for Your Career Stage",
    shortTitle: "How to Choose a Resume Format",
    metaDescription:
      "Compare chronological, combination (hybrid), and functional resume formats with practical advice on readability and applicant tracking systems.",
    stage: "Recent Graduate",
    profession: "All Industries",
    readTime: "5 min read",
    recommendedTemplate: "minimal",
    recommendedTemplateLabel: "ATS Minimal",
    intro:
      "Your resume format controls what a recruiter reads in the first 10 seconds. Choosing the right layout is not about decoration—it is about putting your strongest verified proof points near the top in a structure both humans and software can parse cleanly.",
    exampleHeader: {
      name: "Bosco Resume Editorial Guide",
      role: "Resume Formatting Standards",
      location: "Global Best Practices",
      email: "guide@boscoresume",
      phone: "",
    },
    exampleBody: {
      guideSections: [
        {
          heading: "1. Reverse-Chronological Format (Best Default for Most Applicants)",
          body: "Lists your work history starting with your most recent role. It is the most familiar layout for hiring managers and parses cleanly across virtually all applicant tracking systems.",
          bullets: [
            "Best when you have steady progression in the same or a closely related field.",
            "Keep dates, job titles, and employer names aligned consistently.",
          ],
        },
        {
          heading: "2. Combination / Hybrid Format (Best for Technical & Multi-Skilled Roles)",
          body: "Places a concise summary and grouped core skills above your reverse-chronological work timeline so reviewers see both your technical stack and your track record immediately.",
          bullets: [
            "Ideal for Data Analysts, Engineers, Developers, and Project Managers.",
            "Avoid letting the skills list crowd out concrete experience bullets.",
          ],
        },
        {
          heading: "3. Skills-First / Functional Emphasis (Best for Students & Career Starters)",
          body: "Brings education, certifications, practical projects, and volunteering higher on the page when you have limited paid work history.",
          bullets: [
            "Still include clear dates on projects, volunteering, or education so nothing looks hidden.",
          ],
        },
      ],
    },
    structureBreakdown: [
      {
        section: "Readable Hierarchy",
        whyItWorks:
          "Consistent headings, clear spacing, and standard section titles make scanning effortless.",
      },
      {
        section: "Both PDF and Plain Text",
        whyItWorks:
          "PDF preserves exact typography for human readers, while TXT helps when pasting into strict legacy forms.",
      },
    ],
    keySkills: [
      "Reverse-Chronological Clarity",
      "Action-Verb Bullets",
      "Consistent Date Formatting",
      "Single-Page Editing (Early Career)",
    ],
    writingTips: [
      "Different employers use different applicant tracking systems—keep headings standard ('Work Experience', 'Education', 'Skills') rather than clever puns.",
      "Do not sacrifice legibility for tight margins; leave enough white space so every bullet breathes.",
    ],
    commonMistakes: [
      "Hiding employment dates altogether, which raises questions during screening.",
      "Overstuffing two columns with tiny 7pt fonts just to force everything onto one page.",
    ],
    faqs: [
      {
        q: "Does a single-column resume always beat a two-column resume?",
        a: "Single-column layouts are the safest default for older automated parsers, while clean two-column layouts work very well for direct recruiter review and modern hiring portals. Pick based on how you are submitting.",
      },
    ],
  },
  {
    slug: "how-to-write-action-bullet-points",
    category: "writing-guides",
    title: "How to Write Clear, Honest Resume Bullet Points",
    shortTitle: "Writing Strong Resume Bullets",
    metaDescription:
      "Turn passive job-description duties into sharp, truthful resume bullet points using the Action + Context + Outcome method—without inventing fake numbers.",
    stage: "Mid-Level & Professional",
    profession: "All Industries",
    readTime: "4 min read",
    recommendedTemplate: "richard",
    recommendedTemplateLabel: "Executive Sidebar",
    intro:
      "Most resumes fail not because the applicant lacks ability, but because their bullet points read like a vague job description ('Responsible for reports'). Switching to an Action + Scope + Outcome structure makes your real contributions immediately clear.",
    exampleHeader: {
      name: "Bosco Resume Editorial Guide",
      role: "Resume Writing Craft",
      location: "Global Best Practices",
      email: "guide@boscoresume",
      phone: "",
    },
    exampleBody: {
      guideSections: [
        {
          heading: "The Action + Context + Outcome Formula",
          body: "Start every bullet with a concrete past-tense verb (present tense for your current role), explain the exact system or task you owned, and state the real result.",
          bullets: [
            "Weak: 'Responsible for helping with customer emails and spreadsheets.'",
            "Stronger: 'Tracked incoming customer inquiries in a shared spreadsheet and standardized reply templates to keep response times consistent.'",
          ],
        },
        {
          heading: "What If You Do Not Have Exact Percentages?",
          body: "Never invent metrics just to look impressive—interviewers will ask how you measured them. Instead, use verifiable scope details: how often you delivered, who used the work, or what bottleneck you removed.",
          bullets: [
            "Good real scope: 'weekly executive briefs', '5-person team', 'monthly reconciliation', 'eliminated manual copy-pasting'.",
          ],
        },
      ],
    },
    structureBreakdown: [
      {
        section: "Lead With Ownership Verbs",
        whyItWorks:
          "Verbs like Built, Coordinated, Audited, Installed, Standardized, and Analyzed instantly communicate agency.",
      },
    ],
    keySkills: [
      "Concise Editing",
      "Verifiable Scope",
      "Active Voice",
      "Role Tailoring",
    ],
    writingTips: [
      "Limit each role to 3–5 focused bullets rather than 10 repetitive lines.",
      "Avoid repeating the exact same opening verb three times in a row.",
    ],
    commonMistakes: [
      "Fabricating percentages ('increased efficiency by 47%') that you cannot explain in an interview.",
      "Writing dense 5-line paragraphs instead of scannable 1–2 line bullets.",
    ],
    faqs: [
      {
        q: "How many bullet points should I write per job?",
        a: "Aim for 3–5 strong bullets for your most recent relevant roles, and 2–3 concise bullets for older positions.",
      },
    ],
  },
];

export function getResourceByParams(
  category: string,
  slug: string
): ResourceItem | undefined {
  return RESOURCES.find((r) => r.category === category && r.slug === slug);
}

export function getResourcesByCategory(category: ResourceCategory): ResourceItem[] {
  return RESOURCES.filter((r) => r.category === category);
}
