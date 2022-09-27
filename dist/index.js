"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.Cacher = exports.createCacheFunction = void 0;
var Cacher_1 = require("./lib/Cacher");
exports.Cacher = Cacher_1["default"];
function createCacheFunction(fn, opt) {
    var _a, _b, _c;
    if (opt === void 0) { opt = {}; }
    var cache = new Cacher_1["default"]();
    var characterize = (_a = opt.characterize) !== null && _a !== void 0 ? _a : JSON.stringify;
    cache.initOpt((_b = opt.maxBuckets) !== null && _b !== void 0 ? _b : 5, (_c = opt.expires) !== null && _c !== void 0 ? _c : 0);
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        cache.keepFresh();
        var characteristic = characterize(__spreadArray([], __read(args), false));
        var theCache = cache.getCache(characteristic);
        if (theCache) {
            return theCache.cache;
        }
        else {
            cache.keepBuckets();
            var res = fn.apply(void 0, __spreadArray([], __read(args), false));
            cache.addCache(characteristic, res);
            return res;
        }
    };
}
exports.createCacheFunction = createCacheFunction;
