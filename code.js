/*
 * @Author: 李思豪
 * @Date: 2022-07-04 13:40:14
 * @LastEditTime: 2022-07-05 17:26:40
 * @Description: file content
 * @LastEditors: 李思豪
 */

/** 实现原生 AJAX
 * readyState
 * 0(未初始化) 此阶段确认 XMLHttpRequest 对象是否创建, 并调用 open 方法进行`未初始化`做好准备。值为`0表示对象已经存在`,否则报错对象不存在。
 * 1(载入) 此阶段确认 XMLHttpRequest 对象进行初始化,调用了 open 方法, 根据参数(methods,url,true)完成对象状态设置。并调用 send 方法开始向服务器 发送请求。 值为 `1表示正在向服务器发送请求`
 * 2(载入完成) 此阶段时接收到服务端的响应数据。但`获得的还只是服务端响应的原始数据`,并不能直接在客户端使用。值为2表示已经接收完全部响应数据。并为下一阶段数据解析做好准备。
 * 3(交互) 此阶段解析接收到的服务器端响应数据。即根据服务器端响应头部返回的MIME类型把数据转换成能通过responseBody、responseTex@diresponseXML属性存取的格式,为在客户端调用作好准备。状态3表示正在解析数据。
 * 4(完成) 此阶段确认全部数据都已经解析为客户端可用的格式，解析已经完成。值为4表示数据解析完毕，可以通过XNLHtpRequest对象的相应属性取得数据。
 *
 * Ajax方式提交表单的常见编码类型总结(未完成):
 * CONTENT-TYPE:application/x-www-form-urlencoded
 * CONTENT-TYPE:multipart/form-data 用来提交文件
 */
 const _ajax = {
  get(ul, fn) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", ul, true); // 第三个参数异步与否
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.statusText === 4 && xhr.status === 200) {
        fn(xhr.responseText);
      }
    };
  },
  post(url, data, fn) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(data);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        fn(xhr.statusText);
      }
    };
  }
};

/** 实现 new 关键字
 *1. 创建一个新的空对象
 *2. 设置原型，根据原型链，设置空对象的原型 （__proto__） 设置为构造函数的原型对象 prototype
 *3. 让函数的 this 指向这个对象，执行构造函数的代码（为这个新对象添加属性）
 *4. 判断函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象。
 */
function _new(fn, ...args) {
  const obj = Object.create(fn.prototype);
  let res = fn.apply(obj, args);
  let isObject = typeof res === "object" && res !== null;
  let isFunc = typeof res === "function";
  return isObject || isFunc ? res : obj;
}

/** 实现 instanceof 关键字
 */
