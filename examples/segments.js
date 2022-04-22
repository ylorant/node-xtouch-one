const XTouchOne = require('../index');
const Controls = require('../controls');
const { ButtonNames, LightStatus } = require('../controls');

let btnMessages = {};
btnMessages[Controls.Buttons.REWIND] = "123.45678.9.012";
btnMessages[Controls.Buttons.FORWARD] = "foo.bar";
btnMessages[Controls.Buttons.STOP] = "got milk?";
btnMessages[Controls.Buttons.PLAY] = "01.23.45   ";
btnMessages[Controls.Buttons.REC] = "004258023";

let dev = new XTouchOne();

dev.connect();

dev.on("btnpress", (btn) => {
    if(btnMessages[btn]) {
        for(let i in btnMessages) {
            dev.light(i, LightStatus.OFF);
        }

        dev.light(btn, LightStatus.ON);
        dev.setSegmentDisplay(btnMessages[btn]);

    }

    if(btn == Controls.Buttons.ENTER) {
        dev.light(Controls.Buttons.SEGMENT_SOLO, Controls.LightStatus.ON);
    }
});

dev.on('btnrelease', (btn) => console.log(ButtonNames[btn]));