// js/ui.js
import { 
  MATH_COMFORT, 
  BOARD, 
  GEO_BUDGET_TIER, 
  PATH_SIGNAL, 
  INTEREST_TAGS_LIST 
} from "./taxonomy.js";

import { 
  setMathComfort, 
  setBoard, 
  setGeoBudgetTier, 
  setPathSignal, 
  toggleInterestTag, 
  getSessionSnapshot,
  resetSession 
} from "./state.js";

import { getRoutingResult } from "./routing.js";

const container = document.getElementById("card-container");
const progressText = document.getElementById("progress-indicator");

let currentIndex = 0;
let careerContentCache = null;
let contentLoadPromise = null;

// Background preload: non-blocking at startup, guarded at result screen
function preloadCareerContent() {
  contentLoadPromise = fetch("data/career-content.json")
    .then(res => res.json())
    .then(data => {
      careerContentCache = data?.pathways || {};
    })
    .catch(err => {
      console.error("Failed to load career content", err);
      careerContentCache = {}; // empty object fallback, never null
    });
}

// Card sequence definition
const CARD_SEQUENCE = [
  { field: "math_comfort", render: renderMathCard, optional: false },
  { field: "board", render: renderBoardCard, optional: true },
  { field: "top_interests", render: renderInterestsCard, optional: false },
  { field: "geo_budget_tier", render: renderGeoBudgetCard, optional: false },
  { field: "path_signal", render: renderPathSignalCard, optional: false }
];

function updateProgress() {
  if (currentIndex < CARD_SEQUENCE.length) {
    progressText.textContent = `Step ${currentIndex + 1} of ${CARD_SEQUENCE.length}`;
  } else {
    progressText.textContent = "Your Recommendation";
  }
}

// Idempotent card renderer (destroys and rebuilds DOM cleanly)
function renderCard(index) {
  currentIndex = index;
  updateProgress();
  container.innerHTML = "";

  if (currentIndex >= CARD_SEQUENCE.length) {
    renderResultCard();
    return;
  }

  const cardDef = CARD_SEQUENCE[currentIndex];
  const snapshot = getSessionSnapshot();
  const currentValue = snapshot[cardDef.field];

  cardDef.render(currentValue);
}

// Shared Navigation Row Helper
function appendNavRow(cardElement, onNext, isNextEnabled = true) {
  const nav = document.createElement("div");
  nav.className = "nav-row";

  // Back Button
  if (currentIndex > 0) {
    const backBtn = document.createElement("button");
    backBtn.className = "btn-secondary";
    backBtn.textContent = "← Back";
    backBtn.addEventListener("click", () => renderCard(currentIndex - 1));
    nav.appendChild(backBtn);
  } else {
    nav.appendChild(document.createElement("div")); // Spacer
  }

  // Next Button
  const nextBtn = document.createElement("button");
  nextBtn.className = "btn-primary";
  nextBtn.id = "card-next-btn";
  nextBtn.textContent = currentIndex === CARD_SEQUENCE.length - 1 ? "View Roadmap →" : "Next →";
  nextBtn.disabled = !isNextEnabled;
  nextBtn.addEventListener("click", onNext);
  nav.appendChild(nextBtn);

  cardElement.appendChild(nav);
}

// 1. Math Comfort Card
function renderMathCard(currentValue) {
  const card = document.createElement("div");
  card.className = "intake-card";
  card.innerHTML = `
    <h2>How comfortable are you with Mathematics?</h2>
    <p class="hint">Mathematics forms the foundation for algorithms and technical AI tracks.</p>
    <div class="option-group" id="math-options"></div>
  `;

  const options = [
    { val: MATH_COMFORT.STRONG, label: "Strong (Enjoy algebra, geometry & problem-solving)" },
    { val: MATH_COMFORT.AVERAGE, label: "Average (Can handle it with consistent practice)" },
    { val: MATH_COMFORT.WEAK, label: "Weak (Prefer minimal formulas and pure math)" },
    { val: MATH_COMFORT.UNTESTED, label: "Untested / Not Sure" }
  ];

  const group = card.querySelector("#math-options");
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = `btn-option ${currentValue === opt.val ? "selected" : ""}`;
    btn.textContent = opt.label;
    btn.addEventListener("click", () => {
      setMathComfort(opt.val);
      renderCard(currentIndex + 1);
    });
    group.appendChild(btn);
  });

  appendNavRow(card, () => renderCard(currentIndex + 1), currentValue !== null);
  container.appendChild(card);
}

