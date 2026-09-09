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
let careerData = null;

// Pre-fetch career content on load
async function initContent() {
  try {
    const res = await fetch("data/career-content.json");
    careerData = await res.json();
  } catch (err) {
    console.error("Could not load career-content.json", err);
  }
}

// Card sequence definition
const CARD_SEQUENCE = [
  { field: "math_comfort", render: renderMathCard },
  { field: "board", render: renderBoardCard, optional: true },
  { field: "top_interests", render: renderInterestsCard },
  { field: "geo_budget_tier", render: renderGeoBudgetCard },
  { field: "path_signal", render: renderPathSignalCard }
];

function updateProgress() {
  if (currentIndex < CARD_SEQUENCE.length) {
    progressText.textContent = `Step ${currentIndex + 1} of ${CARD_SEQUENCE.length}`;
  } else {
    progressText.textContent = "Your Recommendation";
  }
}

function nextStep() {
  currentIndex++;
  if (currentIndex < CARD_SEQUENCE.length) {
    updateProgress();
    CARD_SEQUENCE[currentIndex].render();
  } else {
    updateProgress();
    renderResultCard();
  }
}

// 1. Math Comfort Card
function renderMathCard() {
  container.innerHTML = `
    <div class="card">
      <h2>How comfortable are you with Mathematics?</h2>
      <p class="hint">Mathematics forms the foundation for algorithms and technical AI tracks.</p>
      <div class="options-grid">
        <button class="btn-option" data-val="${MATH_COMFORT.STRONG}">Strong (Enjoy calculus, algebra & problem-solving)</button>
        <button class="btn-option" data-val="${MATH_COMFORT.AVERAGE}">Average (Can handle it with consistent practice)</button>
        <button class="btn-option" data-val="${MATH_COMFORT.WEAK}">Weak (Prefer minimal formulas and pure math)</button>
        <button class="btn-option" data-val="${MATH_COMFORT.UNTESTED}">Untested / Not Sure</button>
      </div>
    </div>
  `;

  container.querySelectorAll(".btn-option").forEach(btn => {
    btn.addEventListener("click", () => {
      setMathComfort(btn.dataset.val);
      nextStep();
    });
  });
}

// 2. Board Card (Optional)
function renderBoardCard() {
  container.innerHTML = `
    <div class="card">
      <h2>What is your 10th Board?</h2>
      <p class="hint">Helps contextualize entrance exam alignment and cutoffs.</p>
      <div class="options-grid">
        <button class="btn-option" data-val="${BOARD.CBSE}">CBSE</button>
        <button class="btn-option" data-val="${BOARD.ICSE}">ICSE</button>
        <button class="btn-option" data-val="${BOARD.STATE}">State Board</button>
        <button class="btn-option" data-val="${BOARD.OTHER}">Other</button>
      </div>
      <div class="card-actions">
        <button class="btn-secondary" id="skip-board">Skip this question</button>
      </div>
    </div>
  `;

  container.querySelectorAll(".btn-option").forEach(btn => {
    btn.addEventListener("click", () => {
      setBoard(btn.dataset.val);
      nextStep();
    });
  });

  document.getElementById("skip-board").addEventListener("click", () => {
    setBoard(null);
    nextStep();
  });
}

// 3. Top Interests Card (Multi-select capped at 2 via FIFO)
function renderInterestsCard() {
  const currentSnapshot = getSessionSnapshot();
  const selected = new Set(currentSnapshot.top_interests);

  container.innerHTML = `
    <div class="card">
      <h2>Select Your Top 2 Interests</h2>
      <p class="hint">Pick up to 2 areas that excite you most. Selecting a 3rd rotates the oldest.</p>
      <div class="options-grid" id="interests-grid">
        ${INTEREST_TAGS_LIST.map(tag => `
          <button class="btn-option ${selected.has(tag) ? 'selected' : ''}" data-tag="${tag}">
            ${tag.replace(/_/g, ' ').toUpperCase()}
          </button>
        `).join('')}
      </div>
      <div class="card-actions">
        <button class="btn-primary" id="confirm-interests">Continue</button>
      </div>
    </div>
  `;

  const buttons = container.querySelectorAll("#interests-grid .btn-option");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const updatedList = toggleInterestTag(btn.dataset.tag);
      const updatedSet = new Set(updatedList);
      buttons.forEach(b => {
        b.classList.toggle("selected", updatedSet.has(b.dataset.tag));
      });
    });
  });

  document.getElementById("confirm-interests").addEventListener("click", () => {
    const snap = getSessionSnapshot();
    if (snap.top_interests.length === 0) {
      alert("Please select at least one interest to continue.");
      return;
    }
    nextStep();
  });
}

