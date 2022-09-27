import Cacher from './lib/Cacher';
interface CreateCacheFunctionOpt<T extends (...args: any) => any> {
    characterize?: (params: [Parameters<T>]) => any;
    maxBuckets?: number;
    expires?: number;
}
export declare function createCacheFunction<T extends (...args: any) => any>(fn: T, opt?: CreateCacheFunctionOpt<T>): (...args: Parameters<T>) => ReturnType<T>;
export { Cacher };
