export interface WorkEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  current: boolean;
  bullets: string[];
  techTags: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
}

export const WORK_HISTORY: WorkEntry[] = [
  {
    company: "Charter Communications",
    role: "Software Engineer V",
    period: "July 2020 – Present",
    location: "Denver, CO",
    current: true,
    bullets: [
      "Building custom Jira/Confluence plugins and integrations for internal enterprise teams using the Atlassian SDK and Active Objects.",
      "Developing AI-powered MCP servers in Python to automate developer workflows and enhance productivity tooling.",
      "Implementing Playwright automation suites for regression testing of internal business applications.",
      "Leading full-stack feature development across Spring Boot microservices and Angular frontends.",
      "Driving SAFe Agile ceremonies and cross-team technical alignment for quarterly planning.",
    ],
    techTags: [
      "Java",
      "Spring Boot",
      "Atlassian SDK",
      "Python",
      "MCP",
      "Playwright",
      "Angular",
      "Active Objects",
      "Docker",
    ],
  },
  {
    company: "CenturyLink INC.",
    role: "Java Full Stack Developer",
    period: "July 2018 – July 2020",
    location: "Remote",
    current: false,
    bullets: [
      "Migrated a monolithic VoIP order processing application to a microservices architecture using Spring Boot.",
      "Built event-driven pipelines with Apache Kafka for real-time order status updates and workflow management.",
      "Developed Angular 8 frontends with reactive forms and REST integration for order management dashboards.",
      "Containerized services with Docker and orchestrated deployments on Kubernetes.",
    ],
    techTags: [
      "Java",
      "Spring Boot",
      "Angular",
      "Kafka",
      "Docker",
      "Kubernetes",
      "Hibernate",
      "MongoDB",
    ],
  },
];

export const EDUCATION: EducationEntry[] = [
  {
    degree: "MS Computer Science",
    institution: "University of Central Missouri, MO",
    year: "2018",
  },
  {
    degree: "BTech Computer Science & Engineering",
    institution: "JNTU Kakinada",
    year: "2016",
  },
];
