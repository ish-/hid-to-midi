import output, { sendCC, sendNote } from './midi.js';
import { MIDI } from './config.js';

function log (...strs) { console.log('state: ', ...strs) }

const state = {
  // note
  P1: 0, P2: 0,
  B1: 0, B2: 0, B3: 0, B4: 0,
  S5: 0, S6: 0, S7: 0, S8: 0, S9: 0, S10: 0,
  UP: 0, LE: 0, DO: 0, RI: 0, NO: 0,

  // cc
  P1_X: 0, P1_Y: 0, P2_X: 0, P2_Y: 0,
};

export default state;

function updateState (name, value) {
  if (state[name] === value)
    return;

  state[name] = value;
  log(name, value);
  return true;
}

state.cc = (name, value) => {
  if (!updateState(name, value)) return;

  return sendCC(name, value);
}

state.note = (name, value) => {
  if (!updateState(name, value)) return;

  return sendNote(name, value);
}