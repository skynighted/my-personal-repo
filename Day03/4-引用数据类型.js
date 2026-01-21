/**
 * Object 对象
 */
//1.对象创建方式
var obj = {
    name:'terry',
    age:20,
}
// 对象访问 点访问法 中括号访问法
console.log(obj.name);
console.log(obj['age']);

// 修改属性 如果修改属性不存在则新增属性
obj.gender = 'male';
obj['weight'] = '60KG';
console.log(obj);

// 删除对象属性
delete obj.age;
console.log(obj,'删除后');

// 遍历对象中属性 for in循环遍历
for(var key in obj){
    console.log(key,"：" + obj[key]);
}


// 对象创建第二种方式 构造函数
var obj1 = new Object();
obj1.name = 'larry';
obj1.age = 30;
console.log(obj1);
