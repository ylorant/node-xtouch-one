const XTouchOne = require('../src/index');
const Controls = require('../src/controls');
const { ButtonNames, LightStatus } = require('../src/controls');

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
});

dev.on('btnrelease', (btn) => console.log(ButtonNames[btn])); 