const Controls = require('../controls');
const XTouchOne = require('../index');
const LCD = require('../lcd');

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