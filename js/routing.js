import {
  MATH_COMFORT,
  BOARD,
  GEO_BUDGET_TIER,
  PATH_SIGNAL,
  INTEREST_TAGS,
  PATHWAY_KEYS
} from "./taxonomy.js";

export function getRoutingResult(snapshot) {
  if (!snapshot) {
    throw new Error("Missing snapshot state for routing");
  }

  // 1. Explicit Polytechnic Gate (Highest Priority)
  if (snapshot.path_signal === PATH_SIGNAL.POLYTECHNIC_CURIOUS) {
    return {
      pathway_key: PATHWAY_KEYS.POLYTECHNIC_DIPLOMA,
      confidence: "high",
      reasoning_tags: ["polytechnic:direct_interest"]
    };
  }

  // 2. Medical / Biology Gates (BiPC & PCMB)
  const hasBiology = snapshot.top_interests && snapshot.top_interests.some(t =>
    [INTEREST_TAGS.HEALTH_MEDICINE, INTEREST_TAGS.LIVING_SYSTEMS].includes(t)
  );
  if (hasBiology) {
    if (snapshot.math_comfort === MATH_COMFORT.STRONG) {
      return {
        pathway_key: PATHWAY_KEYS.PCMB_HYBRID,
        confidence: "high",
        reasoning_tags: ["pcmb:strong_math_plus_biology"]
      };
    }
    return {
      pathway_key: PATHWAY_KEYS.BIPC_MEDICINE,
      confidence: snapshot.math_comfort === MATH_COMFORT.WEAK ? "high" : "hedged",
      reasoning_tags: ["bipc:pure_medical_health_focus"]
    };
  }

  // 3. Commerce & Arts Gates (MEC, CEC, HEC)
  if (snapshot.top_interests && snapshot.top_interests.includes(INTEREST_TAGS.FINANCE_BUSINESS)) {
    if (snapshot.math_comfort === MATH_COMFORT.STRONG || snapshot.math_comfort === MATH_COMFORT.AVERAGE) {
      return {
        pathway_key: PATHWAY_KEYS.MEC_COMMERCE_DATA,
        confidence: "high",
        reasoning_tags: ["mec:finance_with_math"]
      };
    }
    return {
      pathway_key: PATHWAY_KEYS.CEC_COMMERCE_MANAGEMENT,
      confidence: "high",
      reasoning_tags: ["cec:finance_without_calculus"]
    };
  }

  if (snapshot.top_interests && snapshot.top_interests.includes(INTEREST_TAGS.HUMAN_LAW_SOCIETY)) {
    return {
      pathway_key: PATHWAY_KEYS.HEC_HUMANITIES_ARTS,
      confidence: "high",
      reasoning_tags: ["hec:policy_and_law"]
    };
  }

  // 4. MPC Core Engineering Gate
  const hasTechInterests = snapshot.top_interests && snapshot.top_interests.some(t =>
    [INTEREST_TAGS.LOGIC_SYSTEMS, INTEREST_TAGS.HARDWARE_TINKERING].includes(t)
  );
  if (snapshot.math_comfort === MATH_COMFORT.STRONG && hasTechInterests) {
    return {
      pathway_key: PATHWAY_KEYS.MPC_ENGINEERING,
      confidence: "high",
      reasoning_tags: ["mpc:strong_math_engineering_alignment"]
    };
  }

  // 5. Hybrid / Interdisciplinary Gate
  const hasDesignOrHumanities = snapshot.top_interests && snapshot.top_interests.some(t =>
    [INTEREST_TAGS.CREATIVE_AI_MEDIA, INTEREST_TAGS.HUMAN_BEHAVIOR, INTEREST_TAGS.CREATIVE_DESIGN].includes(t)
  );
  if (hasDesignOrHumanities && snapshot.math_comfort !== MATH_COMFORT.STRONG) {
    return {
      pathway_key: PATHWAY_KEYS.AI_HUMANITIES_HYBRID,
      confidence: "hedged",
      reasoning_tags: ["hybrid:design_humanities_priority"]
    };
  }

  // 6. Tier 3 Resource-Constrained Gate
  if (snapshot.geo_budget === GEO_BUDGET_TIER.TIER2_3_CONSTRAINED && snapshot.math_comfort === MATH_COMFORT.WEAK) {
    return {
      pathway_key: PATHWAY_KEYS.VOCATIONAL_SELF_PACED,
      confidence: "high",
      reasoning_tags: ["vocational:cost_and_practical_focus"]
    };
  }

  // 7. Core Accelerated vs Applied Fallbacks
  if (snapshot.math_comfort === MATH_COMFORT.STRONG) {
    return {
      pathway_key: PATHWAY_KEYS.CS_CORE_ACCELERATED,
      confidence: "high",
      reasoning_tags: ["cs_core:strong_math_baseline"]
    };
  }

  return {
    pathway_key: PATHWAY_KEYS.CS_APPLIED_EXPLORATORY,
    confidence: snapshot.math_comfort === MATH_COMFORT.AVERAGE ? "high" : "hedged",
    reasoning_tags: ["cs_applied:foundational_support"]
  };
}

export function calculateRoutingDecision(snapshot) {
  const primaryResult = getRoutingResult(snapshot);

  const isForkCandidate =
    snapshot.math_comfort === MATH_COMFORT.STRONG &&
    snapshot.top_interests &&
    snapshot.top_interests.includes(INTEREST_TAGS.LOGIC_SYSTEMS) &&
    (snapshot.top_interests.includes(INTEREST_TAGS.HEALTH_MEDICINE) ||
     snapshot.top_interests.includes(INTEREST_TAGS.FINANCE_BUSINESS));

  if (isForkCandidate) {
    return {
      isForked: true,
      primary: primaryResult,
      secondary: {
        pathway_key: snapshot.top_interests.includes(INTEREST_TAGS.HEALTH_MEDICINE)
          ? PATHWAY_KEYS.PCMB_HYBRID
          : PATHWAY_KEYS.MEC_COMMERCE_DATA,
        confidence: "high",
        reasoning_tags: ["forked:dual_affinity"]
      }
    };
  }

  return {
    isForked: false,
    primary: primaryResult,
    secondary: null
  };
}