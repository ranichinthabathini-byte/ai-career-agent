import {
  MATH_COMFORT,
  BOARD,
  GEO_BUDGET_TIER,
  PATH_SIGNAL,
  INTEREST_TAGS,
  PATHWAY_KEYS
} from "./taxonomy.js";
import { state, updateField, toggleInterest, resetState } from "./state.js";
import { calculateRoutingDecision } from "./routing.js";

const CARD_SEQUENCE = [
  {
    id: "math_comfort",
    field: "math_comfort",
    type: "single",
    title: "How comfortable are you with Mathematics?",
    hint: "Mathematics forms the foundation for algorithms, engineering, and data tracks.",
    options: [
      { label: "Strong (Enjoy algebra, geometry & problem-solving)", value: MATH_COMFORT.STRONG },
      { label: "Average (Can handle it with practice)", value: MATH_COMFORT.AVERAGE },
      { label: "Weak (Prefer minimal formulas & pure theory)", value: MATH_COMFORT.WEAK },
      { label: "Untested / Not Sure", value: MATH_COMFORT.UNTESTED }
    ]
  },
  {
    id: "board",
    field: "board",
    type: "single",
    title: "What is your current education board?",
    hint: "Helps tailor academic pacing and entrance examination roadmaps.",
    options: [
      { label: "CBSE", value: BOARD.CBSE },
      { label: "ICSE / ISC", value: BOARD.ICSE },
      { label: "State Board", value: BOARD.STATE },
      { label: "Other / International", value: BOARD.OTHER }
    ]
  },
  {
    id: "top_interests",
    field: "top_interests",
    type: "multi",
    maxSelect: 3,
    title: "What areas genuinely excite you?",
    hint: "Select up to 3 options. These drive your stream routing.",
    options: [
      { label: "Logic & Problem-Solving", value: INTEREST_TAGS.LOGIC_SYSTEMS },
      { label: "Hardware & Robotics", value: INTEREST_TAGS.HARDWARE_TINKERING },
      { label: "Data & Exploration", value: INTEREST_TAGS.DATA_EXPLORATION },
      { label: "Health & Clinical Medicine", value: INTEREST_TAGS.HEALTH_MEDICINE },
      { label: "Biology & Living Systems", value: INTEREST_TAGS.LIVING_SYSTEMS },
      { label: "Finance & Economics", value: INTEREST_TAGS.FINANCE_BUSINESS },
      { label: "Design & Creative Media", value: INTEREST_TAGS.CREATIVE_DESIGN },
      { label: "Law, Governance & Society", value: INTEREST_TAGS.HUMAN_LAW_SOCIETY }
    ]
  },
  {
    id: "geo_budget",
    field: "geo_budget",
    type: "single",
    title: "What is your educational environment preference?",
    hint: "Considers college access, infrastructure, and geographical mobility.",
    options: [
      { label: "Metro / Flexible (Open to national institutions)", value: GEO_BUDGET_TIER.METRO_FLEXIBLE },
      { label: "Metro / Budget Conscious", value: GEO_BUDGET_TIER.METRO_CONSTRAINED },
      { label: "Tier 2/3 / Local Regional Access", value: GEO_BUDGET_TIER.TIER2_3_CONSTRAINED }
    ]
  },
  {
    id: "path_signal",
    field: "path_signal",
    type: "single",
    title: "What learning pathway style do you prefer?",
    hint: "Choose between traditional schooling or applied hands-on diploma tracks.",
    options: [
      { label: "Traditional 11th/12th Intermediate (MPC / BiPC / MEC / HEC)", value: PATH_SIGNAL.TRADITIONAL },
      { label: "Hands-on 3-Year Polytechnic Diploma (Direct technical entry)", value: PATH_SIGNAL.POLYTECHNIC_CURIOUS },
      { label: "Undecided / Open to recommendations", value: PATH_SIGNAL.UNDECIDED }
    ]
  }
];

let currentIndex = 0;
let careerContent = null;

const container = document.getElementById("card-container");
const progressText = document.getElementById("progress-indicator");
const progressBar = document.getElementById("progress-bar");

async function init() {
  try {
    const res = await fetch("data/career-content.json");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    careerContent = data.pathways;
    renderCard(currentIndex);
  } catch (err) {
    console.error("Initialization failed:", err);
    if (container) {
      container.innerHTML = `
        <div class="intake-card">
          <h2>Failed to load career data</h2>
          <p class="hint">${err.message}</p>
        </div>
      `;
    }
  }
}

function updateProgress() {
  if (currentIndex < CARD_SEQUENCE.length) {
    if (progressText) progressText.textContent = `Step ${currentIndex + 1} of ${CARD_SEQUENCE.length}`;
    if (progressBar) progressBar.style.width = `${((currentIndex + 1) / CARD_SEQUENCE.length) * 100}%`;
  } else {
    if (progressText) progressText.textContent = "Your Recommendation";
    if (progressBar) progressBar.style.width = "100%";
  }
}

