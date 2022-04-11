const Controls = require('../src/controls');
const XTouchOne = require('../src/index');
const LCD = require('../src/lcd');

let dev = new XTouchOne();

dev.connect();

dev.clear();

dev.on("fader", (value) => {
    if(value == 127) {
        dev.setLCD(["You", "Lost"], LCD.Background.RED, false, true);
    } else {
        dev.setLCD("CH1    Main", LCD.Background.BLUE, true, false);
    }
});