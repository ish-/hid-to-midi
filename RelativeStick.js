import { sendCC } from './midi.js';
import { MIDI } from './config.js';

const STEPS = 128;
const HALF = STEPS / 2;
const CENTER = STEPS / 2;
const GAP = STEPS / 32;
const POW = 5;

export default function RelativeStick (name) {
  var lastValue;
  var cc = 64;
  var speed = 0;
  var t;
  var accel = 0;

  function animate (reset) {
    reset && stop();

    let _speed = speed;
    // if (Math.abs(accel) > .15) {
      if (accel % 1 !== 0) console.log(accel)
      _speed += Math.pow(accel, 1.5) * 16;
    // }

    cc = Math.min(127, Math.max(0, cc + _speed * 3));
    // console.log(cc, speed);

    const value = Math.ceil(cc);
    sendCC(name, value);

    accel = 0;
    t = setTimeout(animate, 8);
  }

  function stop (reset) {
    if (reset) {
      accel = 0;
    }
    clearTimeout(t);
  }

  return {
    proc (value) {
      if (value > CENTER - GAP && value < CENTER + GAP) {
        accel = 0;
        lastValue = 0;
        speed = 0;
        stop();
        return;
      }

      const dir = value < CENTER;
      // if (value % 127 === 0) {
      //   output.send('cc', {
      //     controller: MIDI[name],
      //     value: dir ? 127 : 0,
      //     channel,
      //   });
      //   accel = speed = lastValue = 0;
      //   stop();
      //   return;
      // }
      // console.log(value)

      const lastSpeed = speed;

      var v;
      if (dir) {
        v = (HALF - value) / HALF;
        if (v < lastValue) {
          lastValue /= 2;
          speed = 0;
          console.log('stopped');
          return stop(true);
        }
        speed = Math.pow(v, POW);
      } else {
        v = (value - HALF) / HALF;
        if (v < lastValue) {
          lastValue /= 2;
          speed = 0;
          console.log('stopped');
          return stop(true);
        }
        speed = Math.pow(v, POW) * -1;
      }

      lastValue = v;

      accel = Math.abs(speed - lastSpeed);

      animate(true);
    },
  };
}