import { BOARD, SUBJECT_INTERESTS, PATHWAY_KEYS } from "./taxonomy.js?v=5";

const STEPS = [
  {
    id: "board",
    title: "Step 1: What is your current school board?",
    hint: "Helps tailor the transition into Higher Secondary (11th & 12th) or Polytechnic Diploma.",
    options: [
      { label: "State Board (BIEAP / TSBIE / SSC)", value: BOARD.STATE },
      { label: "CBSE (Central Board)", value: BOARD.CBSE },
      { label: "ICSE / ISC", value: BOARD.ICSE },
      { label: "Other / International Board", value: BOARD.OTHER }
    ]
  },
  {
    id: "subject_interest",
    title: "Step 2: Which subjects do you genuinely enjoy studying?",
    hint: "Choose the combination that best matches your interest and core strengths.",
    options: [
      { label: "Mathematics & Physical Sciences (Logic, Calculations, Physics)", value: SUBJECT_INTERESTS.MATH_PHYSICS },
      { label: "Biology & Life Sciences (Plants, Animals, Human Anatomy, Medicine)", value: SUBJECT_INTERESTS.BIOLOGY_CHEMISTRY },
      { label: "Practical Technical Labs & Machinery (Hands-on circuits, repairs, hardware)", value: SUBJECT_INTERESTS.HANDS_ON_TECHNICAL },
      { label: "Commerce, Business & Financial Accounts (Money, Trade, Mathematics)", value: SUBJECT_INTERESTS.COMMERCE_ACCOUNTS },
      { label: "Civics, History & Social Governance (Law, Constitution, Society, Polity)", value: SUBJECT_INTERESTS.CIVICS_HISTORY },
      { label: "Drawing, UI/UX, Spatial Arts & Creative Visuals (Design, Sketching, Media)", value: SUBJECT_INTERESTS.CREATIVE_DESIGN }
    ]
  }
];

const STREAM_MAPPINGS = {
  [SUBJECT_INTERESTS.MATH_PHYSICS]: [
    {
      label: "Intermediate MPC (Maths, Physics, Chemistry)",
      badge: "Standard +2 Track",
      desc: "Prepares for engineering degrees, architecture, and scientific computing.",
      pathway: PATHWAY_KEYS.MPC_ENGINEERING
    },
    {
      label: "3-Year Polytechnic Diploma (Engineering)",
      badge: "Hands-on Technical",
      desc: "Laboratory-oriented diploma with lateral entry directly into 2nd year B.Tech.",
      pathway: PATHWAY_KEYS.POLYTECHNIC_DIPLOMA
    }
  ],
  [SUBJECT_INTERESTS.BIOLOGY_CHEMISTRY]: [
    {
      label: "Intermediate BiPC (Biology, Physics, Chemistry)",
      badge: "Standard Medical Track",
      desc: "Targeted pathway for clinical medicine, agriculture, and pharmaceutical degrees.",
      pathway: PATHWAY_KEYS.BIPC_MEDICINE
    }
  ],
  [SUBJECT_INTERESTS.HANDS_ON_TECHNICAL]: [
    {
      label: "3-Year Polytechnic Diploma (Technical Specializations)",
      badge: "Direct Polytechnic Route",
      desc: "Applied practical coursework with direct lateral admission to 2nd year B.Tech.",
      pathway: PATHWAY_KEYS.POLYTECHNIC_DIPLOMA
    },
    {
      label: "Intermediate MPC (Maths, Physics, Chemistry)",
      badge: "Academic Alternative",
      desc: "Traditional academic foundation for university degrees in engineering.",
      pathway: PATHWAY_KEYS.MPC_ENGINEERING
    }
  ],
  [SUBJECT_INTERESTS.COMMERCE_ACCOUNTS]: [
    {
      label: "Intermediate MEC (Mathematics, Economics, Commerce)",
      badge: "Quantitative Commerce",
      desc: "Ideal for professional accounting, finance, and integrated management.",
      pathway: PATHWAY_KEYS.MEC_COMMERCE_DATA
    },
    {
      label: "Intermediate CEC (Commerce, Economics, Civics)",
      badge: "Management & Law",
      desc: "Focuses on corporate governance, business, and law without calculus.",
      pathway: PATHWAY_KEYS.CEC_COMMERCE_MANAGEMENT
    }
  ],
  [SUBJECT_INTERESTS.CIVICS_HISTORY]: [
    {
      label: "Intermediate HEC (History, Economics, Civics)",
      badge: "Humanities & Civil Services",
      desc: "Prime stream for integrated 5-year law, public policy, and civil administration.",
      pathway: PATHWAY_KEYS.HEC_HUMANITIES_ARTS
    },
    {
      label: "Intermediate CEC (Commerce, Economics, Civics)",
      badge: "Commercial Law Alternative",
      desc: "Balanced mix of commerce, financial fundamentals, and legal civics.",
      pathway: PATHWAY_KEYS.CEC_COMMERCE_MANAGEMENT
    }
  ],
  [SUBJECT_INTERESTS.CREATIVE_DESIGN]: [
    {
      label: "Arts & Design Track",
      badge: "Creative Professional",
      desc: "Undergraduate programs in digital interaction, spatial interior, and fashion design.",
      pathway: PATHWAY_KEYS.ARTS_DESIGN_CREATIVE
    },
    {
      label: "Intermediate MPC",
      badge: "Architecture Prerequisite",
      desc: "Mandatory qualification if targeting structural architecture programs.",
      pathway: PATHWAY_KEYS.MPC_ENGINEERING
    }
  ]
};

