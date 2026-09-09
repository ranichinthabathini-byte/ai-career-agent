// js/state.js
import { 
  MATH_COMFORT, 
  PATH_SIGNAL, 
  GEO_BUDGET_TIER, 
  BOARD, 
  INTEREST_TAGS 
} from "./taxonomy.js";

// Private in-memory state object
let sessionState = {
  math_comfort: null,
  path_signal: null,
  geo_budget_tier: null,
  board: null,          // Optional field
  top_interests: [],    // Max length: 2 (FIFO replacement)
  completeness: "partial"
};

// Required fields checklist for completeness
const REQUIRED_FIELDS = ["math_comfort", "path_signal", "geo_budget_tier"];

// Internal helper to calculate completeness
function evaluateCompleteness() {
  const hasRequired = REQUIRED_FIELDS.every(field => sessionState[field] !== null);
  const hasInterests = sessionState.top_interests.length > 0;
  
  sessionState.completeness = (hasRequired && hasInterests) ? "full" : "partial";
}

// 1. Math Comfort Setter
export function setMathComfort(value) {
  if (!Object.values(MATH_COMFORT).includes(value)) {
    throw new Error(`Invalid math comfort value: "${value}"`);
  }
  sessionState.math_comfort = value;
  evaluateCompleteness();
}

// 2. Path Signal Setter
export function setPathSignal(value) {
  if (!Object.values(PATH_SIGNAL).includes(value)) {
    throw new Error(`Invalid path signal value: "${value}"`);
  }
  sessionState.path_signal = value;
  evaluateCompleteness();
}

// 3. Geo/Budget Tier Setter
export function setGeoBudgetTier(value) {
  if (!Object.values(GEO_BUDGET_TIER).includes(value)) {
    throw new Error(`Invalid geo budget tier: "${value}"`);
  }
  sessionState.geo_budget_tier = value;
  evaluateCompleteness();
}

// 4. Board Setter (Optional)
export function setBoard(value) {
  if (value !== null && !Object.values(BOARD).includes(value)) {
    throw new Error(`Invalid board value: "${value}"`);
  }
  sessionState.board = value;
  evaluateCompleteness();
}

// 5. Interest Tags: FIFO replacement behavior (3rd selection drops the oldest)
export function toggleInterestTag(tag) {
  if (!Object.values(INTEREST_TAGS).includes(tag)) {
    throw new Error(`Invalid interest tag: "${tag}"`);
  }

  const index = sessionState.top_interests.indexOf(tag);

  if (index > -1) {
    // Already selected: deselect it
    sessionState.top_interests.splice(index, 1);
  } else {
    // If already 2 selected, drop the oldest (index 0)
    if (sessionState.top_interests.length >= 2) {
      sessionState.top_interests.shift();
    }
    sessionState.top_interests.push(tag);
  }

  evaluateCompleteness();
  return [...sessionState.top_interests];
}

// 6. Reset state to clean baseline
export function resetSession() {
  sessionState = {
    math_comfort: null,
    path_signal: null,
    geo_budget_tier: null,
    board: null,
    top_interests: [],
    completeness: "partial"
  };
}

// 7. Pure snapshot provider for routing.js (deep freeze / shallow copy)
export function getSessionSnapshot() {
  return Object.freeze({
    ...sessionState,
    top_interests: [...sessionState.top_interests]
  });
}
