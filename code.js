/*
 * @Author: 李思豪
 * @Date: 2022-07-04 13:40:14
 * @LastEditTime: 2022-07-04 16:33:41
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
