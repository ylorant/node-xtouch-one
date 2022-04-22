const Controls = require('../controls');
const XTouchOne = require('../index');

let dev = new XTouchOne();
let encoderLevel = 0;

dev.on("encoder", (direction) => {
    if(dev.getEncoderMode() == Controls.EncoderMode.RELATIVE) {
        if(direction == Controls.Direction.LEFT) {
            encoderLevel -= 10;
        } else {
            encoderLevel += 10;
        }

        encoderLevel = dev.clampLevel(encoderLevel);
        dev.setEncoderRingLevel(encoderLevel);
    }
});

dev.on("debug", (msg) => console.info("[Debug]", msg));
dev.on("error", (msg) => console.info("[Error]", msg));

dev.connect();

dev.setEncoderRingLevel(-1);