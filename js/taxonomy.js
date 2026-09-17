// js/taxonomy.js

export const MATH_COMFORT = {
  STRONG: "strong",
  AVERAGE: "average",
  WEAK: "weak",
  UNTESTED: "untested"
};

export const BOARD = {
  CBSE: "cbse",
  ICSE: "icse",
  STATE: "state",
  OTHER: "other"
};

export const GEO_BUDGET_TIER = {
  METRO_FLEXIBLE: "metro_flexible",
  METRO_CONSTRAINED: "metro_constrained",
  TIER2_3_CONSTRAINED: "tier2_3_constrained"
};

export const PATH_SIGNAL = {
  TRADITIONAL: "traditional",
  POLYTECHNIC_CURIOUS: "polytechnic_curious",
  UNDECIDED: "undecided"
};

export const INTEREST_TAGS = {
  // Existing AI & Tech Tags
  LOGIC_SYSTEMS: "logic_systems",
  HARDWARE_TINKERING: "hardware_tinkering",
  DATA_EXPLORATION: "data_exploration",
  CREATIVE_AI_MEDIA: "creative_ai_media",
  HUMAN_BEHAVIOR: "human_behavior",
  WEB_MOBILE_DEV: "web_mobile_dev",

  // New Streams: Medical, Commerce & Arts
  HEALTH_MEDICINE: "health_medicine",
  LIVING_SYSTEMS: "living_systems",
  FINANCE_BUSINESS: "finance_business",
  CREATIVE_DESIGN: "creative_design",
  HUMAN_LAW_SOCIETY: "human_law_society"
};

export const INTEREST_TAGS_LIST = Object.values(INTEREST_TAGS);

export const PATHWAY_KEYS = {
  // Core AI & Tech Tracks
  CS_CORE_ACCELERATED: "CS_CORE_ACCELERATED",
  CS_APPLIED_EXPLORATORY: "CS_APPLIED_EXPLORATORY",
  POLYTECHNIC_DIPLOMA: "POLYTECHNIC_DIPLOMA",
  VOCATIONAL_SELF_PACED: "VOCATIONAL_SELF_PACED",
  AI_HUMANITIES_HYBRID: "AI_HUMANITIES_HYBRID",

  // Core Indian Streams
  MPC_ENGINEERING: "MPC_ENGINEERING",
  BIPC_MEDICINE: "BIPC_MEDICINE",
  PCMB_HYBRID: "PCMB_HYBRID",
  MEC_COMMERCE_DATA: "MEC_COMMERCE_DATA",
  CEC_COMMERCE_MANAGEMENT: "CEC_COMMERCE_MANAGEMENT",
  HEC_HUMANITIES_ARTS: "HEC_HUMANITIES_ARTS"
};
// Dynamic alignment insights for instant feedback on Step 3
export const DOMAIN_ALIGNMENT_INSIGHTS = {
  data_systems: {
    match: (tags) => tags.includes(INTEREST_TAGS.LOGIC_SYSTEMS) && tags.includes(INTEREST_TAGS.DATA_EXPLORATION),
    title: "Computer Science & Data Science Alignment",
    domains: "CSE (Data Science / AI), Applied Analytics, Quantitative Systems",
    subjects: "Advanced Algebra, Statistics & Probability, Discrete Mathematics"
  },
  hardware_iot: {
    match: (tags) => tags.includes(INTEREST_TAGS.HARDWARE_TINKERING) && tags.includes(INTEREST_TAGS.LOGIC_SYSTEMS),
    title: "Electronics, Robotics & Embedded Tech Alignment",
    domains: "ECE (Electronics & Communication), IoT Engineering, Robotics & Mechatronics",
    subjects: "Mechanics, Electromagnetism, Differential Calculus"
  },
  medical_clinical: {
    match: (tags) => tags.includes(INTEREST_TAGS.HEALTH_MEDICINE) || tags.includes(INTEREST_TAGS.LIVING_SYSTEMS),
    title: "Healthcare & Biological Sciences Alignment",
    domains: "MBBS, B.Pharmacy, Biomedical Engineering, Biotechnology",
    subjects: "Human Physiology, Organic Chemistry, Genetics"
  },
  fintech_business: {
    match: (tags) => tags.includes(INTEREST_TAGS.FINANCE_BUSINESS),
    title: "Commerce & FinTech Analytics Alignment",
    domains: "B.Com Analytics, FinTech Systems, Financial Engineering, CA / CFA",
    subjects: "Applied Business Math, Macroeconomics, Accounting Logic"
  },
  creative_design: {
    match: (tags) => tags.includes(INTEREST_TAGS.CREATIVE_DESIGN),
    title: "Digital Product Design & HCI Alignment",
    domains: "B.Des (UI/UX), Cognitive Design, Creative Media Technology",
    subjects: "Design Thinking, Spatial Geometry, Cognitive Psychology"
  },
  law_society: {
    match: (tags) => tags.includes(INTEREST_TAGS.HUMAN_LAW_SOCIETY),
    title: "Legal Studies, Policy & Governance Alignment",
    domains: "B.A. LL.B (Corporate / Cyber Law), Public Policy, Civil Services",
    subjects: "Constitutional Law, Political Philosophy, Critical Reasoning"
  }
};
export const NODE_STATUS = {
  MANDATORY: "mandatory",
  RECOMMENDED: "recommended",
  OPTIONAL: "optional"
};