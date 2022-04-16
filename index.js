const EventEmitter = require('events');
const Midi = require('midi');
const Segments = require('./segments');
const Controls = require('./controls');
const LCD = require('./lcd');

const CMD_CC = 176;
const CMD_NOTE = 144;

const VALID_CMD_TYPES = [CMD_NOTE, CMD_CC]; // 144: Note on, 176: CC
const RELATIVE_ENCODER_VALUES = [Controls.Direction.LEFT, Controls.Direction.RIGHT];

class XTouchOne extends EventEmitter {
    constructor()
    {
        super();

        // Midi devices
        this.input = new Midi.input();
        this.output = new Midi.output();

        // Default encoder mode is relative, corrected if we detect an absolute value when reading
        this.encoderMode = null;

        this.input.on("message", this.onMidiMessage.bind(this));
    }

    /**
     * Connects to the X-Touch. If no input/output device is provided, it will be auto-guessed.
     * 
     * @param {int} midiInput Midi input device number.
     * @param {int} midiOutput Midi output device number.
     */
    connect(midiInput = null, midiOutput = null)
    {
        // Auto-discover devices if needed
        if(!midiInput || !midiOutput) {
            let devices = this.getDevices();
            
            if(!midiInput) {
                this.emit("debug", "No input device ID provided, auto-discovering it.");
                midiInput = parseInt(Object.keys(devices.input)[0]);
            }
            
            if(!midiOutput) {
                this.emit("debug", "No output device ID provided, auto-discovering it.");
                midiOutput = parseInt(Object.keys(devices.output)[0]);
            }
        }
        
        if(!midiInput || !midiOutput) {
            this.emit("error", "No device discovered.");
            return;
        }

        this.emit("debug", "Input device: " + midiInput);
        this.emit("debug", "Output device: " + midiOutput);

        try {
            this.input.openPort(midiInput);
            this.output.openPort(midiOutput);
        } catch(e) {
            this.emit("error", e);
            this.emit("debug", "Cannot open MIDI port: " + e.message);
        }
    }

    /**
     * Disconnects from the device.
     */
    disconnect()
    {
        this.input.closePort();
        this.output.closePort();
    }

    /**
     * Gets the available MIDI devices.
     * 
     * @returns object The list of available devices as an object with "input" and "output" keys for sorting.
     */
    getDevices()
    {
        let count = 0;
        let i;
        let devices = {input: {}, output: {}};


        // Count the available input ports.
        this.emit("debug", "Discovering input devices:");
        count = this.input.getPortCount();

        for(i = 0; i < count; i++) {
            let deviceName = this.input.getPortName(i);
            let debugMsg = i + ": " + deviceName;

            if(deviceName.match(/x-touch/i)) {
                devices.input[i] = deviceName;
                debugMsg += " (match)";
            }

            this.emit("debug", debugMsg);
        }

        // Count the available output ports.
        this.emit("debug", "Discovering output devices:");
        count = this.output.getPortCount();

        for(i = 0; i < count; i++) {
            var deviceName = this.output.getPortName(i);
            let debugMsg = i + ": " + deviceName;

            if(deviceName.match(/x-touch one/i)) {
                devices.output[i] = deviceName;
                debugMsg += " (match)";
            }

            this.emit("debug", debugMsg);
        }

        return devices;
    }

    /**
     * Callback on MIDI message received.
     * 
     * @param {float} deltaTime Time since last event on the track
     * @param {array} msg The received message
     */
    onMidiMessage(deltaTime, msg)
    {
        // Extract components from the MIDI command
        let [cmdType, target, value] = msg;

        this.emit("debug", "MIDI message: " + msg);

        // Handle only notes and CC
        if(VALID_CMD_TYPES.includes(cmdType)) {
            // Button presses
            if(Controls.Buttons.match(target)) {
                let eventName = value == Controls.PressStatus.ON ? "btnpress" : "btnrelease";
                this.emit("debug", "Button " + eventName.substring(3) + ": " + Controls.ButtonNames[target]);
                this.emit(eventName, target);
            } else if(target == Controls.Encoder) {
                // Guess encoder mode
                if(RELATIVE_ENCODER_VALUES.includes(value)) {
                    this.encoderMode = Controls.EncoderMode.RELATIVE;
                } else {
                    this.encoderMode = Controls.EncoderMode.ABSOLUTE;
                }

                this.emit("encoder", value);
            } else if(target == Controls.Fader) {
                this.emit("fader", value);
            } else if(target == Controls.Jogwheel) {
                this.emit("jogwheel", value);
            }
        }
    }

