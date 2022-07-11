/*
 * @Author: 李思豪
 * @Date: 2022-07-04 13:40:14
 * @LastEditTime: 2022-07-11 15:38:18
 * @Description: file content
 * @LastEditors: 李思豪
 */

/**
 * 实现原生 AJAX
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

/**
 * 实现 new 关键字
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

/**
 * 实现 instanceof 关键字
 * @param {*} target
 * @param {*} origin
 * @returns
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

/**
 * 实现防抖函数
 * @param {*} fn
 * @param {*} delay
 * @returns
 */
function _debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    if (timer) clearInterval(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 实现节流函数
 * @param {*} fn
 * @param {*} delay
 * @returns
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

/**
 * 数组去重
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

/**
 * 使用 setTimeout  实现 setInterval
 * @param {*} fn
 * @param {*} delay
 */
function _setInterval(fn, delay) {
  let timer = null;
  const interval = () => {
    fn();
    timer = setTimeout(interval, delay);
  };
  _setTimeout(interval, delay)
  return {
    cancel : () => {
      clearInterval(timer);
    }
  }
}

/**
 * 使用 setInterval 实现 setTimeout
 * @param {*} fn
 * @param {*} delay
 */
function _setTimeout(fn, delay) {
  const timer = setInterval(() => {
    fn();
    clearInterval(timer);
  }, delay);
}

/**
 * 实现一个 compose 函数
 * @param  {...any} fns
 * @returns
 */
function _compose(...fns) {
  if (fns.length === 0) arg => arg;
  if (fns.length === 1) fns[0];
  return fns.reduce((pre, cur) => arg => pre(cur(arg)));
}

/**
 * 实现一个柯里化函数
 * @param {*} fn
 * @param {*} args
 * @returns
 */
function _curring(fn, ...args) {
  args = Array.isArray(args) ? args :[...args]
  const inner = (arr = []) => {
    args.push(...arr);
    return args.length >= fn.length ? fn(...args) : (...args) => inner(args);
  };
  return inner();
}


/**
 * 实现一个 LRU缓存函数
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

/**
 * 实现发布订阅
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

/**
 * 实现 JSON.parse (待补充)
 * @param {*} json
 * @returns
 */
function _parse(json) {
  return eval(`(${json})`);
}

/**
 * 将 DOM 转换成树结构对象 (待补充)
 * @param {*} dom
 * @returns
 */
function _domTree(dom) {
  let obj = {};
  obj.tag = dom.tagName;
  obj.children = [];
  dom.childNodes.forEach(child => obj.children.push(_domTree(child)));
  return obj;
}

/**
 * 将树结构转换为 DOM (未验证)
 * @param {*} vnode
 * @returns
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

/**
 * 判断一个对象有环引用
 * @param {*} obj
 * @returns
 */
function _cycleDetector(obj) {
  function findLoop(target, src) {
    // 源数组,并将自身传入
    const source = src.slice().concat([target]);
    for (const key in target) {
      // 如果是对象才需要判断
      if (typeof target[key] === "object" && target[key] !== null) {
        // 如果在源数组中找到 || 递归查找内部属性找到相同
        if (source.indexOf(target[key]) > -1 || findLoop(target[key], source)) {
          return true;
        }
      }
    }
    return false;
  }
  // 如果传入值是对象，则执行判断，否则返回false
  return typeof obj === "object" ? findLoop(obj, []) : false;
}
// eg:
// var obj = {
//   a: {
//     c: [1, 2]
//   },
//   b: 1
// };
// obj.a.c.d = obj;
// console.log(_cycleDetector(obj)); // true

/**
 * 计算一个对象层数
 * @param {*} obj
 * @returns
 */
function _loopGetLevel(obj) {
  var res = 1;
  (function computedLevel(obj, level = 0) {
    if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          computedLevel(obj[key], level + 1);
        } else {
          res = ++level > res ? level : res;
        }
      }
    } else {
      res = level > res ? level : res;
    }
  })(obj);
  return res;
}
// const obj = {
//   a: { b: [1] },
//   c: { d: { e: { f: 1 } } }
// };
// console.log(_loopGetLevel(obj)); // 4

/** 
 * 对象的的扁平化
 */