// 4. Geo / Budget Tier Card
function renderGeoBudgetCard() {
  container.innerHTML = `
    <div class="card">
      <h2>Learning Resources & Location Environment</h2>
      <p class="hint">Identifies realistic preparation pathways (coaching vs. self-study & government tracks).</p>
      <div class="options-grid">
        <button class="btn-option" data-val="${GEO_BUDGET_TIER.METRO_FLEXIBLE}">Metro / Tier 1 (Open to private colleges & coaching)</button>
        <button class="btn-option" data-val="${GEO_BUDGET_TIER.METRO_CONSTRAINED}">Metro / Tier 1 (Cost-conscious, focus on self-study)</button>
        <button class="btn-option" data-val="${GEO_BUDGET_TIER.TIER2_3_CONSTRAINED}">Tier 2/3 or Rural (Government colleges, polytechnic, online)</button>
      </div>
    </div>
  `;

  container.querySelectorAll(".btn-option").forEach(btn => {
    btn.addEventListener("click", () => {
      setGeoBudgetTier(btn.dataset.val);
      nextStep();
    });
  });
}

// 5. Path Signal Card
function renderPathSignalCard() {
  container.innerHTML = `
    <div class="card">
      <h2>Post-10th Path Preference</h2>
      <p class="hint">Choose your preferred academic format.</p>
      <div class="options-grid">
        <button class="btn-option" data-val="${PATH_SIGNAL.TRADITIONAL}">Traditional 11th & 12th (Higher Secondary / Junior College)</button>
        <button class="btn-option" data-val="${PATH_SIGNAL.POLYTECHNIC_CURIOUS}">3-Year Polytechnic Diploma (Hands-on, direct lateral entry to B.Tech)</button>
        <button class="btn-option" data-val="${PATH_SIGNAL.UNDECIDED}">Undecided / Open to recommendation</button>
      </div>
    </div>
  `;

  container.querySelectorAll(".btn-option").forEach(btn => {
    btn.addEventListener("click", () => {
      setPathSignal(btn.dataset.val);
      nextStep();
    });
  });
}

// 6. Result Card Renderer
function renderResultCard() {
  const snapshot = getSessionSnapshot();
  const result = getRoutingResult(snapshot);
  const primaryData = careerData?.pathways[result.pathway_key];
  const secondaryData = result.secondary_pathway_key ? careerData?.pathways[result.secondary_pathway_key] : null;

  container.innerHTML = `
    <div class="card">
      <h2>Recommended AI Career Pathway</h2>
      <p class="hint">Confidence: <strong>${result.confidence.toUpperCase()}</strong></p>

      <div class="result-box">
        <span class="tag">${primaryData?.stream || "Recommended Stream"}</span>
        <h3 style="margin-top: 0.5rem; color: var(--primary);">${primaryData?.title || result.pathway_key}</h3>
        <p style="margin: 0.5rem 0; font-size: 0.9rem;">${primaryData?.summary || ""}</p>
        
        <div style="margin-top: 0.75rem;">
          <strong>11th & 12th Focus:</strong>
          <ul style="padding-left: 1.25rem; font-size: 0.875rem; margin-top: 0.25rem;">
            ${primaryData?.highSchoolFocus?.map(item => `<li>${item}</li>`).join('') || ''}
          </ul>
        </div>

        <div style="margin-top: 0.75rem;">
          <strong>Target Degrees:</strong>
          <ul style="padding-left: 1.25rem; font-size: 0.875rem; margin-top: 0.25rem;">
            ${primaryData?.undergradDegrees?.map(item => `<li>${item}</li>`).join('') || ''}
          </ul>
        </div>

        <div style="margin-top: 0.75rem;">
          <strong>Recommended Free Foundations:</strong>
          <ul style="padding-left: 1.25rem; font-size: 0.875rem; margin-top: 0.25rem;">
            ${primaryData?.freeResources?.map(item => `<li>${item}</li>`).join('') || ''}
          </ul>
        </div>
      </div>

      ${secondaryData ? `
        <div class="result-box" style="margin-top: 1rem; border-left: 4px solid var(--accent);">
          <span class="tag">Alternative Hybrid Pathway</span>
          <h3 style="margin-top: 0.5rem;">${secondaryData.title}</h3>
          <p style="margin: 0.5rem 0; font-size: 0.9rem;">${secondaryData.summary}</p>
        </div>
      ` : ''}

      <div class="card-actions">
        <button class="btn-secondary" id="restart-btn">Restart Assessment</button>
      </div>
    </div>
  `;

  document.getElementById("restart-btn").addEventListener("click", () => {
    resetSession();
    currentIndex = 0;
    updateProgress();
    CARD_SEQUENCE[0].render();
  });
}

// Initialize application
document.addEventListener("DOMContentLoaded", async () => {
  await initContent();
  updateProgress();
  CARD_SEQUENCE[0].render();
});