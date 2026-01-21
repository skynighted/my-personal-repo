/**
 * 是有序列表，存放多个值的集合
 * 特点：1.存放值可以是任意数据类型
 * 2.数组的大小可以动态调整的
 * 3.length可读可写
 */
// 数组创建 使用字面量创建
var arr = [10,true,null,undefined,"hello",{name:'larry'}];
// console.log(a);
// console.log(a.length,'未修改前');
// a.length = 5;
// console.log(a,'修改后');


// 数组访问 arr[index] index 下标从0开始 访问数据元素
// console.log(arr[2]);
// console.log(arr[arr.length - 1]);

/** 
 * 常用的数组api
 * join toString 将数组转为字符串
*/
// console.log(arr.toString(),typeof arr.toString());
// console.log(arr.join('-'));

/** 
 * 迭代方法
 * every
 * 参数：函数（item,index,arr）
 * 返回值：true false 全部都返回true
*/

var arr1 = [10,20,30,40,50];
var res = arr1.every(function(item,index,arr){
    // item是数组每个元素 index就是数组元素对应的索引 arr就是数组元素本身
    // console.log(item,index,arr);
    return item > 10;
});
console.log(res);

/** 
 * some方法
 * 参数：函数（item,index,arr）
 * 返回值：true false 有一个数组元素符合返回true 全部都不符合返回false
*/
var res2 = arr1.some(function(item,index,arr){
    console.log('some');
    return item > 20;
});
console.log(res2);

/** 
 * map方法 映射 对每一个数组元素进行操作
 * 参数：函数（item,index,arr）
 * 返回值：操作后的新数组
*/
var res3 = arr1.map(function(item,index,arr){
    return item * 5;
});
console.log(res3,arr1 == res3);

/** 
 * filter方法 过滤符合条件的数组元素
 * 参数：函数（item,index,arr）
 * 返回值：返回符合条件的数组元素组成的新数组
*/
var res4 = arr1.filter(function(item,index,arr){
    return item > 30;
});
console.log(res4,arr1 == res4);

/** 
 * forEach方法 迭代遍历方法 主要的作用就是遍历所有的数组元素
 * 参数：函数（item,index,arr）
 * 没有返回值
*/
var res5 = arr1.forEach(function(item,index,arr){
    console.log(item,index,arr);
    return 10;
});

// 遍历数组元素 for循环或者for ... in 循环
for(let i = 0;i < arr1.length;i++){
    console.log(arr1[i],'for循环');
}
for(let index in arr1){
    console.log(index,arr1[index]);
}