function _objFlatter(obj) {
  let isObj = function (obj) {
    return typeof obj === "object" && obj !== null;
  };
  if (!isObj(obj)) return;
  const res = {};
  (function dfs(cur, pre = "") {
    if (isObj(cur)) {
      if (Array.isArray(cur)) {
        cur.forEach((item, index) => {
          dfs(item, `${pre}[${index}]`);
        });
      } else {
        for (let key in cur) {
          dfs(cur[key], `${pre}${pre ? "." : ""}${key}`);
        }
      }
    } else {
      res[pre] = cur;
    }
  })(obj);
  return res;
}
// const obj = {
//   a: {
//     b: 1,
//     c: 2,
//     d: { e: 5 }
//   },
//   b: [1, 3, { a: 2, b: 3 }],
//   c: 3
// };

// console.log(_objFlatter(obj));

/**
 * 实现 (a == 1 && a == 2 && a == 3) 为 true
 */
// 方法一:
var toNum = {
  i: 1,
  toString: function () {
    return toNum.i++;
  }
};

// 方法二：
var toVal = 0;
Object.defineProperty(this, "a", {
  get: function () {
    return ++toVal;
  }
});

/** 
 * 实现 lazyMan 函数
 */
class _LazyMan {
  constructor(name) {
    this.ontaskCallbacks = [];

    const task = () => {
      console.log(`Hi! This is ${name}`);
      this.next();
    };

    this.ontaskCallbacks.push(task);

    setTimeout(() => {
      this.next();
    }, 0);
  }
  next() {
    setTimeout(() => {
      const task = this.ontaskCallbacks.shift();
      task && task();
    }, 0);
  }
  sleep(time) {
    this.sleepWrapper(time, false);
    return this;
  }
  sleepFirst(time) {
    this.sleepWrapper(time, true);
    return this;
  }
  sleepWrapper(time, first) {
    const task = () => {
      setTimeout(() => {
        console.log(`Wake up after ${time}`);
        this.next();
      }, time * 1000);
    };
    if (first) {
      this.ontaskCallbacks.unshift(task);
    } else {
      this.ontaskCallbacks.push(task);
    }
  }
  eat(food) {
    const task = () => {
      console.log(`Eat ${food}`);
      this.next();
    };
    this.ontaskCallbacks.push(task);
    return this;
  }
}
// 测试
const lazyMan = name => new _LazyMan(name);
lazyMan("Hank");

// lazyMan("Hank").sleep(1).eat("dinner");

// lazyMan("Hank").eat("dinner").eat("supper");

// lazyMan("Hank").eat("supper").sleepFirst(5);

/**
 * 实现 add 函数
 */
function _add(...args1) {
  let allArgs = [...args1];
  function fn(...args2) {
    if (!args2.length) return fn.toString();
    allArgs = [...allArgs, ...args2];
    return fn;
  }
  fn.toString = function () {
    return allArgs.reduce((pre, next) => pre + next);
  };
  return fn;
}
// 测试
// console.log(add(1)(2)(3)());
// console.log(add(1, 2)(3)());

/**
 * 实现一个深拷贝 (待补充)
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

/**
 * promise.resolve
 * @param {*} promise
 * @returns
 */
_Promise.resolve = function (promise) {
  if (promise instanceof Promise) {
    return promise;
  }
  return new Promise(resolve => {
    resolve(promise);
  });
};

/**
 * Promise.reject
 * @param {*} promise
 * @returns
 */
_Promise.reject = function (promise) {
  return new Promise((_, reject) => {
    reject(promise);
  });
};

/** Promise.all
 * - 接收一个Promise数组，数组中如有非Promise项，则此项当做成功
 * - 如果所有Promise都成功，则返回成功结果数组
 * - 如果有一个Promise失败，则返回这个失败结果
 */

_Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let result = [];
    let count = 0;
    function processData(i, val) {
      result[i] = val;
      if (++count === promises.length) resolve(result);
    }
    promises.forEach((p, i) => {
      if (p instanceof Promise) {
        p.then(res => {
          processData(i, res);
        }, reject);
      } else {
        processData(i, p);
      }
    });
  });
};

/**
 * Promise.race
 * @param {*} promises
 * @returns
 * - 接收一个Promise数组，数组中如有非Promise项，则此项当做成功
 * - 哪个Promise最快得到结果，就返回那个结果，无论成功失败
 */
_Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => {
      if (p instanceof Promise) {
        Promise.resolve(p).then(resolve).catch(reject);
      } else {
        resolve(promises);
      }
    });
  });
};

