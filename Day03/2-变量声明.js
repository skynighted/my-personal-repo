/**
 * var声明变量特点
 * 1.会进行变量提升
 *      console.log(a);//undefined
 *      var a = 10;
 * 2.可以重复声明
        var a = 10;
        var a = "hello";
 * 3.不存在块级作用域
        if(true){
            var a = 10;
        }
        console.log(a);
 */
/**
 * let声明变量特点：
 * 1.不会进行变量提升
 *      console.log(a);//Cannot access 'a' before initialization
        let a = 10; 
    2.不可以进行重复声明
        let a = 10;
        let a = true;//报错 重复声明变量
    3.存在块级作用域
    if(true){
        let a = "hello";
    }
    console.log(a);
 */

/**
 * const声明变量特点
 * 1.不会进行变量提升
 *      console.log(a);//Cannot access 'a' before initialization
        const a = 10;
    2.不可以重复声明
    const a = 10;
    const a = 20;//报错
    3.存在块级作用域
    if(true){
        let a = "hello";
    }
    console.log(a);
    4.const声明变量必须进行初始化 初始化后值不可以更改 所以一般用于声明变量
    const a;//报错
 */
