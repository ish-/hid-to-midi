import easymidi from 'easymidi';
import { MIDI, CHANNEL } from './config.js';

function midiLog (str) { console.log('MIDI: ', str) }

try {
  var output = new easymidi.Output('node-midi: RumblePad 2', true);
  midiLog('Connected!');
} catch (e) {
  midiLog('Cant connect');
  midiLog(e);
  process.exit();
}

export default output;

export function sendCC (name, value, channel = CHANNEL) {
  output.send('cc', {
    controller: MIDI[name],
    value,
    channel,
  });
}

export function sendNote (name, value, channel = CHANNEL) {
  output.send(value ? 'noteon' : 'noteoff', {
    note: MIDI[name],
    velocity: 127,
    channel,
  });
}