/**
 * Promise.allSettled
 * @param {*} promises
 * @returns
 * - 接收一个Promise数组，数组中如有非Promise项，则此项当做成功
 * - 把每一个Promise的结果，集合成数组，返回
 */
_Promise.allSettled = function (promises) {
  return new Promise((resolve, _) => {
    let count = 0;
    let result = [];
    let len = promises.length;
    if (len == 0) resolve([]);

    const addData = (status, value, i) => {
      result[i] = { status, value };
      count++;
      if (count === len) resolve(result);
    };

    promises.forEach((p, i) => {
      if (p instanceof Promise) {
        Promise.resolve(p)
          .then(res => {
            addData("fulfilled", res, i);
          })
          .catch(e => {
            addData("rejected", e, i);
          });
      } else {
        addData("fulfilled", p, i);
      }
    });
  });
};

/**
 * Promise.any
 * @param {*} promises
 * @returns
 * - 接收一个Promise数组，数组中如有非Promise项，则此项当做成功
 * - 如果有一个Promise成功，则返回这个成功结果
 * - 如果所有Promise都失败，则报错
 */
_Promise.any = function (promises) {
  return new Promise((resolve, reject) => {
    let count = 0;
    promises.forEach(p => {
      if (p instanceof Promise) {
        Promise.resolve(p)
          .then(res => {
            resolve(res);
          })
          .catch(_ => {
            count++;
            if (count === promises.length) {
              reject(new Error("All promises were rejected"));
            }
          });
      } else {
        resolve(p);
      }
    });
  });
};

/**
 * Promise.finally
 * @param {*} onFinished
 * @returns
 * - 接收一个回调函数，但无参数接收
 * - 无论成功失败状态，都会执行finally
 */
_Promise.finally = function (onFinished) {
  return this.then(val => {
    onFinished();
    return val;
  }).catche(err => {
    onFinished();
    return err;
  });
};

/**
 * 实现限制并发的Promise调度器
 */
class _Scheduler {
  constructor(limit) {
    this.queue = [];
    this.maxCount = limit;
    this.runCounts = 0;
  }
  add(time, order) {
    const promiseCreator = () => {
      return new Promise((resolve, _) => {
        setTimeout(() => {
          console.log(order);
          resolve();
        }, time);
      });
    };
    this.queue.push(promiseCreator);
  }
  taskStart() {
    for (let i = 0; i < this.maxCount; i++) {
      this.request();
    }
  }
  request() {
    if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
      return;
    }
    this.runCounts++;
    this.queue
      .shift()()
      .then(() => {
        this.runCounts--;
        this.request();
      });
  }
}
// const scheduler = new Scheduler(2);
// const addTask = (time, order) => {
//   scheduler.add(time, order);
// };
// addTask(1000, "1");
// addTask(500, "2");
// addTask(300, "3");
// addTask(400, "4");
// scheduler.taskStart();

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

/**
 * forEach
 * 对数组的每个元素执行一次给定的函数。
 * @param {*} callBack
 * 描述：
 *- this[i] 数组中正在处理的当前元素。
 *- i(可选) 数组中正在处理的当前元素的索引。
 *- array(可选) 方法正在操作的数组。
 */
Array.prototype._forEach = function (callBack) {
  for (let i = 0; i < this.length; i++) {
    callBack(this[i], i, this);
  }
};

/**
 * map
 * @param {*} callBack
 * @returns 创建一个新数组，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成。
 * 描述：
 *- this[i] 数组中正在处理的当前元素。
 *- i(可选) 数组中正在处理的当前元素的索引。
 *- array(可选) 调用了 map 的数组本身。
 */
Array.prototype._map = function (callBack) {
  let res = [];
  for (let i = 0; i < this.length; i++) {
    res.push(callBack(this[i], i, this));
  }
  return res;
};

/**
 * filter
 * @param {*} callback
 * @returns 创建一个新数组，其包含通过所提供函数实现的测试的所有元素。
 * 描述：
 *- this[i] 数组中正在处理的当前元素。
 *- i(可选) 数组中正在处理的当前元素的索引。
 *- array(可选) 调用了 filter 的数组本身。。
 */
Array.prototype._filter = function (callback) {
  let res = [];
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this) && res.push(this[i]);
  }
  return res;
};

