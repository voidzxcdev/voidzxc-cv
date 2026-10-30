var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// lib/qr.js
var QrCodeDataType = /* @__PURE__ */ ((QrCodeDataType2) => {
  QrCodeDataType2[QrCodeDataType2["Border"] = -1] = "Border";
  QrCodeDataType2[QrCodeDataType2["Data"] = 0] = "Data";
  QrCodeDataType2[QrCodeDataType2["Function"] = 1] = "Function";
  QrCodeDataType2[QrCodeDataType2["Position"] = 2] = "Position";
  QrCodeDataType2[QrCodeDataType2["Timing"] = 3] = "Timing";
  QrCodeDataType2[QrCodeDataType2["Alignment"] = 4] = "Alignment";
  return QrCodeDataType2;
})(QrCodeDataType || {});
var __defProp2 = Object.defineProperty;
var __defNormalProp = /* @__PURE__ */ __name((obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value, "__defNormalProp");
var __publicField = /* @__PURE__ */ __name((obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
}, "__publicField");
var LOW = [0, 1];
var MEDIUM = [1, 0];
var QUARTILE = [2, 3];
var HIGH = [3, 2];
var EccMap = {
  L: LOW,
  M: MEDIUM,
  Q: QUARTILE,
  H: HIGH
};
var NUMERIC_REGEX = /^[0-9]*$/;
var ALPHANUMERIC_REGEX = /^[A-Z0-9 $%*+.\/:-]*$/;
var ALPHANUMERIC_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
var MIN_VERSION = 1;
var MAX_VERSION = 40;
var PENALTY_N1 = 3;
var PENALTY_N2 = 3;
var PENALTY_N3 = 40;
var PENALTY_N4 = 10;
var ECC_CODEWORDS_PER_BLOCK = [
  // Version: (note that index 0 is for padding, and is set to an illegal value)
  // 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40    Error correction level
  [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  // Low
  [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  // Medium
  [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  // Quartile
  [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
  // High
];
var NUM_ERROR_CORRECTION_BLOCKS = [
  // Version: (note that index 0 is for padding, and is set to an illegal value)
  // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40    Error correction level
  [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  // Low
  [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  // Medium
  [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  // Quartile
  [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
  // High
];
var QrCode = class {
  static {
    __name(this, "QrCode");
  }
  /* -- Constructor (low level) and fields -- */
  // Creates a new QR Code with the given version number,
  // error correction level, data codeword bytes, and mask number.
  // This is a low-level API that most users should not use directly.
  // A mid-level API is the encodeSegments() function.
  constructor(version, ecc, dataCodewords, msk) {
    this.version = version;
    this.ecc = ecc;
    __publicField(this, "size");
    __publicField(this, "mask");
    __publicField(this, "modules", []);
    __publicField(this, "types", []);
    if (version < MIN_VERSION || version > MAX_VERSION)
      throw new RangeError("Version value out of range");
    if (msk < -1 || msk > 7)
      throw new RangeError("Mask value out of range");
    this.size = version * 4 + 17;
    const row = Array.from({ length: this.size }, () => false);
    for (let i = 0; i < this.size; i++) {
      this.modules.push(row.slice());
      this.types.push(row.map(() => 0));
    }
    this.drawFunctionPatterns();
    const allCodewords = this.addEccAndInterleave(dataCodewords);
    this.drawCodewords(allCodewords);
    if (msk === -1) {
      let minPenalty = 1e9;
      for (let i = 0; i < 8; i++) {
        this.applyMask(i);
        this.drawFormatBits(i);
        const penalty = this.getPenaltyScore();
        if (penalty < minPenalty) {
          msk = i;
          minPenalty = penalty;
        }
        this.applyMask(i);
      }
    }
    this.mask = msk;
    this.applyMask(msk);
    this.drawFormatBits(msk);
  }
  /* -- Accessor methods -- */
  // Returns the color of the module (pixel) at the given coordinates, which is false
  // for light or true for dark. The top left corner has the coordinates (x=0, y=0).
  // If the given coordinates are out of bounds, then false (light) is returned.
  getModule(x, y) {
    return x >= 0 && x < this.size && y >= 0 && y < this.size && this.modules[y][x];
  }
  /* -- Private helper methods for constructor: Drawing function modules -- */
  // Reads this object's version field, and draws and marks all function modules.
  drawFunctionPatterns() {
    for (let i = 0; i < this.size; i++) {
      this.setFunctionModule(6, i, i % 2 === 0, QrCodeDataType.Timing);
      this.setFunctionModule(i, 6, i % 2 === 0, QrCodeDataType.Timing);
    }
    this.drawFinderPattern(3, 3);
    this.drawFinderPattern(this.size - 4, 3);
    this.drawFinderPattern(3, this.size - 4);
    const alignPatPos = this.getAlignmentPatternPositions();
    const numAlign = alignPatPos.length;
    for (let i = 0; i < numAlign; i++) {
      for (let j = 0; j < numAlign; j++) {
        if (!(i === 0 && j === 0 || i === 0 && j === numAlign - 1 || i === numAlign - 1 && j === 0))
          this.drawAlignmentPattern(alignPatPos[i], alignPatPos[j]);
      }
    }
    this.drawFormatBits(0);
    this.drawVersion();
  }
  // Draws two copies of the format bits (with its own error correction code)
  // based on the given mask and this object's error correction level field.
  drawFormatBits(mask) {
    const data = this.ecc[1] << 3 | mask;
    let rem = data;
    for (let i = 0; i < 10; i++)
      rem = rem << 1 ^ (rem >>> 9) * 1335;
    const bits = (data << 10 | rem) ^ 21522;
    for (let i = 0; i <= 5; i++)
      this.setFunctionModule(8, i, getBit(bits, i));
    this.setFunctionModule(8, 7, getBit(bits, 6));
    this.setFunctionModule(8, 8, getBit(bits, 7));
    this.setFunctionModule(7, 8, getBit(bits, 8));
    for (let i = 9; i < 15; i++)
      this.setFunctionModule(14 - i, 8, getBit(bits, i));
    for (let i = 0; i < 8; i++)
      this.setFunctionModule(this.size - 1 - i, 8, getBit(bits, i));
    for (let i = 8; i < 15; i++)
      this.setFunctionModule(8, this.size - 15 + i, getBit(bits, i));
    this.setFunctionModule(8, this.size - 8, true);
  }
  // Draws two copies of the version bits (with its own error correction code),
  // based on this object's version field, iff 7 <= version <= 40.
  drawVersion() {
    if (this.version < 7)
      return;
    let rem = this.version;
    for (let i = 0; i < 12; i++)
      rem = rem << 1 ^ (rem >>> 11) * 7973;
    const bits = this.version << 12 | rem;
    for (let i = 0; i < 18; i++) {
      const color = getBit(bits, i);
      const a = this.size - 11 + i % 3;
      const b = Math.floor(i / 3);
      this.setFunctionModule(a, b, color);
      this.setFunctionModule(b, a, color);
    }
  }
  // Draws a 9*9 finder pattern including the border separator,
  // with the center module at (x, y). Modules can be out of bounds.
  drawFinderPattern(x, y) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        const xx = x + dx;
        const yy = y + dy;
        if (xx >= 0 && xx < this.size && yy >= 0 && yy < this.size)
          this.setFunctionModule(xx, yy, dist !== 2 && dist !== 4, QrCodeDataType.Position);
      }
    }
  }
  // Draws a 5*5 alignment pattern, with the center module
  // at (x, y). All modules must be in bounds.
  drawAlignmentPattern(x, y) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        this.setFunctionModule(
          x + dx,
          y + dy,
          Math.max(Math.abs(dx), Math.abs(dy)) !== 1,
          QrCodeDataType.Alignment
        );
      }
    }
  }
  // Sets the color of a module and marks it as a function module.
  // Only used by the constructor. Coordinates must be in bounds.
  setFunctionModule(x, y, isDark, type = QrCodeDataType.Function) {
    this.modules[y][x] = isDark;
    this.types[y][x] = type;
  }
  /* -- Private helper methods for constructor: Codewords and masking -- */
  // Returns a new byte string representing the given data with the appropriate error correction
  // codewords appended to it, based on this object's version and error correction level.
  addEccAndInterleave(data) {
    const ver = this.version;
    const ecl = this.ecc;
    if (data.length !== getNumDataCodewords(ver, ecl))
      throw new RangeError("Invalid argument");
    const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[ecl[0]][ver];
    const blockEccLen = ECC_CODEWORDS_PER_BLOCK[ecl[0]][ver];
    const rawCodewords = Math.floor(getNumRawDataModules(ver) / 8);
    const numShortBlocks = numBlocks - rawCodewords % numBlocks;
    const shortBlockLen = Math.floor(rawCodewords / numBlocks);
    const blocks = [];
    const rsDiv = reedSolomonComputeDivisor(blockEccLen);
    for (let i = 0, k = 0; i < numBlocks; i++) {
      const dat = data.slice(k, k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1));
      k += dat.length;
      const ecc = reedSolomonComputeRemainder(dat, rsDiv);
      if (i < numShortBlocks)
        dat.push(0);
      blocks.push(dat.concat(ecc));
    }
    const result = [];
    for (let i = 0; i < blocks[0].length; i++) {
      blocks.forEach((block, j) => {
        if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks)
          result.push(block[i]);
      });
    }
    return result;
  }
  // Draws the given sequence of 8-bit codewords (data and error correction) onto the entire
  // data area of this QR Code. Function modules need to be marked off before this is called.
  drawCodewords(data) {
    if (data.length !== Math.floor(getNumRawDataModules(this.version) / 8))
      throw new RangeError("Invalid argument");
    let i = 0;
    for (let right = this.size - 1; right >= 1; right -= 2) {
      if (right === 6)
        right = 5;
      for (let vert = 0; vert < this.size; vert++) {
        for (let j = 0; j < 2; j++) {
          const x = right - j;
          const upward = (right + 1 & 2) === 0;
          const y = upward ? this.size - 1 - vert : vert;
          if (!this.types[y][x] && i < data.length * 8) {
            this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7));
            i++;
          }
        }
      }
    }
  }
  // XORs the codeword modules in this QR Code with the given mask pattern.
  // The function modules must be marked and the codeword bits must be drawn
  // before masking. Due to the arithmetic of XOR, calling applyMask() with
  // the same mask value a second time will undo the mask. A final well-formed
  // QR Code needs exactly one (not zero, two, etc.) mask applied.
  applyMask(mask) {
    if (mask < 0 || mask > 7)
      throw new RangeError("Mask value out of range");
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let invert;
        switch (mask) {
          case 0:
            invert = (x + y) % 2 === 0;
            break;
          case 1:
            invert = y % 2 === 0;
            break;
          case 2:
            invert = x % 3 === 0;
            break;
          case 3:
            invert = (x + y) % 3 === 0;
            break;
          case 4:
            invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
            break;
          case 5:
            invert = x * y % 2 + x * y % 3 === 0;
            break;
          case 6:
            invert = (x * y % 2 + x * y % 3) % 2 === 0;
            break;
          case 7:
            invert = ((x + y) % 2 + x * y % 3) % 2 === 0;
            break;
          default:
            throw new Error("Unreachable");
        }
        if (!this.types[y][x] && invert)
          this.modules[y][x] = !this.modules[y][x];
      }
    }
  }
  // Calculates and returns the penalty score based on state of this QR Code's current modules.
  // This is used by the automatic mask choice algorithm to find the mask pattern that yields the lowest score.
  getPenaltyScore() {
    let result = 0;
    for (let y = 0; y < this.size; y++) {
      let runColor = false;
      let runX = 0;
      const runHistory = [0, 0, 0, 0, 0, 0, 0];
      for (let x = 0; x < this.size; x++) {
        if (this.modules[y][x] === runColor) {
          runX++;
          if (runX === 5)
            result += PENALTY_N1;
          else if (runX > 5)
            result++;
        } else {
          this.finderPenaltyAddHistory(runX, runHistory);
          if (!runColor)
            result += this.finderPenaltyCountPatterns(runHistory) * PENALTY_N3;
          runColor = this.modules[y][x];
          runX = 1;
        }
      }
      result += this.finderPenaltyTerminateAndCount(runColor, runX, runHistory) * PENALTY_N3;
    }
    for (let x = 0; x < this.size; x++) {
      let runColor = false;
      let runY = 0;
      const runHistory = [0, 0, 0, 0, 0, 0, 0];
      for (let y = 0; y < this.size; y++) {
        if (this.modules[y][x] === runColor) {
          runY++;
          if (runY === 5)
            result += PENALTY_N1;
          else if (runY > 5)
            result++;
        } else {
          this.finderPenaltyAddHistory(runY, runHistory);
          if (!runColor)
            result += this.finderPenaltyCountPatterns(runHistory) * PENALTY_N3;
          runColor = this.modules[y][x];
          runY = 1;
        }
      }
      result += this.finderPenaltyTerminateAndCount(runColor, runY, runHistory) * PENALTY_N3;
    }
    for (let y = 0; y < this.size - 1; y++) {
      for (let x = 0; x < this.size - 1; x++) {
        const color = this.modules[y][x];
        if (color === this.modules[y][x + 1] && color === this.modules[y + 1][x] && color === this.modules[y + 1][x + 1])
          result += PENALTY_N2;
      }
    }
    let dark = 0;
    for (const row of this.modules)
      dark = row.reduce((sum, color) => sum + (color ? 1 : 0), dark);
    const total = this.size * this.size;
    const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
    result += k * PENALTY_N4;
    return result;
  }
  /* -- Private helper functions -- */
  // Returns an ascending list of positions of alignment patterns for this version number.
  // Each position is in the range [0,177), and are used on both the x and y axes.
  // This could be implemented as lookup table of 40 variable-length lists of integers.
  getAlignmentPatternPositions() {
    if (this.version === 1) {
      return [];
    } else {
      const numAlign = Math.floor(this.version / 7) + 2;
      const step = this.version === 32 ? 26 : Math.ceil((this.version * 4 + 4) / (numAlign * 2 - 2)) * 2;
      const result = [6];
      for (let pos = this.size - 7; result.length < numAlign; pos -= step)
        result.splice(1, 0, pos);
      return result;
    }
  }
  // Can only be called immediately after a light run is added, and
  // returns either 0, 1, or 2. A helper function for getPenaltyScore().
  finderPenaltyCountPatterns(runHistory) {
    const n = runHistory[1];
    const core = n > 0 && runHistory[2] === n && runHistory[3] === n * 3 && runHistory[4] === n && runHistory[5] === n;
    return (core && runHistory[0] >= n * 4 && runHistory[6] >= n ? 1 : 0) + (core && runHistory[6] >= n * 4 && runHistory[0] >= n ? 1 : 0);
  }
  // Must be called at the end of a line (row or column) of modules. A helper function for getPenaltyScore().
  finderPenaltyTerminateAndCount(currentRunColor, currentRunLength, runHistory) {
    if (currentRunColor) {
      this.finderPenaltyAddHistory(currentRunLength, runHistory);
      currentRunLength = 0;
    }
    currentRunLength += this.size;
    this.finderPenaltyAddHistory(currentRunLength, runHistory);
    return this.finderPenaltyCountPatterns(runHistory);
  }
  // Pushes the given value to the front and drops the last value. A helper function for getPenaltyScore().
  finderPenaltyAddHistory(currentRunLength, runHistory) {
    if (runHistory[0] === 0)
      currentRunLength += this.size;
    runHistory.pop();
    runHistory.unshift(currentRunLength);
  }
};
function appendBits(val, len, bb) {
  if (len < 0 || len > 31 || val >>> len !== 0)
    throw new RangeError("Value out of range");
  for (let i = len - 1; i >= 0; i--)
    bb.push(val >>> i & 1);
}
__name(appendBits, "appendBits");
function getBit(x, i) {
  return (x >>> i & 1) !== 0;
}
__name(getBit, "getBit");
var QrSegment = class {
  static {
    __name(this, "QrSegment");
  }
  // Creates a new QR Code segment with the given attributes and data.
  // The character count (numChars) must agree with the mode and the bit buffer length,
  // but the constraint isn't checked. The given bit buffer is cloned and stored.
  constructor(mode, numChars, bitData) {
    this.mode = mode;
    this.numChars = numChars;
    this.bitData = bitData;
    if (numChars < 0)
      throw new RangeError("Invalid argument");
    this.bitData = bitData.slice();
  }
  /* -- Methods -- */
  // Returns a new copy of the data bits of this segment.
  getData() {
    return this.bitData.slice();
  }
};
var MODE_NUMERIC = [1, 10, 12, 14];
var MODE_ALPHANUMERIC = [2, 9, 11, 13];
var MODE_BYTE = [4, 8, 16, 16];
function numCharCountBits(mode, ver) {
  return mode[Math.floor((ver + 7) / 17) + 1];
}
__name(numCharCountBits, "numCharCountBits");
function makeBytes(data) {
  const bb = [];
  for (const b of data)
    appendBits(b, 8, bb);
  return new QrSegment(MODE_BYTE, data.length, bb);
}
__name(makeBytes, "makeBytes");
function makeNumeric(digits) {
  if (!isNumeric(digits))
    throw new RangeError("String contains non-numeric characters");
  const bb = [];
  for (let i = 0; i < digits.length; ) {
    const n = Math.min(digits.length - i, 3);
    appendBits(Number.parseInt(digits.substring(i, i + n), 10), n * 3 + 1, bb);
    i += n;
  }
  return new QrSegment(MODE_NUMERIC, digits.length, bb);
}
__name(makeNumeric, "makeNumeric");
function makeAlphanumeric(text) {
  if (!isAlphanumeric(text))
    throw new RangeError("String contains unencodable characters in alphanumeric mode");
  const bb = [];
  let i;
  for (i = 0; i + 2 <= text.length; i += 2) {
    let temp = ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45;
    temp += ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1));
    appendBits(temp, 11, bb);
  }
  if (i < text.length)
    appendBits(ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)), 6, bb);
  return new QrSegment(MODE_ALPHANUMERIC, text.length, bb);
}
__name(makeAlphanumeric, "makeAlphanumeric");
function makeSegments(text) {
  if (text === "")
    return [];
  else if (isNumeric(text))
    return [makeNumeric(text)];
  else if (isAlphanumeric(text))
    return [makeAlphanumeric(text)];
  else
    return [makeBytes(toUtf8ByteArray(text))];
}
__name(makeSegments, "makeSegments");
function isNumeric(text) {
  return NUMERIC_REGEX.test(text);
}
__name(isNumeric, "isNumeric");
function isAlphanumeric(text) {
  return ALPHANUMERIC_REGEX.test(text);
}
__name(isAlphanumeric, "isAlphanumeric");
function getTotalBits(segs, version) {
  let result = 0;
  for (const seg of segs) {
    const ccbits = numCharCountBits(seg.mode, version);
    if (seg.numChars >= 1 << ccbits)
      return Number.POSITIVE_INFINITY;
    result += 4 + ccbits + seg.bitData.length;
  }
  return result;
}
__name(getTotalBits, "getTotalBits");
function toUtf8ByteArray(str) {
  str = encodeURI(str);
  const result = [];
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) !== "%") {
      result.push(str.charCodeAt(i));
    } else {
      result.push(Number.parseInt(str.substring(i + 1, i + 3), 16));
      i += 2;
    }
  }
  return result;
}
__name(toUtf8ByteArray, "toUtf8ByteArray");
function getNumRawDataModules(ver) {
  if (ver < MIN_VERSION || ver > MAX_VERSION)
    throw new RangeError("Version number out of range");
  let result = (16 * ver + 128) * ver + 64;
  if (ver >= 2) {
    const numAlign = Math.floor(ver / 7) + 2;
    result -= (25 * numAlign - 10) * numAlign - 55;
    if (ver >= 7)
      result -= 36;
  }
  return result;
}
__name(getNumRawDataModules, "getNumRawDataModules");
function getNumDataCodewords(ver, ecl) {
  return Math.floor(getNumRawDataModules(ver) / 8) - ECC_CODEWORDS_PER_BLOCK[ecl[0]][ver] * NUM_ERROR_CORRECTION_BLOCKS[ecl[0]][ver];
}
__name(getNumDataCodewords, "getNumDataCodewords");
function reedSolomonComputeDivisor(degree) {
  if (degree < 1 || degree > 255)
    throw new RangeError("Degree out of range");
  const result = [];
  for (let i = 0; i < degree - 1; i++)
    result.push(0);
  result.push(1);
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = reedSolomonMultiply(result[j], root);
      if (j + 1 < result.length)
        result[j] ^= result[j + 1];
    }
    root = reedSolomonMultiply(root, 2);
  }
  return result;
}
__name(reedSolomonComputeDivisor, "reedSolomonComputeDivisor");
function reedSolomonComputeRemainder(data, divisor) {
  const result = divisor.map((_) => 0);
  for (const b of data) {
    const factor = b ^ result.shift();
    result.push(0);
    divisor.forEach((coef, i) => result[i] ^= reedSolomonMultiply(coef, factor));
  }
  return result;
}
__name(reedSolomonComputeRemainder, "reedSolomonComputeRemainder");
function reedSolomonMultiply(x, y) {
  if (x >>> 8 !== 0 || y >>> 8 !== 0)
    throw new RangeError("Byte out of range");
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = z << 1 ^ (z >>> 7) * 285;
    z ^= (y >>> i & 1) * x;
  }
  return z;
}
__name(reedSolomonMultiply, "reedSolomonMultiply");
function encodeSegments(segs, ecl, minVersion = 1, maxVersion = 40, mask = -1, boostEcl = true) {
  if (!(MIN_VERSION <= minVersion && minVersion <= maxVersion && maxVersion <= MAX_VERSION) || mask < -1 || mask > 7)
    throw new RangeError("Invalid value");
  let version;
  let dataUsedBits;
  for (version = minVersion; ; version++) {
    const dataCapacityBits2 = getNumDataCodewords(version, ecl) * 8;
    const usedBits = getTotalBits(segs, version);
    if (usedBits <= dataCapacityBits2) {
      dataUsedBits = usedBits;
      break;
    }
    if (version >= maxVersion)
      throw new RangeError("Data too long");
  }
  for (const newEcl of [MEDIUM, QUARTILE, HIGH]) {
    if (boostEcl && dataUsedBits <= getNumDataCodewords(version, newEcl) * 8)
      ecl = newEcl;
  }
  const bb = [];
  for (const seg of segs) {
    appendBits(seg.mode[0], 4, bb);
    appendBits(seg.numChars, numCharCountBits(seg.mode, version), bb);
    for (const b of seg.getData())
      bb.push(b);
  }
  const dataCapacityBits = getNumDataCodewords(version, ecl) * 8;
  appendBits(0, Math.min(4, dataCapacityBits - bb.length), bb);
  appendBits(0, (8 - bb.length % 8) % 8, bb);
  for (let padByte = 236; bb.length < dataCapacityBits; padByte ^= 236 ^ 17)
    appendBits(padByte, 8, bb);
  const dataCodewords = Array.from({ length: Math.ceil(bb.length / 8) }, () => 0);
  bb.forEach((b, i) => dataCodewords[i >>> 3] |= b << 7 - (i & 7));
  return new QrCode(version, ecl, dataCodewords, mask);
}
__name(encodeSegments, "encodeSegments");
function encode(data, options) {
  const {
    ecc = "L",
    boostEcc = false,
    minVersion = 1,
    maxVersion = 40,
    maskPattern = -1,
    border = 1
  } = options || {};
  const segment = typeof data === "string" ? makeSegments(data) : Array.isArray(data) ? [makeBytes(data)] : void 0;
  if (!segment)
    throw new Error(`uqr only supports encoding string and binary data, but got: ${typeof data}`);
  const qr = encodeSegments(
    segment,
    EccMap[ecc],
    minVersion,
    maxVersion,
    maskPattern,
    boostEcc
  );
  const result = addBorder({
    version: qr.version,
    maskPattern: qr.mask,
    size: qr.size,
    data: qr.modules,
    types: qr.types
  }, border);
  if (options?.invert)
    result.data = result.data.map((row) => row.map((mod) => !mod));
  options?.onEncoded?.(result);
  return result;
}
__name(encode, "encode");
function addBorder(input, border = 1) {
  if (!border)
    return input;
  const { size } = input;
  const newSize = size + border * 2;
  input.size = newSize;
  input.data.forEach((row) => {
    for (let i = 0; i < border; i++) {
      row.unshift(false);
      row.push(false);
    }
  });
  for (let i = 0; i < border; i++) {
    input.data.unshift(Array.from({ length: newSize }, (_) => false));
    input.data.push(Array.from({ length: newSize }, (_) => false));
  }
  const b = QrCodeDataType.Border;
  input.types.forEach((row) => {
    for (let i = 0; i < border; i++) {
      row.unshift(b);
      row.push(b);
    }
  });
  for (let i = 0; i < border; i++) {
    input.types.unshift(Array.from({ length: newSize }, (_) => b));
    input.types.push(Array.from({ length: newSize }, (_) => b));
  }
  return input;
}
__name(addBorder, "addBorder");
function renderSVG(data, options = {}) {
  const result = encode(data, options);
  const {
    pixelSize = 10,
    whiteColor = "white",
    blackColor = "black"
  } = options;
  const height = result.size * pixelSize;
  const width = result.size * pixelSize;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`;
  const pathes = [];
  for (let row = 0; row < result.size; row++) {
    for (let col = 0; col < result.size; col++) {
      const x = col * pixelSize;
      const y = row * pixelSize;
      if (result.data[row][col])
        pathes.push(`M${x},${y}h${pixelSize}v${pixelSize}h-${pixelSize}z`);
    }
  }
  svg += `<rect fill="${whiteColor}" width="${width}" height="${height}"/>`;
  svg += `<path fill="${blackColor}" d="${pathes.join("")}"/>`;
  svg += "</svg>";
  return svg;
}
__name(renderSVG, "renderSVG");

// dash-ui.js
var RANGES = ["24h", "7d", "30d"];
function renderDash({ site, range, snap }) {
  const q = /* @__PURE__ */ __name((next) => {
    const u = new URL("https://voidzxc.cv/dashboard");
    u.searchParams.set("r", next.range ?? range);
    return u.pathname + u.search;
  }, "q");
  return `
    <header class="top">
      <div class="brand">
        <p class="kicker">voidzxc.cv</p>
        <h1>Traffic</h1>
      </div>
      <nav class="seg">
        ${RANGES.map((item) => `<a class="${item === range ? "on" : ""}" href="${q({ range: item })}">${item}</a>`).join("")}
      </nav>
      <form method="post" action="/dashboard/logout"><button type="submit">Log out</button></form>
    </header>

    <section class="kpis">
      ${kpi("Visitors", snap.visitors, "unique people")}
      ${kpi("Views", snap.views, "page loads")}
      ${kpi("Link clicks", snap.clicks, "outbound hrefs")}
      ${kpi("Per visitor", snap.perVisitor, "pages each")}
    </section>

    <section class="panel chart-wrap">
      <div class="panel-head">
        <h2>Visitors and views</h2>
        <p class="legend"><i class="dot views"></i> Views <i class="dot people"></i> Visitors</p>
      </div>
      ${chart(snap.series)}
    </section>

    <section class="split">
      ${rank("Pages", snap.pages, snap.views)}
      ${rank("Outbound links", snap.links, snap.clicks)}
    </section>

    <section class="split">
      ${rank("Sources", snap.refs, snap.views)}
      ${rank("Countries", snap.countries, snap.visitors || snap.views)}
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Live</h2></div>
      ${live(snap.recent)}
    </section>
  `;
}
__name(renderDash, "renderDash");
function kpi(label, value, hint) {
  const text = label === "Per visitor" ? value ? value.toFixed(1) : "0" : fmt(value);
  return `
    <article class="kpi">
      <p class="label">${esc(label)}</p>
      <p class="num">${esc(text)}</p>
      <p class="hint">${esc(hint)}</p>
    </article>
  `;
}
__name(kpi, "kpi");
function chart(series2) {
  const views = series2?.views || [0];
  const uniques = series2?.uniques || [0];
  const w = 1e3;
  const h = 220;
  const max = Math.max(1, ...views, ...uniques);
  const n = Math.max(views.length, 2);
  const x = /* @__PURE__ */ __name((i) => i / (n - 1) * w, "x");
  const y = /* @__PURE__ */ __name((v) => h - 8 - v / max * (h - 24), "y");
  const line = /* @__PURE__ */ __name((arr) => arr.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" "), "line");
  const area = `M0,${h} ` + views.map((v, i) => `L${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ") + ` L${w},${h} Z`;
  return `
    <svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
      <path d="${area}" fill="rgba(245,245,244,.07)"/>
      <path d="${line(views)}" fill="none" stroke="rgba(245,245,244,.42)" stroke-width="2.2" vector-effect="non-scaling-stroke"/>
      <path d="${line(uniques)}" fill="none" stroke="#f5d76e" stroke-width="2.2" vector-effect="non-scaling-stroke"/>
    </svg>
  `;
}
__name(chart, "chart");
function rank(title, rows, total) {
  const list = rows || [];
  const max = Math.max(1, ...list.map((r) => r.count), total || 0);
  return `
    <section class="panel">
      <div class="panel-head"><h2>${esc(title)}</h2></div>
      ${list.length ? `<ol class="rank">
              ${list.map((row) => {
    const pct = Math.max(2, Math.round(row.count / max * 100));
    return `<li>
                    <span class="name">${esc(row.name)}</span>
                    <span class="track"><b style="width:${pct}%"></b></span>
                    <span class="n">${fmt(row.count)}</span>
                  </li>`;
  }).join("")}
            </ol>` : `<p class="empty">Nothing yet.</p>`}
    </section>
  `;
}
__name(rank, "rank");
function live(rows) {
  const list = (rows || []).slice(0, 18);
  if (!list.length) return `<p class="empty">Waiting for the next visitor.</p>`;
  return `
    <ol class="live">
      ${list.map((row) => {
    const kind = row.kind === "click" ? "Click" : "View";
    const main = row.kind === "click" ? row.href : row.path;
    const extra = row.kind === "click" ? row.path : row.from;
    return `<li>
            <span class="when">${esc(ago(row.at))}</span>
            <span class="kind ${row.kind}">${kind}</span>
            <span class="main">${esc(main)}</span>
            <span class="extra">${esc(extra || "")}</span>
            <span class="geo">${esc(row.country || "")}</span>
          </li>`;
  }).join("")}
    </ol>
  `;
}
__name(live, "live");
function mergeSnaps(a, b, range) {
  const left = a || blank(range);
  const right = b || blank(range);
  const addMaps = /* @__PURE__ */ __name((x, y) => {
    const out = {};
    for (const row of [...x || [], ...y || []]) {
      out[row.name] = (out[row.name] || 0) + row.count;
    }
    return Object.entries(out).sort((p, q) => q[1] - p[1]).slice(0, 8).map(([name, count]) => ({ name, count }));
  }, "addMaps");
  const len = Math.max(left.series.views.length, right.series.views.length, 1);
  const zip = /* @__PURE__ */ __name((key) => Array.from({ length: len }, (_, i) => (left.series[key]?.[i] || 0) + (right.series[key]?.[i] || 0)), "zip");
  const visitors = left.visitors + right.visitors;
  const views = left.views + right.views;
  return {
    range,
    visitors,
    views,
    clicks: left.clicks + right.clicks,
    perVisitor: visitors ? views / visitors : 0,
    series: { views: zip("views"), uniques: zip("uniques"), clicks: zip("clicks") },
    pages: addMaps(left.pages, right.pages),
    links: addMaps(left.links, right.links),
    countries: addMaps(left.countries, right.countries),
    refs: addMaps(left.refs, right.refs),
    utm: addMaps(left.utm, right.utm),
    recent: [...left.recent || [], ...right.recent || []].sort((x, y) => y.at - x.at).slice(0, 18),
    lastSeen: Math.max(left.lastSeen || 0, right.lastSeen || 0)
  };
}
__name(mergeSnaps, "mergeSnaps");
function blank(range) {
  const n = range === "24h" ? 24 : range === "30d" ? 30 : 7;
  const z = Array(n).fill(0);
  return {
    range,
    visitors: 0,
    views: 0,
    clicks: 0,
    perVisitor: 0,
    series: { views: z, uniques: z, clicks: z },
    pages: [],
    links: [],
    countries: [],
    refs: [],
    utm: [],
    recent: [],
    lastSeen: 0
  };
}
__name(blank, "blank");
function dashCss() {
  return `
@font-face{font-family:Geist;font-style:normal;font-weight:400;font-display:swap;src:url("/fonts/geist-sans-400.woff2") format("woff2")}
@font-face{font-family:Geist;font-style:normal;font-weight:500;font-display:swap;src:url("/fonts/geist-sans-500.woff2") format("woff2")}
@font-face{font-family:Geist;font-style:normal;font-weight:600;font-display:swap;src:url("/fonts/geist-sans-600.woff2") format("woff2")}
@font-face{font-family:"Geist Mono";font-style:normal;font-weight:400;font-display:swap;src:url("/fonts/geist-mono-400.woff2") format("woff2")}
:root{--bg:#0c0a09;--fg:#f5f5f4;--muted:#a8a29e;--line:rgb(255 255 255 / .12);--soft:rgb(255 255 255 / .06);--mark:#f5d76e}
*{box-sizing:border-box;margin:0;padding:0}
html,body{min-height:100dvh;background:var(--bg);color:var(--fg);font-family:Geist,ui-sans-serif,system-ui,sans-serif}
::selection{background:var(--mark);color:var(--bg)}
body{padding:1.6rem 1.2rem 4rem}
.is-gate{display:grid;place-items:center}
.gate{width:min(26rem,100%);text-align:center}
.kicker{color:var(--muted);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase}
h1{margin:.15rem 0 0;font-size:clamp(1.8rem,4vw,2.55rem);letter-spacing:-.045em;font-weight:600}
.lede,.hint,.empty{color:var(--muted);font-size:.9rem}
.err{margin:.7rem 0;color:var(--mark)}
.qr{margin:1.1rem auto;width:min(14rem,100%);padding:.7rem;border:1px solid var(--line);background:#f5f5f4}
.qr svg{display:block;width:100%;height:auto}
.secret{margin:0 0 1rem;color:var(--muted);font-family:"Geist Mono",ui-monospace,monospace;font-size:.72rem;word-break:break-all}
.gate form{display:flex;align-items:stretch;justify-content:center;gap:.45rem}
input,button{border:1px solid var(--line);background:var(--bg);color:var(--fg);font:inherit}
input{width:8.6rem;padding:.7rem .45rem;text-align:center;letter-spacing:.28em;font-family:"Geist Mono",ui-monospace,monospace;font-size:1.12rem}
button{padding:.7rem .95rem;cursor:pointer}
button:hover,a:hover{border-color:rgb(255 255 255 / .3)}
.top,section,.kpis,.split{width:min(70rem,100%);margin-left:auto;margin-right:auto}
.top{display:flex;flex-wrap:wrap;align-items:flex-end;gap:.75rem 1.1rem;margin-bottom:1.4rem}
.brand{margin-right:auto}
.seg{display:flex;gap:1rem}
.seg a{color:var(--muted);text-decoration:none;padding-bottom:.2rem;border-bottom:1px solid transparent}
.seg a.on{color:var(--fg);border-bottom-color:var(--fg)}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--line);margin-bottom:.7rem}
.kpi{padding:1.05rem 1.1rem;border-left:1px solid var(--line)}
.kpi:first-child{border-left:0}
.label,.panel-head h2{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:500}
.num{margin:.35rem 0 .15rem;font-size:clamp(1.7rem,3vw,2.35rem);letter-spacing:-.04em;font-weight:600}
.panel{border:1px solid var(--line);padding:1rem 1.1rem 1.05rem;margin-bottom:.7rem}
.panel-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:.7rem}
.chart-wrap{padding-bottom:.55rem}
.chart{display:block;width:100%;height:220px}
.legend{display:flex;align-items:center;gap:.7rem;color:var(--muted);font-size:.78rem}
.dot{display:inline-block;width:.55rem;height:.55rem;margin-right:.25rem}
.dot.views{background:rgb(245 245 244 / .45)}
.dot.people{background:var(--mark)}
.split{display:grid;grid-template-columns:1fr 1fr;gap:.7rem;margin-bottom:.7rem}
.split .panel{margin:0}
.rank,.live{list-style:none}
.rank li{display:grid;grid-template-columns:minmax(0,1fr) minmax(5rem,2fr) auto;align-items:center;gap:.7rem;padding:.42rem 0;border-top:1px solid var(--soft);font-size:.9rem}
.rank .name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.track{height:2px;background:var(--soft)}
.track b{display:block;height:100%;background:rgb(245 245 244 / .55)}
.n{font-family:"Geist Mono",ui-monospace,monospace;font-size:.78rem;color:var(--muted)}
.live li{display:grid;grid-template-columns:4.6rem 3.2rem minmax(0,1fr) minmax(0,.8fr) 2.2rem;gap:.6rem;padding:.4rem 0;border-top:1px solid var(--soft);font-size:.84rem;color:var(--muted)}
.live .main{color:var(--fg);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.live .kind.click{color:var(--mark)}
.empty{padding:.4rem 0}
@media (max-width:860px){
  .kpis,.split{grid-template-columns:1fr 1fr}
  .live li{grid-template-columns:4rem 2.6rem 1fr}
  .live .extra,.live .geo{display:none}
}
@media (max-width:560px){
  .kpis,.split{grid-template-columns:1fr}
  .kpi{border-left:0;border-top:1px solid var(--line)}
  .kpi:first-child{border-top:0}
}
`;
}
__name(dashCss, "dashCss");
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
__name(esc, "esc");
function fmt(n) {
  return new Intl.NumberFormat("en-GB").format(Math.round(n || 0));
}
__name(fmt, "fmt");
function ago(ts) {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1e3));
  if (s < 60) return s + "s";
  if (s < 3600) return Math.round(s / 60) + "m";
  if (s < 86400) return Math.round(s / 3600) + "h";
  return Math.round(s / 86400) + "d";
}
__name(ago, "ago");