// 2. Board Card (Optional)
function renderBoardCard(currentValue) {
  const card = document.createElement("div");
  card.className = "intake-card";
  card.innerHTML = `
    <h2>What is your 10th Board?</h2>
    <p class="hint">Helps contextualize entrance exam alignment and cutoffs (Optional).</p>
    <div class="option-group" id="board-options"></div>
  `;

  const options = [
    { val: BOARD.CBSE, label: "CBSE" },
    { val: BOARD.ICSE, label: "ICSE" },
    { val: BOARD.STATE, label: "State Board" },
    { val: BOARD.OTHER, label: "Other" }
  ];

  const group = card.querySelector("#board-options");
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = `btn-option ${currentValue === opt.val ? "selected" : ""}`;
    btn.textContent = opt.label;
    btn.addEventListener("click", () => {
      setBoard(opt.val);
      renderCard(currentIndex + 1);
    });
    group.appendChild(btn);
  });

  appendNavRow(card, () => renderCard(currentIndex + 1), true);
  container.appendChild(card);
}

// 3. Top Interests Card (Full Snapshot Re-render Pattern)
function renderInterestsCard() {
  const card = document.createElement("div");
  card.className = "intake-card";
  card.innerHTML = `
    <h2>Select Your Top 2 Interests</h2>
    <p class="hint">Pick up to 2 areas that excite you most. A 3rd selection replaces the 1st (FIFO).</p>
    <div class="tag-grid" id="interest-grid"></div>
  `;

  const grid = card.querySelector("#interest-grid");

  function refreshTags() {
    const snapshot = getSessionSnapshot();
    const selected = snapshot.top_interests; // index 0 = 1st, index 1 = 2nd
    grid.innerHTML = "";

    INTEREST_TAGS_LIST.forEach(tag => {
      const btn = document.createElement("button");
      btn.className = "btn-option";
      const rank = selected.indexOf(tag);

      const labelSpan = document.createElement("span");
      labelSpan.textContent = tag.replace(/_/g, " ").toUpperCase();
      btn.appendChild(labelSpan);

      if (rank !== -1) {
        btn.classList.add("selected");
        const badge = document.createElement("span");
        badge.className = "tag-badge";
        badge.textContent = rank === 0 ? "1st" : "2nd";
        btn.appendChild(badge);
      }

      btn.addEventListener("click", () => {
        toggleInterestTag(tag);
        refreshTags(); // Unconditional full repaint
      });

      grid.appendChild(btn);
    });

    const nextBtn = card.querySelector("#card-next-btn");
    if (nextBtn) {
      nextBtn.disabled = selected.length === 0;
    }
  }

  refreshTags();
  appendNavRow(card, () => renderCard(currentIndex + 1), getSessionSnapshot().top_interests.length > 0);
  container.appendChild(card);
}

// 4. Geo / Budget Tier Card
function renderGeoBudgetCard(currentValue) {
  const card = document.createElement("div");
  card.className = "intake-card";
  card.innerHTML = `
    <h2>Learning Resources & Location Environment</h2>
    <p class="hint">Identifies realistic preparation pathways (coaching vs. self-study & government tracks).</p>
    <div class="option-group" id="geo-options"></div>
  `;

  const options = [
    { val: GEO_BUDGET_TIER.METRO_FLEXIBLE, label: "Metro / Tier 1 (Open to private colleges & coaching)" },
    { val: GEO_BUDGET_TIER.METRO_CONSTRAINED, label: "Metro / Tier 1 (Cost-conscious, focus on self-study)" },
    { val: GEO_BUDGET_TIER.TIER2_3_CONSTRAINED, label: "Tier 2/3 or Rural (Government colleges, polytechnic, online)" }
  ];

  const group = card.querySelector("#geo-options");
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = `btn-option ${currentValue === opt.val ? "selected" : ""}`;
    btn.textContent = opt.label;
    btn.addEventListener("click", () => {
      setGeoBudgetTier(opt.val);
      renderCard(currentIndex + 1);
    });
    group.appendChild(btn);
  });

  appendNavRow(card, () => renderCard(currentIndex + 1), currentValue !== null);
  container.appendChild(card);
}

