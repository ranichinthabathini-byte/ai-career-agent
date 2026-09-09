// js/routing.js
import { 
  MATH_COMFORT, 
  PATH_SIGNAL, 
  INTEREST_TAGS 
} from "./taxonomy.js";

// Mapping of interests to their natural stream affinity
const INTEREST_STREAM_MAP = Object.freeze({
  [INTEREST_TAGS.LOGIC_SYSTEMS]: "PCM",
  [INTEREST_TAGS.HARDWARE_TINKERING]: "PCM",
  [INTEREST_TAGS.EXPERIMENTATION_SCIENCE]: "PCM",
  [INTEREST_TAGS.BIOLOGY_HEALTH]: "PCB",
  [INTEREST_TAGS.BUSINESS_STRATEGY]: "COMMERCE",
  [INTEREST_TAGS.DESIGN_VISUAL]: "ARTS",
  [INTEREST_TAGS.WRITING_COMMUNICATION]: "ARTS",
  [INTEREST_TAGS.PEOPLE_FACING]: "ARTS"
});

// Mapping of (Stream + Interest) to exact pathway keys
function mapStreamToPathway(stream, primaryInterest) {
  switch (stream) {
    case "PCM":
      return "PCM_CORE_AI";
    case "PCB":
      return "PCB_HEALTHTECH_AI";
    case "COMMERCE":
      return "COMMERCE_DATA_AI";
    case "ARTS":
      return "ARTS_AI_ETHICS";
    default:
      return "GENERAL_EXPLORE";
  }
}

// Gate 0: Short-circuit for polytechnic path signal
function routeToPolytechnic(snapshot, reasoning) {
  reasoning.push("gate0:polytechnic_path_selected");
  return {
    pathway_key: "POLYTECHNIC_HARDWARE_AI",
    confidence: "high",
    reasoning_tags: reasoning
  };
}

// Gate 2 Conflict Fallback
function handleGate2Conflict(snapshot, confidence, reasoning) {
  const primary = snapshot.top_interests[0];
  reasoning.push(`gate2_conflict:unmatched_primary_${primary}`);

  // Fallback: Weak math with strong system/hardware interests maps cleanly to Polytechnic
  if (
    snapshot.math_comfort === MATH_COMFORT.WEAK &&
    (primary === INTEREST_TAGS.LOGIC_SYSTEMS || primary === INTEREST_TAGS.HARDWARE_TINKERING)
  ) {
    reasoning.push("fallback:polytechnic_via_weak_math_systems_interest");
    return {
      pathway_key: "POLYTECHNIC_HARDWARE_AI",
      confidence: "hedged",
      reasoning_tags: reasoning
    };
  }

  // Final terminal fallback
  reasoning.push("fallback:general_exploration");
  return {
    pathway_key: "GENERAL_EXPLORE",
    confidence: "hedged",
    reasoning_tags: reasoning
  };
}

// Main pure function entry point
export function getRoutingResult(snapshot) {
  const reasoning = [];

  // Gate 0: Polytechnic short-circuit
  if (snapshot.path_signal === PATH_SIGNAL.POLYTECHNIC_CURIOUS) {
    return routeToPolytechnic(snapshot, reasoning);
  }

  // Gate 1: Math comfort filters candidate streams
  let candidates = [];
  let confidence = (snapshot.completeness === "full") ? "high" : "hedged";

  switch (snapshot.math_comfort) {
    case MATH_COMFORT.STRONG:
      candidates = ["PCM", "PCB"];
      reasoning.push("math:strong_filters_to_stem");
      break;
    case MATH_COMFORT.AVERAGE:
      candidates = ["PCM", "PCB", "COMMERCE"];
      reasoning.push("math:average_retains_applied_and_stem");
      break;
    case MATH_COMFORT.WEAK:
      candidates = ["COMMERCE", "ARTS"];
      reasoning.push("math:weak_filters_to_applied_and_humanities");
      break;
    case MATH_COMFORT.UNTESTED:
    default:
      candidates = ["PCM", "PCB", "COMMERCE", "ARTS"];
      confidence = "hedged";
      reasoning.push("math:untested_opens_all_candidates_hedged");
      break;
  }

  // Gate 2: Interest Resolution
  const primaryInterest = snapshot.top_interests[0];
  const secondaryInterest = snapshot.top_interests[1];
  const matchedStream = INTEREST_STREAM_MAP[primaryInterest];

  if (!matchedStream || !candidates.includes(matchedStream)) {
    return handleGate2Conflict(snapshot, confidence, reasoning);
  }

  // Gate 2b: Override Check (Strong Math + People/Writing Interest Fork)
  const isHumanitiesInterest = (tag) => 
    tag === INTEREST_TAGS.PEOPLE_FACING || tag === INTEREST_TAGS.WRITING_COMMUNICATION;

  if (
    snapshot.math_comfort === MATH_COMFORT.STRONG && 
    (isHumanitiesInterest(primaryInterest) || isHumanitiesInterest(secondaryInterest))
  ) {
    reasoning.push("gate2b:strong_math_humanities_fork");
    return {
      pathway_key: "PCM_CORE_AI",
      secondary_pathway_key: "ARTS_AI_ETHICS",
      confidence: confidence,
      reasoning_tags: reasoning
    };
  }

  // Gate 3: Geo/Budget Tier resolution & tag enrichment
  const basePathway = mapStreamToPathway(matchedStream, primaryInterest);
  reasoning.push(`stream_matched:${matchedStream}`);
  
  if (snapshot.geo_budget_tier) {
    reasoning.push(`geo_budget:${snapshot.geo_budget_tier}`);
  }

  return {
    pathway_key: basePathway,
    confidence: confidence,
    reasoning_tags: reasoning
  };
}