let currentStep = 0;
let userChoices = {
  board: null,
  subject_interest: null,
  chosen_pathway: null,
  selected_exam_id: null,
  user_score: null
};

let careerContent = null;
const container = document.getElementById("card-container");
const progressBar = document.getElementById("progress-bar");

async function init() {
  try {
    const res = await fetch("data/career-content.json");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    careerContent = data.pathways;
    renderStep(currentStep);
  } catch (err) {
    if (container) {
      container.innerHTML = `
        <div class="intake-card">
          <h2>Failed to load stream database</h2>
          <p class="hint">${err.message}</p>
        </div>
      `;
    }
  }
}

function updateProgress() {
  if (progressBar) {
    progressBar.style.width = `${((currentStep + 1) / 4) * 100}%`;
  }
}

function renderStep(index) {
  if (!container) return;
  updateProgress();

  // STEP 1 & STEP 2: Basic single-selection cards
  if (index < 2) {
    const card = STEPS[index];
    container.innerHTML = `
      <div class="intake-card">
        <h2>${card.title}</h2>
        <p class="hint">${card.hint}</p>

        <div class="option-group" id="option-list">
          ${card.options.map(opt => {
            const isSelected = userChoices[card.id] === opt.value;
            return `
              <button type="button" class="btn-option ${isSelected ? 'selected' : ''}" data-value="${opt.value}">
                <span>${opt.label}</span>
              </button>
            `;
          }).join("")}
        </div>

        <div class="nav-row">
          ${index > 0 ? `<button type="button" class="btn-secondary" id="btn-back">← Back</button>` : `<div></div>`}
          <button type="button" class="btn-primary" id="btn-next" ${userChoices[card.id] ? "" : "disabled"}>
            Next →
          </button>
        </div>
      </div>
    `;

    container.querySelectorAll(".btn-option").forEach(btn => {
      btn.addEventListener("click", () => {
        userChoices[card.id] = btn.getAttribute("data-value");
        renderStep(currentStep);
      });
    });

    document.getElementById("btn-next")?.addEventListener("click", () => {
      currentStep++;
      renderStep(currentStep);
    });

    document.getElementById("btn-back")?.addEventListener("click", () => {
      currentStep--;
      renderStep(currentStep);
    });
    return;
  }

  // STEP 3: Stream Selection based on Step 2
  if (index === 2) {
    const dynamicOptions = STREAM_MAPPINGS[userChoices.subject_interest] || [];

    container.innerHTML = `
      <div class="intake-card">
        <h2>Step 3: Select Your Stream / Program</h2>
        <p class="hint">Recommended stream options based on your subject preferences:</p>

        <div class="option-group" id="option-list">
          ${dynamicOptions.map(opt => {
            const isSelected = userChoices.chosen_pathway === opt.pathway;
            return `
              <button type="button" class="btn-option ${isSelected ? 'selected' : ''}" data-pathway="${opt.pathway}" style="flex-direction: column; align-items: flex-start; gap: 0.35rem;">
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                  <strong style="color: var(--text-main); font-size: 1rem;">${opt.label}</strong>
                  <span class="tag-badge">${opt.badge}</span>
                </div>
                <span style="font-size: 0.82rem; color: var(--text-muted);">${opt.desc}</span>
              </button>
            `;
          }).join("")}
        </div>

        <div class="nav-row">
          <button type="button" class="btn-secondary" id="btn-back">← Back</button>
          <button type="button" class="btn-primary" id="btn-to-exam" ${userChoices.chosen_pathway ? "" : "disabled"}>
            Choose Entrance Exam →
          </button>
        </div>
      </div>
    `;

    container.querySelectorAll(".btn-option").forEach(btn => {
      btn.addEventListener("click", () => {
        userChoices.chosen_pathway = btn.getAttribute("data-pathway");
        userChoices.selected_exam_id = null; // reset if pathway changed
        userChoices.user_score = null;
        renderStep(2);
      });
    });

    document.getElementById("btn-to-exam")?.addEventListener("click", () => {
      currentStep = 3;
      renderStep(3);
    });

    document.getElementById("btn-back")?.addEventListener("click", () => {
      currentStep--;
      renderStep(currentStep);
    });
    return;
  }

  // STEP 4: Choose Exam Type and Enter Rank / Score
  if (index === 3) {
    const pathwayData = careerContent[userChoices.chosen_pathway];
    const availableExams = pathwayData?.exams || [];
    const activeExam = availableExams.find(e => e.id === userChoices.selected_exam_id) || null;

    container.innerHTML = `
      <div class="intake-card">
        <h2>Step 4: Select Exam Type & Score</h2>
        <p class="hint">Select your target entrance examination and provide your actual or expected score/rank:</p>

        <label style="font-size: 0.88rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 0.6rem;">
          Target Entrance Exam:
        </label>
        <div class="option-group" style="margin-bottom: 1.25rem;">
          ${availableExams.map(exam => {
            const isSelected = userChoices.selected_exam_id === exam.id;
            return `
              <button type="button" class="btn-option ${isSelected ? 'selected' : ''}" data-exam-id="${exam.id}">
                <span>🎯 ${exam.name}</span>
                <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">(${exam.unit})</span>
              </button>
            `;
          }).join("")}
        </div>

        ${activeExam ? `
          <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 1.15rem; margin-bottom: 1.5rem;">
            <label for="user-score-input" style="font-size: 0.88rem; font-weight: 700; color: var(--text-main); display: block; margin-bottom: 0.35rem;">
              Enter your actual or expected ${activeExam.unit}:
            </label>
            <input 
              type="number" 
              id="user-score-input" 
              placeholder="e.g. ${activeExam.unit.toLowerCase().includes('rank') ? '4500' : '94'}" 
              value="${userChoices.user_score !== null ? userChoices.user_score : ''}"
              style="width: 100%; padding: 0.85rem 1rem; border: 1.5px solid #94a3b8; border-radius: 10px; font-size: 1rem; outline: none; margin-bottom: 0.5rem;"
            />
            <p style="font-size: 0.78rem; color: #64748b; margin: 0;">
              💡 <em>Qualifying Standard:</em> ${activeExam.qualifying}
            </p>
          </div>
        ` : ""}

        <div class="nav-row">
          <button type="button" class="btn-secondary" id="btn-back">← Back</button>
          <button type="button" class="btn-primary" id="btn-show-result" ${activeExam ? "" : "disabled"}>
            View Admission Bracket & Cut-offs →
          </button>
        </div>
      </div>
    `;

    container.querySelectorAll(".btn-option[data-exam-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        userChoices.selected_exam_id = btn.getAttribute("data-exam-id");
        renderStep(3);
      });
    });

    const scoreInput = document.getElementById("user-score-input");
    scoreInput?.addEventListener("input", (e) => {
      userChoices.user_score = e.target.value ? parseFloat(e.target.value) : null;
    });

    document.getElementById("btn-show-result")?.addEventListener("click", () => {
      showFinalResults();
    });

    document.getElementById("btn-back")?.addEventListener("click", () => {
      currentStep = 2;
      renderStep(2);
    });
  }
}

