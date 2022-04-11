const Controls = {};

Controls.Buttons = {
    BPM: 1,
    MASTER: 2,
    SELECT: 3,
    MUTE: 4,
    CH_SOLO: 5,
    CH_REC: 6,
    F1: 7,
    F2: 8,
    F3: 9,
    F4: 10,
    F5: 11,
    F6: 12,
    MARKER: 13,
    NUDGE: 14,
    CYCLE: 15,
    DROP: 16,
    REPLACE: 17,
    CLICK: 18,
    SOLO: 19,
    REWIND: 20,
    FORWARD: 21,
    STOP: 22,
    PLAY: 23,
    REC: 24,
    FB_PREV: 25,
    FB_NEXT: 26,
    CH_PREV: 27,
    CH_NEXT: 28,
    SCRUB: 29,
    UP: 30,
    LEFT: 31,
    ENTER: 32,
    RIGHT: 33,
    DOWN: 34,
    FADER: 110, // Fader touch
};

Controls.ButtonNames = {};

for(const [buttonName, buttonCode] of Object.entries(Controls.Buttons)) {
    Controls.ButtonNames[buttonCode] = buttonName[0] + buttonName.toLowerCase().substring(1);
}

Controls.PressStatus = {
    OFF: 0,
    ON: 127
};

Controls.LightStatus = {
    OFF: 0,
    BLINK: 64,
    ON: 127
};

Controls.Fader = 70;
Controls.Encoder = 80;
Controls.Jogwheel = 88;
Controls.FaderLED = 90;

Controls.EncoderMode = {
    RELATIVE: 1,
    ABSOLUTE: 2
};

Controls.Direction = {
    RIGHT: 65,
    LEFT: 1
};

Controls.Levels = {
    MIN: 0,
    MAX: 127
};

// Checks if a code is identifying a button press
Controls.Buttons.match = function(code) {
    return Object.keys(Controls.ButtonNames).includes(code.toString());
};

module.exports = Controls;