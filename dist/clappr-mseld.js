(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('clappr')) :
  typeof define === 'function' && define.amd ? define(['clappr'], factory) :
  (global.MSELD = factory(global.Clappr));
}(this, (function (clappr) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && function () {
      try {
        new Blob();
        return true;
      } catch (e) {
        return false;
      }
    }(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj);
  }

  if (support.arrayBuffer) {
    var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

    var isArrayBufferView = ArrayBuffer.isView || function (obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
    };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }

    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name');
    }

    return name.toLowerCase();
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }

    return value;
  } // Build a destructive iterator for the value list


  function iteratorFor(items) {
    var iterator = {
      next: function () {
        var value = items.shift();
        return {
          done: value === undefined,
          value: value
        };
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function () {
        return iterator;
      };
    }

    return iterator;
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function (value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function (header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function (name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function (name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers.prototype['delete'] = function (name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function (name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null;
  };

  Headers.prototype.has = function (name) {
    return this.map.hasOwnProperty(normalizeName(name));
  };

  Headers.prototype.set = function (name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function (callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push(name);
    });
    return iteratorFor(items);
  };

  Headers.prototype.values = function () {
    var items = [];
    this.forEach(function (value) {
      items.push(value);
    });
    return iteratorFor(items);
  };

  Headers.prototype.entries = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items);
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'));
    }

    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function (resolve, reject) {
      reader.onload = function () {
        resolve(reader.result);
      };

      reader.onerror = function () {
        reject(reader.error);
      };
    });
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise;
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise;
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }

    return chars.join('');
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0);
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer;
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function (body) {
      this._bodyInit = body;

      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer); // IE 10-11 can't handle a DataView body.

        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function () {
        var rejected = consumed(this);

        if (rejected) {
          return rejected;
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob);
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]));
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob');
        } else {
          return Promise.resolve(new Blob([this._bodyText]));
        }
      };

      this.arrayBuffer = function () {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
        } else {
          return this.blob().then(readBlobAsArrayBuffer);
        }
      };
    }

    this.text = function () {
      var rejected = consumed(this);

      if (rejected) {
        return rejected;
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text');
      } else {
        return Promise.resolve(this._bodyText);
      }
    };

    if (support.formData) {
      this.formData = function () {
        return this.text().then(decode);
      };
    }

    this.json = function () {
      return this.text().then(JSON.parse);
    };

    return this;
  } // HTTP methods whose capitalization should be normalized


  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method;
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read');
      }

      this.url = input.url;
      this.credentials = input.credentials;

      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }

      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;

      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';

    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }

    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests');
    }

    this._initBody(body);
  }

  Request.prototype.clone = function () {
    return new Request(this, {
      body: this._bodyInit
    });
  };

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function (bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form;
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers(); // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2

    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
      var parts = line.split(':');
      var key = parts.shift().trim();

      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers;
  }

  Body.call(Request.prototype);
  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';

    this._initBody(bodyInit);
  }
  Body.call(Response.prototype);

  Response.prototype.clone = function () {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    });
  };

  Response.error = function () {
    var response = new Response(null, {
      status: 0,
      statusText: ''
    });
    response.type = 'error';
    return response;
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function (url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code');
    }

    return new Response(null, {
      status: status,
      headers: {
        location: url
      }
    });
  };

  var DOMException = self.DOMException;

  try {
    new DOMException();
  } catch (err) {
    DOMException = function (message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };

    DOMException.prototype = Object.create(Error.prototype);
    DOMException.prototype.constructor = DOMException;
  }

  function fetch$1(input, init) {
    return new Promise(function (resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new DOMException('Aborted', 'AbortError'));
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function () {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.onabort = function () {
        reject(new DOMException('Aborted', 'AbortError'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value);
      });

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function () {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    });
  }
  fetch$1.polyfill = true;

  if (!self.fetch) {
    self.fetch = fetch$1;
    self.Headers = Headers;
    self.Request = Request;
    self.Response = Response;
  }

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var FlussonicMsePlayer_min = createCommonjsModule(function (module, exports) {
    !function (e, t) {
      module.exports = t();
    }(window, function () {
      return n = {}, o.m = r = [function (e, t) {
        var r = e.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
        "number" == typeof __g && (__g = r);
      }, function (e, t) {
        e.exports = function (e) {
          return "object" == typeof e ? null !== e : "function" == typeof e;
        };
      }, function (e, t, r) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.logger = t.enableLogs = void 0;
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
          return typeof e;
        } : function (e) {
          return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
        },
            o = r(50);

        function i() {}

        var s = {
          trace: i,
          debug: i,
          log: i,
          warn: i,
          info: i,
          error: i
        },
            a = s;
        var u = (0, o.getSelfScope)();

        function c(t) {
          for (var e = arguments.length, r = Array(1 < e ? e - 1 : 0), n = 1; n < e; n++) r[n - 1] = arguments[n];

          r.forEach(function (e) {
            a[e] = t[e] ? t[e].bind(t) : function (n) {
              var o = u.console[n];
              return o ? function () {
                for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];

                t[0] && (t[0] = function (e, t) {
                  return t = "[" + e + "] > " + t;
                }(n, t[0])), o.apply(u.console, t);
              } : i;
            }(e);
          });
        }

        t.enableLogs = function (e) {
          if (!0 === e || "object" === (void 0 === e ? "undefined" : n(e))) {
            c(e, "trace", "debug", "log", "info", "warn", "error");

            try {
              a.log();
            } catch (e) {
              a = s;
            }
          } else a = s;
        }, t.logger = a;
      }, function (e, t) {
        var r = e.exports = {
          version: "2.5.1"
        };
        "number" == typeof __e && (__e = r);
      }, function (e, t, r) {
        var n = r(20),
            o = r(25);
        e.exports = r(5) ? function (e, t, r) {
          return n.f(e, t, o(1, r));
        } : function (e, t, r) {
          return e[t] = r, e;
        };
      }, function (e, t, r) {
        e.exports = !r(7)(function () {
          return 7 != Object.defineProperty({}, "a", {
            get: function () {
              return 7;
            }
          }).a;
        });
      }, function (e, t, r) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        t.default = {
          MEDIA_SOURCE_SOURCE_OPEN: "sourceopen",
          MEDIA_SOURCE_SOURCE_ENDED: "sourceended",
          MEDIA_SOURCE_SOURCE_CLOSE: "sourceclose",
          MEDIA_ELEMENT_PROGRESS: "progress",
          MEDIA_ELEMENT_EMPTIED: "emptied",
          WS_OPEN: "open",
          WS_MESSAGE: "message",
          WS_ERROR: "error",
          WS_CLOSE: "close",
          BUFFER_UPDATE_END: "updateend",
          BUFFER_ERROR: "onerror",
          BUFFER_ABORT: "onabort"
        }, e.exports = t.default;
      }, function (e, t) {
        e.exports = function (e) {
          try {
            return !!e();
          } catch (e) {
            return !0;
          }
        };
      }, function (e, t) {
        var r = 0,
            n = Math.random();

        e.exports = function (e) {
          return "Symbol(".concat(void 0 === e ? "" : e, ")_", (++r + n).toString(36));
        };
      }, function (e, t, r) {
        var i = r(28);

        e.exports = function (n, o, e) {
          if (i(n), void 0 === o) return n;

          switch (e) {
            case 1:
              return function (e) {
                return n.call(o, e);
              };

            case 2:
              return function (e, t) {
                return n.call(o, e, t);
              };

            case 3:
              return function (e, t, r) {
                return n.call(o, e, t, r);
              };
          }

          return function () {
            return n.apply(o, arguments);
          };
        };
      }, function (e, t) {
        var r = {}.toString;

        e.exports = function (e) {
          return r.call(e).slice(8, -1);
        };
      }, function (e, t, r) {
        var n = r(38)("wks"),
            o = r(8),
            i = r(0).Symbol,
            s = "function" == typeof i;
        (e.exports = function (e) {
          return n[e] || (n[e] = s && i[e] || (s ? i : o)("Symbol." + e));
        }).store = n;
      }, function (e, t, r) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.errorMsg = t.replaceHttpByWS = t.checkVideoProgress = t.MAX_DELAY = void 0, t.getMediaSource = o, t.isAndroid = i, t.isSupportedMSE = function () {
          if (i()) return !1;
          var e = o(),
              t = window.SourceBuffer || window.WebKitSourceBuffer,
              r = e && "function" == typeof e.isTypeSupported && e.isTypeSupported('video/mp4; codecs="avc1.4d401f,mp4a.40.2"'),
              n = !t || t.prototype && "function" == typeof t.prototype.appendBuffer && "function" == typeof t.prototype.remove;
          return !!r && !!n;
        }, t.base64ToArrayBuffer = function (e) {
          return Uint8Array.from(atob(e), function (e) {
            return e.charCodeAt(0);
          });
        }, t.RawDataToUint8Array = function (e) {
          return new Uint8Array(e);
        }, t.getTrackId = n, t.getRealUtcFromData = s, t.doArrayBuffer = function (e) {
          e.isInit || (this.utc = s(e.data), this.lastLoadedUTC = this.utc);
        }, t.debugData = a, t.pad2 = f, t.humanTime = function (e) {
          var t = !(1 < arguments.length && void 0 !== arguments[1]) || arguments[1];
          if (!(0 < e)) return "";
          var r = e,
              n = new Date();
          n.setTime(1e3 * r);
          var o = !(!1 === t),
              i = o ? n.getHours() : n.getUTCHours(),
              s = o ? n.getMinutes() : n.getUTCMinutes(),
              a = o ? n.getSeconds() : n.getUTCSeconds();
          return f(i) + ":" + f(s) + ":" + f(a);
        }, t.logDM = function (e, t) {
          t && g.logger.log("%c " + t.type + " " + ("event" === t.type ? t.event : "mse_init_segment"), "background: aquamarine;", t);
        }, t.showDispatchError = function (e, t) {
          var r = e.data instanceof ArrayBuffer;
          this.media && this.media.error && void 0;
          ++d >= this.opts.errorsBeforeStop && (d = 0, this.stopPromise = this.stop());
          this.onError && this.onError(t, e);
        };
        var g = r(2);

        function o() {
          if ("undefined" != typeof window) return window.MediaSource || window.WebKitMediaSource;
        }

        function i() {
          return -1 !== navigator.userAgent.indexOf("Android");
        }

        function n(e) {
          return e[47];
        }

        function s(e) {
          return (e[92] << 24 | e[93] << 16 | e[94] << 8 | e[95]) + (e[96] << 24 | e[97] << 16 | e[98] << 8 | e[99]) / 1e6;
        }

        function a(e) {
          var t = new Uint8Array(e);
          return {
            trackId: n(t),
            utc: s(t),
            view: t
          };
        }

        var u = navigator.userAgent,
            c = t.MAX_DELAY = /Edge/.test(u) || /trident.*rv:1\d/i.test(u) ? 10 : 2,
            h = (t.checkVideoProgress = function (l, p, e) {
          var m = 2 < arguments.length && void 0 !== e ? e : c;
          return function (e) {
            function t(e, t, r, n) {
              try {
                for (var o = 0; o < t.buffered.length; o++) {
                  var i = t.buffered.start(o),
                      s = t.buffered.end(o),
                      a = Math.max(i, r),
                      u = Math.min(s, n);

                  if (.5 < Math.min(u, s) - a) {
                    return l && l.currentTime.toString(), t.remove(a, u), !0;
                  }
                }
              } catch (e) {}

              return !1;
            }

            var r = l.currentTime,
                n = l.buffered,
                o = l.buffered.length;
            if (p) for (var i = p.sb.sourceBuffer, s = Object.keys(i), a = r - 30, u = s.length - 1; 0 <= u; u--) {
              var c = i[s[u]];

              if (c) {
                var h = c.buffered;
                0 < h.length && a > h.start(0) && t(0, c, 0, a);
              }
            }

            if (o) {
              var f = n.end(o - 1),
                  d = Math.abs(f - r);
              p._stalling && (p.onEndStalling(), l.paused && p._pause && !p.playing && (l.currentTime = f - 1e-4, p.playPromise = l.play(), p.playPromise.then(function () {
                p._pause = !1, p.playing = !0;
              }).catch(function () {}))), d <= m || (g.logger.log("nudge", r, "->", o ? f : "-", r - f), l.currentTime = f - .2);
            }
          };
        }, t.replaceHttpByWS = function (e) {
          return e.replace(/^http/, "ws");
        }, t.errorMsg = function (e) {
          return "Error " + e.name + ": " + e.message + "\n" + e.stack;
        });

        function f(e) {
          return e <= 9 ? "0" + e : "" + e;
        }

        var d = 0;
      }, function (e, t, r) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        t.VIDEO = "video", t.AUDIO = "audio";
      }, function (e, t, r) {
        e.exports = r(15);
      }, function (e, t, r) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var n,
            o = r(16),
            i = (n = o) && n.__esModule ? n : {
          default: n
        };
        t.default = i.default, e.exports = t.default;
      }, function (e, t, r) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        });

        var i = Object.assign || function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];

            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }

          return e;
        },
            n = function (e, t, r) {
          return t && o(e.prototype, t), r && o(e, r), e;
        };

        function o(e, t) {
          for (var r = 0; r < t.length; r++) {
            var n = t[r];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
          }
        }

        r(17);

        var s = p(r(40)),
            a = p(r(51)),
            u = function (e) {
          {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e) for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t;
          }
        }(r(12)),
            c = r(2),
            h = r(52),
            f = r(13),
            d = p(r(6)),
            l = p(r(53));

        function p(e) {
          return e && e.__esModule ? e : {
            default: e
          };
        }

        var m = f.VIDEO,
            g = f.AUDIO,
            v = (y.replaceHttpByWS = function (e) {
          return u.replaceHttpByWS(e);
        }, y.isSupported = function () {
          return u.isSupportedMSE();
        }, n(y, null, [{
          key: "version",
          get: function () {
            return "20.2.3";
          }
        }]), y.prototype.play = function (e, t, r) {
          var n = this;
          return c.logger.log("[mse-player]: play()"), this._play(e, t, r).then(function () {
            n.playing = !0;
          }).catch(function () {
            n.playing = !1;
          });
        }, y.prototype.stop = function () {
          return this.onMediaDetaching();
        }, y.prototype.seek = function (e) {
          if (this.playing) try {
            if (!e) throw new Error('utc should be "live" or UTC value');
            this.ws.seek(e), this.sb.seek(), this.onStartStalling(), this.seekValue = e, this.media.pause(), this._pause = !0, this.playing = !1;
          } catch (e) {
            c.logger.warn("seek:" + e.message);
          }
        }, y.prototype.pause = function () {
          if (!function () {
            return !(!(!this._pause && this.playing && this.media && this.ws && this.mediaSource) || this.mediaSource && "open" !== this.mediaSource.readyState || !this.playPromise);
          }.bind(this)()) return c.logger.log("[mse:playback] can not do pause");

          var e = function () {
            if (this.ws.pause(), this.media.pause(), this._pause = !0, this.playing = !1, this.onPause) try {
              this.onPause();
            } catch (e) {}
          }.bind(this);

          this.playPromise.then(e, e);
        }, y.prototype.restart = function (e) {
          var t = 0 < arguments.length && void 0 !== e && e ? void 0 : this.sb.lastLoadedUTC;
          this.playing = !1, this.ws.destroy(), this.ws.init(), this.ws.start(this.url, t, this.videoTrack, this.audioTrack);
        }, y.prototype.retryConnection = function (e, t, r) {
          var n = 0 < arguments.length && void 0 !== e ? e : null,
              o = 1 < arguments.length && void 0 !== t ? t : null,
              i = 2 < arguments.length && void 0 !== r ? r : null;
          this.retry >= this.opts.connectionRetries ? clearInterval(this.retryConnectionTimer) : (c.logger.log("%cconnectionRetry:", "background: orange;", "Retrying " + (this.retry + 1)), this.mediaSource = void 0, this.init(), this.ws.destroy(), this.sb.destroy(), this.play(n, o, i), this.retry = this.retry + 1);
        }, y.prototype.setTracks = function (e) {
          var r = this;

          if (this.mediaInfo) {
            var n = this.mediaInfo.streams ? "streams" : "tracks",
                t = e.filter(function (t) {
              var e = r.mediaInfo[n].find(function (e) {
                return t === e.track_id;
              });
              return !!e && e.content === m;
            }).join(""),
                o = e.filter(function (t) {
              var e = r.mediaInfo[n].find(function (e) {
                return t === e.track_id;
              });
              return e && e.bitrate && 0 !== e.bitrate ? !!e && e.content === g : null;
            }).join("");
            this.onStartStalling(), this.ws.setTracks(t, o), this.videoTrack = t, this.audioTrack = o, this._setTracksFlag = !0, this.waitForInitFrame = !0;
          } else c.logger.warn("Media info did not loaded. Should try after onMediaInfo triggered or inside.");
        }, y.prototype._play = function (n, o, i) {
          var s = this;
          return this.liveError = !1, new Promise(function (e, t) {
            if (c.logger.log("_play", n, o, i), s.playing) {
              var r = "[mse-player] _play: terminate because already has been playing";
              return c.logger.log(r), e({
                message: r
              });
            }

            return s._pause ? s.ws && !1 === s.ws.opened ? (c.logger.log("WebSocket Closed, trying to restart it"), s._pause = !1, void s.restart(!0)) : (c.logger.log("WebSocket is in opened state, resuming"), s._pause = !1, s._resume(), s.playPromise = s.media.play(), c.logger.log("_play: terminate because _paused and should resume"), s.playPromise) : (s.playTime = n, s.videoTrack = o, s.audioTrack = i, s._pause = !1, s.mediaSource || s.onAttachMedia({
              media: s.media
            }).then(function () {
              s.onsoa = s._play.bind(s, n, o, i), s.mediaSource.addEventListener(d.default.MEDIA_SOURCE_SOURCE_OPEN, s.onsoa), c.logger.warn("mediaSource did not create"), s.resolveThenMediaSourceOpen = s.resolveThenMediaSourceOpen ? s.resolveThenMediaSourceOpen : e, s.rejectThenMediaSourceOpen = s.rejectThenMediaSourceOpen ? s.rejectThenMediaSourceOpen : t;
            }), s.mediaSource && "open" !== s.mediaSource.readyState ? (c.logger.warn('readyState is not "open", it\'s currently ', s.mediaSource.readyState), s.shouldPlay = !0, s.resolveThenMediaSourceOpen = s.resolveThenMediaSourceOpen ? s.resolveThenMediaSourceOpen : e, void (s.rejectThenMediaSourceOpen = s.rejectThenMediaSourceOpen ? s.rejectThenMediaSourceOpen : t)) : void new Promise(function (e, t) {
              return !s.media.autoplay || !0 === s.media.muted || s.opts.retryMuted ? e() : s.onAutoplay ? void s.onAutoplay(function () {
                return s.media.muted = !1, e();
              }) : (s.media.muted = !0, e());
            }).then(function () {
              s.ws.start(s.url, s.playTime, s.videoTrack, s.audioTrack).then(function () {
                return s.playPromise = s.media.play(), s.startProgressTimer(), s.playPromise.then(function () {
                  s.onStartStalling(), s.resolveThenMediaSourceOpen && (s._stop = !1, s.resolveThenMediaSourceOpen(), s.resolveThenMediaSourceOpen = void 0, s.rejectThenMediaSourceOpen = void 0, clearInterval(s.retryConnectionTimer), s.retry = 0);
                }).catch(function (e) {
                  c.logger.log("playPromise rejection.", e), s.ws.connectionPromise && s.ws.connectionPromise.then(function () {
                    return s.ws.pause();
                  }), s.opts.retryMuted && 0 == s.media.muted && (s.onMuted && s.onMuted(), s.media.muted = !0, s._play(n, o, i)), s.onError && s.onError({
                    error: "play_promise_reject",
                    err: e
                  }), s.rejectThenMediaSourceOpen && (s.rejectThenMediaSourceOpen(), s.resolveThenMediaSourceOpen = void 0, s.rejectThenMediaSourceOpen = void 0), s.opts.retryMuted || s.stop();
                }), s.playPromise;
              });
            }));
          });
        }, y.prototype.init = function () {
          this._pause = !1, this.playing = !1, this.shouldPlay = !1, this.playTime = void 0, this.audioTrack = "", this.videoTrack = "", this.endProgressTimer();
        }, y.prototype._resume = function () {
          this.ws.resume();
        }, y.prototype.onMediaDetaching = function () {
          var e = this;
          if (!this.stopRunning) return this.stopRunning = !0, this.handlerMediaDetaching.bind(this), this.playPromise && this.playPromise.then(function () {
            return e.handlerMediaDetaching();
          }).catch(function () {
            return e.handlerMediaDetaching();
          }), this.playPromise, this.handlerMediaDetaching();
          c.logger.warn("stop is running.");
        }, y.prototype.handlerMediaDetaching = function () {
          var t = this;
          c.logger.info("media source detaching");
          var e = void 0;
          return this.removeMediaSource(), this._stop = !0, this.media && (this.media.removeEventListener(d.default.MEDIA_ELEMENT_PROGRESS, this.oncvp), (e = new Promise(function (e) {
            t._onmee = t.onMediaElementEmptied(e).bind(t);
          })).then(function () {
            return t.stopRunning = !1;
          }), this.media.addEventListener(d.default.MEDIA_ELEMENT_EMPTIED, this._onmee)), this.oncvp = null, this.mediaSource = null, this.init(), this.ws.destroy(), this.sb.destroy(), e;
        }, y.prototype.removeMediaSource = function () {
          var e = this.mediaSource;

          if (e) {
            if ("open" === e.readyState) try {
              e.endOfStream();
            } catch (e) {
              c.logger.warn("onMediaDetaching:" + e.message + " while calling endOfStream");
            }
            e.removeEventListener(d.default.MEDIA_SOURCE_SOURCE_OPEN, this.onmso), e.removeEventListener(d.default.MEDIA_SOURCE_SOURCE_ENDED, this.onmse), e.removeEventListener(d.default.MEDIA_SOURCE_SOURCE_CLOSE, this.onmsc), this.onmso = null, this.onmse = null, this.onmsc = null;
          }

          this.media.removeAttribute("src"), this.media.load();
        }, y.prototype.onMediaElementEmptied = function (e) {
          return this._onmee && this.media && (this.media.removeEventListener(d.default.MEDIA_ELEMENT_EMPTIED, this._onmee), this._onmee = void 0), e();
        }, y.prototype.onAttachMedia = function (e) {
          var t = this;
          this.media = e.media;
          var r = this.media;
          if (!(r instanceof HTMLMediaElement)) throw new Error(l.default.NOT_HTML_MEDIA_ELEMENT);

          if (r) {
            var n = this.mediaSource = new MediaSource();
            return this.onmse = this.onMediaSourceEnded.bind(this), this.onmsc = this.onMediaSourceClose.bind(this), n.addEventListener(d.default.MEDIA_SOURCE_SOURCE_ENDED, this.onmse), n.addEventListener(d.default.MEDIA_SOURCE_SOURCE_CLOSE, this.onmsc), r.src = URL.createObjectURL(n), this.oncvp = u.checkVideoProgress(r, this).bind(this), this.media.addEventListener(d.default.MEDIA_ELEMENT_PROGRESS, this.oncvp), this.liveError ? void (this.player = void 0) : new Promise(function (e) {
              t.onmso = t.onMediaSourceOpen.bind(t, e), n.addEventListener(d.default.MEDIA_SOURCE_SOURCE_OPEN, t.onmso);
            });
          }
        }, y.prototype.onMediaSourceOpen = function (e) {
          e();
          var t = this.mediaSource;
          t && t.removeEventListener(d.default.MEDIA_SOURCE_SOURCE_OPEN, this.onmso), URL.revokeObjectURL(this.media.src), this.shouldPlay && (this.shouldPlay = !1, c.logger.info("readyState now is " + this.mediaSource.readyState + ", and will be played", this.playTime, this.audioTrack, this.videoTrack), this._play(this.playTime, this.audioTrack, this.videoTrack));
        }, y.prototype.onDisconnect = function (e) {
          this.opts.onDisconnect && this.opts.onDisconnect(e);
        }, y.prototype.dispatchMessage = function (t) {
          var e = this;

          if (!this.stopRunning) {
            var r = t.data,
                n = r instanceof ArrayBuffer,
                o = n ? void 0 : JSON.parse(r);

            try {
              if (n) {
                if (this.waitForInitFrame) return c.logger.log("old frames");
                this.sb.procArrayBuffer(r);
              }

              if (o && o.type === h.EVENT_SEGMENT) {
                var i = o[h.EVENT_SEGMENT];

                switch (c.logger.log("%c " + o.type + " " + ("event" === o.type ? o.event : "mse_init_segment"), "background: aquamarine;", o), i) {
                  case "resumed":
                    this._pause && !this.playing && this.onStartStalling();
                    break;

                  case "paused":
                    break;

                  case "seeked":
                  case "switched_to_live":
                    if (this.seekValue = void 0, this.opts.onSeeked) try {
                      this.opts.onSeeked();
                    } catch (e) {}
                    break;

                  case "recordings_ended":
                    this._eos = !0, this.sb.onBufferEos();
                    break;

                  case "stream_unavailable":
                    c.logger.log("do playPromise reject with error"), this.ws.connectionPromise && this.ws.connectionPromise.then(function () {
                      return e.ws.pause();
                    }), this.liveError || (this.opts.onError && this.opts.onError({
                      error: "playPromise reject - stream unavaible"
                    }), this.liveError = !0), this.rejectThenMediaSourceOpen && (this.rejectThenMediaSourceOpen(), this.resolveThenMediaSourceOpen = void 0, this.rejectThenMediaSourceOpen = void 0), this.playPromise = Promise.reject("stream unavaible"), this.mediaSource.endOfStream();
                    break;

                  case "tracks_switched":
                    break;

                  default:
                    this.opts.onError && this.opts.onError({
                      error: "unhandled_event",
                      event: i
                    }), c.logger.warn("unknown type of event", i);
                }

                return;
              }

              if (o && o.type === h.MSE_INIT_SEGMENT) return this.procInitSegment(r);
            } catch (e) {
              u.showDispatchError.bind(this)(t, e);

              try {
                if (this.mediaInfo && this.mediaInfo.activeStreams) {
                  var s = this.mediaInfo.activeStreams;
                  this.setTracks([s.video ? s.video : "", s.audio ? s.audio : ""]);
                }
              } catch (e) {
                this.ws.pause();
              }
            }
          }
        }, y.prototype.procInitSegment = function (e) {
          var t = JSON.parse(e);
          if (t.type !== h.MSE_INIT_SEGMENT) return c.logger.warn("type is not " + h.MSE_INIT_SEGMENT);
          this.waitForInitFrame && (this.waitForInitFrame = !1), this.sb.isBuffered() && this.sb.seek(), this.sb.setTracksByType(t);
          var r = i({}, t.metadata, {
            tracks: t.metadata.streams ? t.metadata.streams : t.metadata.tracks,
            streams: t.metadata.streams ? t.metadata.streams : t.metadata.tracks
          }),
              n = t.metadata.streams;
          t.metadata.tracks && (n = t.metadata.tracks);
          var o = {};
          this.sb.videoTrackId && n[this.sb.videoTrackId - 1] && n[this.sb.videoTrackId - 1].track_id && (o.video = n[this.sb.videoTrackId - 1].track_id), this.sb.audioTrackId ? n[this.sb.audioTrackId - 1] && n[this.sb.audioTrackId - 1].track_id && (o.audio = n[this.sb.audioTrackId - 1].track_id) : this.mediaSource && this.sb.sourceBuffer && this.sb.sourceBuffer.audio && this.mediaSource.removeSourceBuffer(this.sb.sourceBuffer.audio), this.doMediaInfo(i({}, r, {
            activeStreams: o,
            version: y.version
          })), c.logger.log("%cprocInitSegment:", "background: lightpink;", t), this.mediaSource && !this.mediaSource.sourceBuffers.length && (this.sb.setMediaSource(this.mediaSource), this.sb.createSourceBuffers(t)), this.liveError || this.sb.createTracks(t.tracks);
        }, y.prototype.doMediaInfo = function (e) {
          if (c.logger.log("%cmediaInfo:", "background: orange;", e), this.onMediaInfo) {
            this.mediaInfo = e;

            try {
              this.onMediaInfo(e);
            } catch (e) {}
          }
        }, y.prototype.getVideoTracks = function () {
          if (this.mediaInfo) {
            var e = this.mediaInfo.streams ? "streams" : "tracks";
            return this.mediaInfo[e].filter(function (e) {
              return e.content === m;
            });
          }
        }, y.prototype.getAudioTracks = function () {
          if (this.mediaInfo) {
            var e = this.mediaInfo.streams ? "streams" : "tracks";
            return this.mediaInfo[e].filter(function (e) {
              return e.content === g;
            });
          }
        }, y.prototype.immediateLevelSwitchEnd = function () {
          var e = this,
              t = this.media;
          t && t.buffered.length && (this.immediateSwitch = !1, this.previouslyPaused || (this.playPromise = t.play(), this.playPromise.then(function () {
            e._pause = !1, e.playing = !0;
          })));
        }, y.prototype.onStartStalling = function () {
          this.opts.onStartStalling && this.opts.onStartStalling(), this._stalling = !0, c.logger.log("onStartStalling");
        }, y.prototype.onEndStalling = function () {
          this.opts.onEndStalling && this.opts.onEndStalling(), this._stalling = !1, c.logger.log("onEndStalling");
        }, y.prototype.startProgressTimer = function () {
          this.timer = setInterval(this.onTimer.bind(this), this.opts.progressUpdateTime);
        }, y.prototype.endProgressTimer = function () {
          clearInterval(this.timer), this.timer = void 0;
        }, y.prototype.onTimer = function () {
          if (this._eos) return c.logger.log("nothing to play");
          if (this.immediateSwitch && this.immediateLevelSwitchEnd(), this.sb.lastLoadedUTC !== this.utcPrev && !this._stalling && (this.utcPrev = this.sb.lastLoadedUTC, this.onProgress)) try {
            this.onProgress(this.sb.lastLoadedUTC);
          } catch (e) {}
        }, y.prototype.onMediaSourceEnded = function () {
          c.logger.log("media source ended");

          try {
            this.opts.onEOS && this.opts.onEOS();
          } catch (e) {}
        }, y.prototype.onMediaSourceClose = function () {
          c.logger.log("media source closed");
        }, y.prototype.onConnectionRetry = function () {
          var e = this;
          this.retryConnectionTimer || this._stop ? this.retry >= this.opts.connectionRetries && clearInterval(this.retryConnectionTimer) : this.retry < this.opts.connectionRetries && (this.retryConnectionTimer = setInterval(function () {
            return e.retryConnection();
          }, 5e3));
        }, y.prototype.debounce = function (n, o, i) {
          var s;
          return function () {
            var e = this,
                t = arguments,
                r = i && !s;
            clearTimeout(s), s = setTimeout(function () {
              s = null, i || n.apply(e, t);
            }, o), r && n.apply(e, t);
          };
        }, y);

        function y(e, t) {
          var r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
          if (function (e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
          }(this, y), r.debug && ((0, c.enableLogs)(!0), window.humanTime = u.humanTime), c.logger.info("[mse-player]:", y.version), this.opts = r || {}, this.media = e, this.url = t, this.opts.progressUpdateTime = this.opts.progressUpdateTime || 100, this.opts.errorsBeforeStop = this.opts.errorsBeforeStop ? this.opts.errorsBeforeStop : 1, "number" != typeof this.opts.errorsBeforeStop || isNaN(this.opts.errorsBeforeStop)) throw new Error("invalid errorsBeforeStop param, should be number");
          if (this.opts.connectionRetries = this.opts.connectionRetries || 0, "number" != typeof this.opts.connectionRetries || isNaN(this.opts.connectionRetries)) throw new Error("invalid connectionRetries param, should be number");
          if (this.opts.wsReconnect = !!this.opts.wsReconnect && this.opts.wsReconnect, "boolean" != typeof this.opts.wsReconnect) throw new Error("invalid wsReconnect param, should be boolean");
          if (this.retry = 0, this.retryConnectionTimer, this.opts.retryMuted = !!this.opts.retryMuted && this.opts.retryMuted, "boolean" != typeof this.opts.retryMuted) throw new Error("invalid retryMuted param, should be boolean");
          this.onProgress = r && r.onProgress, r && r.onDisconnect ? this.onDisconnect = r && r.onDisconnect : this.onDisconnect = function (e) {
            c.logger.log("[websocket status]:", e);
          }, this.onMediaInfo = r && r.onMediaInfo, this.onError = r && r.onError, this.onAutoplay = r && r.onAutoplay, this.onMuted = r && r.onMuted, this.init(), e instanceof HTMLMediaElement && (e.WebKitPlaysInline = !0), this.ws = new s.default({
            message: this.dispatchMessage.bind(this),
            closed: this.onDisconnect.bind(this),
            error: this.onError,
            wsReconnect: this.opts.wsReconnect
          }), this.sb = new a.default({
            media: e
          });
        }

        t.default = v, e.exports = t.default;
      }, function (e, t, r) {
        r(18), e.exports = r(3).Array.find;
      }, function (e, t, r) {

        var n = r(19),
            o = r(29)(5),
            i = "find",
            s = !0;
        i in [] && Array(1)[i](function () {
          s = !1;
        }), n(n.P + n.F * s, "Array", {
          find: function (e, t) {
            return o(this, e, 1 < arguments.length ? t : void 0);
          }
        }), r(39)(i);
      }, function (e, t, r) {
        var m = r(0),
            g = r(3),
            v = r(4),
            y = r(26),
            b = r(9),
            S = "prototype",
            E = function (e, t, r) {
          var n,
              o,
              i,
              s,
              a = e & E.F,
              u = e & E.G,
              c = e & E.S,
              h = e & E.P,
              f = e & E.B,
              d = u ? m : c ? m[t] || (m[t] = {}) : (m[t] || {})[S],
              l = u ? g : g[t] || (g[t] = {}),
              p = l[S] || (l[S] = {});

          for (n in u && (r = t), r) i = ((o = !a && d && void 0 !== d[n]) ? d : r)[n], s = f && o ? b(i, m) : h && "function" == typeof i ? b(Function.call, i) : i, d && y(d, n, i, e & E.U), l[n] != i && v(l, n, s), h && p[n] != i && (p[n] = i);
        };

        m.core = g, E.F = 1, E.G = 2, E.S = 4, E.P = 8, E.B = 16, E.W = 32, E.U = 64, E.R = 128, e.exports = E;
      }, function (e, t, r) {
        var n = r(21),
            o = r(22),
            i = r(24),
            s = Object.defineProperty;
        t.f = r(5) ? Object.defineProperty : function (e, t, r) {
          if (n(e), t = i(t, !0), n(r), o) try {
            return s(e, t, r);
          } catch (e) {}
          if ("get" in r || "set" in r) throw TypeError("Accessors not supported!");
          return "value" in r && (e[t] = r.value), e;
        };
      }, function (e, t, r) {
        var n = r(1);

        e.exports = function (e) {
          if (!n(e)) throw TypeError(e + " is not an object!");
          return e;
        };
      }, function (e, t, r) {
        e.exports = !r(5) && !r(7)(function () {
          return 7 != Object.defineProperty(r(23)("div"), "a", {
            get: function () {
              return 7;
            }
          }).a;
        });
      }, function (e, t, r) {
        var n = r(1),
            o = r(0).document,
            i = n(o) && n(o.createElement);

        e.exports = function (e) {
          return i ? o.createElement(e) : {};
        };
      }, function (e, t, r) {
        var o = r(1);

        e.exports = function (e, t) {
          if (!o(e)) return e;
          var r, n;
          if (t && "function" == typeof (r = e.toString) && !o(n = r.call(e))) return n;
          if ("function" == typeof (r = e.valueOf) && !o(n = r.call(e))) return n;
          if (!t && "function" == typeof (r = e.toString) && !o(n = r.call(e))) return n;
          throw TypeError("Can't convert object to primitive value");
        };
      }, function (e, t) {
        e.exports = function (e, t) {
          return {
            enumerable: !(1 & e),
            configurable: !(2 & e),
            writable: !(4 & e),
            value: t
          };
        };
      }, function (e, t, r) {
        var i = r(0),
            s = r(4),
            a = r(27),
            u = r(8)("src"),
            n = "toString",
            o = Function[n],
            c = ("" + o).split(n);
        r(3).inspectSource = function (e) {
          return o.call(e);
        }, (e.exports = function (e, t, r, n) {
          var o = "function" == typeof r;
          o && (a(r, "name") || s(r, "name", t)), e[t] !== r && (o && (a(r, u) || s(r, u, e[t] ? "" + e[t] : c.join(String(t)))), e === i ? e[t] = r : n ? e[t] ? e[t] = r : s(e, t, r) : (delete e[t], s(e, t, r)));
        })(Function.prototype, n, function () {
          return "function" == typeof this && this[u] || o.call(this);
        });
      }, function (e, t) {
        var r = {}.hasOwnProperty;

        e.exports = function (e, t) {
          return r.call(e, t);
        };
      }, function (e, t) {
        e.exports = function (e) {
          if ("function" != typeof e) throw TypeError(e + " is not a function!");
          return e;
        };
      }, function (e, t, r) {
        var b = r(9),
            S = r(30),
            E = r(31),
            _ = r(33),
            n = r(35);

        e.exports = function (f, e) {
          var d = 1 == f,
              l = 2 == f,
              p = 3 == f,
              m = 4 == f,
              g = 6 == f,
              v = 5 == f || g,
              y = e || n;
          return function (e, t, r) {
            for (var n, o, i = E(e), s = S(i), a = b(t, r, 3), u = _(s.length), c = 0, h = d ? y(e, u) : l ? y(e, 0) : void 0; c < u; c++) if ((v || c in s) && (o = a(n = s[c], c, i), f)) if (d) h[c] = o;else if (o) switch (f) {
              case 3:
                return !0;

              case 5:
                return n;

              case 6:
                return c;

              case 2:
                h.push(n);
            } else if (m) return !1;

            return g ? -1 : p || m ? m : h;
          };
        };
      }, function (e, t, r) {
        var n = r(10);
        e.exports = Object("z").propertyIsEnumerable(0) ? Object : function (e) {
          return "String" == n(e) ? e.split("") : Object(e);
        };
      }, function (e, t, r) {
        var n = r(32);

        e.exports = function (e) {
          return Object(n(e));
        };
      }, function (e, t) {
        e.exports = function (e) {
          if (null == e) throw TypeError("Can't call method on  " + e);
          return e;
        };
      }, function (e, t, r) {
        var n = r(34),
            o = Math.min;

        e.exports = function (e) {
          return 0 < e ? o(n(e), 9007199254740991) : 0;
        };
      }, function (e, t) {
        var r = Math.ceil,
            n = Math.floor;

        e.exports = function (e) {
          return isNaN(e = +e) ? 0 : (0 < e ? n : r)(e);
        };
      }, function (e, t, r) {
        var n = r(36);

        e.exports = function (e, t) {
          return new (n(e))(t);
        };
      }, function (e, t, r) {
        var n = r(1),
            o = r(37),
            i = r(11)("species");

        e.exports = function (e) {
          var t;
          return o(e) && ("function" != typeof (t = e.constructor) || t !== Array && !o(t.prototype) || (t = void 0), n(t) && null === (t = t[i]) && (t = void 0)), void 0 === t ? Array : t;
        };
      }, function (e, t, r) {
        var n = r(10);

        e.exports = Array.isArray || function (e) {
          return "Array" == n(e);
        };
      }, function (e, t, r) {
        var n = r(0),
            o = "__core-js_shared__",
            i = n[o] || (n[o] = {});

        e.exports = function (e) {
          return i[e] || (i[e] = {});
        };
      }, function (e, t, r) {
        var n = r(11)("unscopables"),
            o = Array.prototype;
        null == o[n] && r(4)(o, n, {}), e.exports = function (e) {
          o[n][e] = !0;
        };
      }, function (e, t, r) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.getWSURL = d;
        var u = n(r(41)),
            c = n(r(6)),
            h = r(2);

        function n(e) {
          return e && e.__esModule ? e : {
            default: e
          };
        }

        var f = "live",
            o = (i.prototype.init = function () {
          this.opened = !1, this.connectionPromise = void 0, clearTimeout(this.reconnect), this.reconnect = void 0;
        }, i.prototype.start = function (n, o, e, t) {
          var i = this,
              s = 2 < arguments.length && void 0 !== e ? e : "",
              a = 3 < arguments.length && void 0 !== t ? t : "";
          return this.socketURL = {
            url: n,
            time: o,
            videoTrack: s,
            audioTack: a
          }, this.connectionPromise = new Promise(function (e, t) {
            var r = d(n, o, s, a);
            i.websocket = new WebSocket(r), i.websocket.binaryType = "arraybuffer", i.websocket.addEventListener(c.default.WS_OPEN, i.onwso), i.websocket.addEventListener(c.default.WS_MESSAGE, i.onwsm), i.websocket.addEventListener(c.default.WS_ERROR, i.onwse), i.websocket.addEventListener(c.default.WS_CLOSE, i.onwsc), i._openingResolve = e, i._openingReject = t;
          }), this.connectionPromise;
        }, i.prototype.open = function () {
          this.opened = !0, this.paused = !0, this._openingResolve(), this.resume(), this.websocket.removeEventListener(c.default.WS_OPEN, this.onwso);
        }, i.prototype.send = function (e) {
          this.websocket.send(e);
        }, i.prototype.resume = function () {
          var e = this;
          if (clearTimeout(this.reconnect), h.logger.log("ws: send resume"), 0 === this.websocket.readyState) return setTimeout(function () {
            return e.resume();
          }, 500);
          this.websocket.send("resume"), this.paused = !1;
        }, i.prototype.pause = function () {
          h.logger.log("ws: send pause"), 1 === this.websocket.readyState && (this.websocket.send("pause"), this.paused = !0);
        }, i.prototype.seek = function (e) {
          var t = e === f ? "" : "play_from=";
          h.logger.log(t + e), this.websocket.send(t + e);
        }, i.prototype.setTracks = function (e, t) {
          var r = 1 < arguments.length && void 0 !== t ? t : null;
          this.websocket.send("set_tracks=" + e + r);
        }, i.prototype.handleReceiveMessage = function (e) {
          this.opts.message(e);
        }, i.prototype.handleError = function () {
          var e;
          this.opts.error && (e = this.opts).error.apply(e, arguments);
        }, i.prototype.onWSClose = function (e) {
          var t = this;
          if (h.logger.log("WebSocket lost connection with code ", e.code + " and reason: " + e.reason), this.opts.wsReconnect) if (e.wasClean && 1e3 !== e.code && 1006 !== e.code) h.logger.log("Clean websocket stop"), this.destroy();else {
            var r = this.socketURL,
                n = r.url,
                o = r.time,
                i = r.videoTrack,
                s = r.audioTack;
            this.reconnect = setTimeout(function () {
              t.start(n, o, i, s).then(function () {
                clearTimeout(t.reconnect);
              }).catch(function () {
                t.destroy();
              });
            }, 5e3);
          }
          this.opts.closed && this.opts.closed(e);
        }, i.prototype.destroy = function () {
          this.websocket && (this.pause(), this.websocket.removeEventListener(c.default.WS_MESSAGE, this.onwsm), this.websocket.close(), this.websocket.onclose = void 0, clearTimeout(this.reconnect), this.reconnect = void 0, this.init());
        }, i);

        function i(e) {
          !function (e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
          }(this, i), this.opts = e, this.init(), this.onwso = this.open.bind(this), this.onwsm = this.handleReceiveMessage.bind(this), this.onwse = this.handleError.bind(this), this.onwsc = this.onWSClose.bind(this);
        }

        function d(e, t, r, n) {
          var o = t;
          if (!o && !r && !n) return e;
          var i = (0, u.default)({
            url: e
          }),
              s = "";
          i.query && (s = i.query.split("&").map(function (e) {
            return e.split("=");
          }).filter(function (e) {
            return "from" !== e[0] && "tracks" !== e[0];
          }).map(function (e) {
            return e.join("=");
          }).join("&"), h.logger.log(s));
          var a = !!r || !!n;
          return i.protocol + "//" + i.host + i.pathname + "?" + (a ? "tracks=" + r + n : "") + (a && o && o !== f ? "&" : "") + (t === f ? "" : "from=" + Math.floor(o)) + ((a || o && o !== f) && s ? "&" : "") + s;
        }

        t.default = o;
      }, function (e, t, r) {
        /*!
         * parseurl
         * Copyright(c) 2014 Jonathan Ong
         * Copyright(c) 2014-2017 Douglas Christopher Wilson
         * MIT Licensed
         */

        var n = r(42),
            s = n.parse,
            a = n.Url;

        function o(e) {
          var t = e.url;

          if (void 0 !== t) {
            var r = e._parsedUrl;
            return u(t, r) ? r : ((r = i(t))._raw = t, e._parsedUrl = r);
          }
        }

        function i(e) {
          if ("string" != typeof e || 47 !== e.charCodeAt(0)) return s(e);

          for (var t = e, r = null, n = null, o = 1; o < e.length; o++) switch (e.charCodeAt(o)) {
            case 63:
              null === n && (t = e.substring(0, o), r = e.substring(o + 1), n = e.substring(o));
              break;

            case 9:
            case 10:
            case 12:
            case 13:
            case 32:
            case 35:
            case 160:
            case 65279:
              return s(e);
          }

          var i = void 0 !== a ? new a() : {};
          return i.path = e, i.href = e, i.pathname = t, i.query = r, i.search = n, i;
        }

        function u(e, t) {
          return "object" == typeof t && null !== t && (void 0 === a || t instanceof a) && t._raw === e;
        }

        e.exports = o, e.exports.original = function (e) {
          var t = e.originalUrl;
          if ("string" != typeof t) return o(e);
          var r = e._parsedOriginalUrl;
          if (u(t, r)) return r;
          return (r = i(t))._raw = t, e._parsedOriginalUrl = r;
        };
      }, function (e, t, r) {

        var U = r(43),
            B = r(46);

        function k() {
          this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null;
        }

        t.parse = i, t.resolve = function (e, t) {
          return i(e, !1, !0).resolve(t);
        }, t.resolveObject = function (e, t) {
          return e ? i(e, !1, !0).resolveObject(t) : t;
        }, t.format = function (e) {
          B.isString(e) && (e = i(e));
          return e instanceof k ? e.format() : k.prototype.format.call(e);
        }, t.Url = k;
        var C = /^([a-z0-9.+-]+:)/i,
            n = /:[0-9]*$/,
            x = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
            o = ["{", "}", "|", "\\", "^", "`"].concat(["<", ">", '"', "`", " ", "\r", "\n", "\t"]),
            D = ["'"].concat(o),
            L = ["%", "/", "?", ";", "#"].concat(D),
            N = ["/", "?", "#"],
            F = /^[+a-z0-9A-Z_-]{0,63}$/,
            q = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
            W = {
          javascript: !0,
          "javascript:": !0
        },
            V = {
          javascript: !0,
          "javascript:": !0
        },
            G = {
          http: !0,
          https: !0,
          ftp: !0,
          gopher: !0,
          file: !0,
          "http:": !0,
          "https:": !0,
          "ftp:": !0,
          "gopher:": !0,
          "file:": !0
        },
            H = r(47);

        function i(e, t, r) {
          if (e && B.isObject(e) && e instanceof k) return e;
          var n = new k();
          return n.parse(e, t, r), n;
        }

        k.prototype.parse = function (e, t, r) {
          if (!B.isString(e)) throw new TypeError("Parameter 'url' must be a string, not " + typeof e);
          var n = e.indexOf("?"),
              o = -1 !== n && n < e.indexOf("#") ? "?" : "#",
              i = e.split(o);
          i[0] = i[0].replace(/\\/g, "/");
          var s = e = i.join(o);

          if (s = s.trim(), !r && 1 === e.split("#").length) {
            var a = x.exec(s);
            if (a) return this.path = s, this.href = s, this.pathname = a[1], a[2] ? (this.search = a[2], this.query = t ? H.parse(this.search.substr(1)) : this.search.substr(1)) : t && (this.search = "", this.query = {}), this;
          }

          var u = C.exec(s);

          if (u) {
            var c = (u = u[0]).toLowerCase();
            this.protocol = c, s = s.substr(u.length);
          }

          if (r || u || s.match(/^\/\/[^@\/]+@[^@\/]+/)) {
            var h = "//" === s.substr(0, 2);
            !h || u && V[u] || (s = s.substr(2), this.slashes = !0);
          }

          if (!V[u] && (h || u && !G[u])) {
            for (var f, d, l = -1, p = 0; p < N.length; p++) {
              -1 !== (m = s.indexOf(N[p])) && (-1 === l || m < l) && (l = m);
            }

            -1 !== (d = -1 === l ? s.lastIndexOf("@") : s.lastIndexOf("@", l)) && (f = s.slice(0, d), s = s.slice(d + 1), this.auth = decodeURIComponent(f)), l = -1;

            for (p = 0; p < L.length; p++) {
              var m;
              -1 !== (m = s.indexOf(L[p])) && (-1 === l || m < l) && (l = m);
            }

            -1 === l && (l = s.length), this.host = s.slice(0, l), s = s.slice(l), this.parseHost(), this.hostname = this.hostname || "";
            var g = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
            if (!g) for (var v = this.hostname.split(/\./), y = (p = 0, v.length); p < y; p++) {
              var b = v[p];

              if (b && !b.match(F)) {
                for (var S = "", E = 0, _ = b.length; E < _; E++) 127 < b.charCodeAt(E) ? S += "x" : S += b[E];

                if (!S.match(F)) {
                  var w = v.slice(0, p),
                      M = v.slice(p + 1),
                      T = b.match(q);
                  T && (w.push(T[1]), M.unshift(T[2])), M.length && (s = "/" + M.join(".") + s), this.hostname = w.join(".");
                  break;
                }
              }
            }
            255 < this.hostname.length ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), g || (this.hostname = U.toASCII(this.hostname));
            var O = this.port ? ":" + this.port : "",
                k = this.hostname || "";
            this.host = k + O, this.href += this.host, g && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== s[0] && (s = "/" + s));
          }

          if (!W[c]) for (p = 0, y = D.length; p < y; p++) {
            var A = D[p];

            if (-1 !== s.indexOf(A)) {
              var I = encodeURIComponent(A);
              I === A && (I = escape(A)), s = s.split(A).join(I);
            }
          }
          var j = s.indexOf("#");
          -1 !== j && (this.hash = s.substr(j), s = s.slice(0, j));
          var P = s.indexOf("?");

          if (-1 !== P ? (this.search = s.substr(P), this.query = s.substr(P + 1), t && (this.query = H.parse(this.query)), s = s.slice(0, P)) : t && (this.search = "", this.query = {}), s && (this.pathname = s), G[c] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
            O = this.pathname || "";
            var R = this.search || "";
            this.path = O + R;
          }

          return this.href = this.format(), this;
        }, k.prototype.format = function () {
          var e = this.auth || "";
          e && (e = (e = encodeURIComponent(e)).replace(/%3A/i, ":"), e += "@");
          var t = this.protocol || "",
              r = this.pathname || "",
              n = this.hash || "",
              o = !1,
              i = "";
          this.host ? o = e + this.host : this.hostname && (o = e + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"), this.port && (o += ":" + this.port)), this.query && B.isObject(this.query) && Object.keys(this.query).length && (i = H.stringify(this.query));
          var s = this.search || i && "?" + i || "";
          return t && ":" !== t.substr(-1) && (t += ":"), this.slashes || (!t || G[t]) && !1 !== o ? (o = "//" + (o || ""), r && "/" !== r.charAt(0) && (r = "/" + r)) : o = o || "", n && "#" !== n.charAt(0) && (n = "#" + n), s && "?" !== s.charAt(0) && (s = "?" + s), t + o + (r = r.replace(/[?#]/g, function (e) {
            return encodeURIComponent(e);
          })) + (s = s.replace("#", "%23")) + n;
        }, k.prototype.resolve = function (e) {
          return this.resolveObject(i(e, !1, !0)).format();
        }, k.prototype.resolveObject = function (e) {
          if (B.isString(e)) {
            var t = new k();
            t.parse(e, !1, !0), e = t;
          }

          for (var r = new k(), n = Object.keys(this), o = 0; o < n.length; o++) {
            var i = n[o];
            r[i] = this[i];
          }

          if (r.hash = e.hash, "" === e.href) return r.href = r.format(), r;

          if (e.slashes && !e.protocol) {
            for (var s = Object.keys(e), a = 0; a < s.length; a++) {
              var u = s[a];
              "protocol" !== u && (r[u] = e[u]);
            }

            return G[r.protocol] && r.hostname && !r.pathname && (r.path = r.pathname = "/"), r.href = r.format(), r;
          }

          if (e.protocol && e.protocol !== r.protocol) {
            if (!G[e.protocol]) {
              for (var c = Object.keys(e), h = 0; h < c.length; h++) {
                var f = c[h];
                r[f] = e[f];
              }

              return r.href = r.format(), r;
            }

            if (r.protocol = e.protocol, e.host || V[e.protocol]) r.pathname = e.pathname;else {
              for (var d = (e.pathname || "").split("/"); d.length && !(e.host = d.shift()););

              e.host || (e.host = ""), e.hostname || (e.hostname = ""), "" !== d[0] && d.unshift(""), d.length < 2 && d.unshift(""), r.pathname = d.join("/");
            }

            if (r.search = e.search, r.query = e.query, r.host = e.host || "", r.auth = e.auth, r.hostname = e.hostname || e.host, r.port = e.port, r.pathname || r.search) {
              var l = r.pathname || "",
                  p = r.search || "";
              r.path = l + p;
            }

            return r.slashes = r.slashes || e.slashes, r.href = r.format(), r;
          }

          var m = r.pathname && "/" === r.pathname.charAt(0),
              g = e.host || e.pathname && "/" === e.pathname.charAt(0),
              v = g || m || r.host && e.pathname,
              y = v,
              b = r.pathname && r.pathname.split("/") || [],
              S = (d = e.pathname && e.pathname.split("/") || [], r.protocol && !G[r.protocol]);
          if (S && (r.hostname = "", r.port = null, r.host && ("" === b[0] ? b[0] = r.host : b.unshift(r.host)), r.host = "", e.protocol && (e.hostname = null, e.port = null, e.host && ("" === d[0] ? d[0] = e.host : d.unshift(e.host)), e.host = null), v = v && ("" === d[0] || "" === b[0])), g) r.host = e.host || "" === e.host ? e.host : r.host, r.hostname = e.hostname || "" === e.hostname ? e.hostname : r.hostname, r.search = e.search, r.query = e.query, b = d;else if (d.length) (b = b || []).pop(), b = b.concat(d), r.search = e.search, r.query = e.query;else if (!B.isNullOrUndefined(e.search)) {
            if (S) r.hostname = r.host = b.shift(), (T = !!(r.host && 0 < r.host.indexOf("@")) && r.host.split("@")) && (r.auth = T.shift(), r.host = r.hostname = T.shift());
            return r.search = e.search, r.query = e.query, B.isNull(r.pathname) && B.isNull(r.search) || (r.path = (r.pathname ? r.pathname : "") + (r.search ? r.search : "")), r.href = r.format(), r;
          }
          if (!b.length) return r.pathname = null, r.search ? r.path = "/" + r.search : r.path = null, r.href = r.format(), r;

          for (var E = b.slice(-1)[0], _ = (r.host || e.host || 1 < b.length) && ("." === E || ".." === E) || "" === E, w = 0, M = b.length; 0 <= M; M--) "." === (E = b[M]) ? b.splice(M, 1) : ".." === E ? (b.splice(M, 1), w++) : w && (b.splice(M, 1), w--);

          if (!v && !y) for (; w--;) b.unshift("..");
          !v || "" === b[0] || b[0] && "/" === b[0].charAt(0) || b.unshift(""), _ && "/" !== b.join("/").substr(-1) && b.push("");
          var T,
              O = "" === b[0] || b[0] && "/" === b[0].charAt(0);
          S && (r.hostname = r.host = O ? "" : b.length ? b.shift() : "", (T = !!(r.host && 0 < r.host.indexOf("@")) && r.host.split("@")) && (r.auth = T.shift(), r.host = r.hostname = T.shift()));
          return (v = v || r.host && b.length) && !O && b.unshift(""), b.length ? r.pathname = b.join("/") : (r.pathname = null, r.path = null), B.isNull(r.pathname) && B.isNull(r.search) || (r.path = (r.pathname ? r.pathname : "") + (r.search ? r.search : "")), r.auth = e.auth || r.auth, r.slashes = r.slashes || e.slashes, r.href = r.format(), r;
        }, k.prototype.parseHost = function () {
          var e = this.host,
              t = n.exec(e);
          t && (":" !== (t = t[0]) && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e);
        };
      }, function (e, g, P) {
        (function (l, p) {
          var m;
          /*! https://mths.be/punycode v1.4.1 by @mathias */

          !function () {
            g && g.nodeType, l && l.nodeType;
            var e = "object" == typeof p && p;
            e.global !== e && e.window !== e && e.self;
            var t,
                v = 2147483647,
                y = 36,
                b = 1,
                S = 26,
                o = 38,
                i = 700,
                E = 72,
                _ = 128,
                w = "-",
                r = /^xn--/,
                n = /[^\x20-\x7E]/,
                s = /[\x2E\u3002\uFF0E\uFF61]/g,
                a = {
              overflow: "Overflow: input needs wider integers to process",
              "not-basic": "Illegal input >= 0x80 (not a basic code point)",
              "invalid-input": "Invalid input"
            },
                u = y - b,
                M = Math.floor,
                T = String.fromCharCode;

            function O(e) {
              throw new RangeError(a[e]);
            }

            function c(e, t) {
              for (var r = e.length, n = []; r--;) n[r] = t(e[r]);

              return n;
            }

            function h(e, t) {
              var r = e.split("@"),
                  n = "";
              return 1 < r.length && (n = r[0] + "@", e = r[1]), n + c((e = e.replace(s, ".")).split("."), t).join(".");
            }

            function k(e) {
              for (var t, r, n = [], o = 0, i = e.length; o < i;) 55296 <= (t = e.charCodeAt(o++)) && t <= 56319 && o < i ? 56320 == (64512 & (r = e.charCodeAt(o++))) ? n.push(((1023 & t) << 10) + (1023 & r) + 65536) : (n.push(t), o--) : n.push(t);

              return n;
            }

            function A(e) {
              return c(e, function (e) {
                var t = "";
                return 65535 < e && (t += T((e -= 65536) >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), t += T(e);
              }).join("");
            }

            function I(e, t) {
              return e + 22 + 75 * (e < 26) - ((0 != t) << 5);
            }

            function j(e, t, r) {
              var n = 0;

              for (e = r ? M(e / i) : e >> 1, e += M(e / t); u * S >> 1 < e; n += y) e = M(e / u);

              return M(n + (u + 1) * e / (e + o));
            }

            function f(e) {
              var t,
                  r,
                  n,
                  o,
                  i,
                  s,
                  a,
                  u,
                  c,
                  h,
                  f,
                  d = [],
                  l = e.length,
                  p = 0,
                  m = _,
                  g = E;

              for ((r = e.lastIndexOf(w)) < 0 && (r = 0), n = 0; n < r; ++n) 128 <= e.charCodeAt(n) && O("not-basic"), d.push(e.charCodeAt(n));

              for (o = 0 < r ? r + 1 : 0; o < l;) {
                for (i = p, s = 1, a = y; l <= o && O("invalid-input"), f = e.charCodeAt(o++), (y <= (u = f - 48 < 10 ? f - 22 : f - 65 < 26 ? f - 65 : f - 97 < 26 ? f - 97 : y) || u > M((v - p) / s)) && O("overflow"), p += u * s, !(u < (c = a <= g ? b : g + S <= a ? S : a - g)); a += y) s > M(v / (h = y - c)) && O("overflow"), s *= h;

                g = j(p - i, t = d.length + 1, 0 == i), M(p / t) > v - m && O("overflow"), m += M(p / t), p %= t, d.splice(p++, 0, m);
              }

              return A(d);
            }

            function d(e) {
              var t,
                  r,
                  n,
                  o,
                  i,
                  s,
                  a,
                  u,
                  c,
                  h,
                  f,
                  d,
                  l,
                  p,
                  m,
                  g = [];

              for (d = (e = k(e)).length, t = _, i = E, s = r = 0; s < d; ++s) (f = e[s]) < 128 && g.push(T(f));

              for (n = o = g.length, o && g.push(w); n < d;) {
                for (a = v, s = 0; s < d; ++s) t <= (f = e[s]) && f < a && (a = f);

                for (a - t > M((v - r) / (l = n + 1)) && O("overflow"), r += (a - t) * l, t = a, s = 0; s < d; ++s) if ((f = e[s]) < t && ++r > v && O("overflow"), f == t) {
                  for (u = r, c = y; !(u < (h = c <= i ? b : i + S <= c ? S : c - i)); c += y) m = u - h, p = y - h, g.push(T(I(h + m % p, 0))), u = M(m / p);

                  g.push(T(I(u, 0))), i = j(r, l, n == o), r = 0, ++n;
                }

                ++r, ++t;
              }

              return g.join("");
            }

            t = {
              version: "1.4.1",
              ucs2: {
                decode: k,
                encode: A
              },
              decode: f,
              encode: d,
              toASCII: function (e) {
                return h(e, function (e) {
                  return n.test(e) ? "xn--" + d(e) : e;
                });
              },
              toUnicode: function (e) {
                return h(e, function (e) {
                  return r.test(e) ? f(e.slice(4).toLowerCase()) : e;
                });
              }
            }, void 0 === (m = function () {
              return t;
            }.call(g, P, g, l)) || (l.exports = m);
          }();
        }).call(this, P(44)(e), P(45));
      }, function (e, t) {
        e.exports = function (e) {
          return e.webpackPolyfill || (e.deprecate = function () {}, e.paths = [], e.children || (e.children = []), Object.defineProperty(e, "loaded", {
            enumerable: !0,
            get: function () {
              return e.l;
            }
          }), Object.defineProperty(e, "id", {
            enumerable: !0,
            get: function () {
              return e.i;
            }
          }), e.webpackPolyfill = 1), e;
        };
      }, function (e, t) {
        var r;

        r = function () {
          return this;
        }();

        try {
          r = r || new Function("return this")();
        } catch (e) {
          "object" == typeof window && (r = window);
        }

        e.exports = r;
      }, function (e, t, r) {

        e.exports = {
          isString: function (e) {
            return "string" == typeof e;
          },
          isObject: function (e) {
            return "object" == typeof e && null !== e;
          },
          isNull: function (e) {
            return null === e;
          },
          isNullOrUndefined: function (e) {
            return null == e;
          }
        };
      }, function (e, t, r) {

        t.decode = t.parse = r(48), t.encode = t.stringify = r(49);
      }, function (e, t, r) {

        e.exports = function (e, t, r, n) {
          t = t || "&", r = r || "=";
          var o = {};
          if ("string" != typeof e || 0 === e.length) return o;
          var i = /\+/g;
          e = e.split(t);
          var s = 1e3;
          n && "number" == typeof n.maxKeys && (s = n.maxKeys);
          var a,
              u,
              c = e.length;
          0 < s && s < c && (c = s);

          for (var h = 0; h < c; ++h) {
            var f,
                d,
                l,
                p,
                m = e[h].replace(i, "%20"),
                g = m.indexOf(r);
            d = 0 <= g ? (f = m.substr(0, g), m.substr(g + 1)) : (f = m, ""), l = decodeURIComponent(f), p = decodeURIComponent(d), a = o, u = l, Object.prototype.hasOwnProperty.call(a, u) ? v(o[l]) ? o[l].push(p) : o[l] = [o[l], p] : o[l] = p;
          }

          return o;
        };

        var v = Array.isArray || function (e) {
          return "[object Array]" === Object.prototype.toString.call(e);
        };
      }, function (e, t, r) {

        function i(e) {
          switch (typeof e) {
            case "string":
              return e;

            case "boolean":
              return e ? "true" : "false";

            case "number":
              return isFinite(e) ? e : "";

            default:
              return "";
          }
        }

        e.exports = function (r, n, o, e) {
          return n = n || "&", o = o || "=", null === r && (r = void 0), "object" == typeof r ? a(u(r), function (e) {
            var t = encodeURIComponent(i(e)) + o;
            return s(r[e]) ? a(r[e], function (e) {
              return t + encodeURIComponent(i(e));
            }).join(n) : t + encodeURIComponent(i(r[e]));
          }).join(n) : e ? encodeURIComponent(i(e)) + o + encodeURIComponent(i(r)) : "";
        };

        var s = Array.isArray || function (e) {
          return "[object Array]" === Object.prototype.toString.call(e);
        };

        function a(e, t) {
          if (e.map) return e.map(t);

          for (var r = [], n = 0; n < e.length; n++) r.push(t(e[n], n));

          return r;
        }

        var u = Object.keys || function (e) {
          var t = [];

          for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.push(r);

          return t;
        };
      }, function (e, t, r) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.getSelfScope = function () {
          return "undefined" == typeof window ? self : window;
        };
      }, function (e, t, r) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        var o = r(12),
            f = r(2),
            s = r(13),
            a = r(6);
        var n = (i.prototype.init = function (e) {
          var t = 0 < arguments.length && void 0 !== e ? e : {};
          this.flushRange = [], this.appended = 0, this.mediaSource = t.mediaSource, this.segmentsVideo = [], this.segmentsAudio = [], this.sourceBuffer = {};
        }, i.prototype.setMediaSource = function (e) {
          this.mediaSource = e;
        }, i.prototype.createSourceBuffers = function (e) {
          var o = this,
              i = this.sourceBuffer;
          e.tracks.forEach(function (e) {
            var t = e.content === s.VIDEO,
                r = t ? 'video/mp4; codecs="avc1.4d401f"' : 'audio/mp4; codecs="mp4a.40.2"';
            i[e.content] = o.mediaSource.addSourceBuffer(r);
            var n = i[e.content];
            t ? n.addEventListener(a.BUFFER_UPDATE_END, o.onSBUpdateEnd) : n.addEventListener(a.BUFFER_UPDATE_END, o.onAudioSBUpdateEnd);
          });
        }, i.prototype.onSBUpdateEnd = function () {
          if (this._needsFlush && (f.logger.log("flushing buffer"), this.doFlush()), this._needsEos && this.checkEos(), !this._needsFlush && this.segmentsVideo.length) {
            var e = this.sourceBuffer.video;

            if (e) {
              if (e.updating) return;
              var t = this.segmentsVideo[0];
              e.appendBuffer(t.data), this.segmentsVideo.shift(), this.appended++;
            }
          }
        }, i.prototype.onAudioSBUpdateEnd = function () {
          if (this._needsFlush && (f.logger.log("flushing buffer"), this.doFlush()), this._needsEos && this.checkEos(), !this._needsFlush && this.segmentsAudio.length) {
            var e = this.sourceBuffer.audio;

            if (e) {
              if (e.updating) return;
              var t = this.segmentsAudio[0];
              e.appendBuffer(t.data), this.segmentsAudio.shift(), this.appended++;
            }
          }
        }, i.prototype.createTracks = function (e) {
          var n = this;
          e.forEach(function (e) {
            var t = (0, o.base64ToArrayBuffer)(e.payload),
                r = {
              type: n.getTypeBytrackId(e.id),
              isInit: !0,
              data: t
            };
            n.maybeAppend(r);
          });
        }, i.prototype.maybeAppend = function (e) {
          if (!this._needsFlush) {
            if (!this.media || this.media.error) return "audio" === e.type ? this.segmentsAudio = [] : this.segmentsVideo = [], void f.logger.error("trying to append although a media error occured, flush segment and abort");
            var t = this.sourceBuffer[e.type];

            if (t) {
              if (t.updating) return;
              t.appendBuffer(e.data), "audio" === e.type ? this.segmentsAudio.shift() : this.segmentsVideo.shift(), this.appended++;
            }
          }
        }, i.prototype.setTracksByType = function (e) {
          var t = this,
              r = e.tracks ? "tracks" : "streams";
          1 === e[r].length && (this.audioTrackId = null), e[r].forEach(function (e) {
            t[e.content === s.VIDEO ? "videoTrackId" : "audioTrackId"] = e.id;
          });
        }, i.prototype.getTypeBytrackId = function (e) {
          return this.audioTrackId === e ? s.AUDIO : s.VIDEO;
        }, i.prototype.procArrayBuffer = function (e) {
          var t = this.rawDataToSegmnet(e);
          "audio" === t.type ? this.segmentsAudio.push(t) : this.segmentsVideo.push(t), this.doArrayBuffer(t), this.sourceBuffer && (this.sourceBuffer.video && !this.sourceBuffer.video.updating && this.onSBUpdateEnd(), this.sourceBuffer.audio && !this.sourceBuffer.audio.updating && this.onAudioSBUpdateEnd());
        }, i.prototype.seek = function () {
          for (var e in this.sourceBuffer) this.sourceBuffer[e].abort(), this.sourceBuffer[e].mode = "sequence";

          this.segmentsVideo = [], this.segmentsAudio = [];
        }, i.prototype.isBuffered = function () {
          var e = 0,
              t = this.sourceBuffer;

          for (var r in t) e += t[r].buffered.length;

          return 0 < e;
        }, i.prototype.doFlush = function () {
          for (; this.flushRange.length;) {
            var e = this.flushRange[0];
            if (!this.flushBuffer(e.start, e.end, e.type)) return void (this._needsFlush = !0);
            this.flushRange.shift(), this.flushBufferCounter = 0;
          }

          if (0 === this.flushRange.length) {
            this._needsFlush = !1;
            var t = 0,
                r = this.sourceBuffer;

            try {
              for (var n in r) t += r[n].buffered.length;
            } catch (e) {}

            this.appended = t, this._setTracksFlag = !1;
          }
        }, i.prototype.flushBuffer = function (e, t, r) {
          var n = void 0,
              o = void 0,
              i = void 0,
              s = void 0,
              a = void 0,
              u = void 0,
              c = this.sourceBuffer;

          if (Object.keys(c).length) {
            if (f.logger.log("flushBuffer,pos/start/end: " + this.media.currentTime.toFixed(3) + "/" + e + "/" + t), this.flushBufferCounter < this.appended) {
              for (var h in c) if (!r || h === r) {
                if ((n = c[h]).ended = !1, n.updating) return f.logger.warn("cannot flush, sb updating in progress"), !1;

                try {
                  for (o = 0; o < n.buffered.length; o++) if (i = n.buffered.start(o), s = n.buffered.end(o), u = -1 !== navigator.userAgent.toLowerCase().indexOf("firefox") && t === Number.POSITIVE_INFINITY ? (a = e, t) : (a = Math.max(i, e), Math.min(s, t)), .5 < Math.min(u, s) - a) return this.flushBufferCounter++, f.logger.log("flush " + h + " [" + a + "," + u + "], of [" + i + "," + s + "], pos:" + this.media.currentTime), n.remove(a, u), !1;
                } catch (e) {
                  f.logger.warn("exception while accessing sourcebuffer, it might have been removed from MediaSource");
                }
              }
            } else f.logger.warn("abort flushing too many retries");

            f.logger.log("buffer flushed");
          }

          return !0;
        }, i.prototype.rawDataToSegmnet = function (e) {
          var t = new Uint8Array(e),
              r = (0, o.getTrackId)(t);
          return {
            type: this.getTypeBytrackId(r),
            data: t
          };
        }, i.prototype.onBufferEos = function (e) {
          var t = 0 < arguments.length && void 0 !== e ? e : {},
              r = this.sourceBuffer,
              n = t.type;

          for (var o in r) n && o !== n || r[o].ended || (r[o].ended = !0, f.logger.log(o + " sourceBuffer now EOS"));

          this.checkEos();
        }, i.prototype.checkEos = function () {
          var e = this.sourceBuffer,
              t = this.mediaSource;

          if (t && "open" === t.readyState) {
            for (var r in e) {
              var n = e[r];
              if (!n.ended) return;
              if (n.updating) return void (this._needsEos = !0);
            }

            f.logger.log("all media data available, signal endOfStream() to MediaSource and stop loading fragment");

            try {
              t.endOfStream();
            } catch (e) {
              f.logger.warn("exception while calling mediaSource.endOfStream()");
            }

            this._needsEos = !1;
          } else this._needsEos = !1;
        }, i.prototype.destroy = function () {
          this.init();
        }, i);

        function i() {
          var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
          !function (e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
          }(this, i), f.logger.log("create BuffersController"), this.media = e.media, this.init(e), this.doArrayBuffer = o.doArrayBuffer.bind(this), this.maybeAppend = this.maybeAppend.bind(this), this.onSBUpdateEnd = this.onSBUpdateEnd.bind(this), this.onAudioSBUpdateEnd = this.onAudioSBUpdateEnd.bind(this);
        }

        t.default = n, e.exports = t.default;
      }, function (e, t, r) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        t.EVENT_SEGMENT = "event", t.MSE_INIT_SEGMENT = "mse_init_segment", t.MSE_MEDIA_SEGMENT = "mse_media_segment";
      }, function (e, t, r) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        });
        t.default = {
          NOT_HTML_MEDIA_ELEMENT: "media should be an HTMLMediaElement instance"
        }, e.exports = t.default;
      }], o.c = n, o.d = function (e, t, r) {
        o.o(e, t) || Object.defineProperty(e, t, {
          enumerable: !0,
          get: r
        });
      }, o.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
          value: "Module"
        }), Object.defineProperty(e, "__esModule", {
          value: !0
        });
      }, o.t = function (t, e) {
        if (1 & e && (t = o(t)), 8 & e) return t;
        if (4 & e && "object" == typeof t && t && t.__esModule) return t;
        var r = Object.create(null);
        if (o.r(r), Object.defineProperty(r, "default", {
          enumerable: !0,
          value: t
        }), 2 & e && "string" != typeof t) for (var n in t) o.d(r, n, function (e) {
          return t[e];
        }.bind(null, n));
        return r;
      }, o.n = function (e) {
        var t = e && e.__esModule ? function () {
          return e.default;
        } : function () {
          return e;
        };
        return o.d(t, "a", t), t;
      }, o.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }, o.p = "", o(o.s = 14);

      function o(e) {
        if (n[e]) return n[e].exports;
        var t = n[e] = {
          i: e,
          l: !1,
          exports: {}
        };
        return r[e].call(t.exports, t, t.exports, o), t.l = !0, t.exports;
      }

      var r, n;
    });
  });
  var MSE = unwrapExports(FlussonicMsePlayer_min);
  var FlussonicMsePlayer_min_1 = FlussonicMsePlayer_min.FlussonicMsePlayer;

  var AUTO=-1,firstPlay=!0,MSELD=/*#__PURE__*/function(a){function b(){var a,c;_classCallCheck(this,b);for(var d=arguments.length,e=Array(d),f=0;f<d;f++)e[f]=arguments[f];return c=_possibleConstructorReturn(this,(a=_getPrototypeOf(b)).call.apply(a,[this].concat(e))),c.options.playback||(c.options.playback=c.options),c._startTimeUpdateTimer(),c}// hls like
  // каждые 100мс проверяет обновился ли видео тег
  return _inherits(b,a),_createClass(b,[{key:"name",get:function get$$1(){return "mseld"}},{key:"levels",get:function get$$1(){return this._levels||[]}},{key:"currentLevel",get:function get$$1(){return null===this._currentLevel||void 0===this._currentLevel?AUTO:this._currentLevel;//0 is a valid level ID
  },set:function set(a){this._currentLevel=a,this.trigger(clappr.Events.PLAYBACK_LEVEL_SWITCH_START),this.setTracks(a);}}],[{key:"MSELD",get:function get$$1(){return b}}]),_createClass(b,[{key:"_startTimeUpdateTimer",value:function _startTimeUpdateTimer(){var a=this;this._timeUpdateTimer=setInterval(function(){a._onTimeUpdate();},100);}// hls like
  // проверяет время у плеера обновилось, если нет то ничего не делает
  // если да то Events.PLAYBACK_TIMEUPDATE
  // TODO: проверить нужно ли смотреть обновления общей длинны
  // как она меняется в видео теге
  },{key:"_onTimeUpdate",value:function _onTimeUpdate(){var a={current:this.getCurrentTime(),total:this.getDuration()},b=this._lastTimeUpdate&&a.current===this._lastTimeUpdate.current;b||(// hls wf?
  this._lastTimeUpdate=a,this.trigger(clappr.Events.PLAYBACK_TIMEUPDATE,a,this.name));}// показываем какие контролы есть
  },{key:"_updateSettings",value:function _updateSettings(){this.settings.left=["playstop"],this.trigger(clappr.Events.PLAYBACK_SETTINGSUPDATE);}},{key:"_onDurationChange",value:function _onDurationChange(){var a=this.getDuration();this._lastDuration===a||(this._lastDuration=a,_get(_getPrototypeOf(b.prototype),"_onDurationChange",this).call(this));}},{key:"_stopTimeUpdateTimer",value:function _stopTimeUpdateTimer(){clearInterval(this._timeUpdateTimer);}},{key:"getPlaybackType",value:function getPlaybackType(){return clappr.Playback.LIVE}},{key:"destroy",value:function destroy(){this.MSE&&(this.MSE.stop(),this.MSE=void 0),this._stopTimeUpdateTimer(),_get(_getPrototypeOf(b.prototype),"destroy",this).call(this);}// ???
  },{key:"resolveRedirect",value:function resolveRedirect(a){return fetch(a,{method:"OPTIONS"})["catch"](function(){return a}).then(function(b){return b.headers&&b.headers.get("location")?b.headers.get("location"):a})}},{key:"getStartTimeOffset",value:function getStartTimeOffset(){return this.getCurrentTime()}},{key:"play",value:function play(){var a=this;if(!this._waitStatus&&!this.MSE){var b=this.options.src;this.resolveRedirect(b).then(function(b){var c=MSE.replaceHttpByWS(b),d=a.options.autoplay&&!a.options.mute;d&&(a.el.autoplay=!0,a.el.muted=!1,a.el.volume=1);var e=function(b){a.autoplayFunction=b,!1==firstPlay&&b(),firstPlay=!1;};e=e.bind(a),a.MSE=new MSE(a.el,c,{debug:a.options.debug,connectionRetries:0,onError:function onError(){},onAutoplay:e,onMediaInfo:function(b){var c=a.options.onMediaInfo;// this.audio = undefined;
  if(c&&"function"==typeof c){var d=b.streams||b.tracks;d&&0<d.length&&(a._levels=d.filter(function(b){return b.content&&"audio"===b.content&&(a.audio=b),!!(b.content&&"video"===b.content)}).map(function(a,b){return {id:b,level:a.size,label:"".concat(a.bitrate,"Kbps"),bitrate:a.bitrate,track_id:a.track_id}}),a.trigger(clappr.Events.PLAYBACK_LEVELS_AVAILABLE,a._levels)),c(b);}}});var f=a.MSE.play();// TODO: this.MSE.play() can terminate without promise, it suck!!!
  f&&f.then(function(){a.trigger(clappr.Events.PLAYBACK_PLAY_INTENT),a._stopped=!1;});});}}},{key:"setTracks",value:function setTracks(a){var b=a===AUTO?0:a;if(this.MSE){var c;// if (this.audio.length > 0) {
  //   if (this.audio.length > 1) {
  //     var lowest = Number.POSITIVE_INFINITY;
  //     var highest = Number.NEGATIVE_INFINITY;
  //     var tmp;
  //     let lowestID, highestID;
  //     for (var i = this.audio.length - 1; i >= 0; i--) {
  //       tmp = this.audio[i].bitrate;
  //       if (tmp < lowest) {
  //         lowest = tmp;
  //         lowestID = this.audio[i].track_id;
  //       };
  //       if (tmp > highest) {
  //         highest = tmp;
  //         highestID = this.audio[i].track_id;
  //       }
  //     }
  //     if (this._levels[realID].bitrate >= 2500) {
  //       audioTrack = highestID;
  //     } else if (this._levels[realID].bitrate > 1000) {
  //       if (this.audio.length > 2) {
  //         this.audio.forEach(el => {
  //           if (el.track_id !== highestID && el.track_id !== lowestID) {
  //             audioTrack = el.track_id;
  //           }
  //         });
  //       } else {
  //         audioTrack = highestID;
  //       }
  //     } else {
  //       audioTrack = lowestID;
  //     }
  //   } else {
  //     audioTrack = this.audio[0].track_id;
  //   }
  // }
  this.audio&&this.audio.track_id&&(c=this.audio.track_id);var d=[];this._levels[b]&&d.push(this._levels[b].track_id),void 0!==c&&d.push(c),0<d.length&&this.MSE.setTracks(d);}this.trigger(clappr.Events.PLAYBACK_LEVEL_SWITCH_END);}},{key:"setWaitStatus",value:function setWaitStatus(a){this._waitStatus=a;}},{key:"stop",value:function stop(){var a=this;this.MSE&&this.MSE.stop().then(function(){_get(_getPrototypeOf(b.prototype),"stop",a).call(a),a.MSE=void 0;});}}]),b}(clappr.HTML5Video);MSELD.isSupported=function(){return MSE.isSupported()},MSELD.canPlay=function(a,b){var c=-1!=a.indexOf("mse_ld")||"application/x-flussonic-mse"==b;return c&&MSELD.isSupported()},MSELD.waitingAutoplay=function(){if(MSE.autoplayFunction)return MSE.autoplayFunction};

  return MSELD;

})));