function evaluateScoreBracket(exam, score) {
  if (score === null || isNaN(score) || !exam?.tiers) return null;

  // Rank-based (lower is better)
  if (exam.unit.toLowerCase().includes("rank")) {
    for (const tier of exam.tiers) {
      if (score <= tier.maxRank) {
        return { tier: tier.label, range: tier.range, isMatch: true };
      }
    }
  }

  // Score/Percentile-based (higher is better)
  if (exam.unit.toLowerCase().includes("percentile") || exam.unit.toLowerCase().includes("marks")) {
    for (const tier of exam.tiers) {
      if (score >= tier.minScore) {
        return { tier: tier.label, range: tier.range, isMatch: true };
      }
    }
  }

  return null;
}

function showFinalResults() {
  if (progressBar) progressBar.style.width = "100%";
  const path = careerContent[userChoices.chosen_pathway];
  const selectedExam = path?.exams?.find(e => e.id === userChoices.selected_exam_id);
  const evaluation = evaluateScoreBracket(selectedExam, userChoices.user_score);

  if (!path) {
    container.innerHTML = `<div class="result-card"><h2>Pathway details unavailable.</h2></div>`;
    return;
  }

  container.innerHTML = `
    <div class="result-card">
      <span class="stream-tag">RECOMMENDED STREAM • ${path.stream}</span>
      <h2>${path.title}</h2>
      <p class="hint">${path.summary}</p>

      <!-- 1. What Students Study in College -->
      <section class="result-section">
        <strong>📚 Academic Subjects Taught:</strong>
        <ul>
          ${(path.highSchoolFocus || []).map(item => `<li>${item}</li>`).join("")}
        </ul>
      </section>

      <!-- 2. Candidate Evaluation & Cutoff Ranges -->
      ${selectedExam ? `
        <section class="result-section" style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 1.25rem; margin-top: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
            <strong style="color: var(--primary); font-size: 1rem;">🎯 ${selectedExam.name} Admission Analysis</strong>
            <span class="tag-badge">${selectedExam.unit}</span>
          </div>

          <p style="font-size: 0.84rem; color: #475569; margin-bottom: 0.85rem;">
            <strong>Minimum Qualifying Requirement:</strong> ${selectedExam.qualifying}
          </p>

          ${evaluation ? `
            <div style="background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 10px; padding: 0.85rem 1rem; margin-bottom: 1rem;">
              <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #047857; letter-spacing: 0.05em; display: block; margin-bottom: 0.25rem;">Estimated Placement Range:</span>
              <div style="font-size: 1.05rem; font-weight: 700; color: #065f46;">${evaluation.tier}</div>
              <span style="font-size: 0.82rem; color: #047857;">Based on your entered ${selectedExam.unit.toLowerCase()}: <strong>${userChoices.user_score}</strong></span>
            </div>
          ` : `
            <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 10px; padding: 0.75rem 1rem; margin-bottom: 1rem; font-size: 0.84rem; color: #1e40af;">
              ℹ️ Enter your rank/score in Step 4 to highlight your specific placement bracket.
            </div>
          `}

          <strong style="font-size: 0.86rem; color: var(--text-main); display: block; margin-bottom: 0.45rem;">Average Cutoff Ranges by Institutional Tier:</strong>
          <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.86rem; color: #334155; line-height: 1.6;">
            ${selectedExam.tiers.map(t => `
              <li style="${evaluation && evaluation.tier === t.label ? 'color: #047857; font-weight: 700;' : ''}">
                <strong>${t.label}:</strong> ${t.range} ${evaluation && evaluation.tier === t.label ? '✔ (Your Range)' : ''}
              </li>
            `).join("")}
          </ul>
        </section>
      ` : ""}

      <div class="nav-row result-actions">
        <button type="button" class="btn-secondary" id="btn-restart">↻ Restart Diagnostic</button>
        <button type="button" class="btn-primary" id="save-pdf-btn">🖨️ Print / Save as PDF</button>
      </div>
    </div>
  `;

  document.getElementById("btn-restart")?.addEventListener("click", () => {
    userChoices = {
      board: null,
      subject_interest: null,
      chosen_pathway: null,
      selected_exam_id: null,
      user_score: null
    };
    currentStep = 0;
    renderStep(0);
  });

  document.getElementById("save-pdf-btn")?.addEventListener("click", () => {
    window.print();
  });
}

document.addEventListener("DOMContentLoaded", init);