// 5. Path Signal Card
function renderPathSignalCard(currentValue) {
  const card = document.createElement("div");
  card.className = "intake-card";
  card.innerHTML = `
    <h2>Post-10th Path Preference</h2>
    <p class="hint">Choose your preferred academic format.</p>
    <div class="option-group" id="signal-options"></div>
  `;

  const options = [
    { val: PATH_SIGNAL.TRADITIONAL, label: "Traditional 11th & 12th (Higher Secondary / Junior College)" },
    { val: PATH_SIGNAL.POLYTECHNIC_CURIOUS, label: "3-Year Polytechnic Diploma (Hands-on, direct lateral entry to B.Tech)" },
    { val: PATH_SIGNAL.UNDECIDED, label: "Undecided / Open to recommendation" }
  ];

  const group = card.querySelector("#signal-options");
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = `btn-option ${currentValue === opt.val ? "selected" : ""}`;
    btn.textContent = opt.label;
    btn.addEventListener("click", () => {
      setPathSignal(opt.val);
      renderCard(currentIndex + 1);
    });
    group.appendChild(btn);
  });

  appendNavRow(card, () => renderCard(currentIndex + 1), currentValue !== null);
  container.appendChild(card);
}

// Result Block Helper
function buildPathwayBlock(data, isPrimary = true) {
  const block = document.createElement("div");
  block.className = `pathway-block ${isPrimary ? "primary" : "secondary"}`;
  block.innerHTML = `
    <span class="stream-tag">${data.stream || "Recommended Stream"}</span>
    <h3>${data.title}</h3>
    <p style="font-size: 0.9rem; margin-bottom: 0.5rem;">${data.summary}</p>
    
    <section>
      <strong>11th & 12th / Foundation Focus:</strong>
      <ul>${(data.highSchoolFocus || []).map(item => `<li>${item}</li>`).join("")}</ul>
    </section>

    <section>
      <strong>Target Degrees / Diplomas:</strong>
      <ul>${(data.undergradDegrees || []).map(item => `<li>${item}</li>`).join("")}</ul>
    </section>

    <section>
      <strong>Recommended Free Foundations:</strong>
      <ul>${(data.freeResources || []).map(item => `<li>${item}</li>`).join("")}</ul>
    </section>
  `;
  return block;
}

// 6. Result Card Renderer
async function renderResultCard() {
  // Guard against race condition: await content fetch if fast user arrived early
  if (careerContentCache === null && contentLoadPromise) {
    await contentLoadPromise;
  }

  const snapshot = getSessionSnapshot();
  const result = getRoutingResult(snapshot);
  const isForked = Boolean(result.secondary_pathway_key);

  const card = document.createElement("div");
  card.className = `result-card ${isForked ? "result-card--forked" : ""}`;

  let headerHTML = `<h2>Recommended Career Pathway</h2>`;
  if (result.confidence === "hedged") {
    headerHTML += `
      <div class="hedge-banner">
        <strong>Exploratory Fit:</strong> Based on partial or untested inputs. Use this roadmap as a flexible guide to explore further.
      </div>
    `;
  }
  card.innerHTML = headerHTML;

  const primaryData = careerContentCache[result.pathway_key];

  // Defensive fallback guard
  if (!primaryData) {
    const errorBox = document.createElement("div");
    errorBox.className = "hedge-banner";
    errorBox.textContent = "Details for this specific pathway could not be loaded. Please refresh to try again.";
    card.appendChild(errorBox);
    container.appendChild(card);
    return;
  }

  if (isForked) {
    const explainer = document.createElement("div");
    explainer.className = "fork-explainer";
    explainer.innerHTML = `<strong>Hybrid Fit Detected:</strong> Your combination of strong analytical skills and humanities/communication interests opens two distinct paths. Consider either option below:`;
    card.appendChild(explainer);

    const forkContainer = document.createElement("div");
    forkContainer.className = "fork-container";
    forkContainer.appendChild(buildPathwayBlock(primaryData, true));

    const secondaryData = careerContentCache[result.secondary_pathway_key];
    if (secondaryData) {
      forkContainer.appendChild(buildPathwayBlock(secondaryData, false));
    }
    card.appendChild(forkContainer);
  } else {
    card.appendChild(buildPathwayBlock(primaryData, true));
  }

  // Restart Button
  const actions = document.createElement("div");
  actions.className = "nav-row";
  actions.style.justifyContent = "center";
  const restartBtn = document.createElement("button");
  restartBtn.className = "btn-secondary";
  restartBtn.textContent = "↺ Start Over with Clean Profile";
  restartBtn.addEventListener("click", () => {
    resetSession();
    renderCard(0);
  });
  actions.appendChild(restartBtn);
  card.appendChild(actions);

  container.appendChild(card);
}

// Initial Boot
document.addEventListener("DOMContentLoaded", () => {
  preloadCareerContent(); // Background preload (non-blocking)
  renderCard(0);          // First paint immediately
});
