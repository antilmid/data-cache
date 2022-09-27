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
var Cacher = /** @class */ (function () {
    function Cacher() {
        this.cache = new Map();
        this.maxBuckets = 5;
        this.expires = Infinity;
    }
    Cacher.prototype.initOpt = function (maxBuckets, expires) {
        this.maxBuckets = maxBuckets;
        this.expires = expires;
    };
    Cacher.prototype.addCache = function (characteristic, cache) {
        this.cache.set(characteristic, {
            cache: cache,
            savedTime: new Date().valueOf(),
            useCount: 0
        });
    };
    Cacher.prototype.getCache = function (characteristic) {
        var res = this.cache.get(characteristic);
        if (res)
            res.useCount++;
        return res;
    };
    // 维护最大桶数量
    Cacher.prototype.keepBuckets = function () {
        var _this = this;
        var keys = __spreadArray([], __read(this.cache.keys()), false);
        if (keys.length >= this.maxBuckets) {
            var minCount_1 = Infinity, minKey_1 = null;
            keys.forEach(function (keyname) {
                var ccache = _this.cache.get(keyname);
                if (ccache && ccache.useCount < minCount_1) {
                    minCount_1 = ccache.useCount;
                    minKey_1 = keyname;
                }
            });
            this.cache["delete"](minKey_1);
        }
    };
    ;
    // 维护过期数量
    Cacher.prototype.keepFresh = function () {
        var _this = this;
        var keys = __spreadArray([], __read(this.cache.keys()), false);
        keys.forEach(function (keyname) {
            var ccache = _this.cache.get(keyname);
            if (_this.expires > 0 &&
                ccache &&
                new Date().valueOf() - ccache.savedTime > _this.expires) {
                _this.cache["delete"](keyname);
            }
        });
    };
    ;
    return Cacher;
}());
exports["default"] = Cacher;
