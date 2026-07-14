import { Job, JobType, WorkMode } from '../types';
import { companies } from './companies';

/**
 * Dummy job data. Jobs are generated deterministically from role templates
 * combined with companies, so we get a large realistic catalogue without
 * hand-writing every entry. Later this whole file gets replaced by Firebase.
 */

interface RoleTemplate {
  title: string;
  category: string;
  skills: string[];
  expBands: Array<[number, number]>; // [min, max] years
  salaryPerExp: [number, number]; // base LPA at 0 exp, increment per year
  summary: string;
  responsibilities: string[];
  requirements: string[];
}

const templates: RoleTemplate[] = [
  {
    title: 'Frontend Developer',
    category: 'Engineering',
    skills: ['React', 'TypeScript', 'Next.js', 'Redux', 'Tailwind CSS'],
    expBands: [
      [0, 2],
      [2, 5],
      [5, 8],
    ],
    salaryPerExp: [5, 4],
    summary:
      'build pixel-perfect, high-performance web applications used by millions of users. You will own features end-to-end, from design handoff to production monitoring.',
    responsibilities: [
      'Build responsive, accessible UI components with React and TypeScript',
      'Collaborate with designers and product managers to ship features end-to-end',
      'Optimise web performance — Core Web Vitals, bundle size and rendering',
      'Write unit and integration tests and participate in code reviews',
      'Mentor junior engineers and contribute to the design system',
    ],
    requirements: [
      'Strong fundamentals in JavaScript, HTML and CSS',
      'Hands-on experience with React and modern state management (Redux/RTK)',
      'Experience with TypeScript and component-driven development',
      'Understanding of REST APIs, caching and browser performance',
      'Good communication skills and a product mindset',
    ],
  },
  {
    title: 'Backend Developer',
    category: 'Engineering',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'AWS'],
    expBands: [
      [1, 3],
      [3, 6],
      [6, 10],
    ],
    salaryPerExp: [6, 4.5],
    summary:
      'design and scale backend services that handle millions of requests per day. You will work on APIs, data models, queues and distributed systems.',
    responsibilities: [
      'Design and build RESTful and event-driven microservices',
      'Model data and optimise queries for high-throughput workloads',
      'Own reliability — monitoring, alerting and incident response',
      'Write clean, well-tested code and drive architectural decisions',
      'Collaborate with frontend, data and DevOps teams',
    ],
    requirements: [
      'Strong experience with Node.js/Express or similar backend frameworks',
      'Solid understanding of SQL and NoSQL databases',
      'Experience with message queues, caching and API design',
      'Familiarity with cloud platforms (AWS/GCP) and CI/CD',
      'Strong debugging and problem-solving skills',
    ],
  },
  {
    title: 'Full Stack Engineer',
    category: 'Engineering',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker'],
    expBands: [
      [2, 4],
      [4, 8],
    ],
    salaryPerExp: [8, 5],
    summary:
      'work across the entire stack — from database schemas to polished UIs — shipping complete product features with a small, fast-moving team.',
    responsibilities: [
      'Ship features across frontend, backend and infrastructure',
      'Translate product requirements into technical designs',
      'Maintain high code quality with tests and reviews',
      'Debug production issues across the stack',
      'Contribute to platform and tooling improvements',
    ],
    requirements: [
      'Experience building full-stack applications with React and Node.js',
      'Comfort with relational and document databases',
      'Experience with Docker and cloud deployments',
      'Ability to work independently in ambiguous environments',
      'Startup or product-company experience is a plus',
    ],
  },
  {
    title: 'Data Scientist',
    category: 'Data Science',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'],
    expBands: [
      [1, 3],
      [3, 6],
    ],
    salaryPerExp: [9, 5],
    summary:
      'turn data into product impact. You will build ML models for ranking, prediction and personalisation, and take them all the way to production.',
    responsibilities: [
      'Build and deploy ML models for core product problems',
      'Design experiments and analyse A/B test results',
      'Partner with engineering to productionise models',
      'Communicate insights to leadership with clear storytelling',
      'Stay current with the latest ML and LLM research',
    ],
    requirements: [
      'Strong foundation in statistics, ML algorithms and Python',
      'Experience with scikit-learn, TensorFlow or PyTorch',
      'Expert-level SQL and data-wrangling skills',
      'Experience deploying models to production',
      'Degree in CS, Statistics or a related quantitative field',
    ],
  },
  {
    title: 'Data Analyst',
    category: 'Data Science',
    skills: ['SQL', 'Power BI', 'Excel', 'Python', 'Data Visualization'],
    expBands: [
      [0, 2],
      [2, 5],
    ],
    salaryPerExp: [4.5, 3],
    summary:
      'own business reporting and insights. You will build dashboards, define metrics and answer the hardest "why" questions with data.',
    responsibilities: [
      'Build and maintain dashboards for business teams',
      'Write complex SQL to answer ad-hoc business questions',
      'Define and track KPIs across the funnel',
      'Automate recurring reports and data pipelines',
      'Present findings to stakeholders in a crisp, actionable format',
    ],
    requirements: [
      'Excellent SQL and spreadsheet skills',
      'Experience with BI tools like Power BI, Tableau or Looker',
      'Working knowledge of Python or R for analysis',
      'Strong attention to detail and business intuition',
      'Bachelor’s degree in any quantitative discipline',
    ],
  },
  {
    title: 'DevOps Engineer',
    category: 'Engineering',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD'],
    expBands: [
      [2, 5],
      [5, 9],
    ],
    salaryPerExp: [8, 5],
    summary:
      'build and operate the platform that engineering teams deploy to hundreds of times a day. Reliability, automation and developer experience are your world.',
    responsibilities: [
      'Manage Kubernetes clusters and cloud infrastructure as code',
      'Build CI/CD pipelines and internal developer tooling',
      'Drive observability — metrics, logging, tracing and SLOs',
      'Lead incident response and blameless postmortems',
      'Harden security posture across environments',
    ],
    requirements: [
      'Hands-on experience with Kubernetes, Docker and Terraform',
      'Strong scripting skills (Bash/Python/Go)',
      'Experience with AWS or GCP at production scale',
      'Deep understanding of networking and Linux internals',
      'On-call experience for high-availability systems',
    ],
  },
  {
    title: 'UI/UX Designer',
    category: 'Design',
    skills: ['Figma', 'Design Systems', 'Prototyping', 'User Research', 'Interaction Design'],
    expBands: [
      [1, 3],
      [3, 7],
    ],
    salaryPerExp: [5, 3.5],
    summary:
      'design intuitive, beautiful experiences across web and mobile. You will own flows from research and wireframes to polished, developer-ready specs.',
    responsibilities: [
      'Own end-to-end design for key product areas',
      'Conduct user research and usability testing',
      'Contribute to and evolve the design system',
      'Create high-fidelity prototypes for stakeholder reviews',
      'Partner closely with engineers during implementation',
    ],
    requirements: [
      'Strong portfolio demonstrating shipped product work',
      'Expertise in Figma and modern design workflows',
      'Understanding of accessibility and responsive design',
      'Ability to communicate design decisions clearly',
      '2+ years designing for consumer or SaaS products',
    ],
  },
  {
    title: 'Product Manager',
    category: 'Product',
    skills: ['Product Strategy', 'Roadmapping', 'Analytics', 'Stakeholder Management', 'Agile'],
    expBands: [
      [2, 5],
      [5, 9],
    ],
    salaryPerExp: [12, 6],
    summary:
      'own the roadmap for a high-impact product area. You will talk to users, define strategy, and work with design and engineering to ship things people love.',
    responsibilities: [
      'Define product vision, strategy and quarterly roadmap',
      'Gather and prioritise requirements from users and stakeholders',
      'Write clear PRDs and drive execution with engineering and design',
      'Measure outcomes with data and iterate quickly',
      'Present product updates to leadership',
    ],
    requirements: [
      'Track record of shipping successful products',
      'Strong analytical skills and comfort with data',
      'Excellent written and verbal communication',
      'Technical background or ability to work deeply with engineers',
      'MBA or equivalent experience is a plus',
    ],
  },
  {
    title: 'Digital Marketing Manager',
    category: 'Marketing',
    skills: ['SEO', 'Google Ads', 'Content Marketing', 'Social Media', 'Analytics'],
    expBands: [
      [2, 4],
      [4, 8],
    ],
    salaryPerExp: [6, 3.5],
    summary:
      'own growth across paid and organic channels. You will run campaigns, optimise funnels and scale acquisition efficiently.',
    responsibilities: [
      'Plan and execute multi-channel marketing campaigns',
      'Own SEO strategy and content calendar',
      'Manage performance-marketing budgets and ROAS',
      'Run experiments across landing pages and creatives',
      'Report on funnel metrics and growth KPIs',
    ],
    requirements: [
      'Proven experience running paid campaigns at scale',
      'Strong grasp of SEO, SEM and marketing analytics',
      'Experience with tools like GA4, Google Ads, Meta Ads',
      'Data-driven mindset with strong creative judgement',
      'Excellent copywriting skills',
    ],
  },
  {
    title: 'HR Business Partner',
    category: 'Human Resources',
    skills: ['Talent Management', 'Employee Relations', 'HR Analytics', 'Performance Management'],
    expBands: [[3, 7]],
    salaryPerExp: [7, 3],
    summary:
      'partner with business leaders on everything people — org design, performance, engagement and talent development.',
    responsibilities: [
      'Act as strategic advisor to business unit leaders',
      'Drive performance management and appraisal cycles',
      'Design engagement and retention programs',
      'Handle employee relations with empathy and fairness',
      'Use HR analytics to inform people decisions',
    ],
    requirements: [
      'Experience as an HRBP in a fast-growing company',
      'Strong knowledge of labour laws and HR best practices',
      'Excellent interpersonal and conflict-resolution skills',
      'Comfort with HRMS tools and people analytics',
      'MBA in HR or equivalent preferred',
    ],
  },
  {
    title: 'Sales Executive',
    category: 'Sales',
    skills: ['B2B Sales', 'CRM', 'Negotiation', 'Lead Generation', 'Communication'],
    expBands: [
      [0, 2],
      [2, 5],
    ],
    salaryPerExp: [4, 2.5],
    summary:
      'drive revenue by owning the full sales cycle — prospecting, demos, negotiation and closing — for our fast-growing product suite.',
    responsibilities: [
      'Generate and qualify leads through outbound and inbound channels',
      'Run product demos and manage the full sales pipeline',
      'Negotiate contracts and close deals against targets',
      'Maintain accurate records in CRM',
      'Build long-term relationships with key accounts',
    ],
    requirements: [
      'Excellent communication and persuasion skills',
      'Hunger to exceed targets in a fast-paced environment',
      'Experience with Salesforce/HubSpot is a plus',
      'Willingness to travel for client meetings',
      'Any graduate; MBA preferred for senior levels',
    ],
  },
  {
    title: 'Customer Success Manager',
    category: 'Operations',
    skills: ['Customer Relationship', 'SaaS', 'Onboarding', 'Retention', 'Communication'],
    expBands: [[1, 4]],
    salaryPerExp: [5, 3],
    summary:
      'ensure our customers achieve their goals with our platform. You will own onboarding, adoption, renewals and expansion for a portfolio of accounts.',
    responsibilities: [
      'Own onboarding and training for new customers',
      'Monitor account health and drive product adoption',
      'Manage renewals and identify expansion opportunities',
      'Be the voice of the customer to product teams',
      'Resolve escalations with urgency and empathy',
    ],
    requirements: [
      'Experience in customer success or account management',
      'Strong presentation and relationship-building skills',
      'Analytical mindset for tracking adoption metrics',
      'Experience with SaaS products preferred',
      'Fluent English; regional languages a bonus',
    ],
  },
  {
    title: 'Mobile Developer (React Native)',
    category: 'Engineering',
    skills: ['React Native', 'TypeScript', 'iOS', 'Android', 'Redux'],
    expBands: [
      [1, 3],
      [3, 6],
    ],
    salaryPerExp: [7, 4.5],
    summary:
      'build and ship our mobile apps used by millions daily. You will own features from concept to App Store release across iOS and Android.',
    responsibilities: [
      'Develop cross-platform features with React Native',
      'Optimise app performance, startup time and bundle size',
      'Integrate native modules where needed',
      'Own release cycles and crash-free metrics',
      'Work with designers for smooth, native-feeling UX',
    ],
    requirements: [
      'Strong experience with React Native and TypeScript',
      'Understanding of native iOS/Android build systems',
      'Experience with offline storage and push notifications',
      'Familiarity with app-store release processes',
      'Attention to detail in animations and gestures',
    ],
  },
  {
    title: 'QA Automation Engineer',
    category: 'Engineering',
    skills: ['Selenium', 'Playwright', 'API Testing', 'JavaScript', 'CI/CD'],
    expBands: [[1, 4]],
    salaryPerExp: [5, 3.5],
    summary:
      'own quality across our products. You will build automation frameworks, write E2E suites and make releases boring (in a good way).',
    responsibilities: [
      'Design and maintain E2E and API automation suites',
      'Integrate tests into CI/CD pipelines',
      'Define test strategy with developers and PMs',
      'Track and triage bugs through to resolution',
      'Champion quality culture across teams',
    ],
    requirements: [
      'Experience with Playwright, Cypress or Selenium',
      'Strong programming skills in JavaScript or Python',
      'Experience testing REST APIs and mobile apps',
      'Understanding of CI/CD and test reporting',
      'ISTQB certification is a plus',
    ],
  },
  {
    title: 'Content Writer',
    category: 'Marketing',
    skills: ['Content Writing', 'SEO Writing', 'Copywriting', 'Research', 'Editing'],
    expBands: [[0, 3]],
    salaryPerExp: [3.5, 2],
    summary:
      'create content that educates, ranks and converts — blogs, landing pages, product copy and social content for a brand read by millions.',
    responsibilities: [
      'Write long-form blogs, guides and landing-page copy',
      'Optimise content for SEO and readability',
      'Collaborate with design for visual storytelling',
      'Maintain brand voice across channels',
      'Repurpose content for social and email',
    ],
    requirements: [
      'Exceptional written English with a strong portfolio',
      'Understanding of SEO fundamentals',
      'Ability to simplify complex topics',
      'Comfort with deadlines and feedback loops',
      'Bonus: experience in tech or B2B content',
    ],
  },
  {
    title: 'Financial Analyst',
    category: 'Finance',
    skills: ['Financial Modelling', 'Excel', 'Budgeting', 'Forecasting', 'SQL'],
    expBands: [[1, 4]],
    salaryPerExp: [6, 3.5],
    summary:
      'drive financial planning and analysis. You will build models, track budgets and give leadership the numbers they need to make big calls.',
    responsibilities: [
      'Build and maintain financial models and forecasts',
      'Prepare monthly MIS and variance analysis',
      'Support annual budgeting and quarterly reviews',
      'Analyse unit economics across business lines',
      'Automate reporting with SQL and BI tools',
    ],
    requirements: [
      'Strong financial modelling and Excel skills',
      'Understanding of P&L, cash flow and unit economics',
      'CA/CFA/MBA-Finance or equivalent experience',
      'Comfort working with large datasets',
      'Clear communication of financial insights',
    ],
  },
];