function _instanceof(target, origin) {
  if (typeof target == "object" || target === null) return false;
  if (typeof origin !== "function")
    throw new TypeError("origin must be function");
  let proto = Object.getPrototypeOf(target);
  while (proto) {
    if (proto === origin.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

/** 实现防抖函数
 *
 */
function _debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearInterval(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/** 实现节流函数
 *
 */
function _throttle(fn, delay) {
  let falg = true;
  return (...args) => {
    if (!falg) return;
    falg = false;
    setTimeout(() => {
      fn.apply(this, args);
      falg = true;
    }, delay);
  };
}

/** 数组去重
 *
 */

function _uniqueOne(arr) {
  return [...new Set(arr)];
}

function _uniqueTwo(arr) {
  return arr.filter((ite, i, array) => {
    return array.indexOf(ite) === i;
  });
}

function _uniqueThree(arr) {
  const newArr = [];
  arr.reduce((pre, cur) => {
    if (!pre.has(cur)) {
      pre.set(cur, 1);
      newArr.push(cur);
    }
    return pre;
  }, new Map());
  return newArr;
}

/** 使用 setTimeout  实现 setInterval
 *
 */
function _setInterval(fn, delay) {
  let timer = null;
  const interval = () => {
    fn();
    timer = setTimeout(interval, delay);
  };
  interval();
  _setInterval.cancel = () => {
    clearInterval(timer);
  };
}

/** 使用 setInterval 实现 setTimeout
 *
 */
function _setTimeout(fn, delay) {
  const timer = setInterval(() => {
    fn();
    clearInterval(timer);
  }, delay);
}

/** 实现一个 compose 函数
 *
 */
function _compose(...fns) {
  if (fns.length === 0) arg => arg;
  if (fns.length === 1) fns[0];
  return fns.reduce((pre, cur) => arg => pre(cur(arg)));
}

/** 实现一个 柯里化 函数
 *
 */
function _curring(fn, args = []) {
  const inner = (arr = []) => {
    args.push(...arr);
    return args.length >= fn.length ? fn(...args) : (...args) => inner(args);
  };
  return inner();
}

/** 实现一个 LRU缓存函数
 * 有两个方法：
 * 1. 获取数据 get - 如果密钥(key) 存在于缓存中, 则获取密钥的值(正数),否则返回 -1
 * 2. 写入数据 put - 如果密钥已存在,则进行更新；不存在则插入;当缓存量达到上限,删除最久未使用数据
 * eg:
 * LRUCache cache = new LRUCache(2) // 缓存容量
 * cache.put(1,1)
 * cache.put(2,2)
 * cache.get(1) // 返回1
 * cache.put(3,3) // 该操作会使密钥 2 作废
 * cache.get(2) // 返回-1
 */

class _LRUCache {
  constructor(size) {
    this.size = size;
    this.cache = new Map();
  }
  get(key) {
    if (this.cache.has(key)) {
      const val = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, val);
      return val;
    } else {
      return -1;
    }
  }
  put(key, val) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    this.cache.set(key, val);
    if (this.cache.size > this.size) {
      this.cache.delete(this.cache.values().next().value);
    }
  }
}

/** 实现发布订阅
 *
 */
class _EventEmitter {
  constructor() {
    this.events = {};
  }
  on(type, callBack) {
    if (!this.events[type]) {
      this.events[type] = [callBack];
    } else {
      this.events[type].push(callBack);
    }
  }
  off(type, callBack) {
    if (!this.events[type]) return;
    this.events[type] = this.events[type].filter(fn => fn != callBack);
  }
  once(type, callBack) {
    function fn() {
      callBack();
      this.off(type, callBack);
    }
    this.on(type, fn);
  }
  emit(type, ...rest) {
    this.events[type] && this.events[type].forEach(fn => fn.apply(this, rest));
  }
}

/** 实现 JSON.parse (待补充)
 *
 */
function _parse(json) {
  return eval(`(${json})`);
}

/** 将 DOM 转换成树结构对象 (待补充)
 *
 */
function _domTree(dom) {
  let obj = {};
  obj.tag = dom.tagName;
  obj.children = [];
  dom.childNodes.forEach(child => obj.children.push(_domTree(child)));
  return obj;
}

/** 将树结构转换为 DOM
 *
 */
function _render(vnode) {
  // 如果是数字类型转化为字符串
  if (typeof vnode === "number") {
    vnode = String(vnode);
  }
  // 字符串类型直接就是文本节点
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }
  // 普通 DOM
  const dom = document.createElement(vnode.tag);
  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach(key => {
      const value = vnode.attrs[key];
      dom.setAttribute(key, value);
    });
  }
  // 子数组进行递归操作
  vnode.children.forEach(child => dom.appendChild(_render(child)));
  return dom;
}

/** 判断一个对象有环引用(未)
 *
 */

/** 计算一个对象层数 (未)
 *
 */

/** 对象的的扁平化
 *
 */

/** 实现 (a == 1 && a == 2 && a == 3) 为 true
 *
 */
// 方法一:
var a = {
  i: 1,
  toString: function () {
    return a.i++;
  }
};

// 方法二：
// var val = 0;
// Object.defineProperty(window, "a", {
//   get: function () {
//     return ++val;
//   }
// });

/** 实现 lazyMan 函数 (未)
 *
 */
// class _lazyMan {
//   constructor(name) {
//     this.name = name;
//   }
// }

/** 实现 add 函数 (未)
 *
 */

/** 实现一个深拷贝 (待补充)
 *
 */
