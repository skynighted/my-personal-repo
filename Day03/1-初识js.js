// 声明一个变量 ctrl + j / ctrl + shift + ` 打开终端
/**
 * 进入目录 cd 目录名
 * 
 * 运行js文件 node js文件名
 */
var a = 10;
// 控制台输出a变量
console.log(a);

var a = "hello";
console.log(a);

console.log(b);
var b = 10;

/**
 * 代码解析顺序：
 * 1.var声明的变量会进行变量提升
 * var b;
 * 2.按照代码顺序往下执行
 * console.log(b);//undefined
 * 3.给b变量赋值
 * b = 10;
 */