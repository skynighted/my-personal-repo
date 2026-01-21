/**
 * 封装可复用的代码 多次调用函数
 */
// 函数声明 function 函数名(形式参数){}
// 函数调用 函数名(实际参数)

function add(a,b){
    // 形式参数专门接受实参 a--->10 b--->20
    return a + b;
}
var res = add(10,20);
var res1 = add(30,40);
console.log(res,res1);

// es6 箭头函数
/**
 * let 函数名 = ()=>{}
 */
let foo = (a,b)=>{
    return a + b;
}
var res2 = foo(40,50);
console.log(res2);

// 对象扩展 对象属性简写
let age = 20;
let obj = {
    name:'terry',
    // age:age
    // 如果属性名和变量名一致 可以简写
    age,
    // say:function(){
    //     console.log('hello terry');
    // }
    // say:()=>{
    //     console.log('hello terry');
    // }
    // 方法可以简写
    say(){
        console.log('hello terry');
    }
}
obj.say();