function renderCard(index) {
  if (!container) return;
  updateProgress();

  const currentCard = CARD_SEQUENCE[index];
  const isLast = index === CARD_SEQUENCE.length - 1;

  container.innerHTML = `
    <div class="intake-card">
      <h2>${currentCard.title}</h2>
      <p class="hint">${currentCard.hint}</p>

      <div class="option-group ${currentCard.type === 'multi' ? 'tag-grid' : ''}" id="option-list">
        ${currentCard.options.map(opt => {
          let isSelected = false;
          if (currentCard.type === "single") {
            isSelected = state[currentCard.field] === opt.value;
          } else {
            isSelected = state[currentCard.field]?.includes(opt.value);
          }
          return `
            <button type="button" class="btn-option ${isSelected ? 'selected' : ''}" data-value="${opt.value}">
              <span>${opt.label}</span>
              ${isSelected && currentCard.type === 'multi' ? '<span class="tag-badge">Selected</span>' : ''}
            </button>
          `;
        }).join("")}
      </div>

      <div class="nav-row">
        ${index > 0 ? `<button type="button" class="btn-secondary" id="btn-back">← Back</button>` : `<div></div>`}
        <button type="button" class="btn-primary" id="btn-next" ${isStepValid(currentCard) ? "" : "disabled"}>
          ${isLast ? "Generate Roadmap →" : "Next →"}
        </button>
      </div>
    </div>
  `;

  // Attach button events
  const optionButtons = container.querySelectorAll(".btn-option");
  optionButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-value");
      if (currentCard.type === "single") {
        updateField(currentCard.field, val);
        renderCard(currentIndex);
      } else {
        toggleInterest(val);
        renderCard(currentIndex);
      }
    });
  });

  const nextBtn = document.getElementById("btn-next");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentIndex < CARD_SEQUENCE.length - 1) {
        currentIndex++;
        renderCard(currentIndex);
      } else {
        showResults();
      }
    });
  }

  const backBtn = document.getElementById("btn-back");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderCard(currentIndex);
      }
    });
  }
}

function isStepValid(card) {
  if (card.type === "single") {
    return Boolean(state[card.field]);
  }
  return Array.isArray(state[card.field]) && state[card.field].length > 0;
}

function showResults() {
  updateProgress();
  const decision = calculateRoutingDecision(state);
  const primaryPath = careerContent[decision.primary.pathway_key];
  const secondaryPath = decision.secondary ? careerContent[decision.secondary.pathway_key] : null;

  container.innerHTML = `
    <div class="result-card ${decision.isForked ? 'result-card--forked' : ''}">
      <h2>Your Recommended Pathway</h2>
      <p class="hint">Customized based on your analytical profile and academic interests.</p>

      ${decision.primary.confidence === "hedged" ? `
        <div class="hedge-banner">
          ⚠️ <strong>Flexible Assessment:</strong> Several viable pathways match your profile. Focus on building core foundational strength during your first year.
        </div>
      ` : ""}

      ${decision.isForked ? `
        <div class="fork-explainer">
          ⚖️ <strong>Dual Alignment:</strong> Your interests bridge two high-growth sectors. Compare these pathways below.
        </div>
      ` : ""}

      <div class="fork-container">
        ${renderPathwayBlock(primaryPath, "Primary Match")}
        ${secondaryPath ? renderPathwayBlock(secondaryPath, "Alternative / Secondary Track", true) : ""}
      </div>

      <div class="nav-row result-actions">
        <button type="button" class="btn-secondary" id="btn-restart">↻ Start Over</button>
        <button type="button" class="btn-primary" id="save-pdf-btn">🖨️ Print / Save as PDF</button>
      </div>
    </div>
  `;

  document.getElementById("btn-restart")?.addEventListener("click", () => {
    resetState();
    currentIndex = 0;
    renderCard(0);
  });

  document.getElementById("save-pdf-btn")?.addEventListener("click", () => {
    window.print();
  });
}

function renderPathwayBlock(path, badgeLabel, isSecondary = false) {
  if (!path) return `<div class="pathway-block"><p>Pathway details unavailable.</p></div>`;

  return `
    <div class="pathway-block ${isSecondary ? 'secondary' : ''}">
      <span class="stream-tag">${badgeLabel} • ${path.stream || ''}</span>
      <h3>${path.title}</h3>
      <p>${path.summary}</p>

      <section>
        <strong>High School (11th & 12th) Priorities:</strong>
        <ul>
          ${(path.highSchoolFocus || []).map(item => `<li>${item}</li>`).join("")}
        </ul>
      </section>

      <section>
        <strong>Target Undergraduate Degrees:</strong>
        <ul>
          ${(path.undergradDegrees || []).map(item => `<li>${item}</li>`).join("")}
        </ul>
      </section>

      <section>
        <strong>Free Starter Resources:</strong>
        <ul>
          ${(path.freeResources || []).map(item => `<li>${item}</li>`).join("")}
        </ul>
      </section>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", init);