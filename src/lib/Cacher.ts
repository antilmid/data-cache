export default class Cacher<CacheType, CharacteristicType = any> {
  cache: Map<
    CharacteristicType,
    {
      cache: CacheType;
      useCount: number;
      savedTime: number;
    }
  > = new Map();
  maxBuckets: number = 5;
  expires: number = Infinity;

  initOpt (maxBuckets:number, expires:number) {
    this.maxBuckets = maxBuckets;
    this.expires = expires;
  }

  addCache(characteristic: CharacteristicType, cache: CacheType) {
    this.cache.set(characteristic, {
      cache,
      savedTime: new Date().valueOf(),
      useCount: 0,
    });
  }

  getCache (characteristic: CharacteristicType) {
    const res = this.cache.get(characteristic);
    if(res) res.useCount ++;
    return res;
  }

  // 维护最大桶数量
  keepBuckets () {
    const keys = [...this.cache.keys()];
    if (keys.length >= this.maxBuckets) {
      let minCount = Infinity,
        minKey = null;
      keys.forEach((keyname) => {
        const ccache = this.cache.get(keyname);
        if (ccache && ccache.useCount < minCount) {
          minCount = ccache.useCount;
          minKey = keyname;
        }
      });
      this.cache.delete(minKey as CharacteristicType);
    }
  };

  // 维护过期数量
  keepFresh () {
    const keys = [...this.cache.keys()];
    keys.forEach((keyname) => {
      const ccache = this.cache.get(keyname);
      if (
        this.expires > 0 &&
        ccache &&
        new Date().valueOf() - ccache.savedTime > this.expires
      ) {
        this.cache.delete(keyname);
      }
    });
  };
}
