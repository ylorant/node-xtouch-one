const Segments = {};

// Letters to 7 segments mapping :
// Letters are defined as a number corresponding to a 7-segment 7bit encoding (0xGFEDCBA) using the following mapping :
// --A--
// F---B
// --G--
// E---C
// --D--
Segments.Characters = {
    // Letters
    A: 0b1110111,
    B: 0b1111100,
    C: 0b0111001,
    D: 0b1011110,
    E: 0b1111001,
    F: 0b1110001,
    G: 0b0111101,
    H: 0b1110110,
    I: 0b0110000,
    J: 0b0001110,
    K: 0b1110101,
    L: 0b0111000,
    M: 0b0101011,
    N: 0b0110111,
    O: 0b1011100,
    P: 0b1110011,
    Q: 0b1100111,
    R: 0b1010000,
    S: 0b1101101,
    T: 0b1111000,
    U: 0b0111110,
    V: 0b0011100,
    W: 0b0101010,
    X: 0b1001001,
    Y: 0b1101110,
    Z: 0b1011011,

    // Numbers
    0: 0b0111111,
    1: 0b0000110,
    2: 0b1011011,
    3: 0b1001111,
    4: 0b1100110,
    5: 0b1101101,
    6: 0b1111101,
    7: 0b0100111,
    8: 0b1111111,
    9: 0b1101111,

    " ": 0,
    "=": 0b1001000,
    "?": 0b1010011,
    '"': 0b0100010,
    "'": 0b0100000,
    "-": 0b1000000,
    "_": 0b0001000,
};

Segments.Pad = {
    START: 1,
    END: 2
};

module.exports = Segments;