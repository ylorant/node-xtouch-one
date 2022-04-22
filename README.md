# Node X-Touch One interface library

This library allows you to interface a Behringer X-Touch One using Node.js with the MIDI protocol.
For it to work, the X-Touch One device needs to be configured in MIDI note or MIDI CC mode (either relative or absolute).

## Connect to the X-Touch One

To connect to the X-Touch One, the easiest way is to let the lib automatically detect it :

```js

let xtouch = new XTouchOne();

xtouch.connect();
```

You can also connect using a specific device index, in case you have multiple devices and you want to handle mode
precisely the way you connect to it.

```js
let xtouch = new XTouchOne();

xtouch.connect(1, 1);
```

If you need to, you can also discover the available devices that match the name the X-Touch One should be reporting.
It will return an associative object where keys identify the device ID and values their names.

```js
let xtouch = new XTouchOne();

console.log(xtouch.getDevices());
```

## Disconnect

Disconnecting can be done with the `disconnect()` method :

```js
xtouch.disconnect();
```

## Sending commands

### `light(button, state)`

Sets the light status of the designated button. Buttons can be aliased by constants in `Controls.Buttons`.
The statuses can be aliased by constants in `Controls.LightStatus`. There are 3 available statuses : OFF, ON and BLINK.

```js
xtouch.light(Controls.Button.SCRUB, Controls.LightStatus.BLINK);
xtouch.light(Controls.Button.ENTER, Controls.LightStatus.ON);
```

*Note: You cannot set the button SEGMENT_SOLO to BLINK, only ON and OFF.*

### `setFaderLevel(value)`

Moves the fader to the given value, between 0 (bottom) and 127 (top).

```js
xtouch.setFaderLevel(64); // Mid-level fader
```

### `setFaderLEDLevel(value)`

Sets the fader LED level. Only one LED can be lit up at one time. The LED is set with a value between 0 and 127.
The value will light up accordingly to the level like a reflection of the fader. Values below 8 will turn off the LED.

```js
xtouch.setFaderLEDLevel(64);
```

### `setEncoderRingLevel(value)`

Sets the lit up LED on the encoder ring according to the value (between 0 and 127). There is no way to shut down all
the ring.

```js
xtouch.setEncoderRingLevel(64);
```

### `setSegmentDisplay(str, pad)`

Sets the text/numbers on the 7-segment displays. You can set up to 12 chars, excluding dots (that are inserted between
characters). There is no difference between lower and upper case characters.
For strings shorter than 12 characters, alignment can be set via the pad option: padding from start will align items
to the right, padding from end will align items to the left. By default, it pads from start.

```js
xtouch.setSegmentDisplay("014825030"); // Shows a timecode on the 7-segment display
```

### `clearSegmentDisplay()`

Clears the 7-segment display.

```js
xtouch.clearSegmentDisplay();
```

### `setLCD(text, color, invertTop, invertBottom)`

Sets the text in the small LCD screen above the fader. The `text` parameter defines the text, either as an array (with
2 elements, one for the top text, one for the bottom text) or as a string to redefine the 14 chars as one.
The `color` parameter sets the LCD background color, between the 7 available (+ black which powers down the screen).
Those colors can be aliased with one of the `LCD.Background` constants. 
The `invertTop` and `invertBottom` parameters allows to invert either the top or the bottom line of the display (or both
at the same time). By default both are set as `false`.

```js
xtouch.setLCDDisplay(["Top", "Bottom"], LCD.Background.GREEN);
```

### `clearLCD()`

Clears the LCD screen.

```js
xtouch.clearLCD();
```

### `clear()`

Clears everything on the device.

```js
xtouch.clear();
```

## Reading updates

Reading updates is made using events :

```js
// Button press / fader touch
xtouch.on("btnpress", (btn) => console.log("Button " + Controls.ButtonNames[btn] + " has been pressed."));
// Button release / fader release
xtouch.on("btnrelease", (btn) => console.log("Button " + Controls.ButtonNames[btn] + " has been released."));
// Fader move
xtouch.on("fader", (value) => console.log("Fader value: " + value));
// Encoder move (relative or absolute)
xtouch.on("encoder", (value) => {
    if(xtouch.getEncoderMode() == Controls.EncoderMode.RELATIVE) { // Relative encoder mode
        if(value == Controls.Direction.LEFT) {
            console.log("Encoder moved left");
        } else {
            console.log("Encoder moved right");
        }
    } else { // Absolute encoder mode
        console.log("Encoder value: " + value);
    }
});
// Jogwheel move
xtouch.on("jogwheel", (direction) => {
    if(direction == Controls.Direction.LEFT) {
            console.log("Jogwheel moved left");
        } else {
            console.log("Jogwheel moved right");
        }
});
```


## License

This code is shared under the MIT License.

Copyright (c) 2022 Yohann Lorant

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.