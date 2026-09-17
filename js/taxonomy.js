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
  CS_CORE_ACCELERATED: "CS_CORE_ACCELERATED",
  CS_APPLIED_EXPLORATORY: "CS_APPLIED_EXPLORATORY",
  POLYTECHNIC_DIPLOMA: "POLYTECHNIC_DIPLOMA",
  VOCATIONAL_SELF_PACED: "VOCATIONAL_SELF_PACED",
  AI_HUMANITIES_HYBRID: "AI_HUMANITIES_HYBRID",
  MPC_ENGINEERING: "MPC_ENGINEERING",
  BIPC_MEDICINE: "BIPC_MEDICINE",
  PCMB_HYBRID: "PCMB_HYBRID",
  MEC_COMMERCE_DATA: "MEC_COMMERCE_DATA",
  CEC_COMMERCE_MANAGEMENT: "CEC_COMMERCE_MANAGEMENT",
  HEC_HUMANITIES_ARTS: "HEC_HUMANITIES_ARTS",
  ARTS_DESIGN_CREATIVE: "ARTS_DESIGN_CREATIVE"
};
// Dynamic alignment insights for instant feedback on Step 3
// Dynamic alignment insights for instant feedback on Step 3
export const DOMAIN_ALIGNMENT_INSIGHTS = {
  creative_design: {
    match: (tags) => tags.includes(INTEREST_TAGS.CREATIVE_DESIGN),
    title: "Design, Visual Arts & Creative Tech Alignment",
    domains: "B.Des (UI/UX, Spatial/Interior, Product), Fashion Design, BFA (Animation & VFX)",
    subjects: "Creative Aptitude, Spatial Visualization, Design Thinking (UCEED / NID-DAT / NIFT)"
  },
  humanities_psychology: {
    match: (tags) => tags.includes(INTEREST_TAGS.HUMAN_LAW_SOCIETY) && tags.includes(INTEREST_TAGS.LIVING_SYSTEMS),
    title: "Cognitive, Behavioral & Clinical Psychology Alignment",
    domains: "B.A. / B.Sc Psychology, Cognitive Science, Behavioral Neurobiology",
    subjects: "Human Development, Social Psychology, Cognitive Behavior, Research Methods"
  },
  law_policy: {
    match: (tags) => tags.includes(INTEREST_TAGS.HUMAN_LAW_SOCIETY) && !tags.includes(INTEREST_TAGS.LIVING_SYSTEMS),
    title: "Legal Studies, Governance & Policy Alignment",
    domains: "5-Year Integrated B.A. LL.B (Corporate/Cyber Law), Public Policy, Civil Services (UPSC/State PSC)",
    subjects: "Constitutional Law, Political Science, Legal Reasoning (AP/TS LAWCET, CLAT-UG)"
  },
  data_systems: {
    match: (tags) => tags.includes(INTEREST_TAGS.LOGIC_SYSTEMS) && tags.includes(INTEREST_TAGS.DATA_EXPLORATION),
    title: "Computer Science & Data Science Alignment",
    domains: "CSE (Data Science / AI), Applied Analytics, Quantitative Systems",
    subjects: "Algebra 1A/2A, Coordinate Geometry 1B, Statistics (AP/TG EAPCET, JEE Main)"
  },
  hardware_iot: {
    match: (tags) => tags.includes(INTEREST_TAGS.HARDWARE_TINKERING) && tags.includes(INTEREST_TAGS.LOGIC_SYSTEMS),
    title: "Electronics, Robotics & Embedded Tech Alignment",
    domains: "ECE (Electronics & Communication), IoT Engineering, Robotics & Mechatronics",
    subjects: "Mechanics, Electromagnetism, Differential Calculus 1B (EAPCET, JEE)"
  },
  medical_clinical: {
    match: (tags) => tags.includes(INTEREST_TAGS.HEALTH_MEDICINE) || tags.includes(INTEREST_TAGS.LIVING_SYSTEMS),
    title: "Medical, Pharmacy & Allied Health Sciences Alignment",
    domains: "MBBS, B.Pharmacy, Pharma.D, B.Sc Agriculture, Veterinary Science",
    subjects: "Botany (Plant Anatomy/Genetics), Zoology (Human Physiology), Organic Chemistry (NEET, EAPCET Agri)"
  },
  fintech_business: {
    match: (tags) => tags.includes(INTEREST_TAGS.FINANCE_BUSINESS),
    title: "Commerce & FinTech Analytics Alignment",
    domains: "B.Com Analytics, FinTech Systems, Financial Engineering, CA / CFA",
    subjects: "Commercial Math, Accountancy, Macroeconomics (CA Foundation, IPMAT)"
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