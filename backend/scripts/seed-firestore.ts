/**
 * Seed / remove dummy job posts in the REAL amrutai Firestore.
 *
 * Writes to the same collections the amrut.ai job-posting dashboard uses:
 *   - jobPostings      (one doc per job, exact same shape createJob() writes)
 *   - companyProfiles  (join key: websiteUrl — same lookup the backend does)
 *
 * Every seeded doc carries  seededBy: "amrut-jobs-portal-seed"  so the whole
 * batch can be removed with one command before real production launch.
 *
 * Usage (credentials never printed, only referenced by path):
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json \
 *     npx tsx scripts/seed-firestore.ts seed
 *   ... seed-firestore.ts remove   # deletes every seeded doc
 *   ... seed-firestore.ts list     # counts seeded vs total docs
 */
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

const SEED_MARKER = 'amrut-jobs-portal-seed';

function initAdmin() {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    initializeApp({ credential: applicationDefault() });
  }
  return getFirestore();
}

// ---------------------------------------------------------------------------
// 10 companies
// ---------------------------------------------------------------------------
interface SeedCompany {
  domain: string;
  name: string;
  tagline: string;
  description: string;
  founded: string;
  city: string;
  country: string;
  employeesRange: string;
  industryTags: string[];
}

const COMPANIES: SeedCompany[] = [
  {
    domain: 'innovex.example.com',
    name: 'Innovex Technologies',
    tagline: 'Modernising the digital core of global enterprises',
    description:
      'Innovex Technologies is a global IT services leader helping enterprises modernise their digital core. We build cloud-native platforms, AI-driven products and enterprise software for Fortune 500 clients across 40+ countries.',
    founded: '2004',
    city: 'Bengaluru',
    country: 'India',
    employeesRange: '10,000+',
    industryTags: ['IT Services', 'Cloud', 'Enterprise Software'],
  },
  {
    domain: 'pixelwave.example.com',
    name: 'PixelWave Studios',
    tagline: 'Digital experiences people love',
    description:
      'PixelWave Studios crafts world-class digital experiences. From brand identities to complex design systems, our teams work with startups and global brands to ship delightful products.',
    founded: '2015',
    city: 'Pune',
    country: 'India',
    employeesRange: '501-1,000',
    industryTags: ['Design', 'Creative Tech', 'UX'],
  },
  {
    domain: 'cloudnine.example.com',
    name: 'CloudNine Systems',
    tagline: 'Mission-critical infrastructure at scale',
    description:
      'CloudNine Systems powers mission-critical infrastructure for banks, telcos and unicorn startups. Our managed Kubernetes, observability and DevSecOps platforms run at massive scale.',
    founded: '2010',
    city: 'Hyderabad',
    country: 'India',
    employeesRange: '5,001-10,000',
    industryTags: ['Cloud Infrastructure', 'DevOps', 'SRE'],
  },
  {
    domain: 'dataquark.example.com',
    name: 'DataQuark Analytics',
    tagline: 'Turning raw data into business advantage',
    description:
      'DataQuark Analytics turns raw data into business advantage. We build ML platforms, LLM applications and decision-intelligence tools used by 300+ enterprises worldwide.',
    founded: '2013',
    city: 'Bengaluru',
    country: 'India',
    employeesRange: '1,001-5,000',
    industryTags: ['Data & AI', 'Machine Learning', 'Analytics'],
  },
  {
    domain: 'finedge.example.com',
    name: 'FinEdge Capital',
    tagline: 'Banking for the next billion',
    description:
      'FinEdge Capital is one of India’s fastest growing fintech platforms offering digital lending, wealth management and payment solutions to over 20 million users.',
    founded: '2016',
    city: 'Mumbai',
    country: 'India',
    employeesRange: '1,001-5,000',
    industryTags: ['FinTech', 'Payments', 'Lending'],
  },
  {
    domain: 'medicareplus.example.com',
    name: 'MediCare Plus',
    tagline: 'Quality healthcare, accessible to all',
    description:
      'MediCare Plus is on a mission to make quality healthcare accessible. Our telemedicine, diagnostics and hospital-management products serve 5,000+ clinics across India.',
    founded: '2018',
    city: 'Gurugram',
    country: 'India',
    employeesRange: '501-1,000',
    industryTags: ['HealthTech', 'Telemedicine'],
  },
  {
    domain: 'shopkart.example.com',
    name: 'ShopKart',
    tagline: 'Everything you love, delivered',
    description:
      'ShopKart is a leading e-commerce marketplace serving 100M+ customers with everything from fashion to electronics, powered by one of India’s largest logistics networks.',
    founded: '2012',
    city: 'Bengaluru',
    country: 'India',
    employeesRange: '10,000+',
    industryTags: ['E-commerce', 'Logistics', 'Consumer Tech'],
  },
  {
    domain: 'zestpay.example.com',
    name: 'ZestPay',
    tagline: 'Payment rails for the Indian internet',
    description:
      'ZestPay processes billions of UPI and card transactions every month. We are building the payment rails for the next generation of Indian internet businesses.',
    founded: '2017',
    city: 'Noida',
    country: 'India',
    employeesRange: '1,001-5,000',
    industryTags: ['FinTech', 'Payments', 'UPI'],
  },
  {
    domain: 'brighthire.example.com',
    name: 'BrightHire Solutions',
    tagline: 'Hire faster. Hire fairer.',
    description:
      'BrightHire Solutions builds AI-powered recruitment tools that help companies hire faster and fairer. Our ATS and assessment platform is used by 1,200+ organisations.',
    founded: '2019',
    city: 'Chennai',
    country: 'India',
    employeesRange: '201-500',
    industryTags: ['HR Tech', 'SaaS', 'AI'],
  },
  {
    domain: 'eduspark.example.com',
    name: 'EduSpark Learning',
    tagline: 'World-class education, affordable for everyone',
    description:
      'EduSpark Learning makes world-class education affordable. Our live classes, test-prep and upskilling programs have helped 10M+ learners achieve their goals.',
    founded: '2016',
    city: 'New Delhi',
    country: 'India',
    employeesRange: '1,001-5,000',
    industryTags: ['EdTech', 'Upskilling'],
  },
];

