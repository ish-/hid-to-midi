import HID from 'node-hid';

function hidLog (str) { console.log('HID: ', str) }
try {
  var device = new HID.HID(1133, 49688);
  hidLog('Connected!')
}
catch (e) {
  hidLog('Cant connect');
  console.error(e);
  process.exit();
}

export default device;