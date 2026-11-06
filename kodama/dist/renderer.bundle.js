"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // ../node_modules/@smartspectra/node-sdk/js/renderer/timestamp.js
  var require_timestamp = __commonJS({
    "../node_modules/@smartspectra/node-sdk/js/renderer/timestamp.js"(exports, module) {
      "use strict";
      var FrameTimestampAnchor = class {
        constructor() {
          this._epochOffsetUs = null;
          this._lastFrameTs = 0n;
        }
        /**
         * @param {number|bigint} rawTimestampUs VideoFrame.timestamp — already
         *   microseconds, but in its own media-clock domain.
         * @param {number} [nowMs] Wall-clock epoch milliseconds at the moment of
         *   the first call. Defaults to Date.now(); overridable so callers (and
         *   tests) can pin a deterministic anchor.
         * @returns {bigint} Epoch microseconds, strictly greater than every
         *   previous value returned by this instance.
         */
        next(rawTimestampUs, nowMs = Date.now()) {
          const raw = BigInt(rawTimestampUs || 0);
          if (this._epochOffsetUs === null) {
            this._epochOffsetUs = BigInt(nowMs) * 1000n - raw;
          }
          let ts = raw + this._epochOffsetUs;
          if (ts <= this._lastFrameTs) ts = this._lastFrameTs + 1n;
          this._lastFrameTs = ts;
          return ts;
        }
      };
      module.exports = { FrameTimestampAnchor };
    }
  });

  // ../node_modules/@smartspectra/node-sdk/package.json
  var require_package = __commonJS({
    "../node_modules/@smartspectra/node-sdk/package.json"(exports, module) {
      module.exports = {
        name: "@smartspectra/node-sdk",
        version: "3.4.0",
        description: "Node.js (Electron) FFI binding for SmartSpectra vitals measurement",
        author: "Presage Technologies, Inc.",
        license: "SEE LICENSE IN LICENSE",
        main: "js/index.js",
        types: "js/index.d.ts",
        exports: {
          ".": {
            types: "./js/index.d.ts",
            default: "./js/index.js"
          },
          "./main": {
            types: "./js/main/index.d.ts",
            default: "./js/main/index.js"
          },
          "./preload": "./js/preload/index.js",
          "./renderer": {
            types: "./js/renderer/index.d.ts",
            default: "./js/renderer/index.js"
          },
          "./messages": {
            types: "./js/messages/index.d.ts",
            default: "./js/messages/index.js"
          },
          "./package.json": "./package.json"
        },
        files: [
          "js/**/*.js",
          "js/**/*.d.ts",
          "LICENSE",
          "COPYING.LGPLv2.1",
          "COPYING.LGPLv3",
          "THIRD_PARTY_FFMPEG.md",
          "THIRD_PARTY_NOTICES.txt",
          "NOTICE",
          "README.md"
        ],
        scripts: {
          prepare: "node scripts/gen-proto.cjs",
          "build:proto": "node scripts/gen-proto.cjs",
          test: "npm run test:types && node --test test/log-level-pin.js test/renderer-timestamp.js test/camera-selection.js test/reset-lifecycle.js test/smoke.js",
          "test:types": "tsc --noEmit --strict --skipLibCheck --target es2022 --module nodenext test/camera-selection-types.ts",
          "test:models-allowlist": "node test/models-allowlist.js"
        },
        keywords: [
          "smartspectra",
          "vitals",
          "physiology",
          "electron",
          "nodejs",
          "ffi",
          "koffi"
        ],
        repository: {
          type: "git",
          url: "git+https://github.com/Presage-Security/SmartSpectra.git"
        },
        homepage: "https://smartspectra.presagetech.com/",
        bugs: {
          url: "https://github.com/Presage-Security/SmartSpectra/issues"
        },
        publishConfig: {
          registry: "https://registry.npmjs.org/"
        },
        engines: {
          node: ">=20.0.0"
        },
        _nativeRuntime_doc: "Per-platform native packages (@smartspectra/node-sdk-<plat>-<arch>) are injected into dependencies at publish time (absent here so source installs don't fetch them). Why hard deps, not optionalDependencies: see js/resolve-native.js.",
        dependencies: {
          koffi: "^2.10.0",
          protobufjs: "^7.6.5",
          "@smartspectra/node-sdk-linux-x64": "3.4.0",
          "@smartspectra/node-sdk-linux-arm64": "3.4.0",
          "@smartspectra/node-sdk-darwin-arm64": "3.4.0",
          "@smartspectra/node-sdk-win32-x64": "3.4.0"
        },
        devDependencies: {
          "@types/node": "^24.0.0",
          "protobufjs-cli": "^1.1.3",
          typescript: "^6.0.2"
        },
        _overrides_doc: "tmp is pulled in transitively (protobufjs-cli \u2192 tmp) as a build-only devDependency; it is never a runtime dependency and is not shipped to consumers (the published tarball ships js/ + prebuilds only, no node_modules). Pinned to an exact version (not a >= range) to clear GHSA-ph9p-34f9-6g65 (path traversal, affects tmp <0.2.6) and GHSA-7c78-jf6q-g5cm (type-confusion bypass of the 0.2.6 _assertPath guard, affects tmp >=0.2.6) AND to keep installs deterministic \u2014 an open range would let a future install pull a brand-new, not-yet-vetted release. Bump deliberately. Drop this once protobufjs-cli ships a release whose tmp range is already >=0.2.7.",
        overrides: {
          tmp: "0.2.7"
        }
      };
    }
  });

  // ../node_modules/@protobufjs/aspromise/index.js
  var require_aspromise = __commonJS({
    "../node_modules/@protobufjs/aspromise/index.js"(exports, module) {
      "use strict";
      module.exports = asPromise;
      function asPromise(fn, ctx2) {
        var params2 = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
        while (index < arguments.length)
          params2[offset++] = arguments[index++];
        return new Promise(function executor(resolve, reject) {
          params2[offset] = function callback(err) {
            if (pending) {
              pending = false;
              if (err)
                reject(err);
              else {
                var params3 = new Array(arguments.length - 1), offset2 = 0;
                while (offset2 < params3.length)
                  params3[offset2++] = arguments[offset2];
                resolve.apply(null, params3);
              }
            }
          };
          try {
            fn.apply(ctx2 || null, params2);
          } catch (err) {
            if (pending) {
              pending = false;
              reject(err);
            }
          }
        });
      }
    }
  });

  // ../node_modules/@protobufjs/base64/index.js
  var require_base64 = __commonJS({
    "../node_modules/@protobufjs/base64/index.js"(exports) {
      "use strict";
      var base64 = exports;
      base64.length = function length(string) {
        var p = string.length;
        if (!p)
          return 0;
        var n = 0;
        while (--p % 4 > 1 && string.charAt(p) === "=")
          ++n;
        return Math.ceil(string.length * 3) / 4 - n;
      };
      var b64 = new Array(64);
      var s64 = new Array(123);
      for (i = 0; i < 64; )
        s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
      var i;
      base64.encode = function encode(buffer, start2, end) {
        var parts = null, chunk = [];
        var i2 = 0, j = 0, t;
        while (start2 < end) {
          var b = buffer[start2++];
          switch (j) {
            case 0:
              chunk[i2++] = b64[b >> 2];
              t = (b & 3) << 4;
              j = 1;
              break;
            case 1:
              chunk[i2++] = b64[t | b >> 4];
              t = (b & 15) << 2;
              j = 2;
              break;
            case 2:
              chunk[i2++] = b64[t | b >> 6];
              chunk[i2++] = b64[b & 63];
              j = 0;
              break;
          }
          if (i2 > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i2 = 0;
          }
        }
        if (j) {
          chunk[i2++] = b64[t];
          chunk[i2++] = 61;
          if (j === 1)
            chunk[i2++] = 61;
        }
        if (parts) {
          if (i2)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i2)));
          return parts.join("");
        }
        return String.fromCharCode.apply(String, chunk.slice(0, i2));
      };
      var invalidEncoding = "invalid encoding";
      base64.decode = function decode(string, buffer, offset) {
        var start2 = offset;
        var j = 0, t;
        for (var i2 = 0; i2 < string.length; ) {
          var c = string.charCodeAt(i2++);
          if (c === 61 && j > 1)
            break;
          if ((c = s64[c]) === void 0)
            throw Error(invalidEncoding);
          switch (j) {
            case 0:
              t = c;
              j = 1;
              break;
            case 1:
              buffer[offset++] = t << 2 | (c & 48) >> 4;
              t = c;
              j = 2;
              break;
            case 2:
              buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
              t = c;
              j = 3;
              break;
            case 3:
              buffer[offset++] = (t & 3) << 6 | c;
              j = 0;
              break;
          }
        }
        if (j === 1)
          throw Error(invalidEncoding);
        return offset - start2;
      };
      base64.test = function test(string) {
        return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
      };
    }
  });

  // ../node_modules/@protobufjs/eventemitter/index.js
  var require_eventemitter = __commonJS({
    "../node_modules/@protobufjs/eventemitter/index.js"(exports, module) {
      "use strict";
      module.exports = EventEmitter;
      function EventEmitter() {
        this._listeners = /* @__PURE__ */ Object.create(null);
      }
      EventEmitter.prototype.on = function on(evt, fn, ctx2) {
        (this._listeners[evt] || (this._listeners[evt] = [])).push({
          fn,
          ctx: ctx2 || this
        });
        return this;
      };
      EventEmitter.prototype.off = function off(evt, fn) {
        if (evt === void 0)
          this._listeners = /* @__PURE__ */ Object.create(null);
        else {
          if (fn === void 0)
            this._listeners[evt] = [];
          else {
            var listeners = this._listeners[evt];
            if (!listeners)
              return this;
            for (var i = 0; i < listeners.length; )
              if (listeners[i].fn === fn)
                listeners.splice(i, 1);
              else
                ++i;
          }
        }
        return this;
      };
      EventEmitter.prototype.emit = function emit(evt) {
        var listeners = this._listeners[evt];
        if (listeners) {
          var args = [], i = 1;
          for (; i < arguments.length; )
            args.push(arguments[i++]);
          for (i = 0; i < listeners.length; )
            listeners[i].fn.apply(listeners[i++].ctx, args);
        }
        return this;
      };
    }
  });

  // ../node_modules/@protobufjs/float/index.js
  var require_float = __commonJS({
    "../node_modules/@protobufjs/float/index.js"(exports, module) {
      "use strict";
      module.exports = factory(factory);
      function factory(exports2) {
        if (typeof Float32Array !== "undefined") (function() {
          var f32 = new Float32Array([-0]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
          function writeFloat_f32_cpy(val, buf, pos) {
            f32[0] = val;
            buf[pos] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
          }
          function writeFloat_f32_rev(val, buf, pos) {
            f32[0] = val;
            buf[pos] = f8b[3];
            buf[pos + 1] = f8b[2];
            buf[pos + 2] = f8b[1];
            buf[pos + 3] = f8b[0];
          }
          exports2.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
          exports2.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
          function readFloat_f32_cpy(buf, pos) {
            f8b[0] = buf[pos];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            return f32[0];
          }
          function readFloat_f32_rev(buf, pos) {
            f8b[3] = buf[pos];
            f8b[2] = buf[pos + 1];
            f8b[1] = buf[pos + 2];
            f8b[0] = buf[pos + 3];
            return f32[0];
          }
          exports2.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
          exports2.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
        })();
        else (function() {
          function writeFloat_ieee754(writeUint, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
              val = -val;
            if (val === 0)
              writeUint(1 / val > 0 ? (
                /* positive */
                0
              ) : (
                /* negative 0 */
                2147483648
              ), buf, pos);
            else if (isNaN(val))
              writeUint(2143289344, buf, pos);
            else if (val > 34028234663852886e22)
              writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
            else if (val < 11754943508222875e-54)
              writeUint((sign << 31 | Math.round(val / 1401298464324817e-60)) >>> 0, buf, pos);
            else {
              var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
              writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
            }
          }
          exports2.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
          exports2.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
          function readFloat_ieee754(readUint, buf, pos) {
            var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
            return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 1401298464324817e-60 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
          }
          exports2.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
          exports2.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
        })();
        if (typeof Float64Array !== "undefined") (function() {
          var f64 = new Float64Array([-0]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
          function writeDouble_f64_cpy(val, buf, pos) {
            f64[0] = val;
            buf[pos] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
            buf[pos + 4] = f8b[4];
            buf[pos + 5] = f8b[5];
            buf[pos + 6] = f8b[6];
            buf[pos + 7] = f8b[7];
          }
          function writeDouble_f64_rev(val, buf, pos) {
            f64[0] = val;
            buf[pos] = f8b[7];
            buf[pos + 1] = f8b[6];
            buf[pos + 2] = f8b[5];
            buf[pos + 3] = f8b[4];
            buf[pos + 4] = f8b[3];
            buf[pos + 5] = f8b[2];
            buf[pos + 6] = f8b[1];
            buf[pos + 7] = f8b[0];
          }
          exports2.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
          exports2.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
          function readDouble_f64_cpy(buf, pos) {
            f8b[0] = buf[pos];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            f8b[4] = buf[pos + 4];
            f8b[5] = buf[pos + 5];
            f8b[6] = buf[pos + 6];
            f8b[7] = buf[pos + 7];
            return f64[0];
          }
          function readDouble_f64_rev(buf, pos) {
            f8b[7] = buf[pos];
            f8b[6] = buf[pos + 1];
            f8b[5] = buf[pos + 2];
            f8b[4] = buf[pos + 3];
            f8b[3] = buf[pos + 4];
            f8b[2] = buf[pos + 5];
            f8b[1] = buf[pos + 6];
            f8b[0] = buf[pos + 7];
            return f64[0];
          }
          exports2.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
          exports2.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
        })();
        else (function() {
          function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
              val = -val;
            if (val === 0) {
              writeUint(0, buf, pos + off0);
              writeUint(1 / val > 0 ? (
                /* positive */
                0
              ) : (
                /* negative 0 */
                2147483648
              ), buf, pos + off1);
            } else if (isNaN(val)) {
              writeUint(0, buf, pos + off0);
              writeUint(2146959360, buf, pos + off1);
            } else if (val > 17976931348623157e292) {
              writeUint(0, buf, pos + off0);
              writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
            } else {
              var mantissa;
              if (val < 22250738585072014e-324) {
                mantissa = val / 5e-324;
                writeUint(mantissa >>> 0, buf, pos + off0);
                writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
              } else {
                var exponent = Math.floor(Math.log(val) / Math.LN2);
                if (exponent === 1024)
                  exponent = 1023;
                mantissa = val * Math.pow(2, -exponent);
                writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
              }
            }
          }
          exports2.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
          exports2.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
          function readDouble_ieee754(readUint, off0, off1, buf, pos) {
            var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
            var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
            return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
          }
          exports2.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
          exports2.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
        })();
        return exports2;
      }
      function writeUintLE(val, buf, pos) {
        buf[pos] = val & 255;
        buf[pos + 1] = val >>> 8 & 255;
        buf[pos + 2] = val >>> 16 & 255;
        buf[pos + 3] = val >>> 24;
      }
      function writeUintBE(val, buf, pos) {
        buf[pos] = val >>> 24;
        buf[pos + 1] = val >>> 16 & 255;
        buf[pos + 2] = val >>> 8 & 255;
        buf[pos + 3] = val & 255;
      }
      function readUintLE(buf, pos) {
        return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
      }
      function readUintBE(buf, pos) {
        return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
      }
    }
  });

  // ../node_modules/@protobufjs/utf8/index.js
  var require_utf8 = __commonJS({
    "../node_modules/@protobufjs/utf8/index.js"(exports) {
      "use strict";
      var utf8 = exports;
      var replacementCharCode = 65533;
      utf8.length = function utf8_length(string) {
        var len = 0, c = 0;
        for (var i = 0; i < string.length; ++i) {
          c = string.charCodeAt(i);
          if (c < 128)
            len += 1;
          else if (c < 2048)
            len += 2;
          else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
            ++i;
            len += 4;
          } else
            len += 3;
        }
        return len;
      };
      utf8.read = function utf8_read(buffer, start2, end) {
        if (end - start2 < 1)
          return "";
        var parts = null, chunk = [], i = 0, t, t2, c2, c3;
        while (start2 < end) {
          t = buffer[start2++];
          if (t <= 127) {
            chunk[i++] = t;
          } else if (t >= 192 && t < 224) {
            c2 = (t & 31) << 6 | buffer[start2++] & 63;
            chunk[i++] = c2 >= 128 ? c2 : replacementCharCode;
          } else if (t >= 224 && t < 240) {
            c3 = (t & 15) << 12 | (buffer[start2++] & 63) << 6 | buffer[start2++] & 63;
            chunk[i++] = c3 >= 2048 ? c3 : replacementCharCode;
          } else if (t >= 240) {
            t2 = (t & 7) << 18 | (buffer[start2++] & 63) << 12 | (buffer[start2++] & 63) << 6 | buffer[start2++] & 63;
            if (t2 < 65536 || t2 > 1114111)
              chunk[i++] = replacementCharCode;
            else {
              t2 -= 65536;
              chunk[i++] = 55296 + (t2 >> 10);
              chunk[i++] = 56320 + (t2 & 1023);
            }
          }
          if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk.slice(0, i)));
            i = 0;
          }
        }
        if (parts) {
          if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
          return parts.join("");
        }
        return String.fromCharCode.apply(String, chunk.slice(0, i));
      };
      utf8.write = function utf8_write(string, buffer, offset) {
        var start2 = offset, c1, c2;
        for (var i = 0; i < string.length; ++i) {
          c1 = string.charCodeAt(i);
          if (c1 < 128) {
            buffer[offset++] = c1;
          } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6 | 192;
            buffer[offset++] = c1 & 63 | 128;
          } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
            c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
            ++i;
            buffer[offset++] = c1 >> 18 | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6 & 63 | 128;
            buffer[offset++] = c1 & 63 | 128;
          } else {
            buffer[offset++] = c1 >> 12 | 224;
            buffer[offset++] = c1 >> 6 & 63 | 128;
            buffer[offset++] = c1 & 63 | 128;
          }
        }
        return offset - start2;
      };
    }
  });

  // ../node_modules/@protobufjs/pool/index.js
  var require_pool = __commonJS({
    "../node_modules/@protobufjs/pool/index.js"(exports, module) {
      "use strict";
      module.exports = pool;
      function pool(alloc, slice, size) {
        var SIZE = size || 8192;
        var MAX = SIZE >>> 1;
        var slab = null;
        var offset = SIZE;
        return function pool_alloc(size2) {
          if (size2 < 1 || size2 > MAX)
            return alloc(size2);
          if (offset + size2 > SIZE) {
            slab = alloc(SIZE);
            offset = 0;
          }
          var buf = slice.call(slab, offset, offset += size2);
          if (offset & 7)
            offset = (offset | 7) + 1;
          return buf;
        };
      }
    }
  });

  // ../node_modules/protobufjs/src/util/longbits.js
  var require_longbits = __commonJS({
    "../node_modules/protobufjs/src/util/longbits.js"(exports, module) {
      "use strict";
      module.exports = LongBits;
      var util = require_minimal();
      function LongBits(lo, hi) {
        this.lo = lo >>> 0;
        this.hi = hi >>> 0;
      }
      var zero = LongBits.zero = new LongBits(0, 0);
      zero.toNumber = function() {
        return 0;
      };
      zero.zzEncode = zero.zzDecode = function() {
        return this;
      };
      zero.length = function() {
        return 1;
      };
      var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
      LongBits.fromNumber = function fromNumber(value) {
        if (value === 0)
          return zero;
        var sign = value < 0;
        if (sign)
          value = -value;
        var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
        if (sign) {
          hi = ~hi >>> 0;
          lo = ~lo >>> 0;
          if (++lo > 4294967295) {
            lo = 0;
            if (++hi > 4294967295)
              hi = 0;
          }
        }
        return new LongBits(lo, hi);
      };
      LongBits.from = function from(value) {
        if (typeof value === "number")
          return LongBits.fromNumber(value);
        if (util.isString(value)) {
          if (util.Long)
            value = util.Long.fromString(value);
          else
            return LongBits.fromNumber(parseInt(value, 10));
        }
        return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
      };
      LongBits.prototype.toNumber = function toNumber(unsigned) {
        if (!unsigned && this.hi >>> 31) {
          var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
          if (!lo)
            hi = hi + 1 >>> 0;
          return -(lo + hi * 4294967296);
        }
        return this.lo + this.hi * 4294967296;
      };
      LongBits.prototype.toLong = function toLong(unsigned) {
        return util.Long ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned)) : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
      };
      var charCodeAt = String.prototype.charCodeAt;
      LongBits.fromHash = function fromHash(hash) {
        if (hash === zeroHash)
          return zero;
        return new LongBits(
          (charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0,
          (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0
        );
      };
      LongBits.prototype.toHash = function toHash() {
        return String.fromCharCode(
          this.lo & 255,
          this.lo >>> 8 & 255,
          this.lo >>> 16 & 255,
          this.lo >>> 24,
          this.hi & 255,
          this.hi >>> 8 & 255,
          this.hi >>> 16 & 255,
          this.hi >>> 24
        );
      };
      LongBits.prototype.zzEncode = function zzEncode() {
        var mask = this.hi >> 31;
        this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
        this.lo = (this.lo << 1 ^ mask) >>> 0;
        return this;
      };
      LongBits.prototype.zzDecode = function zzDecode() {
        var mask = -(this.lo & 1);
        this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
        this.hi = (this.hi >>> 1 ^ mask) >>> 0;
        return this;
      };
      LongBits.prototype.length = function length() {
        var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
        return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
      };
    }
  });

  // ../node_modules/long/umd/index.js
  var require_umd = __commonJS({
    "../node_modules/long/umd/index.js"(exports, module) {
      (function(global2, factory) {
        function preferDefault(exports2) {
          return exports2.default || exports2;
        }
        if (typeof define === "function" && define.amd) {
          define([], function() {
            var exports2 = {};
            factory(exports2);
            return preferDefault(exports2);
          });
        } else if (typeof exports === "object") {
          factory(exports);
          if (typeof module === "object") module.exports = preferDefault(exports);
        } else {
          (function() {
            var exports2 = {};
            factory(exports2);
            global2.Long = preferDefault(exports2);
          })();
        }
      })(
        typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports,
        function(_exports) {
          "use strict";
          Object.defineProperty(_exports, "__esModule", {
            value: true
          });
          _exports.default = void 0;
          var wasm = null;
          try {
            wasm = new WebAssembly.Instance(
              new WebAssembly.Module(
                new Uint8Array([
                  // \0asm
                  0,
                  97,
                  115,
                  109,
                  // version 1
                  1,
                  0,
                  0,
                  0,
                  // section "type"
                  1,
                  13,
                  2,
                  // 0, () => i32
                  96,
                  0,
                  1,
                  127,
                  // 1, (i32, i32, i32, i32) => i32
                  96,
                  4,
                  127,
                  127,
                  127,
                  127,
                  1,
                  127,
                  // section "function"
                  3,
                  7,
                  6,
                  // 0, type 0
                  0,
                  // 1, type 1
                  1,
                  // 2, type 1
                  1,
                  // 3, type 1
                  1,
                  // 4, type 1
                  1,
                  // 5, type 1
                  1,
                  // section "global"
                  6,
                  6,
                  1,
                  // 0, "high", mutable i32
                  127,
                  1,
                  65,
                  0,
                  11,
                  // section "export"
                  7,
                  50,
                  6,
                  // 0, "mul"
                  3,
                  109,
                  117,
                  108,
                  0,
                  1,
                  // 1, "div_s"
                  5,
                  100,
                  105,
                  118,
                  95,
                  115,
                  0,
                  2,
                  // 2, "div_u"
                  5,
                  100,
                  105,
                  118,
                  95,
                  117,
                  0,
                  3,
                  // 3, "rem_s"
                  5,
                  114,
                  101,
                  109,
                  95,
                  115,
                  0,
                  4,
                  // 4, "rem_u"
                  5,
                  114,
                  101,
                  109,
                  95,
                  117,
                  0,
                  5,
                  // 5, "get_high"
                  8,
                  103,
                  101,
                  116,
                  95,
                  104,
                  105,
                  103,
                  104,
                  0,
                  0,
                  // section "code"
                  10,
                  191,
                  1,
                  6,
                  // 0, "get_high"
                  4,
                  0,
                  35,
                  0,
                  11,
                  // 1, "mul"
                  36,
                  1,
                  1,
                  126,
                  32,
                  0,
                  173,
                  32,
                  1,
                  173,
                  66,
                  32,
                  134,
                  132,
                  32,
                  2,
                  173,
                  32,
                  3,
                  173,
                  66,
                  32,
                  134,
                  132,
                  126,
                  34,
                  4,
                  66,
                  32,
                  135,
                  167,
                  36,
                  0,
                  32,
                  4,
                  167,
                  11,
                  // 2, "div_s"
                  36,
                  1,
                  1,
                  126,
                  32,
                  0,
                  173,
                  32,
                  1,
                  173,
                  66,
                  32,
                  134,
                  132,
                  32,
                  2,
                  173,
                  32,
                  3,
                  173,
                  66,
                  32,
                  134,
                  132,
                  127,
                  34,
                  4,
                  66,
                  32,
                  135,
                  167,
                  36,
                  0,
                  32,
                  4,
                  167,
                  11,
                  // 3, "div_u"
                  36,
                  1,
                  1,
                  126,
                  32,
                  0,
                  173,
                  32,
                  1,
                  173,
                  66,
                  32,
                  134,
                  132,
                  32,
                  2,
                  173,
                  32,
                  3,
                  173,
                  66,
                  32,
                  134,
                  132,
                  128,
                  34,
                  4,
                  66,
                  32,
                  135,
                  167,
                  36,
                  0,
                  32,
                  4,
                  167,
                  11,
                  // 4, "rem_s"
                  36,
                  1,
                  1,
                  126,
                  32,
                  0,
                  173,
                  32,
                  1,
                  173,
                  66,
                  32,
                  134,
                  132,
                  32,
                  2,
                  173,
                  32,
                  3,
                  173,
                  66,
                  32,
                  134,
                  132,
                  129,
                  34,
                  4,
                  66,
                  32,
                  135,
                  167,
                  36,
                  0,
                  32,
                  4,
                  167,
                  11,
                  // 5, "rem_u"
                  36,
                  1,
                  1,
                  126,
                  32,
                  0,
                  173,
                  32,
                  1,
                  173,
                  66,
                  32,
                  134,
                  132,
                  32,
                  2,
                  173,
                  32,
                  3,
                  173,
                  66,
                  32,
                  134,
                  132,
                  130,
                  34,
                  4,
                  66,
                  32,
                  135,
                  167,
                  36,
                  0,
                  32,
                  4,
                  167,
                  11
                ])
              ),
              {}
            ).exports;
          } catch {
          }
          function Long(low, high, unsigned) {
            this.low = low | 0;
            this.high = high | 0;
            this.unsigned = !!unsigned;
          }
          Long.prototype.__isLong__;
          Object.defineProperty(Long.prototype, "__isLong__", {
            value: true
          });
          function isLong(obj) {
            return (obj && obj["__isLong__"]) === true;
          }
          function ctz32(value) {
            var c = Math.clz32(value & -value);
            return value ? 31 - c : c;
          }
          Long.isLong = isLong;
          var INT_CACHE = {};
          var UINT_CACHE = {};
          function fromInt(value, unsigned) {
            var obj, cachedObj, cache;
            if (unsigned) {
              value >>>= 0;
              if (cache = 0 <= value && value < 256) {
                cachedObj = UINT_CACHE[value];
                if (cachedObj) return cachedObj;
              }
              obj = fromBits(value, 0, true);
              if (cache) UINT_CACHE[value] = obj;
              return obj;
            } else {
              value |= 0;
              if (cache = -128 <= value && value < 128) {
                cachedObj = INT_CACHE[value];
                if (cachedObj) return cachedObj;
              }
              obj = fromBits(value, value < 0 ? -1 : 0, false);
              if (cache) INT_CACHE[value] = obj;
              return obj;
            }
          }
          Long.fromInt = fromInt;
          function fromNumber(value, unsigned) {
            if (isNaN(value)) return unsigned ? UZERO : ZERO;
            if (unsigned) {
              if (value < 0) return UZERO;
              if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
            } else {
              if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
              if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
            }
            if (value < 0) return fromNumber(-value, unsigned).neg();
            return fromBits(
              value % TWO_PWR_32_DBL | 0,
              value / TWO_PWR_32_DBL | 0,
              unsigned
            );
          }
          Long.fromNumber = fromNumber;
          function fromBits(lowBits, highBits, unsigned) {
            return new Long(lowBits, highBits, unsigned);
          }
          Long.fromBits = fromBits;
          var pow_dbl = Math.pow;
          function fromString(str, unsigned, radix) {
            if (str.length === 0) throw Error("empty string");
            if (typeof unsigned === "number") {
              radix = unsigned;
              unsigned = false;
            } else {
              unsigned = !!unsigned;
            }
            if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
              return unsigned ? UZERO : ZERO;
            radix = radix || 10;
            if (radix < 2 || 36 < radix) throw RangeError("radix");
            var p;
            if ((p = str.indexOf("-")) > 0) throw Error("interior hyphen");
            else if (p === 0) {
              return fromString(str.substring(1), unsigned, radix).neg();
            }
            var radixToPower = fromNumber(pow_dbl(radix, 8));
            var result = ZERO;
            for (var i = 0; i < str.length; i += 8) {
              var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
              if (size < 8) {
                var power = fromNumber(pow_dbl(radix, size));
                result = result.mul(power).add(fromNumber(value));
              } else {
                result = result.mul(radixToPower);
                result = result.add(fromNumber(value));
              }
            }
            result.unsigned = unsigned;
            return result;
          }
          Long.fromString = fromString;
          function fromValue(val, unsigned) {
            if (typeof val === "number") return fromNumber(val, unsigned);
            if (typeof val === "string") return fromString(val, unsigned);
            return fromBits(
              val.low,
              val.high,
              typeof unsigned === "boolean" ? unsigned : val.unsigned
            );
          }
          Long.fromValue = fromValue;
          var TWO_PWR_16_DBL = 1 << 16;
          var TWO_PWR_24_DBL = 1 << 24;
          var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
          var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
          var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
          var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
          var ZERO = fromInt(0);
          Long.ZERO = ZERO;
          var UZERO = fromInt(0, true);
          Long.UZERO = UZERO;
          var ONE = fromInt(1);
          Long.ONE = ONE;
          var UONE = fromInt(1, true);
          Long.UONE = UONE;
          var NEG_ONE = fromInt(-1);
          Long.NEG_ONE = NEG_ONE;
          var MAX_VALUE = fromBits(4294967295 | 0, 2147483647 | 0, false);
          Long.MAX_VALUE = MAX_VALUE;
          var MAX_UNSIGNED_VALUE = fromBits(4294967295 | 0, 4294967295 | 0, true);
          Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
          var MIN_VALUE = fromBits(0, 2147483648 | 0, false);
          Long.MIN_VALUE = MIN_VALUE;
          var LongPrototype = Long.prototype;
          LongPrototype.toInt = function toInt() {
            return this.unsigned ? this.low >>> 0 : this.low;
          };
          LongPrototype.toNumber = function toNumber() {
            if (this.unsigned)
              return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
            return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
          };
          LongPrototype.toString = function toString(radix) {
            radix = radix || 10;
            if (radix < 2 || 36 < radix) throw RangeError("radix");
            if (this.isZero()) return "0";
            if (this.isNegative()) {
              if (this.eq(MIN_VALUE)) {
                var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
                return div.toString(radix) + rem1.toInt().toString(radix);
              } else return "-" + this.neg().toString(radix);
            }
            var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
            var result = "";
            while (true) {
              var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
              rem = remDiv;
              if (rem.isZero()) return digits + result;
              else {
                while (digits.length < 6) digits = "0" + digits;
                result = "" + digits + result;
              }
            }
          };
          LongPrototype.getHighBits = function getHighBits() {
            return this.high;
          };
          LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
            return this.high >>> 0;
          };
          LongPrototype.getLowBits = function getLowBits() {
            return this.low;
          };
          LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
            return this.low >>> 0;
          };
          LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
            if (this.isNegative())
              return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
            var val = this.high != 0 ? this.high : this.low;
            for (var bit = 31; bit > 0; bit--) if ((val & 1 << bit) != 0) break;
            return this.high != 0 ? bit + 33 : bit + 1;
          };
          LongPrototype.isSafeInteger = function isSafeInteger() {
            var top11Bits = this.high >> 21;
            if (!top11Bits) return true;
            if (this.unsigned) return false;
            return top11Bits === -1 && !(this.low === 0 && this.high === -2097152);
          };
          LongPrototype.isZero = function isZero() {
            return this.high === 0 && this.low === 0;
          };
          LongPrototype.eqz = LongPrototype.isZero;
          LongPrototype.isNegative = function isNegative() {
            return !this.unsigned && this.high < 0;
          };
          LongPrototype.isPositive = function isPositive() {
            return this.unsigned || this.high >= 0;
          };
          LongPrototype.isOdd = function isOdd() {
            return (this.low & 1) === 1;
          };
          LongPrototype.isEven = function isEven() {
            return (this.low & 1) === 0;
          };
          LongPrototype.equals = function equals(other) {
            if (!isLong(other)) other = fromValue(other);
            if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
              return false;
            return this.high === other.high && this.low === other.low;
          };
          LongPrototype.eq = LongPrototype.equals;
          LongPrototype.notEquals = function notEquals(other) {
            return !this.eq(
              /* validates */
              other
            );
          };
          LongPrototype.neq = LongPrototype.notEquals;
          LongPrototype.ne = LongPrototype.notEquals;
          LongPrototype.lessThan = function lessThan(other) {
            return this.comp(
              /* validates */
              other
            ) < 0;
          };
          LongPrototype.lt = LongPrototype.lessThan;
          LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
            return this.comp(
              /* validates */
              other
            ) <= 0;
          };
          LongPrototype.lte = LongPrototype.lessThanOrEqual;
          LongPrototype.le = LongPrototype.lessThanOrEqual;
          LongPrototype.greaterThan = function greaterThan(other) {
            return this.comp(
              /* validates */
              other
            ) > 0;
          };
          LongPrototype.gt = LongPrototype.greaterThan;
          LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
            return this.comp(
              /* validates */
              other
            ) >= 0;
          };
          LongPrototype.gte = LongPrototype.greaterThanOrEqual;
          LongPrototype.ge = LongPrototype.greaterThanOrEqual;
          LongPrototype.compare = function compare(other) {
            if (!isLong(other)) other = fromValue(other);
            if (this.eq(other)) return 0;
            var thisNeg = this.isNegative(), otherNeg = other.isNegative();
            if (thisNeg && !otherNeg) return -1;
            if (!thisNeg && otherNeg) return 1;
            if (!this.unsigned) return this.sub(other).isNegative() ? -1 : 1;
            return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
          };
          LongPrototype.comp = LongPrototype.compare;
          LongPrototype.negate = function negate() {
            if (!this.unsigned && this.eq(MIN_VALUE)) return MIN_VALUE;
            return this.not().add(ONE);
          };
          LongPrototype.neg = LongPrototype.negate;
          LongPrototype.add = function add(addend) {
            if (!isLong(addend)) addend = fromValue(addend);
            var a48 = this.high >>> 16;
            var a32 = this.high & 65535;
            var a16 = this.low >>> 16;
            var a00 = this.low & 65535;
            var b48 = addend.high >>> 16;
            var b32 = addend.high & 65535;
            var b16 = addend.low >>> 16;
            var b00 = addend.low & 65535;
            var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
            c00 += a00 + b00;
            c16 += c00 >>> 16;
            c00 &= 65535;
            c16 += a16 + b16;
            c32 += c16 >>> 16;
            c16 &= 65535;
            c32 += a32 + b32;
            c48 += c32 >>> 16;
            c32 &= 65535;
            c48 += a48 + b48;
            c48 &= 65535;
            return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
          };
          LongPrototype.subtract = function subtract(subtrahend) {
            if (!isLong(subtrahend)) subtrahend = fromValue(subtrahend);
            return this.add(subtrahend.neg());
          };
          LongPrototype.sub = LongPrototype.subtract;
          LongPrototype.multiply = function multiply(multiplier) {
            if (this.isZero()) return this;
            if (!isLong(multiplier)) multiplier = fromValue(multiplier);
            if (wasm) {
              var low = wasm["mul"](
                this.low,
                this.high,
                multiplier.low,
                multiplier.high
              );
              return fromBits(low, wasm["get_high"](), this.unsigned);
            }
            if (multiplier.isZero()) return this.unsigned ? UZERO : ZERO;
            if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
            if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;
            if (this.isNegative()) {
              if (multiplier.isNegative()) return this.neg().mul(multiplier.neg());
              else return this.neg().mul(multiplier).neg();
            } else if (multiplier.isNegative())
              return this.mul(multiplier.neg()).neg();
            if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
              return fromNumber(
                this.toNumber() * multiplier.toNumber(),
                this.unsigned
              );
            var a48 = this.high >>> 16;
            var a32 = this.high & 65535;
            var a16 = this.low >>> 16;
            var a00 = this.low & 65535;
            var b48 = multiplier.high >>> 16;
            var b32 = multiplier.high & 65535;
            var b16 = multiplier.low >>> 16;
            var b00 = multiplier.low & 65535;
            var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
            c00 += a00 * b00;
            c16 += c00 >>> 16;
            c00 &= 65535;
            c16 += a16 * b00;
            c32 += c16 >>> 16;
            c16 &= 65535;
            c16 += a00 * b16;
            c32 += c16 >>> 16;
            c16 &= 65535;
            c32 += a32 * b00;
            c48 += c32 >>> 16;
            c32 &= 65535;
            c32 += a16 * b16;
            c48 += c32 >>> 16;
            c32 &= 65535;
            c32 += a00 * b32;
            c48 += c32 >>> 16;
            c32 &= 65535;
            c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
            c48 &= 65535;
            return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
          };
          LongPrototype.mul = LongPrototype.multiply;
          LongPrototype.divide = function divide(divisor) {
            if (!isLong(divisor)) divisor = fromValue(divisor);
            if (divisor.isZero()) throw Error("division by zero");
            if (wasm) {
              if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) {
                return this;
              }
              var low = (this.unsigned ? wasm["div_u"] : wasm["div_s"])(
                this.low,
                this.high,
                divisor.low,
                divisor.high
              );
              return fromBits(low, wasm["get_high"](), this.unsigned);
            }
            if (this.isZero()) return this.unsigned ? UZERO : ZERO;
            var approx, rem, res;
            if (!this.unsigned) {
              if (this.eq(MIN_VALUE)) {
                if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                  return MIN_VALUE;
                else if (divisor.eq(MIN_VALUE)) return ONE;
                else {
                  var halfThis = this.shr(1);
                  approx = halfThis.div(divisor).shl(1);
                  if (approx.eq(ZERO)) {
                    return divisor.isNegative() ? ONE : NEG_ONE;
                  } else {
                    rem = this.sub(divisor.mul(approx));
                    res = approx.add(rem.div(divisor));
                    return res;
                  }
                }
              } else if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
              if (this.isNegative()) {
                if (divisor.isNegative()) return this.neg().div(divisor.neg());
                return this.neg().div(divisor).neg();
              } else if (divisor.isNegative()) return this.div(divisor.neg()).neg();
              res = ZERO;
            } else {
              if (!divisor.unsigned) divisor = divisor.toUnsigned();
              if (divisor.gt(this)) return UZERO;
              if (divisor.gt(this.shru(1)))
                return UONE;
              res = UZERO;
            }
            rem = this;
            while (rem.gte(divisor)) {
              approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
              var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
              while (approxRem.isNegative() || approxRem.gt(rem)) {
                approx -= delta;
                approxRes = fromNumber(approx, this.unsigned);
                approxRem = approxRes.mul(divisor);
              }
              if (approxRes.isZero()) approxRes = ONE;
              res = res.add(approxRes);
              rem = rem.sub(approxRem);
            }
            return res;
          };
          LongPrototype.div = LongPrototype.divide;
          LongPrototype.modulo = function modulo(divisor) {
            if (!isLong(divisor)) divisor = fromValue(divisor);
            if (wasm) {
              var low = (this.unsigned ? wasm["rem_u"] : wasm["rem_s"])(
                this.low,
                this.high,
                divisor.low,
                divisor.high
              );
              return fromBits(low, wasm["get_high"](), this.unsigned);
            }
            return this.sub(this.div(divisor).mul(divisor));
          };
          LongPrototype.mod = LongPrototype.modulo;
          LongPrototype.rem = LongPrototype.modulo;
          LongPrototype.not = function not() {
            return fromBits(~this.low, ~this.high, this.unsigned);
          };
          LongPrototype.countLeadingZeros = function countLeadingZeros() {
            return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
          };
          LongPrototype.clz = LongPrototype.countLeadingZeros;
          LongPrototype.countTrailingZeros = function countTrailingZeros() {
            return this.low ? ctz32(this.low) : ctz32(this.high) + 32;
          };
          LongPrototype.ctz = LongPrototype.countTrailingZeros;
          LongPrototype.and = function and(other) {
            if (!isLong(other)) other = fromValue(other);
            return fromBits(
              this.low & other.low,
              this.high & other.high,
              this.unsigned
            );
          };
          LongPrototype.or = function or(other) {
            if (!isLong(other)) other = fromValue(other);
            return fromBits(
              this.low | other.low,
              this.high | other.high,
              this.unsigned
            );
          };
          LongPrototype.xor = function xor(other) {
            if (!isLong(other)) other = fromValue(other);
            return fromBits(
              this.low ^ other.low,
              this.high ^ other.high,
              this.unsigned
            );
          };
          LongPrototype.shiftLeft = function shiftLeft(numBits) {
            if (isLong(numBits)) numBits = numBits.toInt();
            if ((numBits &= 63) === 0) return this;
            else if (numBits < 32)
              return fromBits(
                this.low << numBits,
                this.high << numBits | this.low >>> 32 - numBits,
                this.unsigned
              );
            else return fromBits(0, this.low << numBits - 32, this.unsigned);
          };
          LongPrototype.shl = LongPrototype.shiftLeft;
          LongPrototype.shiftRight = function shiftRight(numBits) {
            if (isLong(numBits)) numBits = numBits.toInt();
            if ((numBits &= 63) === 0) return this;
            else if (numBits < 32)
              return fromBits(
                this.low >>> numBits | this.high << 32 - numBits,
                this.high >> numBits,
                this.unsigned
              );
            else
              return fromBits(
                this.high >> numBits - 32,
                this.high >= 0 ? 0 : -1,
                this.unsigned
              );
          };
          LongPrototype.shr = LongPrototype.shiftRight;
          LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
            if (isLong(numBits)) numBits = numBits.toInt();
            if ((numBits &= 63) === 0) return this;
            if (numBits < 32)
              return fromBits(
                this.low >>> numBits | this.high << 32 - numBits,
                this.high >>> numBits,
                this.unsigned
              );
            if (numBits === 32) return fromBits(this.high, 0, this.unsigned);
            return fromBits(this.high >>> numBits - 32, 0, this.unsigned);
          };
          LongPrototype.shru = LongPrototype.shiftRightUnsigned;
          LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
          LongPrototype.rotateLeft = function rotateLeft(numBits) {
            var b;
            if (isLong(numBits)) numBits = numBits.toInt();
            if ((numBits &= 63) === 0) return this;
            if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
            if (numBits < 32) {
              b = 32 - numBits;
              return fromBits(
                this.low << numBits | this.high >>> b,
                this.high << numBits | this.low >>> b,
                this.unsigned
              );
            }
            numBits -= 32;
            b = 32 - numBits;
            return fromBits(
              this.high << numBits | this.low >>> b,
              this.low << numBits | this.high >>> b,
              this.unsigned
            );
          };
          LongPrototype.rotl = LongPrototype.rotateLeft;
          LongPrototype.rotateRight = function rotateRight(numBits) {
            var b;
            if (isLong(numBits)) numBits = numBits.toInt();
            if ((numBits &= 63) === 0) return this;
            if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
            if (numBits < 32) {
              b = 32 - numBits;
              return fromBits(
                this.high << b | this.low >>> numBits,
                this.low << b | this.high >>> numBits,
                this.unsigned
              );
            }
            numBits -= 32;
            b = 32 - numBits;
            return fromBits(
              this.low << b | this.high >>> numBits,
              this.high << b | this.low >>> numBits,
              this.unsigned
            );
          };
          LongPrototype.rotr = LongPrototype.rotateRight;
          LongPrototype.toSigned = function toSigned() {
            if (!this.unsigned) return this;
            return fromBits(this.low, this.high, false);
          };
          LongPrototype.toUnsigned = function toUnsigned() {
            if (this.unsigned) return this;
            return fromBits(this.low, this.high, true);
          };
          LongPrototype.toBytes = function toBytes(le) {
            return le ? this.toBytesLE() : this.toBytesBE();
          };
          LongPrototype.toBytesLE = function toBytesLE() {
            var hi = this.high, lo = this.low;
            return [
              lo & 255,
              lo >>> 8 & 255,
              lo >>> 16 & 255,
              lo >>> 24,
              hi & 255,
              hi >>> 8 & 255,
              hi >>> 16 & 255,
              hi >>> 24
            ];
          };
          LongPrototype.toBytesBE = function toBytesBE() {
            var hi = this.high, lo = this.low;
            return [
              hi >>> 24,
              hi >>> 16 & 255,
              hi >>> 8 & 255,
              hi & 255,
              lo >>> 24,
              lo >>> 16 & 255,
              lo >>> 8 & 255,
              lo & 255
            ];
          };
          Long.fromBytes = function fromBytes(bytes, unsigned, le) {
            return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
          };
          Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
            return new Long(
              bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24,
              bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24,
              unsigned
            );
          };
          Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
            return new Long(
              bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7],
              bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3],
              unsigned
            );
          };
          if (typeof BigInt === "function") {
            Long.fromBigInt = function fromBigInt(value, unsigned) {
              var lowBits = Number(BigInt.asIntN(32, value));
              var highBits = Number(BigInt.asIntN(32, value >> BigInt(32)));
              return fromBits(lowBits, highBits, unsigned);
            };
            Long.fromValue = function fromValueWithBigInt(value, unsigned) {
              if (typeof value === "bigint") return Long.fromBigInt(value, unsigned);
              return fromValue(value, unsigned);
            };
            LongPrototype.toBigInt = function toBigInt() {
              var lowBigInt = BigInt(this.low >>> 0);
              var highBigInt = BigInt(this.unsigned ? this.high >>> 0 : this.high);
              return highBigInt << BigInt(32) | lowBigInt;
            };
          }
          var _default = _exports.default = Long;
        }
      );
    }
  });

  // ../node_modules/protobufjs/src/util/minimal.js
  var require_minimal = __commonJS({
    "../node_modules/protobufjs/src/util/minimal.js"(exports) {
      "use strict";
      var util = exports;
      util.asPromise = require_aspromise();
      util.base64 = require_base64();
      util.EventEmitter = require_eventemitter();
      util.float = require_float();
      util.utf8 = require_utf8();
      util.pool = require_pool();
      util.LongBits = require_longbits();
      function isUnsafeProperty(key) {
        return key === "__proto__" || key === "prototype" || key === "constructor";
      }
      util.isUnsafeProperty = isUnsafeProperty;
      util.isNode = Boolean(typeof global !== "undefined" && global && global.process && global.process.versions && global.process.versions.node);
      util.global = util.isNode && global || typeof window !== "undefined" && window || typeof self !== "undefined" && self || exports;
      util.emptyArray = Object.freeze ? Object.freeze([]) : (
        /* istanbul ignore next */
        []
      );
      util.emptyObject = Object.freeze ? Object.freeze({}) : (
        /* istanbul ignore next */
        {}
      );
      util.isInteger = Number.isInteger || /* istanbul ignore next */
      function isInteger(value) {
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
      };
      util.isString = function isString(value) {
        return typeof value === "string" || value instanceof String;
      };
      util.isObject = function isObject(value) {
        return value && typeof value === "object";
      };
      util.isset = /**
       * Checks if a property on a message is considered to be present.
       * @param {Object} obj Plain object or message instance
       * @param {string} prop Property name
       * @returns {boolean} `true` if considered to be present, otherwise `false`
       */
      util.isSet = function isSet(obj, prop) {
        var value = obj[prop];
        if (value != null && Object.hasOwnProperty.call(obj, prop))
          return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
        return false;
      };
      util.Buffer = (function() {
        try {
          var Buffer2 = util.global.Buffer;
          return Buffer2.prototype.utf8Write ? Buffer2 : (
            /* istanbul ignore next */
            null
          );
        } catch (e) {
          return null;
        }
      })();
      util._Buffer_from = null;
      util._Buffer_allocUnsafe = null;
      util.newBuffer = function newBuffer(sizeOrArray) {
        return typeof sizeOrArray === "number" ? util.Buffer ? util._Buffer_allocUnsafe(sizeOrArray) : new util.Array(sizeOrArray) : util.Buffer ? util._Buffer_from(sizeOrArray) : typeof Uint8Array === "undefined" ? sizeOrArray : new Uint8Array(sizeOrArray);
      };
      util.Array = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      util.Long = /* istanbul ignore next */
      util.global.dcodeIO && /* istanbul ignore next */
      util.global.dcodeIO.Long || /* istanbul ignore next */
      util.global.Long || (function() {
        try {
          var Long = require_umd();
          return Long && Long.isLong ? Long : null;
        } catch (e) {
          return null;
        }
      })();
      util.key2Re = /^true|false|0|1$/;
      util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
      util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
      util.longToHash = function longToHash(value) {
        return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
      };
      util.longFromHash = function longFromHash(hash, unsigned) {
        var bits = util.LongBits.fromHash(hash);
        if (util.Long)
          return util.Long.fromBits(bits.lo, bits.hi, unsigned);
        return bits.toNumber(Boolean(unsigned));
      };
      function merge(dst) {
        var ifNotSet = typeof arguments[arguments.length - 1] === "boolean", limit = ifNotSet ? arguments.length - 1 : arguments.length;
        ifNotSet = ifNotSet && arguments[arguments.length - 1];
        for (var a = 1; a < limit; ++a) {
          var src = arguments[a];
          if (!src)
            continue;
          for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
            if (!isUnsafeProperty(keys[i]) && (dst[keys[i]] === void 0 || !ifNotSet))
              dst[keys[i]] = src[keys[i]];
        }
        return dst;
      }
      util.merge = merge;
      util.nestingLimit = 32;
      util.recursionLimit = 100;
      util.makeProp = function makeProp(obj, key) {
        Object.defineProperty(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true
        });
      };
      util.lcFirst = function lcFirst(str) {
        return str.charAt(0).toLowerCase() + str.substring(1);
      };
      function newError(name) {
        function CustomError(message, properties) {
          if (!(this instanceof CustomError))
            return new CustomError(message, properties);
          Object.defineProperty(this, "message", { get: function() {
            return message;
          } });
          if (Error.captureStackTrace)
            Error.captureStackTrace(this, CustomError);
          else
            Object.defineProperty(this, "stack", { value: new Error().stack || "" });
          if (properties)
            merge(this, properties);
        }
        CustomError.prototype = Object.create(Error.prototype, {
          constructor: {
            value: CustomError,
            writable: true,
            enumerable: false,
            configurable: true
          },
          name: {
            get: function get() {
              return name;
            },
            set: void 0,
            enumerable: false,
            // configurable: false would accurately preserve the behavior of
            // the original, but I'm guessing that was not intentional.
            // For an actual error subclass, this property would
            // be configurable.
            configurable: true
          },
          toString: {
            value: function value() {
              return this.name + ": " + this.message;
            },
            writable: true,
            enumerable: false,
            configurable: true
          }
        });
        return CustomError;
      }
      util.newError = newError;
      util.ProtocolError = newError("ProtocolError");
      util.oneOfGetter = function getOneOf(fieldNames) {
        var fieldMap = {};
        for (var i = 0; i < fieldNames.length; ++i)
          fieldMap[fieldNames[i]] = 1;
        return function() {
          for (var keys = Object.keys(this), i2 = keys.length - 1; i2 > -1; --i2)
            if (fieldMap[keys[i2]] === 1 && this[keys[i2]] !== void 0 && this[keys[i2]] !== null)
              return keys[i2];
        };
      };
      util.oneOfSetter = function setOneOf(fieldNames) {
        return function(name) {
          for (var i = 0; i < fieldNames.length; ++i)
            if (fieldNames[i] !== name)
              delete this[fieldNames[i]];
        };
      };
      util.toJSONOptions = {
        longs: String,
        enums: String,
        bytes: String,
        json: true
      };
      util._configure = function() {
        var Buffer2 = util.Buffer;
        if (!Buffer2) {
          util._Buffer_from = util._Buffer_allocUnsafe = null;
          return;
        }
        util._Buffer_from = Buffer2.from !== Uint8Array.from && Buffer2.from || /* istanbul ignore next */
        function Buffer_from(value, encoding) {
          return new Buffer2(value, encoding);
        };
        util._Buffer_allocUnsafe = Buffer2.allocUnsafe || /* istanbul ignore next */
        function Buffer_allocUnsafe(size) {
          return new Buffer2(size);
        };
      };
    }
  });

  // ../node_modules/protobufjs/src/writer.js
  var require_writer = __commonJS({
    "../node_modules/protobufjs/src/writer.js"(exports, module) {
      "use strict";
      module.exports = Writer;
      var util = require_minimal();
      var BufferWriter;
      var LongBits = util.LongBits;
      var base64 = util.base64;
      var utf8 = util.utf8;
      function Op(fn, len, val) {
        this.fn = fn;
        this.len = len;
        this.next = void 0;
        this.val = val;
      }
      function noop() {
      }
      function State(writer) {
        this.head = writer.head;
        this.tail = writer.tail;
        this.len = writer.len;
        this.next = writer.states;
      }
      function Writer() {
        this.len = 0;
        this.head = new Op(noop, 0, 0);
        this.tail = this.head;
        this.states = null;
      }
      var create = function create2() {
        return util.Buffer ? function create_buffer_setup() {
          return (Writer.create = function create_buffer() {
            return new BufferWriter();
          })();
        } : function create_array() {
          return new Writer();
        };
      };
      Writer.create = create();
      Writer.alloc = function alloc(size) {
        return new util.Array(size);
      };
      if (util.Array !== Array)
        Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);
      Writer.prototype._push = function push(fn, len, val) {
        this.tail = this.tail.next = new Op(fn, len, val);
        this.len += len;
        return this;
      };
      function writeByte(val, buf, pos) {
        buf[pos] = val & 255;
      }
      function writeVarint32(val, buf, pos) {
        while (val > 127) {
          buf[pos++] = val & 127 | 128;
          val >>>= 7;
        }
        buf[pos] = val;
      }
      function VarintOp(len, val) {
        this.len = len;
        this.next = void 0;
        this.val = val;
      }
      VarintOp.prototype = Object.create(Op.prototype);
      VarintOp.prototype.fn = writeVarint32;
      Writer.prototype.uint32 = function write_uint32(value) {
        this.len += (this.tail = this.tail.next = new VarintOp(
          (value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5,
          value
        )).len;
        return this;
      };
      Writer.prototype.int32 = function write_int32(value) {
        return (value |= 0) < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
      };
      Writer.prototype.sint32 = function write_sint32(value) {
        return this.uint32((value << 1 ^ value >> 31) >>> 0);
      };
      function writeVarint64(val, buf, pos) {
        var lo = val.lo, hi = val.hi;
        while (hi) {
          buf[pos++] = lo & 127 | 128;
          lo = (lo >>> 7 | hi << 25) >>> 0;
          hi >>>= 7;
        }
        while (lo > 127) {
          buf[pos++] = lo & 127 | 128;
          lo = lo >>> 7;
        }
        buf[pos++] = lo;
      }
      Writer.prototype.uint64 = function write_uint64(value) {
        var bits = LongBits.from(value);
        return this._push(writeVarint64, bits.length(), bits);
      };
      Writer.prototype.int64 = Writer.prototype.uint64;
      Writer.prototype.sint64 = function write_sint64(value) {
        var bits = LongBits.from(value).zzEncode();
        return this._push(writeVarint64, bits.length(), bits);
      };
      Writer.prototype.bool = function write_bool(value) {
        return this._push(writeByte, 1, value ? 1 : 0);
      };
      function writeFixed32(val, buf, pos) {
        buf[pos] = val & 255;
        buf[pos + 1] = val >>> 8 & 255;
        buf[pos + 2] = val >>> 16 & 255;
        buf[pos + 3] = val >>> 24;
      }
      Writer.prototype.fixed32 = function write_fixed32(value) {
        return this._push(writeFixed32, 4, value >>> 0);
      };
      Writer.prototype.sfixed32 = Writer.prototype.fixed32;
      Writer.prototype.fixed64 = function write_fixed64(value) {
        var bits = LongBits.from(value);
        return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
      };
      Writer.prototype.sfixed64 = Writer.prototype.fixed64;
      Writer.prototype.float = function write_float(value) {
        return this._push(util.float.writeFloatLE, 4, value);
      };
      Writer.prototype.double = function write_double(value) {
        return this._push(util.float.writeDoubleLE, 8, value);
      };
      var writeBytes = util.Array.prototype.set ? function writeBytes_set(val, buf, pos) {
        buf.set(val, pos);
      } : function writeBytes_for(val, buf, pos) {
        for (var i = 0; i < val.length; ++i)
          buf[pos + i] = val[i];
      };
      Writer.prototype.bytes = function write_bytes(value) {
        var len = value.length >>> 0;
        if (!len)
          return this._push(writeByte, 1, 0);
        if (util.isString(value)) {
          var buf = Writer.alloc(len = base64.length(value));
          base64.decode(value, buf, 0);
          value = buf;
        }
        return this.uint32(len)._push(writeBytes, len, value);
      };
      Writer.prototype.string = function write_string(value) {
        var len = utf8.length(value);
        return len ? this.uint32(len)._push(utf8.write, len, value) : this._push(writeByte, 1, 0);
      };
      Writer.prototype.fork = function fork() {
        this.states = new State(this);
        this.head = this.tail = new Op(noop, 0, 0);
        this.len = 0;
        return this;
      };
      Writer.prototype.reset = function reset() {
        if (this.states) {
          this.head = this.states.head;
          this.tail = this.states.tail;
          this.len = this.states.len;
          this.states = this.states.next;
        } else {
          this.head = this.tail = new Op(noop, 0, 0);
          this.len = 0;
        }
        return this;
      };
      Writer.prototype.ldelim = function ldelim() {
        var head = this.head, tail = this.tail, len = this.len;
        this.reset().uint32(len);
        if (len) {
          this.tail.next = head.next;
          this.tail = tail;
          this.len += len;
        }
        return this;
      };
      Writer.prototype.finish = function finish() {
        var head = this.head.next, buf = this.constructor.alloc(this.len), pos = 0;
        while (head) {
          head.fn(head.val, buf, pos);
          pos += head.len;
          head = head.next;
        }
        return buf;
      };
      Writer._configure = function(BufferWriter_) {
        BufferWriter = BufferWriter_;
        Writer.create = create();
        BufferWriter._configure();
      };
    }
  });

  // ../node_modules/protobufjs/src/writer_buffer.js
  var require_writer_buffer = __commonJS({
    "../node_modules/protobufjs/src/writer_buffer.js"(exports, module) {
      "use strict";
      module.exports = BufferWriter;
      var Writer = require_writer();
      (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
      var util = require_minimal();
      function BufferWriter() {
        Writer.call(this);
      }
      BufferWriter._configure = function() {
        BufferWriter.alloc = util._Buffer_allocUnsafe;
        BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set" ? function writeBytesBuffer_set(val, buf, pos) {
          buf.set(val, pos);
        } : function writeBytesBuffer_copy(val, buf, pos) {
          if (val.copy)
            val.copy(buf, pos, 0, val.length);
          else for (var i = 0; i < val.length; )
            buf[pos++] = val[i++];
        };
      };
      BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
        if (util.isString(value))
          value = util._Buffer_from(value, "base64");
        var len = value.length >>> 0;
        this.uint32(len);
        if (len)
          this._push(BufferWriter.writeBytesBuffer, len, value);
        return this;
      };
      function writeStringBuffer(val, buf, pos) {
        if (val.length < 40)
          util.utf8.write(val, buf, pos);
        else if (buf.utf8Write)
          buf.utf8Write(val, pos);
        else
          buf.write(val, pos);
      }
      BufferWriter.prototype.string = function write_string_buffer(value) {
        var len = util.Buffer.byteLength(value);
        this.uint32(len);
        if (len)
          this._push(writeStringBuffer, len, value);
        return this;
      };
      BufferWriter._configure();
    }
  });

  // ../node_modules/protobufjs/src/reader.js
  var require_reader = __commonJS({
    "../node_modules/protobufjs/src/reader.js"(exports, module) {
      "use strict";
      module.exports = Reader;
      var util = require_minimal();
      var BufferReader;
      var LongBits = util.LongBits;
      var utf8 = util.utf8;
      function indexOutOfRange(reader, writeLength) {
        return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
      }
      function Reader(buffer) {
        this.buf = buffer;
        this.pos = 0;
        this.len = buffer.length;
      }
      var create_array = typeof Uint8Array !== "undefined" ? function create_typed_array(buffer) {
        if (buffer instanceof Uint8Array || Array.isArray(buffer))
          return new Reader(buffer);
        throw Error("illegal buffer");
      } : function create_array2(buffer) {
        if (Array.isArray(buffer))
          return new Reader(buffer);
        throw Error("illegal buffer");
      };
      var create = function create2() {
        return util.Buffer ? function create_buffer_setup(buffer) {
          return (Reader.create = function create_buffer(buffer2) {
            return util.Buffer.isBuffer(buffer2) ? new BufferReader(buffer2) : create_array(buffer2);
          })(buffer);
        } : create_array;
      };
      Reader.create = create();
      Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */
      util.Array.prototype.slice;
      function readVarint32NearEnd(reader) {
        var value = 0;
        for (var i = 0; i < 4; ++i) {
          if (reader.pos >= reader.len)
            throw indexOutOfRange(reader);
          var b = reader.buf[reader.pos++];
          value = (value | (b & 127) << i * 7) >>> 0;
          if (b < 128)
            return value;
        }
        throw indexOutOfRange(reader);
      }
      Reader.prototype.uint32 = /* @__PURE__ */ (function read_uint32_setup() {
        var value = 4294967295;
        return function read_uint32() {
          if (this.len - this.pos < 5) {
            if (this.pos >= this.len)
              throw indexOutOfRange(this);
            if (this.buf[this.pos] >= 128)
              return readVarint32NearEnd(this);
          }
          value = (this.buf[this.pos] & 127) >>> 0;
          if (this.buf[this.pos++] < 128) return value;
          value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
          if (this.buf[this.pos++] < 128) return value;
          value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
          if (this.buf[this.pos++] < 128) return value;
          value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
          if (this.buf[this.pos++] < 128) return value;
          value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
          if (this.buf[this.pos++] < 128) return value;
          if ((this.pos += 5) > this.len) {
            this.pos = this.len;
            throw indexOutOfRange(this, 10);
          }
          return value;
        };
      })();
      Reader.prototype.int32 = function read_int32() {
        return this.uint32() | 0;
      };
      Reader.prototype.sint32 = function read_sint32() {
        var value = this.uint32();
        return value >>> 1 ^ -(value & 1) | 0;
      };
      function readLongVarint() {
        var bits = new LongBits(0, 0);
        var i = 0;
        if (this.len - this.pos > 4) {
          for (; i < 4; ++i) {
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits;
          }
          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
          bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
          i = 0;
        } else {
          for (; i < 3; ++i) {
            if (this.pos >= this.len)
              throw indexOutOfRange(this);
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits;
          }
          bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
          return bits;
        }
        if (this.len - this.pos > 4) {
          for (; i < 5; ++i) {
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits;
          }
        } else {
          for (; i < 5; ++i) {
            if (this.pos >= this.len)
              throw indexOutOfRange(this);
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
              return bits;
          }
        }
        throw Error("invalid varint encoding");
      }
      Reader.prototype.bool = function read_bool() {
        return this.uint32() !== 0;
      };
      function readFixed32_end(buf, end) {
        return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
      }
      Reader.prototype.fixed32 = function read_fixed32() {
        if (this.pos + 4 > this.len)
          throw indexOutOfRange(this, 4);
        return readFixed32_end(this.buf, this.pos += 4);
      };
      Reader.prototype.sfixed32 = function read_sfixed32() {
        if (this.pos + 4 > this.len)
          throw indexOutOfRange(this, 4);
        return readFixed32_end(this.buf, this.pos += 4) | 0;
      };
      function readFixed64() {
        if (this.pos + 8 > this.len)
          throw indexOutOfRange(this, 8);
        return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
      }
      Reader.prototype.float = function read_float() {
        if (this.pos + 4 > this.len)
          throw indexOutOfRange(this, 4);
        var value = util.float.readFloatLE(this.buf, this.pos);
        this.pos += 4;
        return value;
      };
      Reader.prototype.double = function read_double() {
        if (this.pos + 8 > this.len)
          throw indexOutOfRange(this, 4);
        var value = util.float.readDoubleLE(this.buf, this.pos);
        this.pos += 8;
        return value;
      };
      Reader.prototype.bytes = function read_bytes() {
        var length = this.uint32(), start2 = this.pos, end = this.pos + length;
        if (end > this.len)
          throw indexOutOfRange(this, length);
        this.pos += length;
        if (Array.isArray(this.buf))
          return this.buf.slice(start2, end);
        if (start2 === end) {
          var nativeBuffer = util.Buffer;
          return nativeBuffer ? nativeBuffer.alloc(0) : new this.buf.constructor(0);
        }
        return this._slice.call(this.buf, start2, end);
      };
      Reader.prototype.string = function read_string() {
        var bytes = this.bytes();
        return utf8.read(bytes, 0, bytes.length);
      };
      Reader.prototype.skip = function skip(length) {
        if (typeof length === "number") {
          if (this.pos + length > this.len)
            throw indexOutOfRange(this, length);
          this.pos += length;
        } else {
          do {
            if (this.pos >= this.len)
              throw indexOutOfRange(this);
          } while (this.buf[this.pos++] & 128);
        }
        return this;
      };
      Reader.recursionLimit = util.recursionLimit;
      Reader.prototype.skipType = function(wireType, depth) {
        if (depth === void 0) depth = 0;
        if (depth > Reader.recursionLimit)
          throw Error("maximum nesting depth exceeded");
        switch (wireType) {
          case 0:
            this.skip();
            break;
          case 1:
            this.skip(8);
            break;
          case 2:
            this.skip(this.uint32());
            break;
          case 3:
            while ((wireType = this.uint32() & 7) !== 4) {
              this.skipType(wireType, depth + 1);
            }
            break;
          case 5:
            this.skip(4);
            break;
          /* istanbul ignore next */
          default:
            throw Error("invalid wire type " + wireType + " at offset " + this.pos);
        }
        return this;
      };
      Reader._configure = function(BufferReader_) {
        BufferReader = BufferReader_;
        Reader.create = create();
        BufferReader._configure();
        var fn = util.Long ? "toLong" : (
          /* istanbul ignore next */
          "toNumber"
        );
        util.merge(Reader.prototype, {
          int64: function read_int64() {
            return readLongVarint.call(this)[fn](false);
          },
          uint64: function read_uint64() {
            return readLongVarint.call(this)[fn](true);
          },
          sint64: function read_sint64() {
            return readLongVarint.call(this).zzDecode()[fn](false);
          },
          fixed64: function read_fixed64() {
            return readFixed64.call(this)[fn](true);
          },
          sfixed64: function read_sfixed64() {
            return readFixed64.call(this)[fn](false);
          }
        });
      };
    }
  });

  // ../node_modules/protobufjs/src/reader_buffer.js
  var require_reader_buffer = __commonJS({
    "../node_modules/protobufjs/src/reader_buffer.js"(exports, module) {
      "use strict";
      module.exports = BufferReader;
      var Reader = require_reader();
      (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
      var util = require_minimal();
      function BufferReader(buffer) {
        Reader.call(this, buffer);
      }
      BufferReader._configure = function() {
        if (util.Buffer)
          BufferReader.prototype._slice = util.Buffer.prototype.slice;
      };
      BufferReader.prototype.string = function read_string_buffer() {
        var len = this.uint32();
        return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
      };
      BufferReader._configure();
    }
  });

  // ../node_modules/protobufjs/src/rpc/service.js
  var require_service = __commonJS({
    "../node_modules/protobufjs/src/rpc/service.js"(exports, module) {
      "use strict";
      module.exports = Service;
      var util = require_minimal();
      (Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;
      function Service(rpcImpl, requestDelimited, responseDelimited) {
        if (typeof rpcImpl !== "function")
          throw TypeError("rpcImpl must be a function");
        util.EventEmitter.call(this);
        this.rpcImpl = rpcImpl;
        this.requestDelimited = Boolean(requestDelimited);
        this.responseDelimited = Boolean(responseDelimited);
      }
      Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
        if (!request)
          throw TypeError("request must be specified");
        var self2 = this;
        if (!callback)
          return util.asPromise(rpcCall, self2, method, requestCtor, responseCtor, request);
        if (!self2.rpcImpl) {
          setTimeout(function() {
            callback(Error("already ended"));
          }, 0);
          return void 0;
        }
        try {
          return self2.rpcImpl(
            method,
            requestCtor[self2.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
            function rpcCallback(err, response) {
              if (err) {
                self2.emit("error", err, method);
                return callback(err);
              }
              if (response === null) {
                self2.end(
                  /* endedByRPC */
                  true
                );
                return void 0;
              }
              if (!(response instanceof responseCtor)) {
                try {
                  response = responseCtor[self2.responseDelimited ? "decodeDelimited" : "decode"](response);
                } catch (err2) {
                  self2.emit("error", err2, method);
                  return callback(err2);
                }
              }
              self2.emit("data", response, method);
              return callback(null, response);
            }
          );
        } catch (err) {
          self2.emit("error", err, method);
          setTimeout(function() {
            callback(err);
          }, 0);
          return void 0;
        }
      };
      Service.prototype.end = function end(endedByRPC) {
        if (this.rpcImpl) {
          if (!endedByRPC)
            this.rpcImpl(null, null, null);
          this.rpcImpl = null;
          this.emit("end").off();
        }
        return this;
      };
    }
  });

  // ../node_modules/protobufjs/src/rpc.js
  var require_rpc = __commonJS({
    "../node_modules/protobufjs/src/rpc.js"(exports) {
      "use strict";
      var rpc = exports;
      rpc.Service = require_service();
    }
  });

  // ../node_modules/protobufjs/src/roots.js
  var require_roots = __commonJS({
    "../node_modules/protobufjs/src/roots.js"(exports, module) {
      "use strict";
      module.exports = /* @__PURE__ */ Object.create(null);
    }
  });

  // ../node_modules/protobufjs/src/index-minimal.js
  var require_index_minimal = __commonJS({
    "../node_modules/protobufjs/src/index-minimal.js"(exports) {
      "use strict";
      var protobuf = exports;
      protobuf.build = "minimal";
      protobuf.Writer = require_writer();
      protobuf.BufferWriter = require_writer_buffer();
      protobuf.Reader = require_reader();
      protobuf.BufferReader = require_reader_buffer();
      protobuf.util = require_minimal();
      protobuf.rpc = require_rpc();
      protobuf.roots = require_roots();
      protobuf.configure = configure;
      function configure() {
        protobuf.util._configure();
        protobuf.Writer._configure(protobuf.BufferWriter);
        protobuf.Reader._configure(protobuf.BufferReader);
      }
      configure();
    }
  });

  // ../node_modules/protobufjs/minimal.js
  var require_minimal2 = __commonJS({
    "../node_modules/protobufjs/minimal.js"(exports, module) {
      "use strict";
      module.exports = require_index_minimal();
    }
  });

  // ../node_modules/@smartspectra/node-sdk/js/messages/generated.js
  var require_generated = __commonJS({
    "../node_modules/@smartspectra/node-sdk/js/messages/generated.js"(exports, module) {
      "use strict";
      var $protobuf = require_minimal2();
      var $Reader = $protobuf.Reader;
      var $Writer = $protobuf.Writer;
      var $util = $protobuf.util;
      var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
      $root.presage = (function() {
        var presage = {};
        presage.smartspectra = (function() {
          var smartspectra = {};
          smartspectra.Measurement = (function() {
            function Measurement(properties) {
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            Measurement.prototype.value = 0;
            Measurement.prototype.stable = false;
            Measurement.prototype.timestamp = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
            Measurement.create = function create(properties) {
              return new Measurement(properties);
            };
            Measurement.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(
                  /* id 1, wireType 5 =*/
                  13
                ).float(message.value);
              if (message.stable != null && Object.hasOwnProperty.call(message, "stable"))
                writer.uint32(
                  /* id 2, wireType 0 =*/
                  16
                ).bool(message.stable);
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(
                  /* id 3, wireType 0 =*/
                  24
                ).int64(message.timestamp);
              return writer;
            };
            Measurement.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            Measurement.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.Measurement();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    message.value = reader.float();
                    break;
                  }
                  case 2: {
                    message.stable = reader.bool();
                    break;
                  }
                  case 3: {
                    message.timestamp = reader.int64();
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            Measurement.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            Measurement.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.value != null && Object.hasOwnProperty.call(message, "value")) {
                if (typeof message.value !== "number")
                  return "value: number expected";
              }
              if (message.stable != null && Object.hasOwnProperty.call(message, "stable")) {
                if (typeof message.stable !== "boolean")
                  return "stable: boolean expected";
              }
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp")) {
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                  return "timestamp: integer|Long expected";
              }
              return null;
            };
            Measurement.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.Measurement)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.Measurement: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.Measurement();
              if (object.value != null)
                message.value = Number(object.value);
              if (object.stable != null)
                message.stable = Boolean(object.stable);
              if (object.timestamp != null) {
                if ($util.Long)
                  message.timestamp = $util.Long.fromValue(object.timestamp, false);
                else if (typeof object.timestamp === "string")
                  message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                  message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                  message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
              }
              return message;
            };
            Measurement.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.defaults) {
                object.value = 0;
                object.stable = false;
                if ($util.Long) {
                  var long = new $util.Long(0, 0, false);
                  object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                } else
                  object.timestamp = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
              }
              if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
              if (message.stable != null && Object.hasOwnProperty.call(message, "stable"))
                object.stable = message.stable;
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                  object.timestamp = typeof message.timestamp === "number" ? BigInt(message.timestamp) : $util.Long.fromBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0, false).toBigInt();
                else if (typeof message.timestamp === "number")
                  object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                  object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
              return object;
            };
            Measurement.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            Measurement.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.Measurement";
            };
            return Measurement;
          })();
          smartspectra.DetectionStatus = (function() {
            function DetectionStatus(properties) {
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            DetectionStatus.prototype.detected = false;
            DetectionStatus.prototype.stable = false;
            DetectionStatus.prototype.timestamp = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
            DetectionStatus.create = function create(properties) {
              return new DetectionStatus(properties);
            };
            DetectionStatus.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.detected != null && Object.hasOwnProperty.call(message, "detected"))
                writer.uint32(
                  /* id 1, wireType 0 =*/
                  8
                ).bool(message.detected);
              if (message.stable != null && Object.hasOwnProperty.call(message, "stable"))
                writer.uint32(
                  /* id 2, wireType 0 =*/
                  16
                ).bool(message.stable);
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(
                  /* id 3, wireType 0 =*/
                  24
                ).int64(message.timestamp);
              return writer;
            };
            DetectionStatus.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            DetectionStatus.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.DetectionStatus();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    message.detected = reader.bool();
                    break;
                  }
                  case 2: {
                    message.stable = reader.bool();
                    break;
                  }
                  case 3: {
                    message.timestamp = reader.int64();
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            DetectionStatus.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            DetectionStatus.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.detected != null && Object.hasOwnProperty.call(message, "detected")) {
                if (typeof message.detected !== "boolean")
                  return "detected: boolean expected";
              }
              if (message.stable != null && Object.hasOwnProperty.call(message, "stable")) {
                if (typeof message.stable !== "boolean")
                  return "stable: boolean expected";
              }
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp")) {
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                  return "timestamp: integer|Long expected";
              }
              return null;
            };
            DetectionStatus.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.DetectionStatus)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.DetectionStatus: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.DetectionStatus();
              if (object.detected != null)
                message.detected = Boolean(object.detected);
              if (object.stable != null)
                message.stable = Boolean(object.stable);
              if (object.timestamp != null) {
                if ($util.Long)
                  message.timestamp = $util.Long.fromValue(object.timestamp, false);
                else if (typeof object.timestamp === "string")
                  message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                  message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                  message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
              }
              return message;
            };
            DetectionStatus.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.defaults) {
                object.detected = false;
                object.stable = false;
                if ($util.Long) {
                  var long = new $util.Long(0, 0, false);
                  object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                } else
                  object.timestamp = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
              }
              if (message.detected != null && Object.hasOwnProperty.call(message, "detected"))
                object.detected = message.detected;
              if (message.stable != null && Object.hasOwnProperty.call(message, "stable"))
                object.stable = message.stable;
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                  object.timestamp = typeof message.timestamp === "number" ? BigInt(message.timestamp) : $util.Long.fromBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0, false).toBigInt();
                else if (typeof message.timestamp === "number")
                  object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                  object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
              return object;
            };
            DetectionStatus.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            DetectionStatus.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.DetectionStatus";
            };
            return DetectionStatus;
          })();
          smartspectra.MeasurementWithConfidence = (function() {
            function MeasurementWithConfidence(properties) {
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            MeasurementWithConfidence.prototype.value = 0;
            MeasurementWithConfidence.prototype.stable = false;
            MeasurementWithConfidence.prototype.confidence = 0;
            MeasurementWithConfidence.prototype.timestamp = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
            MeasurementWithConfidence.create = function create(properties) {
              return new MeasurementWithConfidence(properties);
            };
            MeasurementWithConfidence.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(
                  /* id 1, wireType 5 =*/
                  13
                ).float(message.value);
              if (message.stable != null && Object.hasOwnProperty.call(message, "stable"))
                writer.uint32(
                  /* id 2, wireType 0 =*/
                  16
                ).bool(message.stable);
              if (message.confidence != null && Object.hasOwnProperty.call(message, "confidence"))
                writer.uint32(
                  /* id 3, wireType 5 =*/
                  29
                ).float(message.confidence);
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(
                  /* id 4, wireType 0 =*/
                  32
                ).int64(message.timestamp);
              return writer;
            };
            MeasurementWithConfidence.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            MeasurementWithConfidence.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.MeasurementWithConfidence();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    message.value = reader.float();
                    break;
                  }
                  case 2: {
                    message.stable = reader.bool();
                    break;
                  }
                  case 3: {
                    message.confidence = reader.float();
                    break;
                  }
                  case 4: {
                    message.timestamp = reader.int64();
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            MeasurementWithConfidence.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            MeasurementWithConfidence.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.value != null && Object.hasOwnProperty.call(message, "value")) {
                if (typeof message.value !== "number")
                  return "value: number expected";
              }
              if (message.stable != null && Object.hasOwnProperty.call(message, "stable")) {
                if (typeof message.stable !== "boolean")
                  return "stable: boolean expected";
              }
              if (message.confidence != null && Object.hasOwnProperty.call(message, "confidence")) {
                if (typeof message.confidence !== "number")
                  return "confidence: number expected";
              }
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp")) {
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                  return "timestamp: integer|Long expected";
              }
              return null;
            };
            MeasurementWithConfidence.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.MeasurementWithConfidence)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.MeasurementWithConfidence: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.MeasurementWithConfidence();
              if (object.value != null)
                message.value = Number(object.value);
              if (object.stable != null)
                message.stable = Boolean(object.stable);
              if (object.confidence != null)
                message.confidence = Number(object.confidence);
              if (object.timestamp != null) {
                if ($util.Long)
                  message.timestamp = $util.Long.fromValue(object.timestamp, false);
                else if (typeof object.timestamp === "string")
                  message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                  message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                  message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
              }
              return message;
            };
            MeasurementWithConfidence.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.defaults) {
                object.value = 0;
                object.stable = false;
                object.confidence = 0;
                if ($util.Long) {
                  var long = new $util.Long(0, 0, false);
                  object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                } else
                  object.timestamp = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
              }
              if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
              if (message.stable != null && Object.hasOwnProperty.call(message, "stable"))
                object.stable = message.stable;
              if (message.confidence != null && Object.hasOwnProperty.call(message, "confidence"))
                object.confidence = options.json && !isFinite(message.confidence) ? String(message.confidence) : message.confidence;
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                  object.timestamp = typeof message.timestamp === "number" ? BigInt(message.timestamp) : $util.Long.fromBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0, false).toBigInt();
                else if (typeof message.timestamp === "number")
                  object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                  object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
              return object;
            };
            MeasurementWithConfidence.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            MeasurementWithConfidence.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.MeasurementWithConfidence";
            };
            return MeasurementWithConfidence;
          })();
          smartspectra.ExpressionType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNSPECIFIED"] = 0;
            values[valuesById[1] = "ANGRY"] = 1;
            values[valuesById[2] = "CONTEMPT"] = 2;
            values[valuesById[3] = "DISGUST"] = 3;
            values[valuesById[4] = "FEAR"] = 4;
            values[valuesById[5] = "HAPPY"] = 5;
            values[valuesById[6] = "NEUTRAL"] = 6;
            values[valuesById[7] = "SAD"] = 7;
            values[valuesById[8] = "SURPRISE"] = 8;
            return values;
          })();
          smartspectra.ExpressionScore = (function() {
            function ExpressionScore(properties) {
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            ExpressionScore.prototype.type = 0;
            ExpressionScore.prototype.confidence = 0;
            ExpressionScore.create = function create(properties) {
              return new ExpressionScore(properties);
            };
            ExpressionScore.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(
                  /* id 1, wireType 0 =*/
                  8
                ).int32(message.type);
              if (message.confidence != null && Object.hasOwnProperty.call(message, "confidence"))
                writer.uint32(
                  /* id 2, wireType 5 =*/
                  21
                ).float(message.confidence);
              return writer;
            };
            ExpressionScore.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            ExpressionScore.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.ExpressionScore();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    message.type = reader.int32();
                    break;
                  }
                  case 2: {
                    message.confidence = reader.float();
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            ExpressionScore.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            ExpressionScore.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                switch (message.type) {
                  default:
                    return "type: enum value expected";
                  case 0:
                  case 1:
                  case 2:
                  case 3:
                  case 4:
                  case 5:
                  case 6:
                  case 7:
                  case 8:
                    break;
                }
              if (message.confidence != null && Object.hasOwnProperty.call(message, "confidence")) {
                if (typeof message.confidence !== "number")
                  return "confidence: number expected";
              }
              return null;
            };
            ExpressionScore.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.ExpressionScore)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.ExpressionScore: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.ExpressionScore();
              switch (object.type) {
                default:
                  if (typeof object.type === "number") {
                    message.type = object.type;
                    break;
                  }
                  break;
                case "UNSPECIFIED":
                case 0:
                  message.type = 0;
                  break;
                case "ANGRY":
                case 1:
                  message.type = 1;
                  break;
                case "CONTEMPT":
                case 2:
                  message.type = 2;
                  break;
                case "DISGUST":
                case 3:
                  message.type = 3;
                  break;
                case "FEAR":
                case 4:
                  message.type = 4;
                  break;
                case "HAPPY":
                case 5:
                  message.type = 5;
                  break;
                case "NEUTRAL":
                case 6:
                  message.type = 6;
                  break;
                case "SAD":
                case 7:
                  message.type = 7;
                  break;
                case "SURPRISE":
                case 8:
                  message.type = 8;
                  break;
              }
              if (object.confidence != null)
                message.confidence = Number(object.confidence);
              return message;
            };
            ExpressionScore.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.defaults) {
                object.type = options.enums === String ? "UNSPECIFIED" : 0;
                object.confidence = 0;
              }
              if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                object.type = options.enums === String ? $root.presage.smartspectra.ExpressionType[message.type] === void 0 ? message.type : $root.presage.smartspectra.ExpressionType[message.type] : message.type;
              if (message.confidence != null && Object.hasOwnProperty.call(message, "confidence"))
                object.confidence = options.json && !isFinite(message.confidence) ? String(message.confidence) : message.confidence;
              return object;
            };
            ExpressionScore.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            ExpressionScore.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.ExpressionScore";
            };
            return ExpressionScore;
          })();
          smartspectra.Expression = (function() {
            function Expression(properties) {
              this.scores = [];
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            Expression.prototype.stable = false;
            Expression.prototype.timestamp = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
            Expression.prototype.scores = $util.emptyArray;
            Expression.create = function create(properties) {
              return new Expression(properties);
            };
            Expression.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.stable != null && Object.hasOwnProperty.call(message, "stable"))
                writer.uint32(
                  /* id 1, wireType 0 =*/
                  8
                ).bool(message.stable);
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(
                  /* id 2, wireType 0 =*/
                  16
                ).int64(message.timestamp);
              if (message.scores != null && message.scores.length)
                for (var i = 0; i < message.scores.length; ++i)
                  $root.presage.smartspectra.ExpressionScore.encode(message.scores[i], writer.uint32(
                    /* id 3, wireType 2 =*/
                    26
                  ).fork(), q + 1).ldelim();
              return writer;
            };
            Expression.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            Expression.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.Expression();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    message.stable = reader.bool();
                    break;
                  }
                  case 2: {
                    message.timestamp = reader.int64();
                    break;
                  }
                  case 3: {
                    if (!(message.scores && message.scores.length))
                      message.scores = [];
                    message.scores.push($root.presage.smartspectra.ExpressionScore.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            Expression.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            Expression.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.stable != null && Object.hasOwnProperty.call(message, "stable")) {
                if (typeof message.stable !== "boolean")
                  return "stable: boolean expected";
              }
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp")) {
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                  return "timestamp: integer|Long expected";
              }
              if (message.scores != null && Object.hasOwnProperty.call(message, "scores")) {
                if (!Array.isArray(message.scores))
                  return "scores: array expected";
                for (var i = 0; i < message.scores.length; ++i) {
                  var error = $root.presage.smartspectra.ExpressionScore.verify(message.scores[i], long + 1);
                  if (error)
                    return "scores." + error;
                }
              }
              return null;
            };
            Expression.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.Expression)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.Expression: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.Expression();
              if (object.stable != null)
                message.stable = Boolean(object.stable);
              if (object.timestamp != null) {
                if ($util.Long)
                  message.timestamp = $util.Long.fromValue(object.timestamp, false);
                else if (typeof object.timestamp === "string")
                  message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                  message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                  message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
              }
              if (object.scores) {
                if (!Array.isArray(object.scores))
                  throw TypeError(".presage.smartspectra.Expression.scores: array expected");
                message.scores = [];
                for (var i = 0; i < object.scores.length; ++i) {
                  if (!$util.isObject(object.scores[i]))
                    throw TypeError(".presage.smartspectra.Expression.scores: object expected");
                  message.scores[i] = $root.presage.smartspectra.ExpressionScore.fromObject(object.scores[i], long + 1);
                }
              }
              return message;
            };
            Expression.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.arrays || options.defaults)
                object.scores = [];
              if (options.defaults) {
                object.stable = false;
                if ($util.Long) {
                  var long = new $util.Long(0, 0, false);
                  object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                } else
                  object.timestamp = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
              }
              if (message.stable != null && Object.hasOwnProperty.call(message, "stable"))
                object.stable = message.stable;
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                  object.timestamp = typeof message.timestamp === "number" ? BigInt(message.timestamp) : $util.Long.fromBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0, false).toBigInt();
                else if (typeof message.timestamp === "number")
                  object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                  object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
              if (message.scores && message.scores.length) {
                object.scores = [];
                for (var j = 0; j < message.scores.length; ++j)
                  object.scores[j] = $root.presage.smartspectra.ExpressionScore.toObject(message.scores[j], options, q + 1);
              }
              return object;
            };
            Expression.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            Expression.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.Expression";
            };
            return Expression;
          })();
          smartspectra.Hrv = (function() {
            function Hrv(properties) {
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            Hrv.prototype.rmssd = 0;
            Hrv.prototype.meanNn = 0;
            Hrv.prototype.sdnn = 0;
            Hrv.prototype.baevsky = 0;
            Hrv.prototype.timestamp = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
            Hrv.prototype.confidence = 0;
            Hrv.prototype.stable = false;
            Hrv.create = function create(properties) {
              return new Hrv(properties);
            };
            Hrv.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.rmssd != null && Object.hasOwnProperty.call(message, "rmssd"))
                writer.uint32(
                  /* id 1, wireType 1 =*/
                  9
                ).double(message.rmssd);
              if (message.meanNn != null && Object.hasOwnProperty.call(message, "meanNn"))
                writer.uint32(
                  /* id 2, wireType 1 =*/
                  17
                ).double(message.meanNn);
              if (message.sdnn != null && Object.hasOwnProperty.call(message, "sdnn"))
                writer.uint32(
                  /* id 3, wireType 1 =*/
                  25
                ).double(message.sdnn);
              if (message.baevsky != null && Object.hasOwnProperty.call(message, "baevsky"))
                writer.uint32(
                  /* id 4, wireType 1 =*/
                  33
                ).double(message.baevsky);
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(
                  /* id 5, wireType 0 =*/
                  40
                ).int64(message.timestamp);
              if (message.confidence != null && Object.hasOwnProperty.call(message, "confidence"))
                writer.uint32(
                  /* id 6, wireType 5 =*/
                  53
                ).float(message.confidence);
              if (message.stable != null && Object.hasOwnProperty.call(message, "stable"))
                writer.uint32(
                  /* id 7, wireType 0 =*/
                  56
                ).bool(message.stable);
              return writer;
            };
            Hrv.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            Hrv.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.Hrv();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    message.rmssd = reader.double();
                    break;
                  }
                  case 2: {
                    message.meanNn = reader.double();
                    break;
                  }
                  case 3: {
                    message.sdnn = reader.double();
                    break;
                  }
                  case 4: {
                    message.baevsky = reader.double();
                    break;
                  }
                  case 5: {
                    message.timestamp = reader.int64();
                    break;
                  }
                  case 6: {
                    message.confidence = reader.float();
                    break;
                  }
                  case 7: {
                    message.stable = reader.bool();
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            Hrv.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            Hrv.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.rmssd != null && Object.hasOwnProperty.call(message, "rmssd")) {
                if (typeof message.rmssd !== "number")
                  return "rmssd: number expected";
              }
              if (message.meanNn != null && Object.hasOwnProperty.call(message, "meanNn")) {
                if (typeof message.meanNn !== "number")
                  return "meanNn: number expected";
              }
              if (message.sdnn != null && Object.hasOwnProperty.call(message, "sdnn")) {
                if (typeof message.sdnn !== "number")
                  return "sdnn: number expected";
              }
              if (message.baevsky != null && Object.hasOwnProperty.call(message, "baevsky")) {
                if (typeof message.baevsky !== "number")
                  return "baevsky: number expected";
              }
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp")) {
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                  return "timestamp: integer|Long expected";
              }
              if (message.confidence != null && Object.hasOwnProperty.call(message, "confidence")) {
                if (typeof message.confidence !== "number")
                  return "confidence: number expected";
              }
              if (message.stable != null && Object.hasOwnProperty.call(message, "stable")) {
                if (typeof message.stable !== "boolean")
                  return "stable: boolean expected";
              }
              return null;
            };
            Hrv.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.Hrv)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.Hrv: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.Hrv();
              if (object.rmssd != null)
                message.rmssd = Number(object.rmssd);
              if (object.meanNn != null)
                message.meanNn = Number(object.meanNn);
              if (object.sdnn != null)
                message.sdnn = Number(object.sdnn);
              if (object.baevsky != null)
                message.baevsky = Number(object.baevsky);
              if (object.timestamp != null) {
                if ($util.Long)
                  message.timestamp = $util.Long.fromValue(object.timestamp, false);
                else if (typeof object.timestamp === "string")
                  message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                  message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                  message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
              }
              if (object.confidence != null)
                message.confidence = Number(object.confidence);
              if (object.stable != null)
                message.stable = Boolean(object.stable);
              return message;
            };
            Hrv.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.defaults) {
                object.rmssd = 0;
                object.meanNn = 0;
                object.sdnn = 0;
                object.baevsky = 0;
                if ($util.Long) {
                  var long = new $util.Long(0, 0, false);
                  object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                } else
                  object.timestamp = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                object.confidence = 0;
                object.stable = false;
              }
              if (message.rmssd != null && Object.hasOwnProperty.call(message, "rmssd"))
                object.rmssd = options.json && !isFinite(message.rmssd) ? String(message.rmssd) : message.rmssd;
              if (message.meanNn != null && Object.hasOwnProperty.call(message, "meanNn"))
                object.meanNn = options.json && !isFinite(message.meanNn) ? String(message.meanNn) : message.meanNn;
              if (message.sdnn != null && Object.hasOwnProperty.call(message, "sdnn"))
                object.sdnn = options.json && !isFinite(message.sdnn) ? String(message.sdnn) : message.sdnn;
              if (message.baevsky != null && Object.hasOwnProperty.call(message, "baevsky"))
                object.baevsky = options.json && !isFinite(message.baevsky) ? String(message.baevsky) : message.baevsky;
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                  object.timestamp = typeof message.timestamp === "number" ? BigInt(message.timestamp) : $util.Long.fromBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0, false).toBigInt();
                else if (typeof message.timestamp === "number")
                  object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                  object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
              if (message.confidence != null && Object.hasOwnProperty.call(message, "confidence"))
                object.confidence = options.json && !isFinite(message.confidence) ? String(message.confidence) : message.confidence;
              if (message.stable != null && Object.hasOwnProperty.call(message, "stable"))
                object.stable = message.stable;
              return object;
            };
            Hrv.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            Hrv.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.Hrv";
            };
            return Hrv;
          })();
          smartspectra.Strict = (function() {
            function Strict(properties) {
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            Strict.prototype.value = 0;
            Strict.prototype.timestamp = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
            Strict.create = function create(properties) {
              return new Strict(properties);
            };
            Strict.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(
                  /* id 1, wireType 5 =*/
                  13
                ).float(message.value);
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(
                  /* id 2, wireType 0 =*/
                  16
                ).int64(message.timestamp);
              return writer;
            };
            Strict.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            Strict.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.Strict();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    message.value = reader.float();
                    break;
                  }
                  case 2: {
                    message.timestamp = reader.int64();
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            Strict.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            Strict.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.value != null && Object.hasOwnProperty.call(message, "value")) {
                if (typeof message.value !== "number")
                  return "value: number expected";
              }
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp")) {
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                  return "timestamp: integer|Long expected";
              }
              return null;
            };
            Strict.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.Strict)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.Strict: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.Strict();
              if (object.value != null)
                message.value = Number(object.value);
              if (object.timestamp != null) {
                if ($util.Long)
                  message.timestamp = $util.Long.fromValue(object.timestamp, false);
                else if (typeof object.timestamp === "string")
                  message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                  message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                  message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
              }
              return message;
            };
            Strict.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.defaults) {
                object.value = 0;
                if ($util.Long) {
                  var long = new $util.Long(0, 0, false);
                  object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                } else
                  object.timestamp = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
              }
              if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                  object.timestamp = typeof message.timestamp === "number" ? BigInt(message.timestamp) : $util.Long.fromBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0, false).toBigInt();
                else if (typeof message.timestamp === "number")
                  object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                  object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
              return object;
            };
            Strict.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            Strict.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.Strict";
            };
            return Strict;
          })();
          smartspectra.Pulse = (function() {
            function Pulse(properties) {
              this.rate = [];
              this.trace = [];
              this.pulseRespirationQuotient = [];
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            Pulse.prototype.rate = $util.emptyArray;
            Pulse.prototype.trace = $util.emptyArray;
            Pulse.prototype.pulseRespirationQuotient = $util.emptyArray;
            Pulse.prototype.pulseRateStrict = null;
            Pulse.create = function create(properties) {
              return new Pulse(properties);
            };
            Pulse.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.rate != null && message.rate.length)
                for (var i = 0; i < message.rate.length; ++i)
                  $root.presage.smartspectra.MeasurementWithConfidence.encode(message.rate[i], writer.uint32(
                    /* id 1, wireType 2 =*/
                    10
                  ).fork(), q + 1).ldelim();
              if (message.trace != null && message.trace.length)
                for (var i = 0; i < message.trace.length; ++i)
                  $root.presage.smartspectra.Measurement.encode(message.trace[i], writer.uint32(
                    /* id 2, wireType 2 =*/
                    18
                  ).fork(), q + 1).ldelim();
              if (message.pulseRespirationQuotient != null && message.pulseRespirationQuotient.length)
                for (var i = 0; i < message.pulseRespirationQuotient.length; ++i)
                  $root.presage.smartspectra.Measurement.encode(message.pulseRespirationQuotient[i], writer.uint32(
                    /* id 3, wireType 2 =*/
                    26
                  ).fork(), q + 1).ldelim();
              if (message.pulseRateStrict != null && Object.hasOwnProperty.call(message, "pulseRateStrict"))
                $root.presage.smartspectra.Strict.encode(message.pulseRateStrict, writer.uint32(
                  /* id 4, wireType 2 =*/
                  34
                ).fork(), q + 1).ldelim();
              return writer;
            };
            Pulse.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            Pulse.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.Pulse();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    if (!(message.rate && message.rate.length))
                      message.rate = [];
                    message.rate.push($root.presage.smartspectra.MeasurementWithConfidence.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 2: {
                    if (!(message.trace && message.trace.length))
                      message.trace = [];
                    message.trace.push($root.presage.smartspectra.Measurement.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 3: {
                    if (!(message.pulseRespirationQuotient && message.pulseRespirationQuotient.length))
                      message.pulseRespirationQuotient = [];
                    message.pulseRespirationQuotient.push($root.presage.smartspectra.Measurement.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 4: {
                    message.pulseRateStrict = $root.presage.smartspectra.Strict.decode(reader, reader.uint32(), void 0, long + 1);
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            Pulse.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            Pulse.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.rate != null && Object.hasOwnProperty.call(message, "rate")) {
                if (!Array.isArray(message.rate))
                  return "rate: array expected";
                for (var i = 0; i < message.rate.length; ++i) {
                  var error = $root.presage.smartspectra.MeasurementWithConfidence.verify(message.rate[i], long + 1);
                  if (error)
                    return "rate." + error;
                }
              }
              if (message.trace != null && Object.hasOwnProperty.call(message, "trace")) {
                if (!Array.isArray(message.trace))
                  return "trace: array expected";
                for (var i = 0; i < message.trace.length; ++i) {
                  var error = $root.presage.smartspectra.Measurement.verify(message.trace[i], long + 1);
                  if (error)
                    return "trace." + error;
                }
              }
              if (message.pulseRespirationQuotient != null && Object.hasOwnProperty.call(message, "pulseRespirationQuotient")) {
                if (!Array.isArray(message.pulseRespirationQuotient))
                  return "pulseRespirationQuotient: array expected";
                for (var i = 0; i < message.pulseRespirationQuotient.length; ++i) {
                  var error = $root.presage.smartspectra.Measurement.verify(message.pulseRespirationQuotient[i], long + 1);
                  if (error)
                    return "pulseRespirationQuotient." + error;
                }
              }
              if (message.pulseRateStrict != null && Object.hasOwnProperty.call(message, "pulseRateStrict")) {
                var error = $root.presage.smartspectra.Strict.verify(message.pulseRateStrict, long + 1);
                if (error)
                  return "pulseRateStrict." + error;
              }
              return null;
            };
            Pulse.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.Pulse)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.Pulse: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.Pulse();
              if (object.rate) {
                if (!Array.isArray(object.rate))
                  throw TypeError(".presage.smartspectra.Pulse.rate: array expected");
                message.rate = [];
                for (var i = 0; i < object.rate.length; ++i) {
                  if (!$util.isObject(object.rate[i]))
                    throw TypeError(".presage.smartspectra.Pulse.rate: object expected");
                  message.rate[i] = $root.presage.smartspectra.MeasurementWithConfidence.fromObject(object.rate[i], long + 1);
                }
              }
              if (object.trace) {
                if (!Array.isArray(object.trace))
                  throw TypeError(".presage.smartspectra.Pulse.trace: array expected");
                message.trace = [];
                for (var i = 0; i < object.trace.length; ++i) {
                  if (!$util.isObject(object.trace[i]))
                    throw TypeError(".presage.smartspectra.Pulse.trace: object expected");
                  message.trace[i] = $root.presage.smartspectra.Measurement.fromObject(object.trace[i], long + 1);
                }
              }
              if (object.pulseRespirationQuotient) {
                if (!Array.isArray(object.pulseRespirationQuotient))
                  throw TypeError(".presage.smartspectra.Pulse.pulseRespirationQuotient: array expected");
                message.pulseRespirationQuotient = [];
                for (var i = 0; i < object.pulseRespirationQuotient.length; ++i) {
                  if (!$util.isObject(object.pulseRespirationQuotient[i]))
                    throw TypeError(".presage.smartspectra.Pulse.pulseRespirationQuotient: object expected");
                  message.pulseRespirationQuotient[i] = $root.presage.smartspectra.Measurement.fromObject(object.pulseRespirationQuotient[i], long + 1);
                }
              }
              if (object.pulseRateStrict != null) {
                if (!$util.isObject(object.pulseRateStrict))
                  throw TypeError(".presage.smartspectra.Pulse.pulseRateStrict: object expected");
                message.pulseRateStrict = $root.presage.smartspectra.Strict.fromObject(object.pulseRateStrict, long + 1);
              }
              return message;
            };
            Pulse.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.arrays || options.defaults) {
                object.rate = [];
                object.trace = [];
                object.pulseRespirationQuotient = [];
              }
              if (options.defaults)
                object.pulseRateStrict = null;
              if (message.rate && message.rate.length) {
                object.rate = [];
                for (var j = 0; j < message.rate.length; ++j)
                  object.rate[j] = $root.presage.smartspectra.MeasurementWithConfidence.toObject(message.rate[j], options, q + 1);
              }
              if (message.trace && message.trace.length) {
                object.trace = [];
                for (var j = 0; j < message.trace.length; ++j)
                  object.trace[j] = $root.presage.smartspectra.Measurement.toObject(message.trace[j], options, q + 1);
              }
              if (message.pulseRespirationQuotient && message.pulseRespirationQuotient.length) {
                object.pulseRespirationQuotient = [];
                for (var j = 0; j < message.pulseRespirationQuotient.length; ++j)
                  object.pulseRespirationQuotient[j] = $root.presage.smartspectra.Measurement.toObject(message.pulseRespirationQuotient[j], options, q + 1);
              }
              if (message.pulseRateStrict != null && Object.hasOwnProperty.call(message, "pulseRateStrict"))
                object.pulseRateStrict = $root.presage.smartspectra.Strict.toObject(message.pulseRateStrict, options, q + 1);
              return object;
            };
            Pulse.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            Pulse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.Pulse";
            };
            return Pulse;
          })();
          smartspectra.Breathing = (function() {
            function Breathing(properties) {
              this.rate = [];
              this.upperTrace = [];
              this.lowerTrace = [];
              this.amplitude = [];
              this.apnea = [];
              this.respiratoryLineLength = [];
              this.baseline = [];
              this.inhaleExhaleRatio = [];
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            Breathing.prototype.rate = $util.emptyArray;
            Breathing.prototype.upperTrace = $util.emptyArray;
            Breathing.prototype.lowerTrace = $util.emptyArray;
            Breathing.prototype.amplitude = $util.emptyArray;
            Breathing.prototype.apnea = $util.emptyArray;
            Breathing.prototype.respiratoryLineLength = $util.emptyArray;
            Breathing.prototype.baseline = $util.emptyArray;
            Breathing.prototype.inhaleExhaleRatio = $util.emptyArray;
            Breathing.prototype.breathingRateStrict = null;
            Breathing.create = function create(properties) {
              return new Breathing(properties);
            };
            Breathing.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.rate != null && message.rate.length)
                for (var i = 0; i < message.rate.length; ++i)
                  $root.presage.smartspectra.MeasurementWithConfidence.encode(message.rate[i], writer.uint32(
                    /* id 1, wireType 2 =*/
                    10
                  ).fork(), q + 1).ldelim();
              if (message.upperTrace != null && message.upperTrace.length)
                for (var i = 0; i < message.upperTrace.length; ++i)
                  $root.presage.smartspectra.Measurement.encode(message.upperTrace[i], writer.uint32(
                    /* id 2, wireType 2 =*/
                    18
                  ).fork(), q + 1).ldelim();
              if (message.lowerTrace != null && message.lowerTrace.length)
                for (var i = 0; i < message.lowerTrace.length; ++i)
                  $root.presage.smartspectra.Measurement.encode(message.lowerTrace[i], writer.uint32(
                    /* id 3, wireType 2 =*/
                    26
                  ).fork(), q + 1).ldelim();
              if (message.amplitude != null && message.amplitude.length)
                for (var i = 0; i < message.amplitude.length; ++i)
                  $root.presage.smartspectra.Measurement.encode(message.amplitude[i], writer.uint32(
                    /* id 4, wireType 2 =*/
                    34
                  ).fork(), q + 1).ldelim();
              if (message.apnea != null && message.apnea.length)
                for (var i = 0; i < message.apnea.length; ++i)
                  $root.presage.smartspectra.DetectionStatus.encode(message.apnea[i], writer.uint32(
                    /* id 5, wireType 2 =*/
                    42
                  ).fork(), q + 1).ldelim();
              if (message.respiratoryLineLength != null && message.respiratoryLineLength.length)
                for (var i = 0; i < message.respiratoryLineLength.length; ++i)
                  $root.presage.smartspectra.Measurement.encode(message.respiratoryLineLength[i], writer.uint32(
                    /* id 6, wireType 2 =*/
                    50
                  ).fork(), q + 1).ldelim();
              if (message.baseline != null && message.baseline.length)
                for (var i = 0; i < message.baseline.length; ++i)
                  $root.presage.smartspectra.Measurement.encode(message.baseline[i], writer.uint32(
                    /* id 7, wireType 2 =*/
                    58
                  ).fork(), q + 1).ldelim();
              if (message.inhaleExhaleRatio != null && message.inhaleExhaleRatio.length)
                for (var i = 0; i < message.inhaleExhaleRatio.length; ++i)
                  $root.presage.smartspectra.Measurement.encode(message.inhaleExhaleRatio[i], writer.uint32(
                    /* id 8, wireType 2 =*/
                    66
                  ).fork(), q + 1).ldelim();
              if (message.breathingRateStrict != null && Object.hasOwnProperty.call(message, "breathingRateStrict"))
                $root.presage.smartspectra.Strict.encode(message.breathingRateStrict, writer.uint32(
                  /* id 9, wireType 2 =*/
                  74
                ).fork(), q + 1).ldelim();
              return writer;
            };
            Breathing.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            Breathing.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.Breathing();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    if (!(message.rate && message.rate.length))
                      message.rate = [];
                    message.rate.push($root.presage.smartspectra.MeasurementWithConfidence.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 2: {
                    if (!(message.upperTrace && message.upperTrace.length))
                      message.upperTrace = [];
                    message.upperTrace.push($root.presage.smartspectra.Measurement.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 3: {
                    if (!(message.lowerTrace && message.lowerTrace.length))
                      message.lowerTrace = [];
                    message.lowerTrace.push($root.presage.smartspectra.Measurement.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 4: {
                    if (!(message.amplitude && message.amplitude.length))
                      message.amplitude = [];
                    message.amplitude.push($root.presage.smartspectra.Measurement.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 5: {
                    if (!(message.apnea && message.apnea.length))
                      message.apnea = [];
                    message.apnea.push($root.presage.smartspectra.DetectionStatus.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 6: {
                    if (!(message.respiratoryLineLength && message.respiratoryLineLength.length))
                      message.respiratoryLineLength = [];
                    message.respiratoryLineLength.push($root.presage.smartspectra.Measurement.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 7: {
                    if (!(message.baseline && message.baseline.length))
                      message.baseline = [];
                    message.baseline.push($root.presage.smartspectra.Measurement.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 8: {
                    if (!(message.inhaleExhaleRatio && message.inhaleExhaleRatio.length))
                      message.inhaleExhaleRatio = [];
                    message.inhaleExhaleRatio.push($root.presage.smartspectra.Measurement.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 9: {
                    message.breathingRateStrict = $root.presage.smartspectra.Strict.decode(reader, reader.uint32(), void 0, long + 1);
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            Breathing.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            Breathing.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.rate != null && Object.hasOwnProperty.call(message, "rate")) {
                if (!Array.isArray(message.rate))
                  return "rate: array expected";
                for (var i = 0; i < message.rate.length; ++i) {
                  var error = $root.presage.smartspectra.MeasurementWithConfidence.verify(message.rate[i], long + 1);
                  if (error)
                    return "rate." + error;
                }
              }
              if (message.upperTrace != null && Object.hasOwnProperty.call(message, "upperTrace")) {
                if (!Array.isArray(message.upperTrace))
                  return "upperTrace: array expected";
                for (var i = 0; i < message.upperTrace.length; ++i) {
                  var error = $root.presage.smartspectra.Measurement.verify(message.upperTrace[i], long + 1);
                  if (error)
                    return "upperTrace." + error;
                }
              }
              if (message.lowerTrace != null && Object.hasOwnProperty.call(message, "lowerTrace")) {
                if (!Array.isArray(message.lowerTrace))
                  return "lowerTrace: array expected";
                for (var i = 0; i < message.lowerTrace.length; ++i) {
                  var error = $root.presage.smartspectra.Measurement.verify(message.lowerTrace[i], long + 1);
                  if (error)
                    return "lowerTrace." + error;
                }
              }
              if (message.amplitude != null && Object.hasOwnProperty.call(message, "amplitude")) {
                if (!Array.isArray(message.amplitude))
                  return "amplitude: array expected";
                for (var i = 0; i < message.amplitude.length; ++i) {
                  var error = $root.presage.smartspectra.Measurement.verify(message.amplitude[i], long + 1);
                  if (error)
                    return "amplitude." + error;
                }
              }
              if (message.apnea != null && Object.hasOwnProperty.call(message, "apnea")) {
                if (!Array.isArray(message.apnea))
                  return "apnea: array expected";
                for (var i = 0; i < message.apnea.length; ++i) {
                  var error = $root.presage.smartspectra.DetectionStatus.verify(message.apnea[i], long + 1);
                  if (error)
                    return "apnea." + error;
                }
              }
              if (message.respiratoryLineLength != null && Object.hasOwnProperty.call(message, "respiratoryLineLength")) {
                if (!Array.isArray(message.respiratoryLineLength))
                  return "respiratoryLineLength: array expected";
                for (var i = 0; i < message.respiratoryLineLength.length; ++i) {
                  var error = $root.presage.smartspectra.Measurement.verify(message.respiratoryLineLength[i], long + 1);
                  if (error)
                    return "respiratoryLineLength." + error;
                }
              }
              if (message.baseline != null && Object.hasOwnProperty.call(message, "baseline")) {
                if (!Array.isArray(message.baseline))
                  return "baseline: array expected";
                for (var i = 0; i < message.baseline.length; ++i) {
                  var error = $root.presage.smartspectra.Measurement.verify(message.baseline[i], long + 1);
                  if (error)
                    return "baseline." + error;
                }
              }
              if (message.inhaleExhaleRatio != null && Object.hasOwnProperty.call(message, "inhaleExhaleRatio")) {
                if (!Array.isArray(message.inhaleExhaleRatio))
                  return "inhaleExhaleRatio: array expected";
                for (var i = 0; i < message.inhaleExhaleRatio.length; ++i) {
                  var error = $root.presage.smartspectra.Measurement.verify(message.inhaleExhaleRatio[i], long + 1);
                  if (error)
                    return "inhaleExhaleRatio." + error;
                }
              }
              if (message.breathingRateStrict != null && Object.hasOwnProperty.call(message, "breathingRateStrict")) {
                var error = $root.presage.smartspectra.Strict.verify(message.breathingRateStrict, long + 1);
                if (error)
                  return "breathingRateStrict." + error;
              }
              return null;
            };
            Breathing.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.Breathing)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.Breathing: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.Breathing();
              if (object.rate) {
                if (!Array.isArray(object.rate))
                  throw TypeError(".presage.smartspectra.Breathing.rate: array expected");
                message.rate = [];
                for (var i = 0; i < object.rate.length; ++i) {
                  if (!$util.isObject(object.rate[i]))
                    throw TypeError(".presage.smartspectra.Breathing.rate: object expected");
                  message.rate[i] = $root.presage.smartspectra.MeasurementWithConfidence.fromObject(object.rate[i], long + 1);
                }
              }
              if (object.upperTrace) {
                if (!Array.isArray(object.upperTrace))
                  throw TypeError(".presage.smartspectra.Breathing.upperTrace: array expected");
                message.upperTrace = [];
                for (var i = 0; i < object.upperTrace.length; ++i) {
                  if (!$util.isObject(object.upperTrace[i]))
                    throw TypeError(".presage.smartspectra.Breathing.upperTrace: object expected");
                  message.upperTrace[i] = $root.presage.smartspectra.Measurement.fromObject(object.upperTrace[i], long + 1);
                }
              }
              if (object.lowerTrace) {
                if (!Array.isArray(object.lowerTrace))
                  throw TypeError(".presage.smartspectra.Breathing.lowerTrace: array expected");
                message.lowerTrace = [];
                for (var i = 0; i < object.lowerTrace.length; ++i) {
                  if (!$util.isObject(object.lowerTrace[i]))
                    throw TypeError(".presage.smartspectra.Breathing.lowerTrace: object expected");
                  message.lowerTrace[i] = $root.presage.smartspectra.Measurement.fromObject(object.lowerTrace[i], long + 1);
                }
              }
              if (object.amplitude) {
                if (!Array.isArray(object.amplitude))
                  throw TypeError(".presage.smartspectra.Breathing.amplitude: array expected");
                message.amplitude = [];
                for (var i = 0; i < object.amplitude.length; ++i) {
                  if (!$util.isObject(object.amplitude[i]))
                    throw TypeError(".presage.smartspectra.Breathing.amplitude: object expected");
                  message.amplitude[i] = $root.presage.smartspectra.Measurement.fromObject(object.amplitude[i], long + 1);
                }
              }
              if (object.apnea) {
                if (!Array.isArray(object.apnea))
                  throw TypeError(".presage.smartspectra.Breathing.apnea: array expected");
                message.apnea = [];
                for (var i = 0; i < object.apnea.length; ++i) {
                  if (!$util.isObject(object.apnea[i]))
                    throw TypeError(".presage.smartspectra.Breathing.apnea: object expected");
                  message.apnea[i] = $root.presage.smartspectra.DetectionStatus.fromObject(object.apnea[i], long + 1);
                }
              }
              if (object.respiratoryLineLength) {
                if (!Array.isArray(object.respiratoryLineLength))
                  throw TypeError(".presage.smartspectra.Breathing.respiratoryLineLength: array expected");
                message.respiratoryLineLength = [];
                for (var i = 0; i < object.respiratoryLineLength.length; ++i) {
                  if (!$util.isObject(object.respiratoryLineLength[i]))
                    throw TypeError(".presage.smartspectra.Breathing.respiratoryLineLength: object expected");
                  message.respiratoryLineLength[i] = $root.presage.smartspectra.Measurement.fromObject(object.respiratoryLineLength[i], long + 1);
                }
              }
              if (object.baseline) {
                if (!Array.isArray(object.baseline))
                  throw TypeError(".presage.smartspectra.Breathing.baseline: array expected");
                message.baseline = [];
                for (var i = 0; i < object.baseline.length; ++i) {
                  if (!$util.isObject(object.baseline[i]))
                    throw TypeError(".presage.smartspectra.Breathing.baseline: object expected");
                  message.baseline[i] = $root.presage.smartspectra.Measurement.fromObject(object.baseline[i], long + 1);
                }
              }
              if (object.inhaleExhaleRatio) {
                if (!Array.isArray(object.inhaleExhaleRatio))
                  throw TypeError(".presage.smartspectra.Breathing.inhaleExhaleRatio: array expected");
                message.inhaleExhaleRatio = [];
                for (var i = 0; i < object.inhaleExhaleRatio.length; ++i) {
                  if (!$util.isObject(object.inhaleExhaleRatio[i]))
                    throw TypeError(".presage.smartspectra.Breathing.inhaleExhaleRatio: object expected");
                  message.inhaleExhaleRatio[i] = $root.presage.smartspectra.Measurement.fromObject(object.inhaleExhaleRatio[i], long + 1);
                }
              }
              if (object.breathingRateStrict != null) {
                if (!$util.isObject(object.breathingRateStrict))
                  throw TypeError(".presage.smartspectra.Breathing.breathingRateStrict: object expected");
                message.breathingRateStrict = $root.presage.smartspectra.Strict.fromObject(object.breathingRateStrict, long + 1);
              }
              return message;
            };
            Breathing.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.arrays || options.defaults) {
                object.rate = [];
                object.upperTrace = [];
                object.lowerTrace = [];
                object.amplitude = [];
                object.apnea = [];
                object.respiratoryLineLength = [];
                object.baseline = [];
                object.inhaleExhaleRatio = [];
              }
              if (options.defaults)
                object.breathingRateStrict = null;
              if (message.rate && message.rate.length) {
                object.rate = [];
                for (var j = 0; j < message.rate.length; ++j)
                  object.rate[j] = $root.presage.smartspectra.MeasurementWithConfidence.toObject(message.rate[j], options, q + 1);
              }
              if (message.upperTrace && message.upperTrace.length) {
                object.upperTrace = [];
                for (var j = 0; j < message.upperTrace.length; ++j)
                  object.upperTrace[j] = $root.presage.smartspectra.Measurement.toObject(message.upperTrace[j], options, q + 1);
              }
              if (message.lowerTrace && message.lowerTrace.length) {
                object.lowerTrace = [];
                for (var j = 0; j < message.lowerTrace.length; ++j)
                  object.lowerTrace[j] = $root.presage.smartspectra.Measurement.toObject(message.lowerTrace[j], options, q + 1);
              }
              if (message.amplitude && message.amplitude.length) {
                object.amplitude = [];
                for (var j = 0; j < message.amplitude.length; ++j)
                  object.amplitude[j] = $root.presage.smartspectra.Measurement.toObject(message.amplitude[j], options, q + 1);
              }
              if (message.apnea && message.apnea.length) {
                object.apnea = [];
                for (var j = 0; j < message.apnea.length; ++j)
                  object.apnea[j] = $root.presage.smartspectra.DetectionStatus.toObject(message.apnea[j], options, q + 1);
              }
              if (message.respiratoryLineLength && message.respiratoryLineLength.length) {
                object.respiratoryLineLength = [];
                for (var j = 0; j < message.respiratoryLineLength.length; ++j)
                  object.respiratoryLineLength[j] = $root.presage.smartspectra.Measurement.toObject(message.respiratoryLineLength[j], options, q + 1);
              }
              if (message.baseline && message.baseline.length) {
                object.baseline = [];
                for (var j = 0; j < message.baseline.length; ++j)
                  object.baseline[j] = $root.presage.smartspectra.Measurement.toObject(message.baseline[j], options, q + 1);
              }
              if (message.inhaleExhaleRatio && message.inhaleExhaleRatio.length) {
                object.inhaleExhaleRatio = [];
                for (var j = 0; j < message.inhaleExhaleRatio.length; ++j)
                  object.inhaleExhaleRatio[j] = $root.presage.smartspectra.Measurement.toObject(message.inhaleExhaleRatio[j], options, q + 1);
              }
              if (message.breathingRateStrict != null && Object.hasOwnProperty.call(message, "breathingRateStrict"))
                object.breathingRateStrict = $root.presage.smartspectra.Strict.toObject(message.breathingRateStrict, options, q + 1);
              return object;
            };
            Breathing.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            Breathing.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.Breathing";
            };
            return Breathing;
          })();
          smartspectra.Landmarks = (function() {
            function Landmarks(properties) {
              this.value = [];
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            Landmarks.prototype.value = $util.emptyArray;
            Landmarks.prototype.stable = false;
            Landmarks.prototype.reset = false;
            Landmarks.prototype.timestamp = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
            Landmarks.create = function create(properties) {
              return new Landmarks(properties);
            };
            Landmarks.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.value != null && message.value.length)
                for (var i = 0; i < message.value.length; ++i)
                  $root.presage.smartspectra.Point2dFloat.encode(message.value[i], writer.uint32(
                    /* id 1, wireType 2 =*/
                    10
                  ).fork(), q + 1).ldelim();
              if (message.stable != null && Object.hasOwnProperty.call(message, "stable"))
                writer.uint32(
                  /* id 2, wireType 0 =*/
                  16
                ).bool(message.stable);
              if (message.reset != null && Object.hasOwnProperty.call(message, "reset"))
                writer.uint32(
                  /* id 3, wireType 0 =*/
                  24
                ).bool(message.reset);
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(
                  /* id 4, wireType 0 =*/
                  32
                ).int64(message.timestamp);
              return writer;
            };
            Landmarks.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            Landmarks.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.Landmarks();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    if (!(message.value && message.value.length))
                      message.value = [];
                    message.value.push($root.presage.smartspectra.Point2dFloat.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 2: {
                    message.stable = reader.bool();
                    break;
                  }
                  case 3: {
                    message.reset = reader.bool();
                    break;
                  }
                  case 4: {
                    message.timestamp = reader.int64();
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            Landmarks.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            Landmarks.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.value != null && Object.hasOwnProperty.call(message, "value")) {
                if (!Array.isArray(message.value))
                  return "value: array expected";
                for (var i = 0; i < message.value.length; ++i) {
                  var error = $root.presage.smartspectra.Point2dFloat.verify(message.value[i], long + 1);
                  if (error)
                    return "value." + error;
                }
              }
              if (message.stable != null && Object.hasOwnProperty.call(message, "stable")) {
                if (typeof message.stable !== "boolean")
                  return "stable: boolean expected";
              }
              if (message.reset != null && Object.hasOwnProperty.call(message, "reset")) {
                if (typeof message.reset !== "boolean")
                  return "reset: boolean expected";
              }
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp")) {
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                  return "timestamp: integer|Long expected";
              }
              return null;
            };
            Landmarks.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.Landmarks)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.Landmarks: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.Landmarks();
              if (object.value) {
                if (!Array.isArray(object.value))
                  throw TypeError(".presage.smartspectra.Landmarks.value: array expected");
                message.value = [];
                for (var i = 0; i < object.value.length; ++i) {
                  if (!$util.isObject(object.value[i]))
                    throw TypeError(".presage.smartspectra.Landmarks.value: object expected");
                  message.value[i] = $root.presage.smartspectra.Point2dFloat.fromObject(object.value[i], long + 1);
                }
              }
              if (object.stable != null)
                message.stable = Boolean(object.stable);
              if (object.reset != null)
                message.reset = Boolean(object.reset);
              if (object.timestamp != null) {
                if ($util.Long)
                  message.timestamp = $util.Long.fromValue(object.timestamp, false);
                else if (typeof object.timestamp === "string")
                  message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                  message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                  message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
              }
              return message;
            };
            Landmarks.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.arrays || options.defaults)
                object.value = [];
              if (options.defaults) {
                object.stable = false;
                object.reset = false;
                if ($util.Long) {
                  var long = new $util.Long(0, 0, false);
                  object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                } else
                  object.timestamp = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
              }
              if (message.value && message.value.length) {
                object.value = [];
                for (var j = 0; j < message.value.length; ++j)
                  object.value[j] = $root.presage.smartspectra.Point2dFloat.toObject(message.value[j], options, q + 1);
              }
              if (message.stable != null && Object.hasOwnProperty.call(message, "stable"))
                object.stable = message.stable;
              if (message.reset != null && Object.hasOwnProperty.call(message, "reset"))
                object.reset = message.reset;
              if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                  object.timestamp = typeof message.timestamp === "number" ? BigInt(message.timestamp) : $util.Long.fromBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0, false).toBigInt();
                else if (typeof message.timestamp === "number")
                  object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                  object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
              return object;
            };
            Landmarks.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            Landmarks.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.Landmarks";
            };
            return Landmarks;
          })();
          smartspectra.Face = (function() {
            function Face(properties) {
              this.blinking = [];
              this.talking = [];
              this.landmarks = [];
              this.expression = [];
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            Face.prototype.blinking = $util.emptyArray;
            Face.prototype.talking = $util.emptyArray;
            Face.prototype.landmarks = $util.emptyArray;
            Face.prototype.expression = $util.emptyArray;
            Face.create = function create(properties) {
              return new Face(properties);
            };
            Face.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.blinking != null && message.blinking.length)
                for (var i = 0; i < message.blinking.length; ++i)
                  $root.presage.smartspectra.DetectionStatus.encode(message.blinking[i], writer.uint32(
                    /* id 1, wireType 2 =*/
                    10
                  ).fork(), q + 1).ldelim();
              if (message.talking != null && message.talking.length)
                for (var i = 0; i < message.talking.length; ++i)
                  $root.presage.smartspectra.DetectionStatus.encode(message.talking[i], writer.uint32(
                    /* id 2, wireType 2 =*/
                    18
                  ).fork(), q + 1).ldelim();
              if (message.landmarks != null && message.landmarks.length)
                for (var i = 0; i < message.landmarks.length; ++i)
                  $root.presage.smartspectra.Landmarks.encode(message.landmarks[i], writer.uint32(
                    /* id 3, wireType 2 =*/
                    26
                  ).fork(), q + 1).ldelim();
              if (message.expression != null && message.expression.length)
                for (var i = 0; i < message.expression.length; ++i)
                  $root.presage.smartspectra.Expression.encode(message.expression[i], writer.uint32(
                    /* id 4, wireType 2 =*/
                    34
                  ).fork(), q + 1).ldelim();
              return writer;
            };
            Face.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            Face.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.Face();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    if (!(message.blinking && message.blinking.length))
                      message.blinking = [];
                    message.blinking.push($root.presage.smartspectra.DetectionStatus.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 2: {
                    if (!(message.talking && message.talking.length))
                      message.talking = [];
                    message.talking.push($root.presage.smartspectra.DetectionStatus.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 3: {
                    if (!(message.landmarks && message.landmarks.length))
                      message.landmarks = [];
                    message.landmarks.push($root.presage.smartspectra.Landmarks.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 4: {
                    if (!(message.expression && message.expression.length))
                      message.expression = [];
                    message.expression.push($root.presage.smartspectra.Expression.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            Face.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            Face.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.blinking != null && Object.hasOwnProperty.call(message, "blinking")) {
                if (!Array.isArray(message.blinking))
                  return "blinking: array expected";
                for (var i = 0; i < message.blinking.length; ++i) {
                  var error = $root.presage.smartspectra.DetectionStatus.verify(message.blinking[i], long + 1);
                  if (error)
                    return "blinking." + error;
                }
              }
              if (message.talking != null && Object.hasOwnProperty.call(message, "talking")) {
                if (!Array.isArray(message.talking))
                  return "talking: array expected";
                for (var i = 0; i < message.talking.length; ++i) {
                  var error = $root.presage.smartspectra.DetectionStatus.verify(message.talking[i], long + 1);
                  if (error)
                    return "talking." + error;
                }
              }
              if (message.landmarks != null && Object.hasOwnProperty.call(message, "landmarks")) {
                if (!Array.isArray(message.landmarks))
                  return "landmarks: array expected";
                for (var i = 0; i < message.landmarks.length; ++i) {
                  var error = $root.presage.smartspectra.Landmarks.verify(message.landmarks[i], long + 1);
                  if (error)
                    return "landmarks." + error;
                }
              }
              if (message.expression != null && Object.hasOwnProperty.call(message, "expression")) {
                if (!Array.isArray(message.expression))
                  return "expression: array expected";
                for (var i = 0; i < message.expression.length; ++i) {
                  var error = $root.presage.smartspectra.Expression.verify(message.expression[i], long + 1);
                  if (error)
                    return "expression." + error;
                }
              }
              return null;
            };
            Face.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.Face)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.Face: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.Face();
              if (object.blinking) {
                if (!Array.isArray(object.blinking))
                  throw TypeError(".presage.smartspectra.Face.blinking: array expected");
                message.blinking = [];
                for (var i = 0; i < object.blinking.length; ++i) {
                  if (!$util.isObject(object.blinking[i]))
                    throw TypeError(".presage.smartspectra.Face.blinking: object expected");
                  message.blinking[i] = $root.presage.smartspectra.DetectionStatus.fromObject(object.blinking[i], long + 1);
                }
              }
              if (object.talking) {
                if (!Array.isArray(object.talking))
                  throw TypeError(".presage.smartspectra.Face.talking: array expected");
                message.talking = [];
                for (var i = 0; i < object.talking.length; ++i) {
                  if (!$util.isObject(object.talking[i]))
                    throw TypeError(".presage.smartspectra.Face.talking: object expected");
                  message.talking[i] = $root.presage.smartspectra.DetectionStatus.fromObject(object.talking[i], long + 1);
                }
              }
              if (object.landmarks) {
                if (!Array.isArray(object.landmarks))
                  throw TypeError(".presage.smartspectra.Face.landmarks: array expected");
                message.landmarks = [];
                for (var i = 0; i < object.landmarks.length; ++i) {
                  if (!$util.isObject(object.landmarks[i]))
                    throw TypeError(".presage.smartspectra.Face.landmarks: object expected");
                  message.landmarks[i] = $root.presage.smartspectra.Landmarks.fromObject(object.landmarks[i], long + 1);
                }
              }
              if (object.expression) {
                if (!Array.isArray(object.expression))
                  throw TypeError(".presage.smartspectra.Face.expression: array expected");
                message.expression = [];
                for (var i = 0; i < object.expression.length; ++i) {
                  if (!$util.isObject(object.expression[i]))
                    throw TypeError(".presage.smartspectra.Face.expression: object expected");
                  message.expression[i] = $root.presage.smartspectra.Expression.fromObject(object.expression[i], long + 1);
                }
              }
              return message;
            };
            Face.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.arrays || options.defaults) {
                object.blinking = [];
                object.talking = [];
                object.landmarks = [];
                object.expression = [];
              }
              if (message.blinking && message.blinking.length) {
                object.blinking = [];
                for (var j = 0; j < message.blinking.length; ++j)
                  object.blinking[j] = $root.presage.smartspectra.DetectionStatus.toObject(message.blinking[j], options, q + 1);
              }
              if (message.talking && message.talking.length) {
                object.talking = [];
                for (var j = 0; j < message.talking.length; ++j)
                  object.talking[j] = $root.presage.smartspectra.DetectionStatus.toObject(message.talking[j], options, q + 1);
              }
              if (message.landmarks && message.landmarks.length) {
                object.landmarks = [];
                for (var j = 0; j < message.landmarks.length; ++j)
                  object.landmarks[j] = $root.presage.smartspectra.Landmarks.toObject(message.landmarks[j], options, q + 1);
              }
              if (message.expression && message.expression.length) {
                object.expression = [];
                for (var j = 0; j < message.expression.length; ++j)
                  object.expression[j] = $root.presage.smartspectra.Expression.toObject(message.expression[j], options, q + 1);
              }
              return object;
            };
            Face.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            Face.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.Face";
            };
            return Face;
          })();
          smartspectra.MicroMotion = (function() {
            function MicroMotion(properties) {
              this.glutes = [];
              this.knees = [];
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            MicroMotion.prototype.glutes = $util.emptyArray;
            MicroMotion.prototype.knees = $util.emptyArray;
            MicroMotion.create = function create(properties) {
              return new MicroMotion(properties);
            };
            MicroMotion.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.glutes != null && message.glutes.length)
                for (var i = 0; i < message.glutes.length; ++i)
                  $root.presage.smartspectra.Measurement.encode(message.glutes[i], writer.uint32(
                    /* id 1, wireType 2 =*/
                    10
                  ).fork(), q + 1).ldelim();
              if (message.knees != null && message.knees.length)
                for (var i = 0; i < message.knees.length; ++i)
                  $root.presage.smartspectra.Measurement.encode(message.knees[i], writer.uint32(
                    /* id 2, wireType 2 =*/
                    18
                  ).fork(), q + 1).ldelim();
              return writer;
            };
            MicroMotion.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            MicroMotion.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.MicroMotion();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    if (!(message.glutes && message.glutes.length))
                      message.glutes = [];
                    message.glutes.push($root.presage.smartspectra.Measurement.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 2: {
                    if (!(message.knees && message.knees.length))
                      message.knees = [];
                    message.knees.push($root.presage.smartspectra.Measurement.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            MicroMotion.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            MicroMotion.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.glutes != null && Object.hasOwnProperty.call(message, "glutes")) {
                if (!Array.isArray(message.glutes))
                  return "glutes: array expected";
                for (var i = 0; i < message.glutes.length; ++i) {
                  var error = $root.presage.smartspectra.Measurement.verify(message.glutes[i], long + 1);
                  if (error)
                    return "glutes." + error;
                }
              }
              if (message.knees != null && Object.hasOwnProperty.call(message, "knees")) {
                if (!Array.isArray(message.knees))
                  return "knees: array expected";
                for (var i = 0; i < message.knees.length; ++i) {
                  var error = $root.presage.smartspectra.Measurement.verify(message.knees[i], long + 1);
                  if (error)
                    return "knees." + error;
                }
              }
              return null;
            };
            MicroMotion.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.MicroMotion)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.MicroMotion: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.MicroMotion();
              if (object.glutes) {
                if (!Array.isArray(object.glutes))
                  throw TypeError(".presage.smartspectra.MicroMotion.glutes: array expected");
                message.glutes = [];
                for (var i = 0; i < object.glutes.length; ++i) {
                  if (!$util.isObject(object.glutes[i]))
                    throw TypeError(".presage.smartspectra.MicroMotion.glutes: object expected");
                  message.glutes[i] = $root.presage.smartspectra.Measurement.fromObject(object.glutes[i], long + 1);
                }
              }
              if (object.knees) {
                if (!Array.isArray(object.knees))
                  throw TypeError(".presage.smartspectra.MicroMotion.knees: array expected");
                message.knees = [];
                for (var i = 0; i < object.knees.length; ++i) {
                  if (!$util.isObject(object.knees[i]))
                    throw TypeError(".presage.smartspectra.MicroMotion.knees: object expected");
                  message.knees[i] = $root.presage.smartspectra.Measurement.fromObject(object.knees[i], long + 1);
                }
              }
              return message;
            };
            MicroMotion.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.arrays || options.defaults) {
                object.glutes = [];
                object.knees = [];
              }
              if (message.glutes && message.glutes.length) {
                object.glutes = [];
                for (var j = 0; j < message.glutes.length; ++j)
                  object.glutes[j] = $root.presage.smartspectra.Measurement.toObject(message.glutes[j], options, q + 1);
              }
              if (message.knees && message.knees.length) {
                object.knees = [];
                for (var j = 0; j < message.knees.length; ++j)
                  object.knees[j] = $root.presage.smartspectra.Measurement.toObject(message.knees[j], options, q + 1);
              }
              return object;
            };
            MicroMotion.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            MicroMotion.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.MicroMotion";
            };
            return MicroMotion;
          })();
          smartspectra.Eda = (function() {
            function Eda(properties) {
              this.trace = [];
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            Eda.prototype.trace = $util.emptyArray;
            Eda.create = function create(properties) {
              return new Eda(properties);
            };
            Eda.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.trace != null && message.trace.length)
                for (var i = 0; i < message.trace.length; ++i)
                  $root.presage.smartspectra.Measurement.encode(message.trace[i], writer.uint32(
                    /* id 1, wireType 2 =*/
                    10
                  ).fork(), q + 1).ldelim();
              return writer;
            };
            Eda.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            Eda.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.Eda();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    if (!(message.trace && message.trace.length))
                      message.trace = [];
                    message.trace.push($root.presage.smartspectra.Measurement.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            Eda.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            Eda.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.trace != null && Object.hasOwnProperty.call(message, "trace")) {
                if (!Array.isArray(message.trace))
                  return "trace: array expected";
                for (var i = 0; i < message.trace.length; ++i) {
                  var error = $root.presage.smartspectra.Measurement.verify(message.trace[i], long + 1);
                  if (error)
                    return "trace." + error;
                }
              }
              return null;
            };
            Eda.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.Eda)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.Eda: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.Eda();
              if (object.trace) {
                if (!Array.isArray(object.trace))
                  throw TypeError(".presage.smartspectra.Eda.trace: array expected");
                message.trace = [];
                for (var i = 0; i < object.trace.length; ++i) {
                  if (!$util.isObject(object.trace[i]))
                    throw TypeError(".presage.smartspectra.Eda.trace: object expected");
                  message.trace[i] = $root.presage.smartspectra.Measurement.fromObject(object.trace[i], long + 1);
                }
              }
              return message;
            };
            Eda.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.arrays || options.defaults)
                object.trace = [];
              if (message.trace && message.trace.length) {
                object.trace = [];
                for (var j = 0; j < message.trace.length; ++j)
                  object.trace[j] = $root.presage.smartspectra.Measurement.toObject(message.trace[j], options, q + 1);
              }
              return object;
            };
            Eda.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            Eda.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.Eda";
            };
            return Eda;
          })();
          smartspectra.Cardio = (function() {
            function Cardio(properties) {
              this.pulseRate = [];
              this.arterialPressureTrace = [];
              this.hrv = [];
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            Cardio.prototype.pulseRate = $util.emptyArray;
            Cardio.prototype.arterialPressureTrace = $util.emptyArray;
            Cardio.prototype.hrv = $util.emptyArray;
            Cardio.prototype.pulseRateStrict = null;
            Cardio.create = function create(properties) {
              return new Cardio(properties);
            };
            Cardio.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.pulseRate != null && message.pulseRate.length)
                for (var i = 0; i < message.pulseRate.length; ++i)
                  $root.presage.smartspectra.MeasurementWithConfidence.encode(message.pulseRate[i], writer.uint32(
                    /* id 1, wireType 2 =*/
                    10
                  ).fork(), q + 1).ldelim();
              if (message.arterialPressureTrace != null && message.arterialPressureTrace.length)
                for (var i = 0; i < message.arterialPressureTrace.length; ++i)
                  $root.presage.smartspectra.MeasurementWithConfidence.encode(message.arterialPressureTrace[i], writer.uint32(
                    /* id 2, wireType 2 =*/
                    18
                  ).fork(), q + 1).ldelim();
              if (message.hrv != null && message.hrv.length)
                for (var i = 0; i < message.hrv.length; ++i)
                  $root.presage.smartspectra.Hrv.encode(message.hrv[i], writer.uint32(
                    /* id 3, wireType 2 =*/
                    26
                  ).fork(), q + 1).ldelim();
              if (message.pulseRateStrict != null && Object.hasOwnProperty.call(message, "pulseRateStrict"))
                $root.presage.smartspectra.Strict.encode(message.pulseRateStrict, writer.uint32(
                  /* id 4, wireType 2 =*/
                  34
                ).fork(), q + 1).ldelim();
              return writer;
            };
            Cardio.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            Cardio.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.Cardio();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    if (!(message.pulseRate && message.pulseRate.length))
                      message.pulseRate = [];
                    message.pulseRate.push($root.presage.smartspectra.MeasurementWithConfidence.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 2: {
                    if (!(message.arterialPressureTrace && message.arterialPressureTrace.length))
                      message.arterialPressureTrace = [];
                    message.arterialPressureTrace.push($root.presage.smartspectra.MeasurementWithConfidence.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 3: {
                    if (!(message.hrv && message.hrv.length))
                      message.hrv = [];
                    message.hrv.push($root.presage.smartspectra.Hrv.decode(reader, reader.uint32(), void 0, long + 1));
                    break;
                  }
                  case 4: {
                    message.pulseRateStrict = $root.presage.smartspectra.Strict.decode(reader, reader.uint32(), void 0, long + 1);
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            Cardio.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            Cardio.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.pulseRate != null && Object.hasOwnProperty.call(message, "pulseRate")) {
                if (!Array.isArray(message.pulseRate))
                  return "pulseRate: array expected";
                for (var i = 0; i < message.pulseRate.length; ++i) {
                  var error = $root.presage.smartspectra.MeasurementWithConfidence.verify(message.pulseRate[i], long + 1);
                  if (error)
                    return "pulseRate." + error;
                }
              }
              if (message.arterialPressureTrace != null && Object.hasOwnProperty.call(message, "arterialPressureTrace")) {
                if (!Array.isArray(message.arterialPressureTrace))
                  return "arterialPressureTrace: array expected";
                for (var i = 0; i < message.arterialPressureTrace.length; ++i) {
                  var error = $root.presage.smartspectra.MeasurementWithConfidence.verify(message.arterialPressureTrace[i], long + 1);
                  if (error)
                    return "arterialPressureTrace." + error;
                }
              }
              if (message.hrv != null && Object.hasOwnProperty.call(message, "hrv")) {
                if (!Array.isArray(message.hrv))
                  return "hrv: array expected";
                for (var i = 0; i < message.hrv.length; ++i) {
                  var error = $root.presage.smartspectra.Hrv.verify(message.hrv[i], long + 1);
                  if (error)
                    return "hrv." + error;
                }
              }
              if (message.pulseRateStrict != null && Object.hasOwnProperty.call(message, "pulseRateStrict")) {
                var error = $root.presage.smartspectra.Strict.verify(message.pulseRateStrict, long + 1);
                if (error)
                  return "pulseRateStrict." + error;
              }
              return null;
            };
            Cardio.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.Cardio)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.Cardio: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.Cardio();
              if (object.pulseRate) {
                if (!Array.isArray(object.pulseRate))
                  throw TypeError(".presage.smartspectra.Cardio.pulseRate: array expected");
                message.pulseRate = [];
                for (var i = 0; i < object.pulseRate.length; ++i) {
                  if (!$util.isObject(object.pulseRate[i]))
                    throw TypeError(".presage.smartspectra.Cardio.pulseRate: object expected");
                  message.pulseRate[i] = $root.presage.smartspectra.MeasurementWithConfidence.fromObject(object.pulseRate[i], long + 1);
                }
              }
              if (object.arterialPressureTrace) {
                if (!Array.isArray(object.arterialPressureTrace))
                  throw TypeError(".presage.smartspectra.Cardio.arterialPressureTrace: array expected");
                message.arterialPressureTrace = [];
                for (var i = 0; i < object.arterialPressureTrace.length; ++i) {
                  if (!$util.isObject(object.arterialPressureTrace[i]))
                    throw TypeError(".presage.smartspectra.Cardio.arterialPressureTrace: object expected");
                  message.arterialPressureTrace[i] = $root.presage.smartspectra.MeasurementWithConfidence.fromObject(object.arterialPressureTrace[i], long + 1);
                }
              }
              if (object.hrv) {
                if (!Array.isArray(object.hrv))
                  throw TypeError(".presage.smartspectra.Cardio.hrv: array expected");
                message.hrv = [];
                for (var i = 0; i < object.hrv.length; ++i) {
                  if (!$util.isObject(object.hrv[i]))
                    throw TypeError(".presage.smartspectra.Cardio.hrv: object expected");
                  message.hrv[i] = $root.presage.smartspectra.Hrv.fromObject(object.hrv[i], long + 1);
                }
              }
              if (object.pulseRateStrict != null) {
                if (!$util.isObject(object.pulseRateStrict))
                  throw TypeError(".presage.smartspectra.Cardio.pulseRateStrict: object expected");
                message.pulseRateStrict = $root.presage.smartspectra.Strict.fromObject(object.pulseRateStrict, long + 1);
              }
              return message;
            };
            Cardio.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.arrays || options.defaults) {
                object.pulseRate = [];
                object.arterialPressureTrace = [];
                object.hrv = [];
              }
              if (options.defaults)
                object.pulseRateStrict = null;
              if (message.pulseRate && message.pulseRate.length) {
                object.pulseRate = [];
                for (var j = 0; j < message.pulseRate.length; ++j)
                  object.pulseRate[j] = $root.presage.smartspectra.MeasurementWithConfidence.toObject(message.pulseRate[j], options, q + 1);
              }
              if (message.arterialPressureTrace && message.arterialPressureTrace.length) {
                object.arterialPressureTrace = [];
                for (var j = 0; j < message.arterialPressureTrace.length; ++j)
                  object.arterialPressureTrace[j] = $root.presage.smartspectra.MeasurementWithConfidence.toObject(message.arterialPressureTrace[j], options, q + 1);
              }
              if (message.hrv && message.hrv.length) {
                object.hrv = [];
                for (var j = 0; j < message.hrv.length; ++j)
                  object.hrv[j] = $root.presage.smartspectra.Hrv.toObject(message.hrv[j], options, q + 1);
              }
              if (message.pulseRateStrict != null && Object.hasOwnProperty.call(message, "pulseRateStrict"))
                object.pulseRateStrict = $root.presage.smartspectra.Strict.toObject(message.pulseRateStrict, options, q + 1);
              return object;
            };
            Cardio.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            Cardio.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.Cardio";
            };
            return Cardio;
          })();
          smartspectra.Metrics = (function() {
            function Metrics(properties) {
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            Metrics.prototype.breathing = null;
            Metrics.prototype.micromotion = null;
            Metrics.prototype.eda = null;
            Metrics.prototype.face = null;
            Metrics.prototype.cardio = null;
            Metrics.create = function create(properties) {
              return new Metrics(properties);
            };
            Metrics.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.breathing != null && Object.hasOwnProperty.call(message, "breathing"))
                $root.presage.smartspectra.Breathing.encode(message.breathing, writer.uint32(
                  /* id 1, wireType 2 =*/
                  10
                ).fork(), q + 1).ldelim();
              if (message.micromotion != null && Object.hasOwnProperty.call(message, "micromotion"))
                $root.presage.smartspectra.MicroMotion.encode(message.micromotion, writer.uint32(
                  /* id 2, wireType 2 =*/
                  18
                ).fork(), q + 1).ldelim();
              if (message.eda != null && Object.hasOwnProperty.call(message, "eda"))
                $root.presage.smartspectra.Eda.encode(message.eda, writer.uint32(
                  /* id 3, wireType 2 =*/
                  26
                ).fork(), q + 1).ldelim();
              if (message.face != null && Object.hasOwnProperty.call(message, "face"))
                $root.presage.smartspectra.Face.encode(message.face, writer.uint32(
                  /* id 4, wireType 2 =*/
                  34
                ).fork(), q + 1).ldelim();
              if (message.cardio != null && Object.hasOwnProperty.call(message, "cardio"))
                $root.presage.smartspectra.Cardio.encode(message.cardio, writer.uint32(
                  /* id 5, wireType 2 =*/
                  42
                ).fork(), q + 1).ldelim();
              return writer;
            };
            Metrics.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            Metrics.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.Metrics();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    message.breathing = $root.presage.smartspectra.Breathing.decode(reader, reader.uint32(), void 0, long + 1);
                    break;
                  }
                  case 2: {
                    message.micromotion = $root.presage.smartspectra.MicroMotion.decode(reader, reader.uint32(), void 0, long + 1);
                    break;
                  }
                  case 3: {
                    message.eda = $root.presage.smartspectra.Eda.decode(reader, reader.uint32(), void 0, long + 1);
                    break;
                  }
                  case 4: {
                    message.face = $root.presage.smartspectra.Face.decode(reader, reader.uint32(), void 0, long + 1);
                    break;
                  }
                  case 5: {
                    message.cardio = $root.presage.smartspectra.Cardio.decode(reader, reader.uint32(), void 0, long + 1);
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            Metrics.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            Metrics.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.breathing != null && Object.hasOwnProperty.call(message, "breathing")) {
                var error = $root.presage.smartspectra.Breathing.verify(message.breathing, long + 1);
                if (error)
                  return "breathing." + error;
              }
              if (message.micromotion != null && Object.hasOwnProperty.call(message, "micromotion")) {
                var error = $root.presage.smartspectra.MicroMotion.verify(message.micromotion, long + 1);
                if (error)
                  return "micromotion." + error;
              }
              if (message.eda != null && Object.hasOwnProperty.call(message, "eda")) {
                var error = $root.presage.smartspectra.Eda.verify(message.eda, long + 1);
                if (error)
                  return "eda." + error;
              }
              if (message.face != null && Object.hasOwnProperty.call(message, "face")) {
                var error = $root.presage.smartspectra.Face.verify(message.face, long + 1);
                if (error)
                  return "face." + error;
              }
              if (message.cardio != null && Object.hasOwnProperty.call(message, "cardio")) {
                var error = $root.presage.smartspectra.Cardio.verify(message.cardio, long + 1);
                if (error)
                  return "cardio." + error;
              }
              return null;
            };
            Metrics.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.Metrics)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.Metrics: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.Metrics();
              if (object.breathing != null) {
                if (!$util.isObject(object.breathing))
                  throw TypeError(".presage.smartspectra.Metrics.breathing: object expected");
                message.breathing = $root.presage.smartspectra.Breathing.fromObject(object.breathing, long + 1);
              }
              if (object.micromotion != null) {
                if (!$util.isObject(object.micromotion))
                  throw TypeError(".presage.smartspectra.Metrics.micromotion: object expected");
                message.micromotion = $root.presage.smartspectra.MicroMotion.fromObject(object.micromotion, long + 1);
              }
              if (object.eda != null) {
                if (!$util.isObject(object.eda))
                  throw TypeError(".presage.smartspectra.Metrics.eda: object expected");
                message.eda = $root.presage.smartspectra.Eda.fromObject(object.eda, long + 1);
              }
              if (object.face != null) {
                if (!$util.isObject(object.face))
                  throw TypeError(".presage.smartspectra.Metrics.face: object expected");
                message.face = $root.presage.smartspectra.Face.fromObject(object.face, long + 1);
              }
              if (object.cardio != null) {
                if (!$util.isObject(object.cardio))
                  throw TypeError(".presage.smartspectra.Metrics.cardio: object expected");
                message.cardio = $root.presage.smartspectra.Cardio.fromObject(object.cardio, long + 1);
              }
              return message;
            };
            Metrics.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.defaults) {
                object.breathing = null;
                object.micromotion = null;
                object.eda = null;
                object.face = null;
                object.cardio = null;
              }
              if (message.breathing != null && Object.hasOwnProperty.call(message, "breathing"))
                object.breathing = $root.presage.smartspectra.Breathing.toObject(message.breathing, options, q + 1);
              if (message.micromotion != null && Object.hasOwnProperty.call(message, "micromotion"))
                object.micromotion = $root.presage.smartspectra.MicroMotion.toObject(message.micromotion, options, q + 1);
              if (message.eda != null && Object.hasOwnProperty.call(message, "eda"))
                object.eda = $root.presage.smartspectra.Eda.toObject(message.eda, options, q + 1);
              if (message.face != null && Object.hasOwnProperty.call(message, "face"))
                object.face = $root.presage.smartspectra.Face.toObject(message.face, options, q + 1);
              if (message.cardio != null && Object.hasOwnProperty.call(message, "cardio"))
                object.cardio = $root.presage.smartspectra.Cardio.toObject(message.cardio, options, q + 1);
              return object;
            };
            Metrics.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            Metrics.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.Metrics";
            };
            return Metrics;
          })();
          smartspectra.Point2dInt32 = (function() {
            function Point2dInt32(properties) {
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            Point2dInt32.prototype.x = 0;
            Point2dInt32.prototype.y = 0;
            Point2dInt32.create = function create(properties) {
              return new Point2dInt32(properties);
            };
            Point2dInt32.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(
                  /* id 1, wireType 0 =*/
                  8
                ).int32(message.x);
              if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(
                  /* id 2, wireType 0 =*/
                  16
                ).int32(message.y);
              return writer;
            };
            Point2dInt32.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            Point2dInt32.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.Point2dInt32();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    message.x = reader.int32();
                    break;
                  }
                  case 2: {
                    message.y = reader.int32();
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            Point2dInt32.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            Point2dInt32.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.x != null && Object.hasOwnProperty.call(message, "x")) {
                if (!$util.isInteger(message.x))
                  return "x: integer expected";
              }
              if (message.y != null && Object.hasOwnProperty.call(message, "y")) {
                if (!$util.isInteger(message.y))
                  return "y: integer expected";
              }
              return null;
            };
            Point2dInt32.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.Point2dInt32)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.Point2dInt32: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.Point2dInt32();
              if (object.x != null)
                message.x = object.x | 0;
              if (object.y != null)
                message.y = object.y | 0;
              return message;
            };
            Point2dInt32.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.defaults) {
                object.x = 0;
                object.y = 0;
              }
              if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                object.x = message.x;
              if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                object.y = message.y;
              return object;
            };
            Point2dInt32.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            Point2dInt32.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.Point2dInt32";
            };
            return Point2dInt32;
          })();
          smartspectra.Point2dFloat = (function() {
            function Point2dFloat(properties) {
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            Point2dFloat.prototype.x = 0;
            Point2dFloat.prototype.y = 0;
            Point2dFloat.create = function create(properties) {
              return new Point2dFloat(properties);
            };
            Point2dFloat.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(
                  /* id 1, wireType 5 =*/
                  13
                ).float(message.x);
              if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(
                  /* id 2, wireType 5 =*/
                  21
                ).float(message.y);
              return writer;
            };
            Point2dFloat.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            Point2dFloat.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.Point2dFloat();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    message.x = reader.float();
                    break;
                  }
                  case 2: {
                    message.y = reader.float();
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            Point2dFloat.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            Point2dFloat.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.x != null && Object.hasOwnProperty.call(message, "x")) {
                if (typeof message.x !== "number")
                  return "x: number expected";
              }
              if (message.y != null && Object.hasOwnProperty.call(message, "y")) {
                if (typeof message.y !== "number")
                  return "y: number expected";
              }
              return null;
            };
            Point2dFloat.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.Point2dFloat)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.Point2dFloat: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.Point2dFloat();
              if (object.x != null)
                message.x = Number(object.x);
              if (object.y != null)
                message.y = Number(object.y);
              return message;
            };
            Point2dFloat.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.defaults) {
                object.x = 0;
                object.y = 0;
              }
              if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
              if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
              return object;
            };
            Point2dFloat.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            Point2dFloat.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.Point2dFloat";
            };
            return Point2dFloat;
          })();
          smartspectra.Point3dFloat = (function() {
            function Point3dFloat(properties) {
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            Point3dFloat.prototype.x = 0;
            Point3dFloat.prototype.y = 0;
            Point3dFloat.prototype.z = 0;
            Point3dFloat.create = function create(properties) {
              return new Point3dFloat(properties);
            };
            Point3dFloat.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(
                  /* id 1, wireType 5 =*/
                  13
                ).float(message.x);
              if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(
                  /* id 2, wireType 5 =*/
                  21
                ).float(message.y);
              if (message.z != null && Object.hasOwnProperty.call(message, "z"))
                writer.uint32(
                  /* id 3, wireType 5 =*/
                  29
                ).float(message.z);
              return writer;
            };
            Point3dFloat.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            Point3dFloat.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.Point3dFloat();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    message.x = reader.float();
                    break;
                  }
                  case 2: {
                    message.y = reader.float();
                    break;
                  }
                  case 3: {
                    message.z = reader.float();
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            Point3dFloat.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            Point3dFloat.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.x != null && Object.hasOwnProperty.call(message, "x")) {
                if (typeof message.x !== "number")
                  return "x: number expected";
              }
              if (message.y != null && Object.hasOwnProperty.call(message, "y")) {
                if (typeof message.y !== "number")
                  return "y: number expected";
              }
              if (message.z != null && Object.hasOwnProperty.call(message, "z")) {
                if (typeof message.z !== "number")
                  return "z: number expected";
              }
              return null;
            };
            Point3dFloat.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.Point3dFloat)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.Point3dFloat: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.Point3dFloat();
              if (object.x != null)
                message.x = Number(object.x);
              if (object.y != null)
                message.y = Number(object.y);
              if (object.z != null)
                message.z = Number(object.z);
              return message;
            };
            Point3dFloat.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.defaults) {
                object.x = 0;
                object.y = 0;
                object.z = 0;
              }
              if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
              if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
              if (message.z != null && Object.hasOwnProperty.call(message, "z"))
                object.z = options.json && !isFinite(message.z) ? String(message.z) : message.z;
              return object;
            };
            Point3dFloat.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            Point3dFloat.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.Point3dFloat";
            };
            return Point3dFloat;
          })();
          smartspectra.FeatureType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "BREATHING"] = 0;
            values[valuesById[1] = "MICROMOTION"] = 1;
            values[valuesById[2] = "EDA"] = 2;
            values[valuesById[3] = "FACE"] = 3;
            values[valuesById[4] = "CARDIO"] = 4;
            return values;
          })();
          smartspectra.MetricType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "CHEST_BREATHING"] = 0;
            values[valuesById[1] = "ABDOMEN_BREATHING"] = 1;
            values[valuesById[2] = "BREATHING_RATE"] = 2;
            values[valuesById[3] = "BREATHING_AMPLITUDE"] = 3;
            values[valuesById[4] = "APNEA"] = 4;
            values[valuesById[5] = "RESPIRATORY_LINE_LENGTH"] = 5;
            values[valuesById[6] = "BASELINE"] = 6;
            values[valuesById[7] = "INHALE_EXHALE_RATIO"] = 7;
            values[valuesById[8] = "GLUTES_MICROMOTION"] = 8;
            values[valuesById[9] = "KNEES_MICROMOTION"] = 9;
            values[valuesById[10] = "EDA_TRACE"] = 10;
            values[valuesById[11] = "FACE_LANDMARKS"] = 11;
            values[valuesById[12] = "BLINKING"] = 12;
            values[valuesById[13] = "TALKING"] = 13;
            values[valuesById[14] = "EXPRESSIONS"] = 14;
            values[valuesById[15] = "PULSE_RATE"] = 15;
            values[valuesById[16] = "ARTERIAL_PRESSURE_TRACE"] = 16;
            values[valuesById[17] = "HRV"] = 17;
            values[valuesById[18] = "PULSE_RATE_STRICT"] = 18;
            values[valuesById[19] = "BREATHING_RATE_STRICT"] = 19;
            return values;
          })();
          smartspectra.RequestedMetrics = (function() {
            function RequestedMetrics(properties) {
              this.metrics = [];
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            RequestedMetrics.prototype.metrics = $util.emptyArray;
            RequestedMetrics.create = function create(properties) {
              return new RequestedMetrics(properties);
            };
            RequestedMetrics.encode = function encode(message, writer, q) {
              if (!writer)
                writer = $Writer.create();
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              if (message.metrics != null && message.metrics.length) {
                writer.uint32(
                  /* id 1, wireType 2 =*/
                  10
                ).fork();
                for (var i = 0; i < message.metrics.length; ++i)
                  writer.int32(message.metrics[i]);
                writer.ldelim();
              }
              return writer;
            };
            RequestedMetrics.encodeDelimited = function encodeDelimited(message, writer) {
              return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
            };
            RequestedMetrics.decode = function decode(reader, length, error, long) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (long === void 0)
                long = 0;
              if (long > $Reader.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var end, message;
              if (length === void 0)
                end = reader.len;
              else {
                end = reader.pos + length;
                if (end > reader.len)
                  throw RangeError("index out of range");
                length = reader.len;
                reader.len = end;
              }
              message = new $root.presage.smartspectra.RequestedMetrics();
              while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                  break;
                switch (tag >>> 3) {
                  case 1: {
                    if (!(message.metrics && message.metrics.length))
                      message.metrics = [];
                    if ((tag & 7) === 2) {
                      var end2 = reader.uint32() + reader.pos;
                      if (end2 > reader.len)
                        throw RangeError("index out of range");
                      reader.len = end2;
                      while (reader.pos < end2)
                        message.metrics.push(reader.int32());
                      if (reader.pos !== end2)
                        throw RangeError("index out of range");
                      reader.len = end;
                    } else
                      message.metrics.push(reader.int32());
                    break;
                  }
                  default:
                    reader.skipType(tag & 7, long);
                    break;
                }
              }
              if (length !== void 0) {
                if (reader.pos !== end)
                  throw RangeError("index out of range");
                reader.len = length;
              }
              return message;
            };
            RequestedMetrics.decodeDelimited = function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            };
            RequestedMetrics.verify = function verify(message, long) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                return "maximum nesting depth exceeded";
              if (message.metrics != null && Object.hasOwnProperty.call(message, "metrics")) {
                if (!Array.isArray(message.metrics))
                  return "metrics: array expected";
                for (var i = 0; i < message.metrics.length; ++i)
                  switch (message.metrics[i]) {
                    default:
                      return "metrics: enum value[] expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                    case 12:
                    case 13:
                    case 14:
                    case 15:
                    case 16:
                    case 17:
                    case 18:
                    case 19:
                      break;
                  }
              }
              return null;
            };
            RequestedMetrics.fromObject = function fromObject(object, long) {
              if (object instanceof $root.presage.smartspectra.RequestedMetrics)
                return object;
              if (!$util.isObject(object))
                throw TypeError(".presage.smartspectra.RequestedMetrics: object expected");
              if (long === void 0)
                long = 0;
              if (long > $util.recursionLimit)
                throw Error("maximum nesting depth exceeded");
              var message = new $root.presage.smartspectra.RequestedMetrics();
              if (object.metrics) {
                if (!Array.isArray(object.metrics))
                  throw TypeError(".presage.smartspectra.RequestedMetrics.metrics: array expected");
                message.metrics = [];
                for (var i = 0; i < object.metrics.length; ++i)
                  switch (object.metrics[i]) {
                    default:
                      if (typeof object.metrics[i] === "number") {
                        message.metrics[i] = object.metrics[i];
                        break;
                      }
                    case "CHEST_BREATHING":
                    case 0:
                      message.metrics[i] = 0;
                      break;
                    case "ABDOMEN_BREATHING":
                    case 1:
                      message.metrics[i] = 1;
                      break;
                    case "BREATHING_RATE":
                    case 2:
                      message.metrics[i] = 2;
                      break;
                    case "BREATHING_AMPLITUDE":
                    case 3:
                      message.metrics[i] = 3;
                      break;
                    case "APNEA":
                    case 4:
                      message.metrics[i] = 4;
                      break;
                    case "RESPIRATORY_LINE_LENGTH":
                    case 5:
                      message.metrics[i] = 5;
                      break;
                    case "BASELINE":
                    case 6:
                      message.metrics[i] = 6;
                      break;
                    case "INHALE_EXHALE_RATIO":
                    case 7:
                      message.metrics[i] = 7;
                      break;
                    case "GLUTES_MICROMOTION":
                    case 8:
                      message.metrics[i] = 8;
                      break;
                    case "KNEES_MICROMOTION":
                    case 9:
                      message.metrics[i] = 9;
                      break;
                    case "EDA_TRACE":
                    case 10:
                      message.metrics[i] = 10;
                      break;
                    case "FACE_LANDMARKS":
                    case 11:
                      message.metrics[i] = 11;
                      break;
                    case "BLINKING":
                    case 12:
                      message.metrics[i] = 12;
                      break;
                    case "TALKING":
                    case 13:
                      message.metrics[i] = 13;
                      break;
                    case "EXPRESSIONS":
                    case 14:
                      message.metrics[i] = 14;
                      break;
                    case "PULSE_RATE":
                    case 15:
                      message.metrics[i] = 15;
                      break;
                    case "ARTERIAL_PRESSURE_TRACE":
                    case 16:
                      message.metrics[i] = 16;
                      break;
                    case "HRV":
                    case 17:
                      message.metrics[i] = 17;
                      break;
                    case "PULSE_RATE_STRICT":
                    case 18:
                      message.metrics[i] = 18;
                      break;
                    case "BREATHING_RATE_STRICT":
                    case 19:
                      message.metrics[i] = 19;
                      break;
                  }
              }
              return message;
            };
            RequestedMetrics.toObject = function toObject(message, options, q) {
              if (!options)
                options = {};
              if (q === void 0)
                q = 0;
              if (q > $util.recursionLimit)
                throw Error("max depth exceeded");
              var object = {};
              if (options.arrays || options.defaults)
                object.metrics = [];
              if (message.metrics && message.metrics.length) {
                object.metrics = [];
                for (var j = 0; j < message.metrics.length; ++j)
                  object.metrics[j] = options.enums === String ? $root.presage.smartspectra.MetricType[message.metrics[j]] === void 0 ? message.metrics[j] : $root.presage.smartspectra.MetricType[message.metrics[j]] : message.metrics[j];
              }
              return object;
            };
            RequestedMetrics.prototype.toJSON = function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
            RequestedMetrics.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
              if (typeUrlPrefix === void 0) {
                typeUrlPrefix = "type.googleapis.com";
              }
              return typeUrlPrefix + "/presage.smartspectra.RequestedMetrics";
            };
            return RequestedMetrics;
          })();
          return smartspectra;
        })();
        return presage;
      })();
      module.exports = $root;
    }
  });

  // ../node_modules/@smartspectra/node-sdk/js/constants.js
  var require_constants = __commonJS({
    "../node_modules/@smartspectra/node-sdk/js/constants.js"(exports, module) {
      "use strict";
      var generatedMetricType = require_generated().presage.smartspectra.MetricType;
      var ProcessingStatus2 = Object.freeze({
        kUninitialized: 0,
        kIdle: 1,
        kStarting: 2,
        kRunning: 3,
        kStopping: 4,
        kError: 5
      });
      var SmartSpectraLogLevel = Object.freeze({
        kDebug: 0,
        kInfo: 1,
        kWarning: 2,
        // the default
        kError: 3,
        kNone: 4
      });
      var PixelFormat = Object.freeze({
        kRGB: 0,
        kBGR: 1,
        kRGBA: 2,
        kBGRA: 3,
        kNV12: 4,
        kNV21: 5,
        kYUYV: 6
      });
      var ValidationCode2 = Object.freeze({
        kOk: 0,
        kNoFaceFound: 1,
        kMultipleFacesFound: 2,
        kFaceNotCentered: 3,
        /** @deprecated Use kFaceTooClose / kFaceTooFar instead. */
        kFaceSizeOutOfRange: 4,
        kTooDark: 5,
        kTooBright: 6,
        kChestNotVisible: 7,
        kCameraTuning: 10,
        kFrameRateTooLow: 11,
        kExcessiveMotion: 12,
        kFaceTooClose: 13,
        kFaceTooFar: 14,
        kFaceTooHigh: 15,
        kFaceTooLow: 16,
        kFaceNotForward: 17
      });
      var SmartSpectraErrorCode = Object.freeze({
        kOk: 0,
        kInvalidState: 1,
        kAuthenticationFailed: 2,
        kConfigurationFailed: 3,
        kCreditExhausted: 4,
        kNetworkError: 5,
        kServerError: 6,
        kInputUnavailable: 7,
        kProcessingFailed: 8,
        kFrameConversionFailed: 9,
        kNonMonotonicTimestamp: 10,
        kTimestampGap: 11
      });
      var FrameTransform = Object.freeze({
        kNone: 0,
        kRotate90CW: 1,
        kRotate90CCW: 2,
        kRotate180: 3,
        kMirrorHorizontal: 4,
        kMirrorVertical: 5
      });
      var MetricType = Object.freeze(Object.fromEntries(
        Object.entries(generatedMetricType).filter(([name]) => Number.isNaN(Number(name)))
      ));
      var breathingMetrics2 = Object.freeze([
        0,
        // CHEST_BREATHING
        1,
        // ABDOMEN_BREATHING
        2,
        // BREATHING_RATE
        3,
        // BREATHING_AMPLITUDE
        4,
        // APNEA
        5,
        // RESPIRATORY_LINE_LENGTH
        6,
        // BASELINE
        7
        // INHALE_EXHALE_RATIO
      ]);
      var cardioMetrics2 = Object.freeze([
        15,
        // PULSE_RATE
        16,
        // ARTERIAL_PRESSURE_TRACE
        17
        // HRV
      ]);
      var faceMetrics2 = Object.freeze([
        11,
        // FACE_LANDMARKS
        12,
        // BLINKING
        13,
        // TALKING
        14
        // EXPRESSIONS
      ]);
      var micromotionMetrics = Object.freeze([
        8,
        // GLUTES_MICROMOTION
        9
        // KNEES_MICROMOTION
      ]);
      var edaMetrics = Object.freeze([
        10
        // EDA_TRACE
      ]);
      var defaultSupportedMetrics = breathingMetrics2;
      module.exports = {
        ProcessingStatus: ProcessingStatus2,
        SmartSpectraLogLevel,
        PixelFormat,
        ValidationCode: ValidationCode2,
        SmartSpectraErrorCode,
        FrameTransform,
        MetricType,
        breathingMetrics: breathingMetrics2,
        cardioMetrics: cardioMetrics2,
        faceMetrics: faceMetrics2,
        micromotionMetrics,
        edaMetrics,
        defaultSupportedMetrics
      };
    }
  });

  // ../node_modules/@smartspectra/node-sdk/js/renderer/index.js
  var require_renderer = __commonJS({
    "../node_modules/@smartspectra/node-sdk/js/renderer/index.js"(exports, module) {
      "use strict";
      var { FrameTimestampAnchor } = require_timestamp();
      var SUPPORTED_EVENTS = /* @__PURE__ */ new Set([
        "processingStatus",
        "validationStatus",
        "metrics",
        "accumulatedMetrics",
        "insight",
        "frameSentThrough",
        "error",
        // Fires once the SDK has acquired (or re-acquired, after a Stop) the
        // default MediaStream. Host apps attach this stream to their preview
        // <video> element. Not fired when the host supplies its own stream
        // via useMediaStream() — in that case the host already owns the
        // reference.
        "streamAvailable"
      ]);
      var PIXEL_FORMAT_RGBA = 2;
      var PROCESSING_STATUS_STARTING = 2;
      var PROCESSING_STATUS_RUNNING = 3;
      var ERROR_CODE_PROCESSING_FAILED = 8;
      var STARTUP_WATCHDOG_MS = 3e4;
      var DEFAULT_VIDEO_CONSTRAINTS = Object.freeze({
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 },
        facingMode: "user"
      });
      var SmartSpectraSDK2 = class {
        /**
         * @param {Object} [options]
         * @param {string} [options.apiKey]
         * @param {number[]} [options.requestedMetrics]
         * @param {boolean} [options.enableAccumulatedOutput=false]
         * @param {boolean} [options.enableTelemetry=true] Aggregate SDK telemetry; set false to opt out.
         * @param {number} [options.sendTimeoutMs=30000] Per-call timeout for
         *   renderer→main IPC roundtrips (start/stop/reset/requestInsight/configure).
         *   If the main process crashes or stalls, the pending call rejects with a
         *   `SMARTSPECTRA_IPC_TIMEOUT` error instead of hanging the UI forever.
         *   Set to 0 to disable the timeout.
         */
        constructor(options = {}) {
          if (typeof window === "undefined" || !window.__smartspectraBridge) {
            throw new Error(
              "@smartspectra/node-sdk/renderer: window.__smartspectraBridge is unavailable. Set webPreferences.preload to require.resolve('@smartspectra/node-sdk/preload') on the BrowserWindow that loads this renderer, and call bindSmartSpectraIpc(window) from the main process."
            );
          }
          for (const method of ["attach", "postMessage", "onMessage", "close"]) {
            if (typeof window.__smartspectraBridge[method] !== "function") {
              throw new Error(
                `@smartspectra/node-sdk/renderer: bridge is missing ${method}(). The preload script may be out of sync with the renderer module.`
              );
            }
          }
          if (typeof MediaStreamTrackProcessor === "undefined") {
            throw new Error(
              "@smartspectra/node-sdk/renderer: MediaStreamTrackProcessor is unavailable. Requires Electron 16+ (Chromium 94+)."
            );
          }
          this._options = {
            apiKey: options.apiKey ?? "",
            requestedMetrics: options.requestedMetrics,
            enableAccumulatedOutput: !!options.enableAccumulatedOutput,
            enableTelemetry: options.enableTelemetry !== false
          };
          this._listeners = /* @__PURE__ */ new Map();
          this._processingStatus = 0;
          this._stream = null;
          this._streamOwned = false;
          this._track = null;
          this._processor = null;
          this._reader = null;
          this._frameLoopActive = false;
          this._frameLoopPromise = null;
          this._frameTimestamps = new FrameTimestampAnchor();
          this._cameraLocked = false;
          this._startupWatchdog = null;
          this._bridge = window.__smartspectraBridge;
          this._diagnostics = this._bridge.diagnostics === true;
          this._nextReplyId = 1;
          this._pendingAcks = /* @__PURE__ */ new Map();
          const sendTimeoutMs = options.sendTimeoutMs;
          this._sendTimeoutMs = typeof sendTimeoutMs === "number" && Number.isFinite(sendTimeoutMs) && sendTimeoutMs >= 0 ? sendTimeoutMs : 3e4;
          this._bridge.onMessage((data) => this._handleBridgeMessage(data));
          this._bridge.attach();
          this._bridge.postMessage({ kind: "configure", options: this._options });
        }
        /** SDK package version. */
        static get version() {
          return require_package().version;
        }
        /** Current ProcessingStatus integer value. */
        get processingStatus() {
          return this._processingStatus;
        }
        /**
         * Override the default camera with a host-supplied `MediaStream` from
         * `navigator.mediaDevices.getUserMedia`, `desktopCapturer`, a
         * `<canvas>.captureStream()`, etc. Optional — if not called, `start()`
         * acquires its own MediaStream with sensible defaults (front camera,
         * 1280x720 at 30 fps, AE/AWB lock after settle) and emits it via the
         * `'streamAvailable'` event.
         *
         * When the host supplies the stream the host also owns its lifecycle —
         * the SDK never stops the original tracks, only its own internal clone.
         */
        useMediaStream(stream) {
          if (!(stream instanceof MediaStream)) {
            throw new TypeError("useMediaStream: argument must be a MediaStream");
          }
          this._stream = stream;
          this._streamOwned = false;
          return this;
        }
        /**
         * Begin processing. If no stream has been attached via useMediaStream(),
         * the SDK acquires the default front-facing camera and emits it through
         * `'streamAvailable'` so the host can show a live preview. Resolves once
         * the main-process SDK has armed the graph and is ready to accept frames.
         * On failure, rolls back the renderer-side frame pump and (if the SDK
         * acquired the stream itself) releases the camera so a retry isn't
         * blocked.
         */
        async start() {
          if (!this._stream) {
            this._stream = await this._acquireDefaultStream();
            this._streamOwned = true;
            this._emit("streamAvailable", this._stream);
          }
          const tracks = this._stream.getVideoTracks();
          if (tracks.length === 0) {
            if (this._streamOwned) {
              for (const t of this._stream.getTracks()) {
                try {
                  t.stop();
                } catch {
                }
              }
              this._stream = null;
              this._streamOwned = false;
            }
            throw new Error("start(): MediaStream has no video tracks");
          }
          this._track = tracks[0].clone();
          this._processor = new MediaStreamTrackProcessor({ track: this._track });
          this._reader = this._processor.readable.getReader();
          this._cameraLocked = false;
          try {
            await this._send({ kind: "start", frameTransform: 0 });
          } catch (err) {
            await this._stopFrameLoop();
            this._releaseOwnedStream();
            throw err;
          }
          this._frameLoopActive = true;
          this._frameLoopPromise = this._runFrameLoop();
        }
        /**
         * Stop processing. Resolves once the main-process SDK has stopped.
         * If the SDK acquired the camera itself, the stream is released here
         * — start() will re-acquire on the next call. Host-supplied streams
         * are left untouched; the host owns their lifecycle.
         */
        async stop() {
          this._clearStartupWatchdog();
          await this._stopFrameLoop();
          await this._send({ kind: "stop" });
          this._releaseOwnedStream();
        }
        /**
         * Rebuild the graph after a kError state. Releases any SDK-acquired
         * camera so the next start() re-runs the acquire + settle sequence
         * from scratch.
         */
        async reset() {
          this._clearStartupWatchdog();
          await this._stopFrameLoop();
          await this._send({ kind: "reset" });
          this._releaseOwnedStream();
        }
        /**
         * Dispatch an on-demand insight prompt. Resolves with the request id
         * assigned to it; the matching Insight response arrives via the
         * `'insight'` event with the same id.
         */
        async requestInsight(text) {
          if (typeof text !== "string") {
            throw new TypeError("requestInsight: text must be a string");
          }
          const ack = await this._send({ kind: "requestInsight", text });
          return ack.requestId | 0;
        }
        /**
         * Tear down the renderer-side resources and instruct the main process
         * to destroy its SDK instance. Idempotent.
         */
        destroy() {
          if (this._destroyed) return;
          this._destroyed = true;
          this._clearStartupWatchdog();
          const destroyedErr = new Error("SmartSpectraSDK: destroyed before main-process ack");
          destroyedErr.code = "SMARTSPECTRA_DESTROYED";
          this._rejectPendingAcks(destroyedErr);
          this._frameLoopActive = false;
          if (this._reader) {
            try {
              this._reader.cancel().catch(() => {
              });
            } catch {
            }
            this._reader = null;
          }
          this._processor = null;
          if (this._track) {
            try {
              this._track.stop();
            } catch {
            }
            this._track = null;
          }
          this._releaseOwnedStream();
          this._stream = null;
          try {
            this._bridge.postMessage({ kind: "destroy" });
          } catch {
          }
          try {
            this._bridge.close();
          } catch {
          }
        }
        on(event, callback) {
          if (typeof event !== "string" || typeof callback !== "function") {
            throw new TypeError("on(event: string, callback: Function)");
          }
          if (!SUPPORTED_EVENTS.has(event)) {
            throw new RangeError(`on(): unsupported event ${event}`);
          }
          this._listeners.set(event, callback);
          return this;
        }
        // ---------- internal --------------------------------------------------
        _armStartupWatchdog() {
          if (this._startupWatchdog) return;
          this._startupWatchdog = setTimeout(() => {
            this._startupWatchdog = null;
            if (this._processingStatus !== PROCESSING_STATUS_STARTING) return;
            const message = `Processing stalled at Starting for ${Math.round(STARTUP_WATCHDOG_MS / 1e3)} s without producing a validation packet. Common causes: model download blocked by network/firewall, server-side service unavailable, or an SDK-level error that didn't propagate through the bridge. Check the main-process terminal for SDK log lines, then retry or fall back to the basic metrics bundle (breathing, pulse rate), which has no additional model-load requirement.`;
            this._emit(
              "error",
              ERROR_CODE_PROCESSING_FAILED,
              message,
              /*retryable=*/
              true
            );
          }, STARTUP_WATCHDOG_MS);
        }
        _clearStartupWatchdog() {
          if (this._startupWatchdog) {
            clearTimeout(this._startupWatchdog);
            this._startupWatchdog = null;
          }
        }
        async _acquireDefaultStream() {
          if (!navigator || !navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
            throw new Error(
              "@smartspectra/node-sdk/renderer: navigator.mediaDevices.getUserMedia is unavailable. Set webPreferences.contextIsolation=true and ensure the BrowserWindow has been granted camera permission."
            );
          }
          try {
            return await navigator.mediaDevices.getUserMedia({
              video: DEFAULT_VIDEO_CONSTRAINTS
            });
          } catch (err) {
            const detail = err && err.name ? ` (${err.name})` : "";
            const e = new Error(
              `Failed to acquire default camera${detail}: ${err && err.message ? err.message : err}. Either grant camera permission and retry, or call useMediaStream() with your own MediaStream before start().`
            );
            e.cause = err;
            throw e;
          }
        }
        _releaseOwnedStream() {
          if (!this._streamOwned || !this._stream) return;
          for (const track of this._stream.getTracks()) {
            try {
              track.stop();
            } catch {
            }
          }
          this._stream = null;
          this._streamOwned = false;
          this._cameraLocked = false;
        }
        _tryLockCameraParameters() {
          if (this._cameraLocked || !this._stream) return;
          this._cameraLocked = true;
          const tracks = this._stream.getVideoTracks();
          const track = tracks[0];
          if (!track || typeof track.applyConstraints !== "function") return;
          const caps = typeof track.getCapabilities === "function" ? track.getCapabilities() || {} : {};
          const advanced = [];
          if (Array.isArray(caps.exposureMode) && caps.exposureMode.includes("manual")) {
            advanced.push({ exposureMode: "manual" });
          }
          if (Array.isArray(caps.whiteBalanceMode) && caps.whiteBalanceMode.includes("manual")) {
            advanced.push({ whiteBalanceMode: "manual" });
          }
          if (Array.isArray(caps.focusMode) && caps.focusMode.includes("manual")) {
            advanced.push({ focusMode: "manual" });
          }
          if (advanced.length === 0) return;
          track.applyConstraints({ advanced }).catch((err) => {
            console.warn(
              "[smartspectra/renderer] camera lock applyConstraints rejected, continuing in auto-mode:",
              err && err.message ? err.message : err
            );
          });
        }
        async _stopFrameLoop() {
          this._frameLoopActive = false;
          if (this._reader) {
            try {
              await this._reader.cancel();
            } catch {
            }
            this._reader = null;
          }
          this._processor = null;
          if (this._track) {
            try {
              this._track.stop();
            } catch {
            }
            this._track = null;
          }
          if (this._frameLoopPromise) {
            try {
              await this._frameLoopPromise;
            } catch {
            }
            this._frameLoopPromise = null;
          }
        }
        async _runFrameLoop() {
          const canvas2 = new OffscreenCanvas(1, 1);
          const ctx2 = canvas2.getContext("2d", { willReadFrequently: true });
          let frameCount = 0;
          try {
            while (this._frameLoopActive && !this._destroyed) {
              let read;
              try {
                read = await this._reader.read();
              } catch (e) {
                console.warn("[smartspectra/renderer] reader.read() threw:", e);
                break;
              }
              if (read.done) break;
              const vf = read.value;
              if (!vf) continue;
              try {
                if (this._destroyed) break;
                if (canvas2.width !== vf.codedWidth || canvas2.height !== vf.codedHeight) {
                  canvas2.width = vf.codedWidth;
                  canvas2.height = vf.codedHeight;
                }
                ctx2.drawImage(vf, 0, 0);
                const imageData = ctx2.getImageData(0, 0, vf.codedWidth, vf.codedHeight);
                const ts = this._frameTimestamps.next(vf.timestamp);
                const ab = imageData.data.buffer;
                this._bridge.postMessage({
                  kind: "frame",
                  buffer: ab,
                  width: vf.codedWidth,
                  height: vf.codedHeight,
                  stride: vf.codedWidth * 4,
                  pixelFormat: PIXEL_FORMAT_RGBA,
                  timestampUs: Number(ts)
                });
                frameCount++;
                if (this._diagnostics) {
                  if (frameCount === 1) {
                    console.log(
                      `[smartspectra/renderer] first frame forwarded (${vf.codedWidth}x${vf.codedHeight}, ts=${ts}\xB5s)`
                    );
                  } else if (frameCount % 60 === 0) {
                    console.log(`[smartspectra/renderer] forwarded ${frameCount} frames`);
                  }
                }
              } finally {
                vf.close();
              }
            }
          } catch (e) {
            console.error("[smartspectra/renderer] frame loop failed:", e);
          } finally {
            if (this._diagnostics) {
              console.log(
                `[smartspectra/renderer] frame loop exited after ${frameCount} frames`
              );
            }
          }
        }
        _send(message) {
          const replyId = this._nextReplyId++;
          const timeoutMs = this._sendTimeoutMs;
          return new Promise((resolve, reject) => {
            const onTimeout = () => {
              if (this._pendingAcks.delete(replyId)) {
                const err = new Error(
                  `smartspectra: main-process ack for kind=${message && message.kind} timed out after ${timeoutMs}ms`
                );
                err.code = "SMARTSPECTRA_IPC_TIMEOUT";
                reject(err);
              }
            };
            const timer = timeoutMs > 0 ? setTimeout(onTimeout, timeoutMs) : null;
            const clear = () => {
              if (timer !== null) clearTimeout(timer);
            };
            this._pendingAcks.set(replyId, {
              resolve: (v) => {
                clear();
                resolve(v);
              },
              reject: (e) => {
                clear();
                reject(e);
              }
            });
            try {
              this._bridge.postMessage({ ...message, replyId });
            } catch (e) {
              clear();
              this._pendingAcks.delete(replyId);
              reject(e);
            }
          });
        }
        _rejectPendingAcks(err) {
          const pending = [...this._pendingAcks.values()];
          this._pendingAcks.clear();
          for (const { reject } of pending) reject(err);
        }
        _handleBridgeMessage(msg) {
          if (!msg || typeof msg.kind !== "string") return;
          switch (msg.kind) {
            case "processingStatus":
              this._processingStatus = msg.status | 0;
              if (this._processingStatus === PROCESSING_STATUS_STARTING) {
                this._armStartupWatchdog();
              } else {
                this._clearStartupWatchdog();
              }
              if (this._processingStatus === PROCESSING_STATUS_RUNNING) {
                this._tryLockCameraParameters();
              }
              this._emit("processingStatus", this._processingStatus);
              return;
            case "validationStatus":
              this._clearStartupWatchdog();
              this._emit("validationStatus", msg.code | 0, Number(msg.timestampUs), msg.hint || "");
              return;
            case "metrics":
              this._emit("metrics", bufFrom(msg.buffer), Number(msg.timestampUs));
              return;
            case "accumulatedMetrics":
              this._emit("accumulatedMetrics", bufFrom(msg.buffer), Number(msg.timestampUs));
              return;
            case "insight":
              this._emit("insight", bufFrom(msg.buffer), msg.requestId | 0);
              return;
            case "frameSentThrough":
              this._emit("frameSentThrough", !!msg.sent, Number(msg.timestampUs));
              return;
            case "error":
              this._emit("error", msg.code | 0, msg.message || "", !!msg.retryable);
              return;
            case "ack": {
              const pending = this._pendingAcks.get(msg.replyId);
              if (!pending) return;
              this._pendingAcks.delete(msg.replyId);
              if (msg.ok) pending.resolve(msg.payload || {});
              else pending.reject(makeAckError(msg.error));
              return;
            }
          }
        }
        _emit(event, ...args) {
          const cb = this._listeners.get(event);
          if (!cb) return;
          try {
            cb(...args);
          } catch (e) {
            console.error(`SmartSpectraSDK: listener for '${event}' threw:`, e);
          }
        }
      };
      function bufFrom(arrayBuffer) {
        return new Uint8Array(arrayBuffer);
      }
      function makeAckError(err) {
        const e = new Error(err?.message || "SmartSpectra IPC failure");
        e.code = typeof err?.code === "number" ? err.code : 0;
        e.retryable = !!err?.retryable;
        return e;
      }
      module.exports = Object.assign(
        { SmartSpectraSDK: SmartSpectraSDK2 },
        require_constants()
      );
    }
  });

  // ../node_modules/@smartspectra/node-sdk/js/messages/index.js
  var require_messages = __commonJS({
    "../node_modules/@smartspectra/node-sdk/js/messages/index.js"(exports, module) {
      "use strict";
      var $root = require_generated();
      var { presage } = $root;
      var Metrics = presage.smartspectra.Metrics;
      function toUint8(buf) {
        if (buf instanceof Uint8Array) return buf;
        if (buf instanceof ArrayBuffer) return new Uint8Array(buf);
        throw new TypeError(
          "@smartspectra/node-sdk/messages: decodeMetrics expected Buffer | Uint8Array | ArrayBuffer, got " + Object.prototype.toString.call(buf)
        );
      }
      function decodeMetrics2(buf) {
        return Metrics.decode(toUint8(buf));
      }
      module.exports = {
        Metrics,
        decodeMetrics: decodeMetrics2,
        presage
      };
    }
  });

  // renderer.js
  var {
    SmartSpectraSDK,
    ProcessingStatus,
    ValidationCode,
    breathingMetrics,
    cardioMetrics,
    faceMetrics
  } = require_renderer();
  var { decodeMetrics } = require_messages();
  var { Brain } = window.KodamaBrain;
  var { Scene } = window.KodamaScene;
  var $ = (id) => document.getElementById(id);
  var params = new URLSearchParams(location.search);
  var canvas = $("world");
  var ctx = canvas.getContext("2d");
  var brain = new Brain();
  var scene = new Scene();
  var sdk = null;
  var running = false;
  if (params.get("key")) $("key-row").hidden = true;
  var keyOk = () => !!(params.get("key") || $("key").value.trim());
  var refresh = () => {
    $("start").disabled = !($("agree").checked && keyOk());
  };
  $("agree").addEventListener("change", refresh);
  $("key").addEventListener("input", refresh);
  $("start").addEventListener("click", start);
  async function start() {
    $("consent").hidden = true;
    $("controls").hidden = false;
    brain = new Brain();
    scene = new Scene();
    sdk = new SmartSpectraSDK({
      apiKey: params.get("key") || $("key").value.trim(),
      requestedMetrics: [...breathingMetrics, ...cardioMetrics, ...faceMetrics],
      enableTelemetry: $("telemetry").checked
      // off unless the user opted in
    });
    sdk.on("metrics", (buf) => {
      try {
        brain.ingest(decodeMetrics(buf));
      } catch (e) {
        console.error("decode failed", e);
      }
    });
    sdk.on("validationStatus", (code, _ts, hint) => brain.validation(code === ValidationCode.kOk, hint));
    sdk.on("processingStatus", (s) => {
      if (s === ProcessingStatus.kIdle && running) stop();
    });
    sdk.on("error", (code, message) => showError(`SmartSpectra error ${code}: ${message}`));
    sdk.on("streamAvailable", (stream) => {
      $("preview").srcObject = stream;
      $("preview").hidden = false;
      $("preview").play().catch(() => {
      });
    });
    try {
      const file = params.get("file");
      if (file) {
        const v = $("preview");
        v.src = file;
        v.hidden = false;
        v.loop = false;
        await v.play();
        sdk.useMediaStream(v.captureStream());
      }
      await sdk.start();
      running = true;
    } catch (e) {
      showError(e.message || String(e));
    }
  }
  async function stop() {
    running = false;
    try {
      if (sdk) await sdk.stop();
    } catch (_) {
    }
    try {
      if (sdk) sdk.destroy();
    } catch (_) {
    }
    sdk = null;
    $("preview").srcObject = null;
    $("preview").hidden = true;
    $("controls").hidden = true;
    $("nudge").hidden = true;
    $("consent").hidden = false;
  }
  function showError(text) {
    const e = $("error");
    e.textContent = text;
    e.hidden = false;
  }
  $("stop").addEventListener("click", stop);
  $("breathe").addEventListener("click", () => brain.startGuide());
  $("pip").addEventListener("click", () => {
    const v = $("preview");
    v.style.visibility = v.style.visibility === "hidden" ? "visible" : "hidden";
    $("pip").textContent = v.style.visibility === "hidden" ? "Show camera" : "Hide camera";
  });
  $("nudge-yes").addEventListener("click", () => {
    brain.acceptNudge();
    $("nudge").hidden = true;
  });
  $("nudge-no").addEventListener("click", () => {
    brain.dismissNudge();
    $("nudge").hidden = true;
  });
  var last = performance.now();
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1e3);
    last = now;
    const dpr = window.devicePixelRatio || 1;
    const W = innerWidth, H = innerHeight;
    if (canvas.width !== W * dpr) {
      canvas.width = W * dpr;
      canvas.height = H * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (running) brain.step(dt);
    $("nudge").hidden = brain.mode !== "nudge";
    scene.draw(ctx, W, H, brain, dt, { hud: running });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
/*! Bundled license information:

long/umd/index.js:
  (**
   * @license
   * Copyright 2009 The Closure Library Authors
   * Copyright 2020 Daniel Wirtz / The long.js Authors.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
