/**
 * 1.number 只要是数字相关的 整数 小数 分数 科学计数 进制数
 * typeof 检测数据类型
 */
// var a = 10;
// var b = 10.1;
// console.log(a,b,typeof a,typeof b);

/**
 * 2.string类型 字符串类型 '' ""
 */
// var a = "hello";
// var b = 'js';
// console.log(a,b,typeof a,typeof b);

/**
 * 3.boolean 布尔类型 true false
 */
// var a = true;
// var b = false;
// console.log(a,b,typeof a,typeof b);

/**
 * 4.null类型 空引用类型
 * typeof null --->object
 */
// var a = null;
// console.log(a,typeof a);

/**
 * 5.undefined 未定义类型
 */
// var a;
// var b = undefined;
// console.log(a,b,typeof a,typeof b);

/**
 * 6.symbol 独一无二的值
 */
// var a = Symbol('hello');
// console.log(a,typeof a);

/**
 * 7.bigint 处理超出number精度范围
 */
// var a = Number.MAX_VALUE;
// var b = 100;
// console.log(a * b);//Infinity

var a = BigInt(Number.MAX_VALUE);
var b = 100n;
console.log(a * b);