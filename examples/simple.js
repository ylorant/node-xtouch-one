const Controls = require('../src/controls');
const XTouchOne = require('../src/index');

let dev = new XTouchOne();

dev.on("btnpress", (btn) => dev.light(btn, Controls.LightStatus.ON));
dev.on("btnrelease", (btn) => dev.light(btn, Controls.LightStatus.OFF));
dev.on("debug", (msg) => console.info("[Debug]", msg));
dev.on("error", (msg) => console.info("[Error]", msg));

dev.connect();