/** 实现 every
 * - item 遍历项
 * - index 索引
 * - arr 数组本身
 */
Array.prototype._every = function (callback) {
  let flag = true;
  for (let i = 0; i < this.length; i++) {
    flag = callback(this[i], i);
    if (!flag) break;
  }
  return flag;
};

/** 实现 some
 * - item 遍历项
 * - index 索引
 * - arr 数组本身
 */
Array.prototype._some = function (callback) {
  let flag = false;
  for (let i = 0; i < this.length; i++) {
    let flag = callback(this[i], i, this);
    if (flag) break;
  }
  return flag;
};

/**
 * reduce
 * @param {*} callback
 * @param  {...any} args
 * @returns 对数组中的每个元素按序执行一个由您提供的 reducer 函数，每一次运行 reducer 会将先前元素的计算结果作为参数传入，最后将其结果汇总为单个返回值。
 * 描述：
 *callbackfn 应是一个接受四个参数的函数，reduce 对于数组中第一个元素之后的每一个元素，按升序各调用一次回调函数。callbackfn 被调用时会传入四个参数：
 *- previousValue（前一次调用 callbackfn 得到的返回值）
 *- currentValue（数组中正在处理的元素）
 *- currentIndex（数组中正在处理的元素的索引）
 *- array 被遍历的对象
 */
Array.prototype._reduce = function (callback, ...args) {
  let start = 0,
    pre;
  if (args.length) {
    pre = args[0];
  } else {
    pre = this[0];
    start = 1;
  }
  for (let i = start; i < this.length; i++) {
    pre = callback(pre, this[i], i, this);
  }
  return pre;
};

/** findIndex
 * - item 遍历项
 * - index 索引
 * - arr 数组本身
 */
Array.prototype._findIndex = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      return i;
    }
  }
  return -1;
};

/** find
 * - item 遍历项
 * - index 索引
 * - arr 数组本身
 */
Array.prototype._find = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      return this[i];
    }
  }
  return undefined;
};

/** fill
 * - initValue 填充的值
 * - start 开始索引,默认为 0
 * - end 结束索引,默认 length
 */
Array.prototype._fill = function (value, start = 0, end) {
  end = end || this.length;
  for (let i = start; i < end; i++) {
    this[i] = value;
  }
  return this;
};

/** includes (未)
 *
 */
Array.prototype._includes = function (value, start = 0) {
  if (start < 0) start = this.length + start;
  const isNaN = Number.isNaN(value);
  for (let i = start; i < this.length; i++) {
    if (this[i] === value || (isNaN && Number.isNaN(this[i]))) {
      return true;
    }
  }
  return false;
};

/**
 * join
 * @param {*} separator
 * @returns 一个所有数组元素连接的字符串。如果 arr.length 为 0，则返回空字符串。
 * 描述：
 * 所有的数组元素被转换成字符串，再用一个分隔符将这些字符串连接起来。
 *- separator 指定一个字符串来分隔数组的每个元素。如果需要，将分隔符转换为字符串。如果缺省该值，数组元素用逗号（,）分隔。如果separator是空字符串 ("")，则所有元素之间都没有任何字符。
 */
Array.prototype._join = function (separator) {
  let str = "";
  for (let i = 0; i < this.length; i++) {
    str = i === 0 ? `${str}${this[i]}` : `${str}${separator}${this[i]}`;
  }
  return separator;
};

/**
 * flat (待完善)
 * @param {*} depth
 * @returns 一个包含将数组与子数组中所有元素的新数组。
 * 描述：
 * 会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。
 *- depth 指定要提取嵌套数组的结构深度，默认值为 1。
 */
Array.prototype._flat = function (depth = 1) {
  console.log("this", this);
  let arr = this;
  let i = 0;
  while (this.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
    i++;
    if (i >= depth) break;
  }
  return arr;
};

/**
 * splice
 * @param {*} start 指定修改的开始位置（从 0 计数）。
 * @param {*} deleteCount 表示要移除的数组元素的个数。
 * @param  {...any} values 要添加进数组的元素，从start 位置开始。如果不指定，则 splice() 将只删除数组元素。
 * @returns
 */
