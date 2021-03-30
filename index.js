import joystick from './hid.js';

import state from './state.js';
import RelativeStick from './RelativeStick.js';

console.log('Starting...')

const P1_X = 0, P1_Y = 1, P2_X = 2, P2_Y = 3, CTRL = 4, OTHR = 5;

const B1 = 0b0001, B2 = 0b0010, B3 = 0b0100, B4 = 0b1000;
const UP = 0b0000, DO = 0b0100, LE = 0b0110, RI = 0b0010, NO = 0b1000;

const S5 =  0b00000001, S6 =  0b00000010, S7 =  0b00000100, S8 =  0b00001000, S9 =  0b00010000, S10 = 0b00100000, P1  = 0b01000000, P2  = 0b10000000;

const p1y = new RelativeStick('P1_Y');

joystick.on('data', (buf) => {
  const _tmp = buf[CTRL];
  const btns = _tmp >> 4;
  const curs = _tmp & 0b00001111;

  state.note('B1', !!(btns & B1));
  state.note('B2', !!(btns & B2));
  state.note('B3', !!(btns & B3));
  state.note('B4', !!(btns & B4));

  state.note('UP', curs === UP);
  state.note('DO', curs === DO);
  state.note('LE', curs === LE);
  state.note('RI', curs === RI);

  const othr = buf[OTHR];
  state.note('S5', !!(othr & S5));
  state.note('S6', !!(othr & S6));
  state.note('S7', !!(othr & S7));
  state.note('S8', !!(othr & S8));

  state.note('S9', !!(othr & S9));
  state.note('S10', !!(othr & S10));

  state.note('P1', !!(othr & P1));
  state.note('P2', !!(othr & P2));

  state.cc('P1_X', Math.ceil(buf[P1_X] / 255 * 127), false);
  // state.cc('P1_Y', Math.ceil(buf[P1_Y] / 255 * 127), false);
  p1y.proc(Math.ceil(buf[P1_Y] / 255 * 127));
  state.cc('P2_X', Math.ceil(buf[P2_X] / 255 * 127), false);
  state.cc('P2_Y', Math.ceil(buf[P2_Y] / 255 * 127), false);

});

joystick.on('error', e => console.error(e));
