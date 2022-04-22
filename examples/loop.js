const XTouchOne = require("../index");
const Controls = require("../controls");
const Segments = require("../segments");

let dev = new XTouchOne();

dev.connect();

dev.clear();
dev.on("debug", (msg) => console.log(msg));

let startTime = new Date();
let interval = setInterval(() => {
    let now = new Date();
    let timeDiff = now.getTime() - startTime.getTime();

    let ms = 0, s = 0, m = 0, h = 0;
    s = Math.floor(timeDiff / 1000);
    ms = timeDiff - (s * 1000);
    m = Math.floor(s / 60);
    s -= m * 60;
    h = Math.floor(m / 60);
    m -= h * 60;


    let frames = Math.floor(ms / 32).toString().padStart(3, "0");  
    let timeStr = h.toString().padStart(2, "0") + "."
                + m.toString().padStart(2, "0") + "."
                + s.toString().padStart(2, "0") + "."
                + frames;

    dev.setSegmentDisplay(timeStr);
}, 32);

dev.on("btnpress", (btn) => {
    if(btn == Controls.Buttons.ENTER) {
        clearInterval(interval);
        dev.clear();

        dev.disconnect();

        process.exit(0);
    }
});