// pulse-do.js
import { DurableObject } from "cloudflare:workers";
var HOUR = 36e5;
var DAY = 24 * HOUR;
var KEEP = 30 * DAY;
var MAP_CAP = 80;
var VID_CAP = 8e3;
var RECENT_CAP = 50;
function empty() {
  return { v: 2, hours: {}, days: {}, seen: {}, recent: [], firstSeen: 0, lastSeen: 0 };
}
__name(empty, "empty");
function load(raw) {
  if (!raw || raw.v !== 2) return empty();
  raw.hours ||= {};
  raw.days ||= {};
  raw.seen ||= {};
  raw.recent ||= [];
  return raw;
}
__name(load, "load");
function bump(map, key, by = 1) {
  if (!key) return;
  map[key] = (map[key] || 0) + by;
}
__name(bump, "bump");
function trimMap(map, cap = MAP_CAP) {
  const entries = Object.entries(map);
  if (entries.length <= cap) return map;
  entries.sort((a, b) => b[1] - a[1]);
  return Object.fromEntries(entries.slice(0, cap));
}
__name(trimMap, "trimMap");
function prune(state, now) {
  const cut = now - KEEP;
  for (const key of Object.keys(state.hours)) {
    if (Date.parse(key + ":00:00.000Z") < cut) delete state.hours[key];
  }
  for (const key of Object.keys(state.days)) {
    if (Date.parse(dayMs(key)) < cut) delete state.days[key];
  }
  for (const [vid, at] of Object.entries(state.seen)) {
    if (at < cut) delete state.seen[vid];
  }
}
__name(prune, "prune");
function dayMs(day) {
  return Date.parse(day + "T00:00:00.000Z");
}
__name(dayMs, "dayMs");
function refHost(raw) {
  if (!raw) return "";
  try {
    return new URL(raw).host.replace(/^www\./, "");
  } catch {
    return "";
  }
}
__name(refHost, "refHost");
function sourceOf(ref, utm, host) {
  if (utm) return utm;
  const from = refHost(ref);
  if (!from) return "direct";
  if (host && (from === host || from.endsWith("." + host))) return "direct";
  return from;
}
__name(sourceOf, "sourceOf");
function cleanPath(path) {
  if (!path) return "/";
  return path.split("?")[0].slice(0, 80) || "/";
}
__name(cleanPath, "cleanPath");
function cleanHref(href) {
  try {
    const u = new URL(href);
    const path = u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "");
    return (u.host.replace(/^www\./, "") + path).slice(0, 120);
  } catch {
    return "";
  }
}
__name(cleanHref, "cleanHref");
function dayBucket(state, now) {
  const day = new Date(now).toISOString().slice(0, 10);
  const cur = state.days[day] || {};
  cur.views ||= 0;
  cur.clicks ||= 0;
  cur.pages ||= {};
  cur.links ||= {};
  cur.countries ||= {};
  cur.refs ||= {};
  cur.utm ||= {};
  cur.vids ||= {};
  state.days[day] = cur;
  return cur;
}
__name(dayBucket, "dayBucket");
function hourBucket(state, now) {
  const hour = new Date(now).toISOString().slice(0, 13);
  const cur = state.hours[hour] || {};
  cur.views ||= cur.req || 0;
  cur.uniques ||= 0;
  cur.clicks ||= 0;
  cur.vids ||= {};
  state.hours[hour] = cur;
  return cur;
}
__name(hourBucket, "hourBucket");
function markVid(bucket, vid) {
  if (!vid) return false;
  if (bucket.vids[vid]) return false;
  const keys = Object.keys(bucket.vids);
  if (keys.length >= VID_CAP) return false;
  bucket.vids[vid] = 1;
  bucket.uniques = (bucket.uniques || 0) + 1;
  return true;
}
__name(markVid, "markVid");
function applyView(state, event) {
  const now = event.at || Date.now();
  const hour = hourBucket(state, now);
  const day = dayBucket(state, now);
  hour.views += 1;
  day.views += 1;
  markVid(hour, event.vid);
  if (event.vid && !day.vids[event.vid] && Object.keys(day.vids).length < VID_CAP) {
    day.vids[event.vid] = 1;
  }
  if (event.vid) state.seen[event.vid] = now;
  bump(day.pages, cleanPath(event.path));
  bump(day.countries, event.country || "??");
  bump(day.refs, sourceOf(event.ref, event.utm, event.host));
  bump(day.utm, event.utm);
  day.pages = trimMap(day.pages);
  day.countries = trimMap(day.countries);
  day.refs = trimMap(day.refs);
  day.utm = trimMap(day.utm);
  if (!state.firstSeen) state.firstSeen = now;
  state.lastSeen = now;
  state.recent.unshift({
    kind: "view",
    at: now,
    path: cleanPath(event.path),
    country: event.country || "??",
    from: sourceOf(event.ref, event.utm, event.host)
  });
  state.recent = state.recent.slice(0, RECENT_CAP);
  prune(state, now);
}
__name(applyView, "applyView");
function applyClick(state, event) {
  const href = cleanHref(event.href);
  if (!href) return;
  const now = event.at || Date.now();
  const hour = hourBucket(state, now);
  const day = dayBucket(state, now);
  hour.clicks += 1;
  day.clicks += 1;
  bump(day.links, href);
  day.links = trimMap(day.links);
  if (event.vid) state.seen[event.vid] = now;
  state.lastSeen = now;
  state.recent.unshift({
    kind: "click",
    at: now,
    path: cleanPath(event.path),
    href,
    country: event.country || "??"
  });
  state.recent = state.recent.slice(0, RECENT_CAP);
  prune(state, now);
}
__name(applyClick, "applyClick");
function uniqueIn(state, from) {
  let n = 0;
  for (const at of Object.values(state.seen || {})) {
    if (at >= from) n += 1;
  }
  return n;
}
__name(uniqueIn, "uniqueIn");
function sumRange(state, from) {
  let views = 0;
  let clicks = 0;
  const pages = {};
  const links = {};
  const countries = {};
  const refs = {};
  const utm = {};
  for (const [day, d] of Object.entries(state.days)) {
    if (dayMs(day) < from) continue;
    views += d.views || 0;
    clicks += d.clicks || 0;
    for (const [k, v] of Object.entries(d.pages || {})) bump(pages, k, v);
    for (const [k, v] of Object.entries(d.links || {})) bump(links, k, v);
    for (const [k, v] of Object.entries(d.countries || {})) bump(countries, k, v);
    for (const [k, v] of Object.entries(d.refs || {})) bump(refs, k, v);
    for (const [k, v] of Object.entries(d.utm || {})) bump(utm, k, v);
  }
  return { views, clicks, pages, links, countries, refs, utm };
}
__name(sumRange, "sumRange");
function series(state, range, now) {
  if (range === "24h") {
    const views2 = [];
    const uniques2 = [];
    const clicks2 = [];
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now - i * HOUR).toISOString().slice(0, 13);
      const b = state.hours[hour];
      views2.push(b?.views || 0);
      uniques2.push(b?.uniques || Object.keys(b?.vids || {}).length);
      clicks2.push(b?.clicks || 0);
    }
    return { views: views2, uniques: uniques2, clicks: clicks2, labels: "hour" };
  }
  const days = range === "30d" ? 30 : 7;
  const views = [];
  const uniques = [];
  const clicks = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now - i * DAY).toISOString().slice(0, 10);
    const b = state.days[day];
    views.push(b?.views || 0);
    uniques.push(Object.keys(b?.vids || {}).length);
    clicks.push(b?.clicks || 0);
  }
  return { views, uniques, clicks, labels: "day" };
}
__name(series, "series");
function top(map, n = 8) {
  return Object.entries(map || {}).sort((a, b) => b[1] - a[1]).slice(0, n).map(([name, count]) => ({ name, count }));
}
__name(top, "top");
function rangeMs(range) {
  if (range === "24h") return DAY;
  if (range === "30d") return 30 * DAY;
  return 7 * DAY;
}
__name(rangeMs, "rangeMs");
var SitePulse = class extends DurableObject {
  static {
    __name(this, "SitePulse");
  }
  async hit(event) {
    const state = load(await this.ctx.storage.get("s"));
    if (event.type === "click") applyClick(state, event);
    else applyView(state, event);
    await this.ctx.storage.put("s", state);
  }
  async snapshot(range = "7d") {
    const now = Date.now();
    const from = now - rangeMs(range);
    const state = load(await this.ctx.storage.get("s"));
    const totals = sumRange(state, from);
    const visitors = uniqueIn(state, from);
    return {
      range,
      visitors,
      views: totals.views,
      clicks: totals.clicks,
      perVisitor: visitors ? totals.views / visitors : 0,
      series: series(state, range, now),
      pages: top(totals.pages),
      links: top(totals.links),
      countries: top(totals.countries),
      refs: top(totals.refs),
      utm: top(totals.utm, 6),
      recent: state.recent,
      lastSeen: state.lastSeen
    };
  }
};