Array.prototype.splice = function (startIndex, deleteCount, ...addElements) {
  let argumentsLen = arguments.length;
  let array = Object(this);
  let len = array.length;
  let deleteArr = new Array(deleteCount);

  const sliceDeleteElements = (array, startIndex, deleteCount, deleteArr) => {
    for (let i = 0; i < deleteCount; i++) {
      let index = startIndex + i;
      if (index in array) {
        let current = array[index];
        deleteArr[i] = current;
      }
    }
  };
  const movePostElements = (
    array,
    startIndex,
    len,
    deleteCount,
    addElements
  ) => {
    // 如果添加的元素和删除的元素个数相等，相当于元素的替换，数组长度不变，被删除元素后面的元素不需要挪动
    if (deleteCount === addElements.length) return;
    // 如果添加的元素和删除的元素个数不相等，则移动后面的元素
    else if (deleteCount > addElements.length) {
      // 删除的元素比新增的元素多，那么后面的元素整体向前挪动
      // 一共需要挪动 len - startIndex - deleteCount 个元素
      for (let i = startIndex + deleteCount; i < len; i++) {
        let fromIndex = i;
        // 将要挪动到的目标位置
        let toIndex = i - (deleteCount - addElements.length);
        if (fromIndex in array) {
          array[toIndex] = array[fromIndex];
        } else {
          delete array[toIndex];
        }
      }
      // 注意注意！这里我们把后面的元素向前挪，相当于数组长度减小了，需要删除冗余元素
      // 目前长度为 len + addElements - deleteCount
      for (let i = len - 1; i >= len + addElements.length - deleteCount; i--) {
        delete array[i];
      }
    } else if (deleteCount < addElements.length) {
      // 删除的元素比新增的元素少，那么后面的元素整体向后挪动
      // 思考一下: 这里为什么要从后往前遍历？从前往后会产生什么问题？
      for (let i = len - 1; i >= startIndex + deleteCount; i--) {
        let fromIndex = i;
        // 将要挪动到的目标位置
        let toIndex = i + (addElements.length - deleteCount);
        if (fromIndex in array) {
          array[toIndex] = array[fromIndex];
        } else {
          delete array[toIndex];
        }
      }
    }
  };
  const computeStartIndex = (startIndex, len) => {
    // 处理索引负数的情况
    if (startIndex < 0) {
      return startIndex + len > 0 ? startIndex + len : 0;
    }
    return startIndex >= len ? len : startIndex;
  };
  const computeDeleteCount = (startIndex, len, deleteCount, argumentsLen) => {
    // 删除数目没有传，默认删除startIndex及后面所有的
    if (argumentsLen === 1) return len - startIndex;
    // 删除数目过小
    if (deleteCount < 0) return 0;
    // 删除数目过大
    if (deleteCount > len - deleteCount) return len - startIndex;
    return deleteCount;
  };
  startIndex = computeStartIndex(startIndex, len);
  deleteCount = computeDeleteCount(startIndex, len, deleteCount, argumentsLen);
  // 判断 sealed 对象和 frozen 对象, 即 密封对象 和 冻结对象
  if (Object.isSealed(array) && deleteCount !== addElements.length) {
    throw new TypeError("the object is a sealed object!");
  } else if (
    Object.isFrozen(array) &&
    (deleteCount > 0 || addElements.length > 0)
  ) {
    throw new TypeError("the object is a frozen object!");
  }
  // 拷贝删除的元素
  sliceDeleteElements(array, startIndex, deleteCount, deleteArr);
  // 移动删除元素后面的元素
  movePostElements(array, startIndex, len, deleteCount, addElements);
  // 插入新元素
  for (let i = 0; i < addElements.length; i++) {
    array[startIndex + i] = addElements[i];
  }
  array.length = len - deleteCount + addElements.length;
  return deleteArr;
};

// --------------------------------------------------- Object -----

/**
 * entries
 * @param {*} obj
 * @returns 返回一个新的Array Iterator对象，该对象包含数组中每个索引的键/值对。
 */
Object.prototype._entries = function (obj) {
  const res = [];
  for (let key in obj) {
    Object.prototype.hasOwnProperty.call(obj, key) && res.push([key, obj[key]]);
  }
  return res;
};

/**
 * fromEntries
 * @param {*} arr
 * @returns
 * 描述：
 * 把键值对列表转换为一个对象。
 */
Object.prototype.fromEntries = function (arr) {
  const obj = {};
  for (let i = 0; i < arr.length; i++) {
    const [key, value] = arr[i];
    obj[key] = value;
  }
  return obj;
};

