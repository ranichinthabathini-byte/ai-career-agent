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