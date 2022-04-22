const Controls = require('../controls');
const XTouchOne = require('../index');

let dev = new XTouchOne();

let faderLevel = 0;
let scrubMode = false;

dev.on("jogwheel", (direction) => {
    if(direction == Controls.Direction.LEFT) {
        faderLevel -= scrubMode ? 1 : 10;
    } else if(direction == Controls.Direction.RIGHT) {
        faderLevel += scrubMode ? 1 : 10;
    }

    faderLevel = dev.clampLevel(faderLevel);
    dev.setFaderLevel(faderLevel);
});

dev.on("fader", (level) => {
    faderLevel = level;
    dev.setFaderLEDLevel(level);
});
dev.on("btnpress", (btn) => {
    if(btn == Controls.Buttons.SCRUB) {
        scrubMode = !scrubMode;
    }

    dev.light(btn, scrubMode ? Controls.LightStatus.BLINK : Controls.LightStatus.OFF);    
});

dev.on("debug", (msg) => console.info("[Debug]", msg));
dev.on("error", (msg) => console.info("[Error]", msg));

dev.connect();

dev.setFaderLevel(0);