// worker.js
var COOKIE = "dash";
var SESSION_MS = 7 * 24 * 36e5;
var FAIL_LIMIT = 8;
var FAIL_MS = 15 * 6e4;
var worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/_pulse" && request.method === "POST") {
      return handlePulse(request, env, "voidzxc.cv");
    }
    if (url.pathname === "/dashboard" || url.pathname.startsWith("/dashboard/")) {
      return handleDash(request, env, url);
    }
    if ((url.pathname === "/" || url.pathname === "/index.html") && (request.method === "GET" || request.method === "HEAD")) {
      const remote = await fetch(
        "https://raw.githubusercontent.com/voidzxcdev/voidzxc-cv/main/index.html",
        { cf: { cacheTtl: 60, cacheEverything: true } }
      );
      if (remote.ok) {
        const { vid: vid2, header: header2 } = visitor(request);
        if (isPageView(request, url)) {
          ctx.waitUntil(recordView(env, request, url, vid2, "voidzxc.cv"));
        }
        let htmlBody = await remote.text();
        let res2 = new Response(request.method === "HEAD" ? null : htmlBody, {
          status: 200,
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "public, max-age=60"
          }
        });
        res2 = await applyPreviewCard(request, res2);
        if (header2 && isPageView(request, url)) {
          const out2 = new Response(res2.body, res2);
          out2.headers.append("Set-Cookie", header2);
          return out2;
        }
        return res2;
      }
    }
    let res = await env.ASSETS.fetch(request);
    const { vid, header } = visitor(request);
    if (isPageView(request, url)) {
      ctx.waitUntil(recordView(env, request, url, vid, "voidzxc.cv"));
    }
    res = await applyPreviewCard(request, res);
    if (isIconPath(url.pathname)) {
      const headers = new Headers(res.headers);
      headers.delete("Set-Cookie");
      headers.set("cache-control", "public, max-age=86400");
      return new Response(res.body, { status: res.status, headers });
    }
    if (!header || !isPageView(request, url)) return res;
    const out = new Response(res.body, res);
    out.headers.append("Set-Cookie", header);
    return out;
  }
};
async function handlePulse(request, env, site) {
  const { vid, header } = visitor(request);
  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  if (body.t === "click" && body.href) {
    try {
      await env.PULSE.get(env.PULSE.idFromName(site)).hit({
        type: "click",
        at: Date.now(),
        href: String(body.href),
        path: String(body.path || "/"),
        vid,
        country: request.cf?.country || "??"
      });
    } catch {
    }
  }
  const headers = { "cache-control": "no-store" };
  if (header) headers["Set-Cookie"] = header;
  return new Response(null, { status: 204, headers });
}
__name(handlePulse, "handlePulse");
async function recordView(env, request, url, vid, site) {
  try {
    await env.PULSE.get(env.PULSE.idFromName(site)).hit({
      type: "view",
      at: Date.now(),
      path: url.pathname,
      host: site,
      vid,
      country: request.cf?.country || "??",
      ref: request.headers.get("referer") || "",
      utm: url.searchParams.get("utm_source") || ""
    });
  } catch {
  }
}
__name(recordView, "recordView");
var SQUARE_PREVIEW = /whatsapp|signal\/|viber|line\//i;
async function applyPreviewCard(request, res) {
  const type = res.headers.get("content-type") || "";
  if (!type.includes("text/html")) return res;
  if (!SQUARE_PREVIEW.test(request.headers.get("user-agent") || "")) return res;
  const body = (await res.text()).replaceAll("og.jpg?v=card2", "og-square.jpg?v=card2").replaceAll('property="og:image:height" content="630"', 'property="og:image:height" content="1200"');
  return new Response(body, res);
}
__name(applyPreviewCard, "applyPreviewCard");
function isIconPath(pathname) {
  return /\/(favicon(\.ico|\.png|\.svg|-\d+\.png)|apple-touch-icon\.png|android-chrome-\d+\.png|site\.webmanifest)$/i.test(
    pathname
  );
}
__name(isIconPath, "isIconPath");
function isPageView(request, url) {
  if (request.headers.get("x-dash-health")) return false;
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  if (url.pathname.startsWith("/dashboard") || url.pathname === "/_pulse") {
    return false;
  }
  if (/\.(css|js|mjs|woff2?|png|jpe?g|gif|svg|ico|map|json|txt|xml)$/i.test(url.pathname)) return false;
  if (url.pathname.startsWith("/fonts/") || url.pathname.startsWith("/icons/")) return false;
  if (/bot|crawl|spider|preview|slurp|facebookexternalhit|whatsapp|telegram/i.test(request.headers.get("user-agent") || "")) {
    return false;
  }
  const dest = request.headers.get("sec-fetch-dest");
  if (dest && dest !== "document") return false;
  return dest === "document" || url.pathname === "/" || !url.pathname.includes(".");
}
__name(isPageView, "isPageView");
function visitor(request) {
  const existing = cookieValue(request, "vid");
  if (existing && /^[a-f0-9]{16,64}$/i.test(existing)) {
    return { vid: existing, header: "" };
  }
  const vid = randomHex(16);
  return {
    vid,
    header: `vid=${vid}; Path=/; Max-Age=31536000; Secure; SameSite=Lax; HttpOnly`
  };
}
__name(visitor, "visitor");
async function handleDash(request, env, url) {
  const path = url.pathname.replace(/\/$/, "") || "/dashboard";
  if (path === "/dashboard/login" && request.method === "POST") {
    return login(request, env);
  }
  if (path === "/dashboard/logout" && request.method === "POST") {
    return logout(request, env);
  }
  if (path !== "/dashboard") {
    return new Response("Not found", { status: 404 });
  }
  const session = await readSession(request, env);
  if (session) {
    const bounce = safeNext(url.searchParams.get("next"));
    if (bounce !== "/dashboard") {
      const headers = new Headers({ Location: "https://voidzxc.cv" + bounce });
      headers.append("Set-Cookie", clearLegacyDashCookie());
      headers.append("Set-Cookie", cookie(session.id, SESSION_MS / 1e3));
      return new Response(null, { status: 302, headers });
    }
    return dashboardPage(env, request);
  }
  return gatePage(env, url.searchParams.get("e"), url.searchParams.get("next"));
}
__name(handleDash, "handleDash");
async function getAuth(env) {
  const row = await env.DASH.get("auth", "json");
  if (row?.secret) return row;
  const secret = randomBase32(20);
  const next = { secret, enrolled: false, enrolledAt: 0 };
  await env.DASH.put("auth", JSON.stringify(next));
  return next;
}
__name(getAuth, "getAuth");
async function login(request, env) {
  const ip = request.headers.get("cf-connecting-ip") || "0";
  const failKey = "fail:" + ip;
  const fails = await env.DASH.get(failKey, "json") || { n: 0, until: 0 };
  if (fails.until && fails.until > Date.now()) {
    return Response.redirect("https://voidzxc.cv/dashboard?e=lock", 303);
  }
  const form = await request.formData();
  const code = String(form.get("code") || "").replace(/\D/g, "");
  const auth = await getAuth(env);
  const ok = await verifyTotp(auth.secret, code);
  if (!ok) {
    const n = (fails.n || 0) + 1;
    const until = n >= FAIL_LIMIT ? Date.now() + FAIL_MS : 0;
    await env.DASH.put(failKey, JSON.stringify({ n, until }), {
      expirationTtl: 60 * 60
    });
    const next2 = safeNext(form.get("next"));
    const q = new URLSearchParams({ e: "code" });
    if (next2 !== "/dashboard") q.set("next", next2);
    return Response.redirect("https://voidzxc.cv/dashboard?" + q.toString(), 303);
  }
  if (!auth.enrolled) {
    auth.enrolled = true;
    auth.enrolledAt = Date.now();
    await env.DASH.put("auth", JSON.stringify(auth));
  }
  await env.DASH.delete(failKey);
  const id = randomHex(24);
  await env.DASH.put(
    "sess:" + id,
    JSON.stringify({ created: Date.now() }),
    { expirationTtl: SESSION_MS / 1e3 }
  );
  const next = safeNext(form.get("next"));
  const headers = new Headers({ Location: next });
  headers.append("Set-Cookie", clearLegacyDashCookie());
  headers.append("Set-Cookie", cookie(id, SESSION_MS / 1e3));
  return new Response(null, { status: 303, headers });
}
__name(login, "login");
async function logout(request, env) {
  const id = cookieValue(request, COOKIE);
  if (id) await env.DASH.delete("sess:" + id);
  const headers = new Headers({ Location: "/dashboard" });
  headers.append("Set-Cookie", clearLegacyDashCookie());
  headers.append("Set-Cookie", cookie("", 0));
  return new Response(null, { status: 303, headers });
}
__name(logout, "logout");
async function readSession(request, env) {
  const id = cookieValue(request, COOKIE);
  if (!id) return null;
  const row = await env.DASH.get("sess:" + id, "json");
  if (!row) return null;
  return { id, created: row.created };
}
__name(readSession, "readSession");
function cookie(value, maxAge) {
  const base = `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
  return value ? base : `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}