// ---------------------------------------------------------------------------
// Jobs — 24 posts across the 10 companies, in the exact jobPostings shape
// ---------------------------------------------------------------------------
interface SeedJob {
  domain: string;
  title: string;
  team: string;
  workFormat: 'Remote' | 'Hybrid' | 'On-site';
  location: string;
  type: string;
  salaryRange: string;
  shortDescription: string;
  intro: string[];
  aboutRole: Array<{ title: string; description: string }>;
  requiredQualifications: string[];
  preferredQualifications: string[];
  perks: string[];
  // portal-only extra fields (their careers serializer ignores these)
  skills: string[];
  experienceMin: number;
  experienceMax: number;
  daysAgo: number; // publishedAt = now - daysAgo
}

const job = (j: SeedJob): SeedJob => j;

const JOBS: SeedJob[] = [
  // ---- Innovex Technologies (3) ----
  job({
    domain: 'innovex.example.com',
    title: 'Senior Frontend Developer',
    team: 'Engineering',
    workFormat: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    type: 'Full-time',
    salaryRange: '₹25–38 LPA',
    shortDescription:
      'Own high-impact features on enterprise platforms used by millions — React, TypeScript and a design-system-first culture.',
    intro: [
      'Innovex Technologies builds cloud-native platforms for Fortune 500 clients across 40+ countries. Our frontend guild ships accessible, high-performance interfaces that real businesses run on every day. You will join a senior team that values craft, ownership and mentorship.',
    ],
    aboutRole: [
      { title: 'Build product surfaces', description: 'Design and ship complex React + TypeScript features end-to-end, from design handoff to production monitoring.' },
      { title: 'Raise the bar', description: 'Drive performance budgets (Core Web Vitals), accessibility and testing standards across squads.' },
      { title: 'Mentor and lead', description: 'Guide mid-level engineers through reviews, pairing and architecture discussions.' },
    ],
    requiredQualifications: [
      '5+ years building production web applications with React',
      'Expert-level TypeScript and modern state management (Redux Toolkit or similar)',
      'Strong grasp of web performance, caching and browser internals',
      'Experience collaborating with design systems at scale',
    ],
    preferredQualifications: ['Next.js App Router experience', 'Open-source contributions or public technical writing'],
    perks: ['Health insurance for family', 'Annual learning budget of ₹1L', 'Flexible hybrid schedule', 'ESOPs', 'Relocation support'],
    skills: ['React', 'TypeScript', 'Next.js', 'Redux Toolkit', 'Tailwind CSS'],
    experienceMin: 5,
    experienceMax: 8,
    daysAgo: 2,
  }),
  job({
    domain: 'innovex.example.com',
    title: 'Backend Engineer — Java/Spring',
    team: 'Engineering',
    workFormat: 'On-site',
    location: 'Bengaluru, Karnataka',
    type: 'Full-time',
    salaryRange: '₹18–30 LPA',
    shortDescription:
      'Design resilient microservices that process millions of enterprise transactions daily on our flagship banking platform.',
    intro: [
      'Our platform engineering group runs 200+ microservices with strict SLAs for global banks. You will own services end-to-end: design, code, deploy, observe.',
    ],
    aboutRole: [
      { title: 'Service ownership', description: 'Build and operate Spring Boot microservices with high availability requirements.' },
      { title: 'Data at scale', description: 'Model transactional data on PostgreSQL and streaming pipelines on Kafka.' },
      { title: 'Reliability', description: 'Participate in on-call, drive post-mortems and eliminate classes of failure.' },
    ],
    requiredQualifications: [
      '3+ years with Java and Spring Boot in production',
      'Solid understanding of SQL, transactions and data modelling',
      'Experience with Kafka or similar messaging systems',
      'Working knowledge of Kubernetes and CI/CD',
    ],
    preferredQualifications: ['BFSI domain experience', 'Performance tuning of JVM services'],
    perks: ['Health insurance for family', 'On-site gym and meals', 'ESOPs', 'Certification sponsorships'],
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Kubernetes'],
    experienceMin: 3,
    experienceMax: 6,
    daysAgo: 5,
  }),
  job({
    domain: 'innovex.example.com',
    title: 'Engineering Intern — Web Platform',
    team: 'Engineering',
    workFormat: 'On-site',
    location: 'Bengaluru, Karnataka',
    type: 'Internship',
    salaryRange: '₹50,000/month stipend',
    shortDescription:
      'Six-month paid internship with the web platform team — real tickets, real reviews, real shipping. High conversion to full-time.',
    intro: [
      'Interns at Innovex are treated like engineers from day one: you get a mentor, a roadmap and production access by week three. 80% of last year’s cohort received full-time offers.',
    ],
    aboutRole: [
      { title: 'Ship real features', description: 'Pick tickets from the live product backlog and take them to production.' },
      { title: 'Learn the craft', description: 'Weekly 1:1 mentorship, code review deep-dives and internal tech talks.' },
    ],
    requiredQualifications: [
      'Final-year student or recent graduate in CS/IT',
      'Strong JavaScript fundamentals and familiarity with React',
      'Git basics and hunger to learn',
    ],
    preferredQualifications: ['Personal projects or hackathon experience'],
    perks: ['₹50k monthly stipend', 'Full-time conversion path', 'Free meals', 'Laptop provided'],
    skills: ['JavaScript', 'React', 'HTML/CSS', 'Git'],
    experienceMin: 0,
    experienceMax: 1,
    daysAgo: 1,
  }),

  // ---- PixelWave Studios (2) ----
  job({
    domain: 'pixelwave.example.com',
    title: 'Product Designer (UI/UX)',
    team: 'Design',
    workFormat: 'Hybrid',
    location: 'Pune, Maharashtra',
    type: 'Full-time',
    salaryRange: '₹14–24 LPA',
    shortDescription:
      'Own end-to-end design for consumer and SaaS products — research, flows, high-fidelity UI and design-system contributions.',
    intro: [
      'PixelWave designs products used by millions across fintech, health and consumer tech. Our designers own problems, not just screens — you will talk to users, shape strategy and ship polished experiences.',
    ],
    aboutRole: [
      { title: 'End-to-end ownership', description: 'Drive discovery, wireframes, prototypes and final UI for client and in-house products.' },
      { title: 'Research-driven', description: 'Plan and run usability studies; turn insights into design decisions.' },
      { title: 'Systems thinking', description: 'Contribute components and patterns to our multi-brand design system.' },
    ],
    requiredQualifications: [
      '3+ years of product design experience with a strong shipped-work portfolio',
      'Expertise in Figma, prototyping and design systems',
      'Solid understanding of accessibility and responsive design',
      'Clear storytelling and stakeholder communication',
    ],
    preferredQualifications: ['Motion design or illustration skills', 'Experience designing for Indian-language users'],
    perks: ['MacBook Pro + display', 'Annual design-conference budget', 'Hybrid 3-day office', 'Health insurance'],
    skills: ['Figma', 'Design Systems', 'Prototyping', 'User Research', 'Interaction Design'],
    experienceMin: 3,
    experienceMax: 7,
    daysAgo: 3,
  }),
  job({
    domain: 'pixelwave.example.com',
    title: 'Junior Visual Designer',
    team: 'Design',
    workFormat: 'On-site',
    location: 'Pune, Maharashtra',
    type: 'Full-time',
    salaryRange: '₹6–10 LPA',
    shortDescription:
      'Craft brand identities, marketing sites and social creatives for global clients under senior art direction.',
    intro: [
      'Start your design career at a studio that obsesses over craft. You will work under senior art directors on real client briefs from week one.',
    ],
    aboutRole: [
      { title: 'Brand & marketing design', description: 'Produce identities, campaign creatives and landing pages for client brands.' },
      { title: 'Grow fast', description: 'Structured design critiques twice a week and a personal growth plan.' },
    ],
    requiredQualifications: [
      '0–2 years of experience with a strong visual portfolio',
      'Proficiency in Figma and Adobe Creative Suite',
      'Good typography and layout fundamentals',
    ],
    preferredQualifications: ['Basic motion graphics (After Effects)'],
    perks: ['Mentorship from senior art directors', 'Health insurance', 'Studio library and workshops'],
    skills: ['Figma', 'Illustrator', 'Photoshop', 'Typography', 'Branding'],
    experienceMin: 0,
    experienceMax: 2,
    daysAgo: 8,
  }),

  // ---- CloudNine Systems (3) ----
  job({
    domain: 'cloudnine.example.com',
    title: 'Senior DevOps Engineer',
    team: 'Platform Engineering',
    workFormat: 'Remote',
    location: 'Hyderabad, Telangana',
    type: 'Full-time',
    salaryRange: '₹28–45 LPA',
    shortDescription:
      'Run Kubernetes fleets for banks and unicorns — Terraform, GitOps and observability at serious scale. Fully remote.',
    intro: [
      'CloudNine operates some of India’s largest managed Kubernetes fleets. Our platform team automates everything: provisioning, deployment, failover, cost. You will design infrastructure that other engineering teams build on.',
    ],
    aboutRole: [
      { title: 'Infrastructure as code', description: 'Own Terraform modules and GitOps pipelines across AWS and GCP estates.' },
      { title: 'Observability', description: 'Build the metrics, tracing and alerting stack (Prometheus, Grafana, OpenTelemetry) with tight SLOs.' },
      { title: 'Incident leadership', description: 'Lead complex incident response and drive blameless post-mortems.' },
    ],
    requiredQualifications: [
      '5+ years in DevOps/SRE roles with production Kubernetes',
      'Deep Terraform and cloud (AWS/GCP) expertise',
      'Strong scripting in Go, Python or Bash',
      'Experience running on-call for high-availability systems',
    ],
    preferredQualifications: ['CKA/CKS certification', 'Service-mesh (Istio/Linkerd) experience'],
    perks: ['Fully remote with quarterly meetups', 'Home-office budget ₹75k', 'ESOPs', 'Premium health cover'],
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Prometheus', 'GitOps'],
    experienceMin: 5,
    experienceMax: 9,
    daysAgo: 4,
  }),
  job({
    domain: 'cloudnine.example.com',
    title: 'Site Reliability Engineer',
    team: 'Platform Engineering',
    workFormat: 'Hybrid',
    location: 'Hyderabad, Telangana',
    type: 'Full-time',
    salaryRange: '₹18–30 LPA',
    shortDescription:
      'Keep 99.99% uptime for mission-critical workloads — capacity planning, automation and deep debugging across the stack.',
    intro: [
      'Our SRE group owns reliability for platforms processing billions of requests. Expect hard problems: cascading failures, noisy neighbours, exotic kernel issues — and the autonomy to fix them properly.',
    ],
    aboutRole: [
      { title: 'Reliability engineering', description: 'Define and defend SLOs; automate toil away with code.' },
      { title: 'Deep debugging', description: 'Chase issues across network, kernel, container runtime and application layers.' },
    ],
    requiredQualifications: [
      '3+ years in SRE/infra roles',
      'Strong Linux internals and networking knowledge',
      'Proficiency in at least one of Go or Python',
      'Production Kubernetes experience',
    ],
    preferredQualifications: ['eBPF or systems-level performance work'],
    perks: ['Hybrid schedule', 'On-call compensation', 'Learning budget', 'Health insurance for family'],
    skills: ['Linux', 'Kubernetes', 'Go', 'Networking', 'Observability'],
    experienceMin: 3,
    experienceMax: 6,
    daysAgo: 10,
  }),
  job({
    domain: 'cloudnine.example.com',
    title: 'Security Engineer — Cloud',
    team: 'Security',
    workFormat: 'Remote',
    location: 'Hyderabad, Telangana',
    type: 'Full-time',
    salaryRange: '₹22–36 LPA',
    shortDescription:
      'Harden multi-cloud environments for regulated clients — zero-trust access, detection engineering and compliance automation.',
    intro: [
      'Security at CloudNine is an engineering discipline, not a checklist. You will build guardrails that let hundreds of engineers move fast safely across banking-grade environments.',
    ],
    aboutRole: [
      { title: 'Zero-trust architecture', description: 'Design identity-first access controls across clusters and clouds.' },
      { title: 'Detection engineering', description: 'Build detections and response automation for cloud-native threats.' },
      { title: 'Compliance as code', description: 'Automate evidence collection for SOC2, ISO 27001 and RBI audits.' },
    ],
    requiredQualifications: [
      '4+ years in security engineering with cloud focus',
      'Hands-on with AWS/GCP security services and Kubernetes security',
      'Coding ability in Python or Go',
      'Understanding of common attack paths in cloud environments',
    ],
    preferredQualifications: ['OSCP/CKS or equivalent', 'Experience with regulated industries'],
    perks: ['Fully remote', 'Security-conference budget', 'ESOPs', 'Premium health cover'],
    skills: ['Cloud Security', 'Kubernetes', 'Python', 'Zero Trust', 'Detection Engineering'],
    experienceMin: 4,
    experienceMax: 8,
    daysAgo: 6,
  }),

  // ---- DataQuark Analytics (3) ----
  job({
    domain: 'dataquark.example.com',
    title: 'Data Scientist — ML Platforms',
    team: 'Data Science',
    workFormat: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    type: 'Full-time',
    salaryRange: '₹20–34 LPA',
    shortDescription:
      'Build and productionise ML models for ranking, prediction and personalisation used by 300+ enterprise customers.',
    intro: [
      'DataQuark’s ML platform powers decision-intelligence for enterprises worldwide. Our data scientists own the full lifecycle: problem framing, modelling, deployment and measurement.',
    ],
    aboutRole: [
      { title: 'Model development', description: 'Design ML solutions for forecasting, ranking and anomaly detection problems.' },
      { title: 'Production ML', description: 'Ship models to production with engineering partners; monitor drift and impact.' },
      { title: 'Experimentation', description: 'Design A/B tests and communicate results to product leadership.' },
    ],
    requiredQualifications: [
      '2+ years of applied ML experience in production settings',
      'Strong Python, SQL and statistics foundations',
      'Experience with scikit-learn, XGBoost or deep-learning frameworks',
      'Clear communication of technical results to business audiences',
    ],
    preferredQualifications: ['LLM fine-tuning or RAG system experience', 'Publications or Kaggle achievements'],
    perks: ['GPU cluster access', 'Conference and paper budgets', 'Hybrid working', 'ESOPs'],
    skills: ['Python', 'Machine Learning', 'SQL', 'PyTorch', 'Statistics'],
    experienceMin: 2,
    experienceMax: 5,
    daysAgo: 2,
  }),
  job({
    domain: 'dataquark.example.com',
    title: 'Analytics Engineer',
    team: 'Data Science',
    workFormat: 'Remote',
    location: 'Bengaluru, Karnataka',
    type: 'Full-time',
    salaryRange: '₹14–24 LPA',
    shortDescription:
      'Own the transformation layer — dbt models, semantic layers and data quality for the analytics stack enterprises rely on.',
    intro: [
      'Sit at the junction of data engineering and analytics: you will turn raw event streams into trusted, documented, tested datasets that every team builds on.',
    ],
    aboutRole: [
      { title: 'Transformation layer', description: 'Design and maintain dbt models with rigorous testing and documentation.' },
      { title: 'Data quality', description: 'Build freshness, completeness and anomaly checks into the pipeline.' },
    ],
    requiredQualifications: [
      '2+ years in analytics/data engineering',
      'Expert SQL and hands-on dbt experience',
      'Experience with a cloud warehouse (BigQuery/Snowflake/Redshift)',
      'Python proficiency for tooling and orchestration',
    ],
    preferredQualifications: ['Airflow/Dagster experience', 'BI tool administration (Looker/Metabase)'],
    perks: ['Fully remote', 'Home-office budget', 'Learning stipend', 'Health insurance'],
    skills: ['SQL', 'dbt', 'BigQuery', 'Python', 'Airflow'],
    experienceMin: 2,
    experienceMax: 5,
    daysAgo: 12,
  }),
  job({
    domain: 'dataquark.example.com',
    title: 'Machine Learning Engineer — LLM Applications',
    team: 'AI Engineering',
    workFormat: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    type: 'Full-time',
    salaryRange: '₹30–50 LPA',
    shortDescription:
      'Build production LLM systems — retrieval pipelines, evaluation harnesses and agentic workflows for enterprise decision tools.',
    intro: [
      'Our LLM team ships AI features that enterprises actually trust: grounded answers, measurable quality, predictable costs. You will engineer the systems around the models — retrieval, evals, guardrails and serving.',
    ],
    aboutRole: [
      { title: 'RAG systems', description: 'Design retrieval pipelines over massive enterprise corpora with strict grounding requirements.' },
      { title: 'Evaluation', description: 'Build automated eval harnesses that gate every prompt and model change.' },
      { title: 'Serving & cost', description: 'Optimise latency and token economics across model providers.' },
    ],
    requiredQualifications: [
      '3+ years of ML or backend engineering experience',
      'Hands-on experience shipping LLM-backed features to production',
      'Strong Python and API design skills',
      'Familiarity with vector databases and embedding pipelines',
    ],
    preferredQualifications: ['Experience with agent frameworks or tool-use systems', 'Distributed systems background'],
    perks: ['Top-of-market pay', 'GPU/compute budget', 'ESOPs', 'Hybrid flexibility'],
    skills: ['Python', 'LLMs', 'RAG', 'Vector Databases', 'MLOps'],
    experienceMin: 3,
    experienceMax: 7,
    daysAgo: 1,
  }),

  // ---- FinEdge Capital (3) ----
  job({
    domain: 'finedge.example.com',
    title: 'Full Stack Engineer',
    team: 'Engineering',
    workFormat: 'Hybrid',
    location: 'Mumbai, Maharashtra',
    type: 'Full-time',
    salaryRange: '₹16–28 LPA',
    shortDescription:
      'Ship lending and wealth products end-to-end for 20M+ users — React, Node.js and a bias for ownership.',
    intro: [
      'FinEdge engineering moves fast with high standards: feature squads own their metrics, deploy daily and talk to customers. You will build products that move real money for real people.',
    ],
    aboutRole: [
      { title: 'Full-stack delivery', description: 'Build features across React frontends and Node.js services.' },
      { title: 'Fintech rigour', description: 'Write code that handles money: idempotent, audited, thoroughly tested.' },
      { title: 'Product partnership', description: 'Work directly with PMs and designers in a 6-person squad.' },
    ],
    requiredQualifications: [
      '2+ years of full-stack development experience',
      'Strong JavaScript/TypeScript with React and Node.js',
      'Experience with SQL databases and REST API design',
      'Understanding of testing and CI/CD practices',
    ],
    preferredQualifications: ['Fintech or payments background', 'AWS experience'],
    perks: ['ESOPs', 'Health insurance for family', 'Hybrid 3-day office', 'Annual offsite'],
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    experienceMin: 2,
    experienceMax: 5,
    daysAgo: 7,
  }),
  job({
    domain: 'finedge.example.com',
    title: 'Product Manager — Lending',
    team: 'Product',
    workFormat: 'On-site',
    location: 'Mumbai, Maharashtra',
    type: 'Full-time',
    salaryRange: '₹28–45 LPA',
    shortDescription:
      'Own the digital-lending roadmap: underwriting UX, disbursal funnels and collections for millions of borrowers.',
    intro: [
      'Lending is FinEdge’s largest business. As PM you will own outcomes across the borrower journey — from application to disbursal to repayment — working with credit, risk, engineering and design.',
    ],
    aboutRole: [
      { title: 'Roadmap ownership', description: 'Define strategy and quarterly outcomes for the lending funnel.' },
      { title: 'Data-driven iteration', description: 'Instrument funnels, run experiments and move approval/NPS metrics.' },
      { title: 'Cross-functional leadership', description: 'Align credit policy, compliance and engineering around shipping.' },
    ],
    requiredQualifications: [
      '4+ years of product management experience',
      'Track record of shipping consumer products at scale',
      'Strong analytical skills (SQL comfort preferred)',
      'Excellent written and verbal communication',
    ],
    preferredQualifications: ['Lending/fintech domain expertise', 'MBA from a top institute'],
    perks: ['ESOPs', 'Performance bonus', 'Health insurance', 'Commuter benefits'],
    skills: ['Product Strategy', 'Analytics', 'A/B Testing', 'SQL', 'Stakeholder Management'],
    experienceMin: 4,
    experienceMax: 8,
    daysAgo: 9,
  }),
  job({
    domain: 'finedge.example.com',
    title: 'Risk Analyst',
    team: 'Risk & Credit',
    workFormat: 'On-site',
    location: 'Mumbai, Maharashtra',
    type: 'Full-time',
    salaryRange: '₹10–18 LPA',
    shortDescription:
      'Monitor portfolio health, build risk dashboards and sharpen underwriting rules for a 20M-user lending book.',
    intro: [
      'The risk team is the backbone of responsible lending at FinEdge. You will live in the data: cohort analyses, early-warning indicators and policy experiments.',
    ],
    aboutRole: [
      { title: 'Portfolio monitoring', description: 'Track delinquency cohorts and flag emerging risk patterns early.' },
      { title: 'Policy analytics', description: 'Design and evaluate underwriting rule changes with A/B rigour.' },
    ],
    requiredQualifications: [
      '1–3 years in risk, analytics or credit roles',
      'Strong SQL and Excel; Python a plus',
      'Statistical intuition for cohort and funnel analysis',
    ],
    preferredQualifications: ['Experience with bureau data (CIBIL etc.)'],
    perks: ['Health insurance', 'Performance bonus', 'Learning budget'],
    skills: ['SQL', 'Excel', 'Python', 'Risk Analytics', 'Statistics'],
    experienceMin: 1,
    experienceMax: 3,
    daysAgo: 14,
  }),

  // ---- MediCare Plus (2) ----
  job({
    domain: 'medicareplus.example.com',
    title: 'Mobile Developer (React Native)',
    team: 'Engineering',
    workFormat: 'Hybrid',
    location: 'Gurugram, Haryana',
    type: 'Full-time',
    salaryRange: '₹14–24 LPA',
    shortDescription:
      'Build the telemedicine app used by thousands of doctors daily — video consults, e-prescriptions and offline-first records.',
    intro: [
      'MediCare Plus connects 5,000+ clinics with patients across India. Our mobile app is the clinic in your pocket: consultations, records, payments. You will ship features that directly improve healthcare access.',
    ],
    aboutRole: [
      { title: 'Cross-platform features', description: 'Build React Native features across iOS and Android with native modules where needed.' },
      { title: 'Reliability in the field', description: 'Engineer offline-first flows for low-connectivity clinics.' },
      { title: 'Quality', description: 'Own crash-free rates, startup time and release health.' },
    ],
    requiredQualifications: [
      '2+ years of React Native development',
      'Strong TypeScript and mobile architecture fundamentals',
      'Experience with offline storage and push notifications',
      'App Store / Play Store release experience',
    ],
    preferredQualifications: ['WebRTC or video-calling experience', 'Healthcare domain interest'],
    perks: ['Health insurance (obviously good)', 'Hybrid schedule', 'ESOPs', 'Device budget'],
    skills: ['React Native', 'TypeScript', 'iOS', 'Android', 'WebRTC'],
    experienceMin: 2,
    experienceMax: 5,
    daysAgo: 4,
  }),
  job({
    domain: 'medicareplus.example.com',
    title: 'Customer Success Manager — Clinics',
    team: 'Customer Success',
    workFormat: 'On-site',
    location: 'Gurugram, Haryana',
    type: 'Full-time',
    salaryRange: '₹8–14 LPA',
    shortDescription:
      'Onboard and grow a portfolio of clinic partners — training, adoption, renewals and being the voice of the doctor.',
    intro: [
      'Our clinic partners are busy doctors, not tech enthusiasts. You will make our platform effortless for them: onboarding, training staff, resolving issues and expanding usage.',
    ],
    aboutRole: [
      { title: 'Portfolio ownership', description: 'Manage onboarding, adoption and renewals for 60–80 clinic accounts.' },
      { title: 'Voice of customer', description: 'Channel structured feedback into the product roadmap.' },
    ],
    requiredQualifications: [
      '2+ years in customer success or account management',
      'Excellent Hindi and English communication',
      'Comfort with CRM tools and adoption metrics',
    ],
    preferredQualifications: ['Healthcare or SaaS background'],
    perks: ['Health insurance', 'Travel allowance', 'Performance incentives'],
    skills: ['Customer Success', 'CRM', 'Onboarding', 'Communication', 'SaaS'],
    experienceMin: 2,
    experienceMax: 5,
    daysAgo: 11,
  }),

  // ---- ShopKart (3) ----
  job({
    domain: 'shopkart.example.com',
    title: 'SDE II — Supply Chain Systems',
    team: 'Engineering',
    workFormat: 'On-site',
    location: 'Bengaluru, Karnataka',
    type: 'Full-time',
    salaryRange: '₹24–40 LPA',
    shortDescription:
      'Engineer the logistics brain behind 100M+ deliveries — routing, warehouse orchestration and real-time tracking at scale.',
    intro: [
      'ShopKart’s supply chain platform decides how every package moves across 500 cities. The problems are hard: real-time optimisation, massive throughput, five-nines reliability during sale events.',
    ],
    aboutRole: [
      { title: 'Distributed systems', description: 'Design services that survive Big Billion-scale traffic spikes.' },
      { title: 'Optimisation', description: 'Build routing and slotting algorithms with measurable cost impact.' },
      { title: 'Operational excellence', description: 'Own services in production with strong observability.' },
    ],
    requiredQualifications: [
      '3+ years building distributed backend systems',
      'Strong CS fundamentals: data structures, concurrency, system design',
      'Proficiency in Java, Go or similar',
      'Experience with high-throughput messaging and caching',
    ],
    preferredQualifications: ['Logistics/marketplace domain experience'],
    perks: ['ESOPs', 'Relocation support', 'Health insurance for family', 'Sale-season bonuses'],
    skills: ['Java', 'Distributed Systems', 'Kafka', 'Redis', 'System Design'],
    experienceMin: 3,
    experienceMax: 6,
    daysAgo: 3,
  }),
  job({
    domain: 'shopkart.example.com',
    title: 'Growth Marketing Manager',
    team: 'Marketing',
    workFormat: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    type: 'Full-time',
    salaryRange: '₹18–30 LPA',
    shortDescription:
      'Own paid and lifecycle growth for a 100M-customer marketplace — budgets, funnels and creative experimentation at scale.',
    intro: [
      'Growth at ShopKart is a quantitative sport: crores in monthly spend, dozens of experiments live at once, and clear revenue accountability.',
    ],
    aboutRole: [
      { title: 'Performance marketing', description: 'Own ROAS across Google, Meta and affiliate channels.' },
      { title: 'Lifecycle', description: 'Build CRM journeys that drive repeat purchase and category adoption.' },
    ],
    requiredQualifications: [
      '4+ years in growth/performance marketing',
      'Proven management of large ad budgets with ROAS accountability',
      'Strong analytics: GA4, SQL comfort, incrementality thinking',
    ],
    preferredQualifications: ['Marketplace or consumer-app experience'],
    perks: ['Performance bonus', 'ESOPs', 'Hybrid working', 'Health insurance'],
    skills: ['Google Ads', 'Meta Ads', 'GA4', 'CRM', 'SQL'],
    experienceMin: 4,
    experienceMax: 8,
    daysAgo: 6,
  }),
  job({
    domain: 'shopkart.example.com',
    title: 'Data Analyst — Category Insights',
    team: 'Analytics',
    workFormat: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    type: 'Full-time',
    salaryRange: '₹9–16 LPA',
    shortDescription:
      'Drive pricing, assortment and demand decisions for top categories with sharp dashboards and sharper questions.',
    intro: [
      'Category analytics sits with the business: your numbers directly set prices, pick assortments and plan sale events for categories worth hundreds of crores.',
    ],
    aboutRole: [
      { title: 'Business partnering', description: 'Answer the why behind category performance with rigorous analysis.' },
      { title: 'Self-serve analytics', description: 'Build dashboards business teams actually use daily.' },
    ],
    requiredQualifications: [
      '1–3 years in analytics roles',
      'Expert SQL and dashboarding (Tableau/Power BI/Looker)',
      'Structured problem solving and crisp communication',
    ],
    preferredQualifications: ['Python for analysis', 'E-commerce experience'],
    perks: ['Health insurance', 'Learning budget', 'Hybrid working'],
    skills: ['SQL', 'Tableau', 'Excel', 'Python', 'E-commerce Analytics'],
    experienceMin: 1,
    experienceMax: 3,
    daysAgo: 13,
  }),

  // ---- ZestPay (2) ----
  job({
    domain: 'zestpay.example.com',
    title: 'Backend Engineer — Payments',
    team: 'Engineering',
    workFormat: 'Hybrid',
    location: 'Noida, Uttar Pradesh',
    type: 'Full-time',
    salaryRange: '₹20–35 LPA',
    shortDescription:
      'Build UPI and card rails processing billions of transactions monthly — correctness, latency and audit-grade reliability.',
    intro: [
      'ZestPay moves money for the Indian internet. Payment engineering here means hard guarantees: exactly-once semantics, sub-second latency, zero tolerance for ledger drift.',
    ],
    aboutRole: [
      { title: 'Payment rails', description: 'Design and operate UPI/card transaction flows with bank-grade reliability.' },
      { title: 'Ledger correctness', description: 'Build reconciliation and double-entry systems that never lose a paisa.' },
      { title: 'Scale events', description: 'Engineer for 10x traffic spikes during festive peaks.' },
    ],
    requiredQualifications: [
      '3+ years of backend engineering in high-throughput systems',
      'Strong grasp of transactions, idempotency and distributed consistency',
      'Proficiency in Java, Go or Kotlin',
      'Production experience with SQL databases under load',
    ],
    preferredQualifications: ['Payments/UPI domain experience', 'NPCI integration exposure'],
    perks: ['ESOPs', 'Top-tier health cover', 'Hybrid working', 'Festive bonuses'],
    skills: ['Java', 'Go', 'UPI', 'PostgreSQL', 'Distributed Systems'],
    experienceMin: 3,
    experienceMax: 7,
    daysAgo: 5,
  }),
  job({
    domain: 'zestpay.example.com',
    title: 'QA Automation Engineer',
    team: 'Engineering',
    workFormat: 'On-site',
    location: 'Noida, Uttar Pradesh',
    type: 'Full-time',
    salaryRange: '₹10–18 LPA',
    shortDescription:
      'Make payment releases boring: build automation that catches money bugs before they ship.',
    intro: [
      'In payments, a missed bug is someone’s money. Our QA guild builds the automation, simulators and chaos suites that let us deploy daily with confidence.',
    ],
    aboutRole: [
      { title: 'Automation frameworks', description: 'Build API and E2E suites covering UPI, cards and settlement flows.' },
      { title: 'Payment simulators', description: 'Maintain bank/NPCI simulators for deterministic testing.' },
    ],
    requiredQualifications: [
      '2+ years in test automation',
      'Strong programming in Java, Python or JavaScript',
      'REST API testing expertise (Postman/Rest-Assured/Playwright)',
      'CI/CD integration experience',
    ],
    preferredQualifications: ['Fintech/payments testing background'],
    perks: ['Health insurance', 'On-site meals', 'Learning budget'],
    skills: ['Playwright', 'API Testing', 'Java', 'CI/CD', 'Test Automation'],
    experienceMin: 2,
    experienceMax: 5,
    daysAgo: 15,
  }),

  // ---- BrightHire Solutions (2) ----
  job({
    domain: 'brighthire.example.com',
    title: 'Frontend Developer',
    team: 'Engineering',
    workFormat: 'Remote',
    location: 'Chennai, Tamil Nadu',
    type: 'Full-time',
    salaryRange: '₹12–20 LPA',
    shortDescription:
      'Build the recruiter experience for 1,200+ organisations — complex dashboards, assessments and real-time interview tools.',
    intro: [
      'BrightHire’s ATS is where recruiters live all day. Great frontend engineering here means dense information, zero friction and interfaces that feel instant. Fully remote team with strong async culture.',
    ],
    aboutRole: [
      { title: 'Product UI', description: 'Build data-heavy dashboards and pipeline views in React + TypeScript.' },
      { title: 'Real-time features', description: 'Ship collaborative interview and assessment experiences.' },
    ],
    requiredQualifications: [
      '2+ years of React development experience',
      'Solid TypeScript and state-management skills',
      'Experience with data-heavy UIs (tables, filters, virtualisation)',
      'Good written communication for async remote work',
    ],
    preferredQualifications: ['WebSocket/real-time experience', 'Design-system contributions'],
    perks: ['Fully remote forever', 'Home-office setup budget', 'Health insurance', 'Async-first culture'],
    skills: ['React', 'TypeScript', 'Redux', 'WebSockets', 'Tailwind CSS'],
    experienceMin: 2,
    experienceMax: 5,
    daysAgo: 2,
  }),
  job({
    domain: 'brighthire.example.com',
    title: 'Sales Development Representative',
    team: 'Sales',
    workFormat: 'Remote',
    location: 'Chennai, Tamil Nadu',
    type: 'Full-time',
    salaryRange: '₹6–10 LPA + incentives',
    shortDescription:
      'Open doors for an AI recruitment platform — outbound prospecting to HR leaders with generous, uncapped incentives.',
    intro: [
      'You will be the first conversation HR leaders have with BrightHire. Strong SDRs here move to closing roles within 18 months.',
    ],
    aboutRole: [
      { title: 'Outbound prospecting', description: 'Research, reach out and qualify HR decision-makers across India and SEA.' },
      { title: 'Pipeline discipline', description: 'Keep CRM hygiene and hit weekly meeting-booked targets.' },
    ],
    requiredQualifications: [
      '0–2 years in sales or business development',
      'Excellent spoken and written English',
      'Resilience, curiosity and coachability',
    ],
    preferredQualifications: ['SaaS sales exposure', 'HR-tech familiarity'],
    perks: ['Uncapped incentives', 'Fully remote', 'Clear promotion path', 'Health insurance'],
    skills: ['B2B Sales', 'Cold Outreach', 'CRM', 'Communication', 'Lead Generation'],
    experienceMin: 0,
    experienceMax: 2,
    daysAgo: 8,
  }),

  // ---- EduSpark Learning (2) ----
  job({
    domain: 'eduspark.example.com',
    title: 'Content Strategist — Upskilling Programs',
    team: 'Content',
    workFormat: 'Hybrid',
    location: 'New Delhi, Delhi',
    type: 'Full-time',
    salaryRange: '₹8–14 LPA',
    shortDescription:
      'Design curriculum and content journeys for tech upskilling programs reaching 10M+ learners.',
    intro: [
      'EduSpark’s upskilling programs change careers. As content strategist you will own what 10M+ learners actually study: curriculum design, instructor collaboration and learning outcomes.',
    ],
    aboutRole: [
      { title: 'Curriculum design', description: 'Structure programs in data, tech and business skills with measurable outcomes.' },
      { title: 'Instructor partnership', description: 'Work with industry experts to produce world-class course content.' },
    ],
    requiredQualifications: [
      '2+ years in content strategy, instructional design or ed-tech',
      'Exceptional written English and structured thinking',
      'Ability to simplify technical topics for beginners',
    ],
    preferredQualifications: ['Familiarity with tech/data subjects', 'Video-content production experience'],
    perks: ['Free access to all programs', 'Hybrid working', 'Health insurance', 'Book budget'],
    skills: ['Instructional Design', 'Content Strategy', 'Curriculum Development', 'EdTech', 'Writing'],
    experienceMin: 2,
    experienceMax: 5,
    daysAgo: 10,
  }),
  job({
    domain: 'eduspark.example.com',
    title: 'Senior Node.js Developer',
    team: 'Engineering',
    workFormat: 'Hybrid',
    location: 'New Delhi, Delhi',
    type: 'Full-time',
    salaryRange: '₹22–36 LPA',
    shortDescription:
      'Scale the live-classes platform serving 100k concurrent learners — streaming, chat, quizzes and payments.',
    intro: [
      'When a celebrity instructor goes live, 100k learners join in minutes. You will build the backend that makes that moment flawless: real-time systems, autoscaling and graceful degradation.',
    ],
    aboutRole: [
      { title: 'Real-time backend', description: 'Own live-class services: signalling, chat, presence and quiz engines.' },
      { title: 'Scale engineering', description: 'Design for 10x spikes with autoscaling and load-shedding strategies.' },
      { title: 'Technical leadership', description: 'Set standards, review designs and mentor a team of six.' },
    ],
    requiredQualifications: [
      '4+ years of Node.js backend development',
      'Production experience with WebSockets and real-time systems',
      'Strong database skills (MongoDB/PostgreSQL) and Redis',
      'Experience leading projects or mentoring engineers',
    ],
    preferredQualifications: ['Media-streaming exposure (HLS/WebRTC)', 'EdTech domain interest'],
    perks: ['ESOPs', 'Health insurance for family', 'Hybrid working', 'Free programs for family'],
    skills: ['Node.js', 'WebSockets', 'MongoDB', 'Redis', 'AWS'],
    experienceMin: 4,
    experienceMax: 8,
    daysAgo: 7,
  }),
];

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------
async function seed() {
  const db = initAdmin();
  const now = Date.now();

  console.log(`Seeding ${COMPANIES.length} companyProfiles + ${JOBS.length} jobPostings…`);

  let batch = db.batch();
  let ops = 0;
  const commit = async () => {
    if (ops > 0) {
      await batch.commit();
      batch = db.batch();
      ops = 0;
    }
  };

  for (const c of COMPANIES) {
    // don't clobber a real profile if one already exists for this domain
    const existing = await db.collection('companyProfiles').where('websiteUrl', '==', c.domain).limit(1).get();
    if (!existing.empty) {
      console.log(`  companyProfiles: "${c.name}" already exists, skipping`);
      continue;
    }
    const ref = db.collection('companyProfiles').doc();
    batch.set(ref, {
      id: ref.id,
      name: c.name,
      tagline: c.tagline,
      description: c.description,
      founded: c.founded,
      headquarters: { city: c.city, country: c.country },
      employees: { range: c.employeesRange },
      websiteUrl: c.domain,
      website: `https://${c.domain}`,
      status: 'active',
      industryTags: c.industryTags,
      metadata: { dataSource: SEED_MARKER, lastUpdated: new Date(now).toISOString() },
      seededBy: SEED_MARKER,
    });
    ops++;
  }
  await commit();

  const companyByDomain = new Map(COMPANIES.map((c) => [c.domain, c]));
  for (const j of JOBS) {
    const ref = db.collection('jobPostings').doc();
    const publishedAt = new Date(now - j.daysAgo * 24 * 60 * 60 * 1000).toISOString();
    batch.set(ref, {
      // ---- exact shape jobs.controller.ts createJob() writes ----
      id: ref.id,
      domain: j.domain,
      companyName: companyByDomain.get(j.domain)?.name ?? null,
      title: j.title,
      team: j.team,
      workFormat: j.workFormat,
      location: j.location,
      country: 'India',
      type: j.type,
      salaryRange: j.salaryRange,
      shortDescription: j.shortDescription,
      intro: j.intro,
      aboutRole: j.aboutRole,
      requiredQualifications: j.requiredQualifications,
      preferredQualifications: j.preferredQualifications,
      perks: j.perks,
      applyEmail: `careers@${j.domain}`,
      status: 'published',
      verifiedPost: true,
      publishedAt,
      closedAt: null,
      pendingChanges: null,
      rejectedReason: null,
      createdBy: { userId: 'portal-seed', email: 'seed@amrut.ai', tenantId: 'portal-seed' },
      approvedBy: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      // ---- portal-only extras (ignored by amrut.ai careers serializer) ----
      skills: j.skills,
      experienceMin: j.experienceMin,
      experienceMax: j.experienceMax,
      applicantsCount: 0,
      seededBy: SEED_MARKER,
    });
    ops++;
    if (ops >= 400) await commit();
  }
  await commit();

  console.log('✅ Seed complete.');
  await list();
}

async function remove() {
  const db = initAdmin();
  for (const col of ['jobPostings', 'companyProfiles']) {
    const snap = await db.collection(col).where('seededBy', '==', SEED_MARKER).get();
    if (snap.empty) {
      console.log(`${col}: nothing seeded, nothing to remove`);
      continue;
    }
    const batch = db.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    console.log(`${col}: removed ${snap.size} seeded docs`);
  }
  console.log('✅ Removal complete.');
}

async function list() {
  const db = initAdmin();
  for (const col of ['jobPostings', 'companyProfiles']) {
    const [seeded, all] = await Promise.all([
      db.collection(col).where('seededBy', '==', SEED_MARKER).count().get(),
      db.collection(col).count().get(),
    ]);
    console.log(`${col}: ${seeded.data().count} seeded / ${all.data().count} total`);
  }
}

const cmd = process.argv[2];
const run = cmd === 'seed' ? seed : cmd === 'remove' ? remove : cmd === 'list' ? list : null;
if (!run) {
  console.error('Usage: tsx scripts/seed-firestore.ts <seed|remove|list>');
  process.exit(1);
}
run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Failed:', e.message);
    process.exit(1);
  });
