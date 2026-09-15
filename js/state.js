// js/state.js
export const state = {
  math_comfort: null,
  board: null,
  top_interests: [],
  geo_budget: null,
  path_signal: null
};

export function updateField(field, value) {
  state[field] = value;
}

export function toggleInterest(tag) {
  const index = state.top_interests.indexOf(tag);
  if (index > -1) {
    state.top_interests.splice(index, 1);
  } else {
    // Keep max 3 selections
    if (state.top_interests.length >= 3) {
      state.top_interests.shift();
    }
    state.top_interests.push(tag);
  }
}

export function resetState() {
  state.math_comfort = null;
  state.board = null;
  state.top_interests = [];
  state.geo_budget = null;
  state.path_signal = null;
}

export function getSessionSnapshot() {
  return Object.freeze({
    ...state,
    top_interests: [...state.top_interests]
  });
}