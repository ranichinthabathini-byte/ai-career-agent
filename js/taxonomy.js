// js/taxonomy.js

// 1. Math Comfort Level
export const MATH_COMFORT = Object.freeze({
  STRONG: "strong",
  AVERAGE: "average",
  WEAK: "weak",
  UNTESTED: "untested"
});

// 2. Initial Post-10th Path Signal (Used in Gate 0 routing)
export const PATH_SIGNAL = Object.freeze({
  TRADITIONAL: "traditional",             // Standard 11th/12th
  POLYTECHNIC_CURIOUS: "polytechnic",   // Considering 3-year diploma
  UNDECIDED: "undecided"
});

// 3. Merged Geo & Budget Tier
export const GEO_BUDGET_TIER = Object.freeze({
  METRO_FLEXIBLE: "metro_flexible",
  METRO_CONSTRAINED: "metro_constrained",
  TIER2_3_CONSTRAINED: "tier2_3_constrained"
});

// 4. Board (Kept lightweight; informative for cutoffs)
export const BOARD = Object.freeze({
  CBSE: "cbse",
  ICSE: "icse",
  STATE: "state",
  OTHER: "other"
});

// 5. Interest Taxonomy (Max top-2 selection)
export const INTEREST_TAGS = Object.freeze({
  LOGIC_SYSTEMS: "logic_systems",
  DESIGN_VISUAL: "design_visual",
  PEOPLE_FACING: "people_facing",
  BUSINESS_STRATEGY: "business_strategy",
  HARDWARE_TINKERING: "hardware_tinkering",
  WRITING_COMMUNICATION: "writing_communication",
  BIOLOGY_HEALTH: "biology_health",
  EXPERIMENTATION_SCIENCE: "experimentation_science"
});

// Derived arrays: exported directly for UI iteration (avoids Object.values calls in ui.js)
export const INTEREST_TAGS_LIST = Object.freeze(Object.values(INTEREST_TAGS));
export const MATH_COMFORT_LIST = Object.freeze(Object.values(MATH_COMFORT));
export const PATH_SIGNAL_LIST = Object.freeze(Object.values(PATH_SIGNAL));
export const GEO_BUDGET_LIST = Object.freeze(Object.values(GEO_BUDGET_TIER));