/**
 * keys
 * @param {*} obj 要返回其枚举自身属性的对象。
 * @returns 一个表示给定对象的所有可枚举属性的字符串数组。
 * 描述：
 * Object.keys 返回一个所有元素为字符串的数组，其元素来自于从给定的 object 上面可直接枚举的属性。这些属性的顺序与手动遍历该对象属性时的一致。
 */
Object.prototype._keys = function (obj) {
  const res = [];
  for (let key in obj) {
    Object.prototype.hasOwnProperty.call(obj, key) && res.push(key);
  }
  return res;
};

/**
 * values
 * @param {*} obj 被返回可枚举属性值的对象。
 * @returns 一个包含对象自身的所有可枚举属性值的数组。
 * 描述：
 * Object.values()返回一个数组，其元素是在对象上找到的可枚举属性值。属性的顺序与通过手动循环对象的属性值所给出的顺序相同。
 */
Object.prototype._values = function (obj) {
  const values = [];
  for (let key in obj) {
    Object.prototype.hasOwnProperty.call(obj, key) && values.push(obj[key]);
  }
  return values;
};

/**
 * instanceOf
 * @param {*} parent
 * @param {*} child
 * @returns
 * 描述：
 * 检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
 */
Object.prototype._instanceOf = function (parent, child) {
  const pp = parent.prototype;
  let cp = child._proto_;
  while (cp) {
    if (cp === pp) {
      return true;
    }
    cp = cp._proto_;
  }
  return false;
};

/**
 * Object.is
 * @param {*} x 被比较的第一个值。
 * @param {*} y 被比较的第二个值。
 * @returns 一个布尔值，表示两个参数是否是同一个值。
 * 描述：
 * Object.is() 方法判断两个值是否为同一个值，如果满足以下任意条件则两个值相等：NaN === NaN /  +0!==-0
 */
Object.prototype._is = function (x, y) {
  if (x === y) {
    // 防止 -0 和 +0
    return x !== 0 || 1 / x === 1 / y;
  }
  // 防止NaN
  return x !== x && y !== y;
};

/**
 * Object.assign
 * @param {*} target 目标对象，接收源对象属性的对象，也是修改后的返回值。
 * @param  {...any} args 源对象，包含将被合并的属性。
 * @returns 目标对象。
 * 描述：
 * 所有可枚举（Object.propertyIsEnumerable() 返回 true）和自有（Object.hasOwnProperty() 返回 true）属性从一个或多个源对象复制到目标对象，返回修改后的对象。
 */
Object.prototype._assign = function (target, ...args) {
  if (target === null || target === undefined) {
    throw new TypeError("Cannot convert undefined or null to object");
  }
  target = Object(target);
  for (let nextObj of args) {
    for (let key in nextObj) {
      Object.prototype.hasOwnProperty.call(nextObj, key) &&
        (target[key] = nextObj[key]);
    }
  }
  return target;
};

// --------------------------------------------------- Function -----

/**
 * call
 * @param {*} asThis(可选) 在 function 函数运行时使用的 this 值。
 * @param {*} args(可选) 指定的参数列表。
 * @returns 使用调用者提供的 this 值和参数调用该函数的返回值。若该方法没有返回值，则返回 undefined。
 * 描述：
 * call() 允许为不同的对象分配和调用属于一个对象的函数/方法。
 * call() 提供新的 this 值给当前调用的函数/方法。你可以使用 call 来实现继承：写一个方法，然后让另外一个新的对象来继承它（而不是在新对象中再写一次这个方法）。
 */
Function.prototype._callES5 = function (asThis) {
  asThis = asThis || Window;
  var uniqueId = "00" + Math.random();
  if (asThis[uniqueId]) {
    uniqueId = "00" + Math.random();
  }
  asThis[uniqueId] = this;
  var args = [];
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push("arguments[" + i + "]");
  }
  var res = eval("asThis[uniqueId](" + args + ")");
  delete asThis[uniqueId];
  return res;
};

Function.prototype._callES6 = function (asThis, ...args) {
  let uniqueId = Symbol("uniqueId");
  asThis[uniqueId] = this;
  let res = asThis[uniqueId](...args);
  delete asThis[uniqueId];
  return res;
};

/**
 * apply
 * @param {*} asThis 在 func 函数运行时使用的 this 值。
 * @param {*} arr 一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 func 函数。
 * @returns 调用有指定 this 值和参数的函数的结果。
 */
