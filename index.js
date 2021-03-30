var HID = require('node-hid');
console.log('Starting...')
function hidLog (str) { console.log('HID: ', str) }
try {
  var device = new HID.HID(1133, 49688);
  hidLog('Connected!')
}
catch (e) { hidLog('Cant connect') }

const P1_X = 0, P1_Y = 1, P2_X = 2, P2_Y = 3, CTRL = 4, OTHR = 5;
const MIDI = { B1:1, B2:2, B3:3, B4:4, UP:20, DO:21, LE:22, RI:23, S5: 5, S6: 6, S7: 7, S8: 8, S9: 9, S10: 10, P1: 11, P2: 12, P1_X: 64, P1_Y: 65, P2_X: 66, P2_Y: 67 };
const state = {
  P1: 0, P2: 0,
  P1_X: 0, P1_Y: 0, P2_X: 0, P2_Y: 0,
  B1: 0, B2: 0, B3: 0, B4: 0,
  S5: 0, S6: 0, S7: 0, S8: 0, S9: 0, S10: 0,
  UP: 0, LE: 0, DO: 0, RI: 0, NO: 0,
};
const B1 = 0b0001, B2 = 0b0010, B3 = 0b0100, B4 = 0b1000;
const UP = 0b0000, DO = 0b0100, LE = 0b0110, RI = 0b0010, NO = 0b1000;

const S5 =  0b00000001, S6 =  0b00000010, S7 =  0b00000100, S8 =  0b00001000, S9 =  0b00010000, S10 = 0b00100000, P1  = 0b01000000, P2  = 0b10000000;

if (device) {
  device.on("data", (buf) => {
    const _tmp = buf[CTRL].toString(2).padStart(8, 0);
    const btns = parseInt(_tmp.slice(0, 4), 2);
    const curs = parseInt(_tmp.slice(4), 2);

    proc('B1', !!(btns & B1));
    proc('B2', !!(btns & B2));
    proc('B3', !!(btns & B3));
    proc('B4', !!(btns & B4));

    proc('UP', curs === UP);
    proc('DO', curs === DO);
    proc('LE', curs === LE);
    proc('RI', curs === RI);

    const othr = buf[OTHR];
    proc('S5', !!(othr & S5));
    proc('S6', !!(othr & S6));
    proc('S7', !!(othr & S7));
    proc('S8', !!(othr & S8));

    proc('S9', !!(othr & S9));
    proc('S10', !!(othr & S10));

    proc('P1', !!(othr & P1));
    proc('P2', !!(othr & P2));

    proc('P1_X', Math.ceil(buf[P1_X] / 255 * 127), false);
    proc('P1_Y', Math.ceil(buf[P1_Y] / 255 * 127), false);
    proc('P2_X', Math.ceil(buf[P2_X] / 255 * 127), false);
    proc('P2_Y', Math.ceil(buf[P2_Y] / 255 * 127), false);

    function proc (name, value, note = true) {
      if (state[name] === value)
        return;

      state[name] = value;
      console.log(name, value);

      if (note) {
        output.send(value ? 'noteon' : 'noteoff', {
          note: MIDI[name],
          velocity: 127,
          channel,
        });
      }
      else {
        output.send('cc', {
          controller: MIDI[name],
          value,
          channel,
        });
      }
    }
  });

  device.on("error", function(error) { console.error(error) });
}

///////////////////

function midiLog (str) { console.log('MIDI: ', str) }

try {
  var easymidi = require('easymidi');
  var output = new easymidi.Output('node-midi: RumblePad 2', true);
  midiLog('Connected!');
} catch (e) { midiLog('Cant connect'); }

const channel = 1;