function _deepCloneOne(source) {
  if (typeof source !== "object" || source == null) return source;
  let targetObj = Array.isArray(source) ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = _deepCloneOne(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/** 实现 Promise
 *
 */

const STATUS = {
  PENDING: "PENDING",
  FUFILLED: "FULFILLED",
  REJECTED: "REJECTED"
};
class _Promise {
  constructor(executor) {
    this.status = STATUS.PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = value => {
      if (this.status === STATUS.PENDING) {
        this.status = STATUS.FUFILLED;
        this.value = value;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    };
    const reject = reason => {
      if (this.status === STATUS.PENDING) {
        this.status = STATUS.REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  // FUFILLED
  then(onFufilled, onRejected) {
    // 解决 onFulfilled  和 onRejected 没有传值的问题
    onFufilled = typeof onFufilled === "function" ? onFufilled : x => x;
    // 因为错误的值要让后面访问到，所以这里也要抛出错误，不然会在之后 then 的 resolve 中捕获
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : err => {
            throw err;
          };
    // 每次调用 then 都返回一个 promise
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === STATUS.FUFILLED) {
        setTimeout(() => {
          try {
            let x = onFufilled(this.value);
            _resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.status === STATUS.REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            _resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.status === STATUS.PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFufilled(this.value);
              _resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              _resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
}
function _resolvePromise(promise2, x, resolve, reject) {
  // 自己等待自己完成是错误的实现，用一个类型错误，结束掉 promise  Promise/A+ 2.3.1
  if (promise2 === x) {
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    let called;
    try {
      // 为了判断 resolve 过的就不用再 reject 了（比如 reject 和 resolve 同时调用的时候）  Promise/A+ 2.3.3.1
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          y => {
            // 根据 promise 的状态决定是成功还是失败
            if (called) return;
            called = true;
            // 递归解析的过程（因为可能 promise 中还有 promise） Promise/A+ 2.3.3.3.1
            _resolvePromise(promise2, y, resolve, reject);
          },
          r => {
            // 只要失败就失败 Promise/A+ 2.3.3.3.2
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        // 如果 x.then 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.3.4
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

/** 实现 async/await
 *  - await 只能在 async 函数中使用, 不然会报错
 *  - async 函数返回的是一个 Promise 对象, 有无值看有无 return 值
 *  - await 后面最好是接 Promise, 虽然接其他值也能达到排队效果
 *  - async/await 作用是 用同步方式, 执行异步操作
 */
function _generatorToAsync(generatorFn) {
  return function () {
    const gen = generatorFn.apply(this, arguments); // gen有可能传参
    // 返回一个 promise
    return new Promise((resolve, reject) => {
      function go(key, arg) {
        let res;
        try {
          res = gen[key](arg); // 这里有可能会执行返回 reject 状态的 promise
        } catch (err) {
          return reject(err);
        }

        // 解构获得 value 和 done
        const { value, done } = res;
        if (done) {
          // 如果 done 为 true, 说明走完了, 进行 resolve(value)
          return resolve(value);
        } else {
          return Promise.resolve(value).then(
            val => go("next", val),
            err => go("throw", err)
          );
        }
      }
      go("next");
    });
  };
}

function fn(nums) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(nums * 2);
    }, 1000);
  });
}
function* _gen() {
  const num1 = yield fn(1);
  console.log(num1); // 2
  const num2 = yield fn(num1);
  console.log(num2); // 4
  const num3 = yield fn(num2);
  console.log(num3); // 8
  return num3;
}
// const genToAsync = _generatorToAsync(gen);
// const asyncRes = genToAsync();
// console.log(asyncRes); // Promise
// asyncRes.then(res => console.log(res)); // 8

// --------------------------------------------------- Array -----

const players = [
  { name: "科比", num: 24 },
  { name: "詹姆斯", num: 23 },
  { name: "保罗", num: 3 },
  { name: "威少", num: 0 },
  { name: "杜兰特", num: 35 }
];

/** 实现 forEach
 * - item 遍历项
 * - index 索引
 * - arr 数组本身
 */
Array.prototype._forEach = function (callBack) {
  for (let i = 0; i < this.length; i++) {
    callBack(this[i], i, this);
  }
};
// players._forEach((item, index, arr) => {
//   console.log(item, index);
// });

/** 实现 map
 * - item 遍历项
 * - index 索引
 * - arr 数组本身
 */

Array.prototype._map = function (callBack) {
  let res = [];
  for (let i = 0; i < this.length; i++) {
    res.push(callBack(this[i], i, this));
  }
  return res;
};

/** 实现 filter
 * - item 遍历项
 * - index 索引
 * - arr 数组本身
 */