Function.prototype._applyES5 = function (asThis, arr) {
  asThis = asThis || Window;
  var uniqueId = "00" + Math.random();
  if (asThis[uniqueId]) {
    uniqueId = "00" + Math.random();
  }
  asThis[uniqueId] = this;

  var args = [];
  var result = null;
  if (!arr) {
    result = asThis[uniqueId]();
  } else {
    for (var i = 0; i < arr.length; i++) {
      args.push("arr[" + i + "]");
    }
    result = eval("asThis[uniqueId](" + args + ")");
  }
  delete asThis[uniqueId];
  return result;
};

Function.prototype._applyES6 = function (asThis, arr = []) {
  let uniqueId = Symbol("uniqueId");
  asThis[uniqueId] = this;
  let res = asThis[uniqueId](arr);
  delete asThis[uniqueId];
  return res;
};

/**
 * bind
 * @param {*} asThis 调用绑定函数时作为 this 参数传递给目标函数的值。
 * @param {*} args 当目标函数被调用时，被预置入绑定函数的参数列表中的参数。
 * @returns 返回一个原函数的拷贝，并拥有指定的 this 值和初始参数。
 * 描述：
 * bind() 函数会创建一个新的绑定函数（bound function，BF）。绑定函数是一个 exotic function object（怪异函数对象，ECMAScript 2015 中的术语），它包装了原函数对象。调用绑定函数通常会导致执行包装函数。
 */
Function.prototype._bindES5 = function (asThis) {
  // 根据MDN的官方建议需要加上这一条,检测一下数据类型
  if (typeof this !== "function") {
    //不是函数不能调用bind方法
    throw new Error(
      "Function.prototype.bind - what is trying to be bound is not callable"
    );
  }
  var _this = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fNop = function () {};
  var fNnc = function () {
    // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
    // 以上面的是 demo 为例，如果改成 `this instanceof fNnc ? null : asThis`，实例只是一个空对象，将 null 改成 this ，实例会具有 habit 属性
    // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 asThis
    _this.apply(
      this instanceof fNop ? this : asThis,
      args.concat(Array.prototype.splice.call(arguments, 0))
    );
  };
  // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
  fNop.prototype = this.prototype;
  fNnc.prototype = new fNop();
  return fNnc;
};

Function.prototype._bindES6 = function (asThis, ...args) {
  const _this = this;
  return function (...arg) {
    return _this.apply(asThis, ...args, ...arg);
  };
};

// --------------------------------------------------- String -----

/**
 * slice
 * @param {*} start 从该索引（以 0 为基数）处开始提取原字符串中的字符。
 * @param {*} end 可选。在该索引（以 0 为基数）处结束提取字符串。
 * @returns 返回一个从原字符串中提取出来的新字符串
 * 描述：
 * 提取某个字符串的一部分，并返回一个新的字符串，且不会改动原字符串。
 */
String.prototype._slice = function (start = 0, end) {
  start = start < 0 ? this.length + start : start;
  end = !end && end !== 0 ? this.length : end;
  if (start >= end) return "";
  let str = "";
  for (let i = start; i < end; i++) {
    str += this[i];
  }
  return str;
};

/**
 * substring
 * @param {*} start 需要截取的第一个字符的索引，该索引位置的字符作为返回的字符串的首字母。
 * @param {*} end 可选。一个 0 到字符串长度之间的整数，以该数字为索引的字符不包含在截取的字符串内。
 * @returns 包含给定字符串的指定部分的新字符串。
 * 描述：
 *  - 如果 indexStart 等于 indexEnd，substring 返回一个空字符串。
 *  - 如果省略 indexEnd，substring 提取字符一直到字符串末尾。
 *  - 如果任一参数小于 0 或为 NaN，则被当作 0。
 *  - 如果任一参数大于 stringName.length，则被当作 stringName.length。
 *  - 如果 indexStart 大于 indexEnd，则 substring 的执行效果就像两个参数调换了一样。见下面的例子。
 */
String.prototype._substring = function (start = 0, end) {
  start = isNaN(start) || start < 0 ? 0 : start;
  end = isNaN(end) || end < 0 ? 0 : end;
  if (start >= end) [start, end] = [end, start];
  let str = "";
  for (let i = start; i < end; i++) {
    str += this[i] ? this[i] : "";
  }
  return str;
};