// which companies host which template (spread roles across companies realistically)
const locations = [
  'Bengaluru, Karnataka',
  'Mumbai, Maharashtra',
  'Hyderabad, Telangana',
  'Pune, Maharashtra',
  'Delhi NCR',
  'Chennai, Tamil Nadu',
  'Gurugram, Haryana',
  'Noida, Uttar Pradesh',
];

const workModes: WorkMode[] = ['On-site', 'Hybrid', 'Remote'];
const jobTypes: JobType[] = ['Full-time', 'Full-time', 'Full-time', 'Contract', 'Internship'];

const seniority = (min: number): string => {
  if (min >= 5) return 'Senior ';
  if (min <= 0) return 'Junior ';
  return '';
};

function buildJobs(): Job[] {
  const jobs: Job[] = [];
  let id = 1;

  templates.forEach((tpl, t) => {
    tpl.expBands.forEach((band, b) => {
      // rotate companies deterministically so every template lands on different companies
      const companyCount = 3;
      for (let k = 0; k < companyCount; k++) {
        const company = companies[(t * 4 + b * 7 + k * 5) % companies.length];
        const seed = t * 31 + b * 17 + k * 11;
        const [expMin, expMax] = band;
        const salaryMin = Math.round(tpl.salaryPerExp[0] + expMin * tpl.salaryPerExp[1]);
        const salaryMax = Math.round(tpl.salaryPerExp[0] + expMax * tpl.salaryPerExp[1] + 2);
        const location = locations[seed % locations.length];
        const workMode = workModes[seed % workModes.length];
        // internships only make sense for fresher roles
        let jobType: JobType = expMin === 0 && seed % 3 === 0 ? 'Internship' : jobTypes[seed % jobTypes.length];
        if (jobType === 'Internship' && expMin > 0) jobType = 'Full-time';
        const title = `${seniority(expMin)}${tpl.title}`;

        jobs.push({
          id: `j${id++}`,
          title,
          companyId: company.id,
          category: tpl.category,
          location,
          workMode,
          jobType,
          experienceMin: expMin,
          experienceMax: expMax,
          salaryMin,
          salaryMax,
          skills: tpl.skills,
          description: `${company.name} is looking for a ${title} to ${tpl.summary} This is a great opportunity to join a ${company.industry.toLowerCase()} leader and grow your career with a team that values ownership, craft and impact.`,
          responsibilities: tpl.responsibilities,
          requirements: tpl.requirements,
          benefits: [
            'Competitive salary with performance bonus',
            'Health insurance for you and your family',
            'Flexible work hours' + (workMode !== 'On-site' ? ' and remote-friendly culture' : ''),
            'Learning & development budget',
            'Employee stock options (ESOPs)',
          ],
          postedDaysAgo: seed % 21,
          applicants: 40 + ((seed * 37) % 960),
          openings: 1 + (seed % 5),
          featured: id % 7 === 0,
        });
      }
    });
  });

  return jobs;
}

export const jobs: Job[] = buildJobs();
export const jobById = new Map(jobs.map((j) => [j.id, j]));

export const categories = Array.from(new Set(jobs.map((j) => j.category))).sort();
export const allLocations = locations;
