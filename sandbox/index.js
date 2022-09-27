const {createCacheFunction, Cacher} = require('../');



function delay5sToRes (data) {
  return new Promise((res) => {
    setTimeout(()=>{
      res(data)
    }, 5000)
  })
}

global.delay5sToRes = createCacheFunction(delay5sToRes, {expires: 20000});

console.log('100', new Cacher);

module.exports = 100