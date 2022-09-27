# **Facher**

## **1. 它能做什么？**

Facher是一个简易的函数式数据缓存器，日常中我们遇到的一些函数运行时间成本极高，可以尝试将它的一部分数据缓存起来使用，降低时间成本（但是会一定量增加空间成本）。其次，Data-Cache还提供了底层Cacher库，可以利用它封装更多种类的缓存器。

---

## **2. createCacheFunction的使用**

  - createCacheFunction
    - 参数
      - fn : `any` 需要修饰的函数
      - opt : `{characterize, maxBuckets, expires}` 设置
    - 返回
      - dfn : `any` 修饰后的函数

### **2.1 缓存器装饰一个异步函数**
假设我们现在有一个如下异步函数，实现的是一个5秒后返回输入的异步函数：
```js
function delay5sToRes (data) {
  return new Promise((res) => {
    setTimeout(()=>{
      res(data)
    }, 5000)
  })
}
```

这时候，我们使用`createCacheFunction`封装一个带有缓存器的`delay5sToRes`函数，如下所示：
```js
const {createCacheFunction} = require('facher');
const cdelay5sToRes = createCacheFunction(delay5sToRes);
```

我们同时运行这两个函数，参数都传`500`，可以发现两个都是在5秒左右返回结果。这时候再次同时运行，带有缓存器封装过后的函数瞬间就能输出上次结果，而原始函数依旧要等待5秒。


### **2.2 缓存原理**
```
｜传入函数参数
｜
｜清理过期缓存
｜
｜利用参数制作characterize（参数唯一标识）
｜
｜通过characterize去获取历史缓存结果
｜
｜   ｜如果有历史缓存
｜   ｜
｜   ｜   ｜缓存useCount（使用计数器）递加1
｜   ｜   ｜
｜   ｜   ｜直接返回缓存结果
｜   ｜   ｜
｜   ｜如果没有历史缓存
｜   ｜
｜   ｜   ｜制作新的缓存缓存本次结果
｜   ｜   ｜
｜   ｜   ｜返还本次函数执行结果
```

### **2.3 createCacheFunction中的options**
`createCacheFunction`函数的第二个参数接收一个opt选项来设置缓存方案，目前版本只提供3个自定义选项，如下：
|  参数名   | 描述  | 默认值  |
|  ----  | ----  | ---- |
| characterize  | 特征函数，通过参数生成唯一标识 | JSON.stringify |
| maxBuckets  | 最大数据缓存数量 | 5 |
| expires  | 数据过期时间（毫秒） | Infinity |

---

## 3. 底层依赖Cacher

`createCacheFunction`函数底层依赖了`Cacher`类，我们可以通过类似的思想，利用`Cacher`实现封装更多种类和更贴合业务场景的工具。

**Cacher API**
|  参数名   | 描述  | 默认值/类型  |
|  ----  | ----  | ---- |
| maxBuckets  | 最大数据缓存数量 | `5` |
| expires  | 数据过期时间（毫秒） | `Infinity` |
| initOpt  | 初始化自身属性值 | `(maxBuckets:number, expires:number)=>void` |
| addCache  | 添加一个cache缓存 | `(characteristic: CharacteristicType, cache: CacheType)=>void` |
| getCache  | 通过characteristic获取一个cache缓存 | `(characteristic: CharacteristicType)=>void` |
| keepBuckets  | 维护最大桶数量，保持数量一直小于或者等于`maxBuckets` | `()=>void` |
| keepFresh  | 维护cache新鲜度，删除`expires`过期的cache缓存 | `()=>void` |


## 4. 缺陷

不管是`createCacheFunction`还是底层的`Cacher`类，都是有缺陷的，或者说：并非完全完美。

1. characteristic真的唯一？`createCacheFunction`中默认是使用`Json.stringify`对参数产生唯一标识characteristic，但是如果一个参数是函数类型，又或者是`NaN`/`null`？这个时候，会发现characteristic并不唯一，虽然`createCacheFunction`允许你通过opt自己去设置characterize特征函数去产生自己想要的特征值。

2. keepBuckets维护逻辑是否合理？当缓存达到最大存储（`maxBuckets`）时，keepBuckets会去删除使用频次低的缓存来保持桶的容量，但是频次低的数据一定是未来使用频次低的数据吗？比如新缓存进来的数据，使用频次就是0次，但是不能保证它未来使用频次会很低。

3. `createCacheFunction`返回出来的函数可能还会存在作用域的问题。

虽然设计上有一定缺陷，但确实满足了部分使用需求，未来会考虑寻找一个合适的优化方向。