    /**
     * Changes the light status of a button. Use the Controls constants to select the button and its status.
     * 
     * @param {int} button The button to light up (or down).
     * @param {int} status The button status. 
     */
    light(button, status)
    {
        this.emit("debug", "Setting button light: " + Controls.ButtonNames[button] + " to " + (status ? "on" : "off"));
        this.output.sendMessage([CMD_CC, button, status]);
    }

    /**
     * Moves the fader.
     * 
     * @param {int} level The fader level, between 0 and 127.
     */
    setFaderLevel(level)
    {
        level = this.clampLevel(level);
        
        this.emit("debug", "Setting fader level to " + level);
        this.output.sendMessage([CMD_CC, Controls.Fader, level]);
    }

    /**
     * Sets the fader LED lights level.
     * 
     * @param {int} level The fader LED level, between 0 and 127. Only one LED will be lighted up, due to hardware
     *                    limitations.
     */
    setFaderLEDLevel(level)
    {
        level = this.clampLevel(level);
        
        this.emit("debug", "Setting fader LED level to " + level);
        this.output.sendMessage([CMD_CC, Controls.FaderLED, level]);
    }

    /**
     * Sets the encoder ring level.
     * 
     * @param {int} level Encoder ring level to set, between 0 and 127.
     */
    setEncoderRingLevel(level)
    {
        level = this.clampLevel(level);
        
        this.emit("debug", "Setting encoder ring level to " + level);
        this.output.sendMessage([CMD_CC, Controls.Encoder, level]);
    }

    /**
     * Gets the encoder mode, either relative or absolute.
     * 
     * @returns The encoder mode.
     */
    getEncoderMode()
    {
        return this.encoderMode;
    }

    /**
     * Bounds a level between min and max values for the device accepted levels.
     * 
     * @param {int} level Level to bound.
     * @returns The bounded level.
     */
    clampLevel(level)
    {
        return Math.max(Math.min(level, Controls.Levels.MAX), Controls.Levels.MIN);
    }

    /**
     * Shows a text on the 7 segment display. Maximum allowed text size is 12 characters, minus dots, which will
     * be appended next to the text.
     * 
     * @param {string} str The string to display. Strings above 12 chars will be truncated, and below will be padded.
     * @param {int} pad Pad direction. By default, pads the start, thus aligning text to the right.
     */
    setSegmentDisplay(str, pad = Segments.Pad.START)
    {
        // Segments update message
        let updateMsg = [0x37];

        // Remove dots to count them separately
        let dotPositions = [];
        let firstChrPos = 0;
        
        for(let i = 0; i < str.length; i++) {
            if(str[i] == ".") {
                // Apply the dot on the letter before it and account for previous dots
                dotPositions.push(i - 1 - dotPositions.length);
            }
        }

        str = str.replaceAll(".", "");

        // Max display length is 12 characters, but we pad if needed, since we need to redefine all segments
        if(str.length > 12) {
            str = str.substring(0, 12);
        } else if(str.length < 12) {
            if(pad == Segments.Pad.START) {
                firstChrPos += 12 - str.length; // For dot positioning, move all them right
                str = str.padStart(12, " ");
            } else {
                str = str.padEnd(12, " ");
            }
        }

        let strChars = str.toUpperCase().split('');
        
        // Insert letters/numbers
        for(let chr of strChars) {
            updateMsg.push(Segments.Characters[chr] || Segments.Characters[" "]);
        }

        // Before inserting dots, correct their pos with the padding length
        dotPositions = dotPositions.map((pos) => pos += firstChrPos);

        // Insert dots
        let dotsStatus = 0;
        let multiplier = 1;

        for(let i = 11; i >= 0; i--) {
            // Move bits to prepare for the next number (not on the first loop)
            if(i < 11) {
                multiplier *= 2;
            }

            if(dotPositions.includes(i)) {
                dotsStatus += multiplier;
            }
        }

        // Generate the 2 byte code for the dots position
        let dotBytes = [];
        dotBytes.push((dotsStatus >> 5).toString(2).padStart(7, "0"));
        dotBytes.push((dotsStatus & 31).toString(2).padStart(5, "0"));

        for(let byte of dotBytes) {
            let bitArray = byte.split("");
            let outByte = 0;
            let multiplier = 1;

            for(let bit of bitArray) {
                outByte += parseInt(bit) * multiplier;
                multiplier *= 2;
            }

            updateMsg.push(outByte);
        }

        this.sendSysExMessage(updateMsg);
    }

