export default class Cacher<CacheType, CharacteristicType = any> {
    cache: Map<CharacteristicType, {
        cache: CacheType;
        useCount: number;
        savedTime: number;
    }>;
    maxBuckets: number;
    expires: number;
    initOpt(maxBuckets: number, expires: number): void;
    addCache(characteristic: CharacteristicType, cache: CacheType): void;
    getCache(characteristic: CharacteristicType): {
        cache: CacheType;
        useCount: number;
        savedTime: number;
    };
    keepBuckets(): void;
    keepFresh(): void;
}
