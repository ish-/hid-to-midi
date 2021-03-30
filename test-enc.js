function midiLog (str) { console.log('MIDI: ', str) }

try {
  var easymidi = require('easymidi');
  var output = new easymidi.Output('test', true);
  midiLog('Connected!');
} catch (e) { midiLog('Cant connect'); }

const channel = 1;

setInterval(() => {
  output.send('cc', {
    controller: 64,
    value: 62,
    channel,
  });
}, 1000);