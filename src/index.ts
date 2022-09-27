import Cacher from './lib/Cacher';


interface CreateCacheFunctionOpt<T extends (...args: any) => any> {
  characterize?: (params: [Parameters<T>]) => any; // 特征函数，默认Params Json
  maxBuckets?: number; // 最大数据缓存数量，默认 5
  expires?: number; // 数据过期时间，（毫秒）
}
export function createCacheFunction<T extends (...args: any) => any>(
  fn: T,
  opt: CreateCacheFunctionOpt<T> = {}
) {
  const cache = new Cacher<ReturnType<T>, any>();
  const characterize = opt.characterize ?? JSON.stringify;
  cache.initOpt(opt.maxBuckets ?? 5, opt.expires ?? 0);

  return (...args:Parameters<T>):ReturnType<T> => {
    cache.keepFresh();
    const characteristic = characterize([...args]);
    const theCache = cache.getCache(characteristic);
    if(theCache) {
      return theCache.cache;
    } else {
      cache.keepBuckets();
      const res = fn(...args);
      cache.addCache(characteristic, res);
      return res;
    }
  }
}

export {Cacher}