    /**
     * Clears the 7-segment display.
     */
    clearSegmentDisplay()
    {
        this.setSegmentDisplay(" ".repeat(12));
    }

    /**
     * Sets the text on the LCD screen.
     * 
     * @param {string|array} text The text to be shown, either as one string (14 chars max., split between top and bottom)
     *                            or as an array, where the top row is the 1st element and the bottom one is the 2nd. 
     * @param {int} background The background color to set. Available colors are available in LCD.
     * @param {bool} invertTop Set to true to invert the colors on the top row. Defaults to false.
     * @param {bool} invertBottom Set to true to invert the colors on the bottom row. Defaults to false.
     */
    setLCD(text, background, invertTop = false, invertBottom = false)
    {
        let updateMsg = [0x4c, 0x00];

        // Set background/color byte. Order is 0b00BT0CCC. B = invert bottom, T = invert top, C = BG color.
        let bgByte = 0;

        bgByte += invertBottom ? 32 : 0; // Bit 5
        bgByte += invertTop ? 16 : 0; // Bit 4
        bgByte += background; // Bits 0-2

        updateMsg.push(bgByte);

        // Handle different types of text
        if(text instanceof Array) {
            let textArray = text;
            text = "";
            for(let row of textArray) {
                if(row.length <= 7) {
                    text += row.padEnd(7, " ");
                } else {
                    text += row.substring(0, 6);
                }
            }
        }

        // Crop text to 14 chrs
        if(text.length > 14) {
            text = text.substring(0, 13);
        } else if(text.length < 14) {
            text = text.padEnd(14, " ");
        }

        // Add msg bytes
        for(let i = 0; i < text.length; i++) {
            updateMsg.push(text.charCodeAt(i));
        }

        this.sendSysExMessage(updateMsg);
    }

    /**
     * Clears the LCD.
     */
    clearLCD()
    {
        this.setLCD("", LCD.Background.BLACK, false, false);
    }

    /**
     * Clears everything displayable on the device (buttons, displays, sets the fader to 0).
     */
    clear()
    {
        for(let button in Controls.Buttons) {
            if(typeof Controls.Buttons[button] == "number") {
                this.light(Controls.Buttons[button], Controls.LightStatus.OFF);
            }
        }

        this.clearSegmentDisplay();
        this.setFaderLevel(0);
        this.setFaderLEDLevel(0);
        this.setEncoderRingLevel(0);
        this.clearLCD();
    }

    /**
     * Sends a SysEx message to the 
     * 
     * @param {array} msg The SysEx msg.
     */
    sendSysExMessage(msg)
    {
        // Build the SysEx frame
        let frame = [0xF0, 0x00, 0x20, 0x32, 0x41];

        for(let byte of msg) {
            frame.push(byte);
        }

        frame.push(0xF7);

        // Send it
        this.output.sendMessage(frame);
    }
}

module.exports = XTouchOne;