__name(cookie, "cookie");
function clearLegacyDashCookie() {
  return `${COOKIE}=; Path=/dashboard; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}
__name(clearLegacyDashCookie, "clearLegacyDashCookie");
function safeNext(_raw) {
  return "/dashboard";
}
__name(safeNext, "safeNext");
function cookieValue(request, name) {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return "";
}
__name(cookieValue, "cookieValue");
async function gatePage(env, err, nextRaw) {
  const auth = await getAuth(env);
  const setup = !auth.enrolled;
  const next = safeNext(nextRaw);
  let qr = "";
  if (setup) {
    const uri = `otpauth://totp/voidzxc.cv:dashboard?secret=${auth.secret}&issuer=voidzxc.cv&algorithm=SHA1&digits=6&period=30`;
    qr = renderSVG(uri, { pixelSize: 8, whiteColor: "#f5f5f4", blackColor: "#0c0a09" });
  }
  const hint = err === "lock" ? "Too many tries. Wait 15 minutes." : err === "code" ? "That code was wrong. Try the next one." : "";
  return html(
    setup ? "Set up Authenticator" : "Dashboard",
    `
    <main class="gate">
      <p class="kicker">voidzxc.cv</p>
      <h1>${setup ? "Scan to open the dashboard" : "Authenticator code"}</h1>
      ${setup ? `<p class="lede">First visit only. Add this to Google Authenticator, then type the 6 digits. After that, the QR never shows again.</p>
             <div class="qr">${qr}</div>
             <p class="secret">${esc2(auth.secret)}</p>` : `<p class="lede">Enter the current 6 digits from Google Authenticator.</p>`}
      ${hint ? `<p class="err">${esc2(hint)}</p>` : ""}
      <form method="post" action="/dashboard/login">
        <input type="hidden" name="next" value="${esc2(next)}" />
        <input
          name="code"
          inputmode="numeric"
          autocomplete="one-time-code"
          maxlength="6"
          pattern="[0-9]{6}"
          placeholder="000000"
          required
          autofocus
        />
        <button type="submit">Enter</button>
      </form>
    </main>
    <script>
      const input = document.querySelector("input[name=code]");
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\\D/g, "").slice(0, 6);
        if (input.value.length === 6) input.form.requestSubmit();
      });
    <\/script>
  `,
    true
  );
}
__name(gatePage, "gatePage");
async function dashboardPage(env, request) {
  const url = new URL(request.url);
  const site = "voidzxc.cv";
  const range = ["24h", "7d", "30d"].includes(url.searchParams.get("r")) ? url.searchParams.get("r") : "7d";
  let snap = null;
  try {
    snap = await env.PULSE.get(env.PULSE.idFromName(site)).snapshot(range);
  } catch {
    snap = null;
  }
  return html(
    "Traffic",
    renderDash({ site, range, snap: snap || mergeSnaps(null, null, range) })
  );
}
__name(dashboardPage, "dashboardPage");
function html(title, body, gate = false) {
  return new Response(
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <meta name="theme-color" content="#0C0A09" />
    <title>${esc2(title)} \xB7 voidzxc.cv</title>
    <link rel="icon" href="https://voidzxc.cv/favicon-48.png?v=mark5" type="image/png" sizes="48x48" />
    <style>${dashCss()}</style>
  </head>
  <body class="${gate ? "is-gate" : ""}">${body}</body>
</html>`,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        "x-robots-tag": "noindex, nofollow",
        "referrer-policy": "same-origin",
        "x-content-type-options": "nosniff"
      }
    }
  );
}
__name(html, "html");
function esc2(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
__name(esc2, "esc");
function randomBase32(bytesLen) {
  const bytes = crypto.getRandomValues(new Uint8Array(bytesLen));
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = 0;
  let value = 0;
  let out = "";
  for (const b of bytes) {
    value = value << 8 | b;
    bits += 8;
    while (bits >= 5) {
      out += alphabet[value >>> bits - 5 & 31];
      bits -= 5;
    }
  }
  if (bits) out += alphabet[value << 5 - bits & 31];
  return out;
}
__name(randomBase32, "randomBase32");
function randomHex(n) {
  const bytes = crypto.getRandomValues(new Uint8Array(n));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(randomHex, "randomHex");
async function verifyTotp(secret, code) {
  if (!/^\d{6}$/.test(code)) return false;
  const step = Math.floor(Date.now() / 1e3 / 30);
  for (const n of [step - 1, step, step + 1]) {
    if (await totp(secret, n) === code) return true;
  }
  return false;
}
__name(verifyTotp, "verifyTotp");
async function totp(secret, counter) {
  const key = base32Decode(secret);
  const raw = new ArrayBuffer(8);
  const view = new DataView(raw);
  view.setUint32(4, counter);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, raw));
  const offset = sig[19] & 15;
  const bin = (sig[offset] & 127) << 24 | sig[offset + 1] << 16 | sig[offset + 2] << 8 | sig[offset + 3];
  return String(bin % 1e6).padStart(6, "0");
}
__name(totp, "totp");
function base32Decode(input) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = input.toUpperCase().replace(/=+$/g, "");
  let bits = 0;
  let value = 0;
  const out = [];
  for (const ch of clean) {
    const idx = alphabet.indexOf(ch);
    if (idx < 0) continue;
    value = value << 5 | idx;
    bits += 5;
    if (bits >= 8) {
      out.push(value >>> bits - 8 & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(out);
}
__name(base32Decode, "base32Decode");
export {
  SitePulse,
  worker_default as default
};
//# sourceMappingURL=worker.js.map
