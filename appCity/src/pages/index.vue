<template>
    <div>
        <!-- 头部开始 -->
         <div class="header">
            智慧城市大气环境监测系统
         </div>
        <!-- 头部结束 -->
        <!-- 体部开始 -->
         <div class="content">
            <div class="top">
                <div class="left">
                    <div class="charts">
                        <!-- 组件使用 -->
                        <Left1></Left1>
                    </div>
                    <div class="charts">
                        <Left2></Left2>
                    </div>
                </div>
                <div class="center">
                    <Map></Map>
                </div>
                <div class="right">
                    <div class="charts">
                        <Right1></Right1>
                    </div>
                    <div class="charts">
                        <Right2></Right2>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="charts">
                    <Bottom1></Bottom1>
                </div>
                <div class="charts">
                    <Bottom2></Bottom2>
                </div>
                <div class="charts">
                    <Bottom3></Bottom3>
                </div>
                <div class="charts">
                    <Bottom4></Bottom4>
                </div>
            </div>
         </div>
        <!-- 体部结束 -->
    </div>
</template>
<script setup>
    // 引入全部组件
    import Left1 from './components/Left1.vue';
    import Left2 from './components/Left2.vue';
    import Right1 from './components/Right1.vue';
    import Right2 from './components/Right2.vue';
    import Bottom1 from './components/Bottom1.vue';
    import Bottom2 from './components/Bottom2.vue';
    import Bottom3 from './components/Bottom3.vue';
    import Bottom4 from './components/Bottom4.vue';
    import map from './components/map.vue';
import Map from './components/map.vue';
</script>
<!-- scoped局部作用域 css样式只在当前页面生效 -->
<style lang="less" scoped>
.header{
    height: 60px;
    background-image: url(../assets/layout/header.png);
    background-size: 100% 200px;
    color: white;
    text-align: center;
    line-height: 45px;
    font-size: 28px;
    font-family: "楷体";
}
.content{
    // 高度
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    .top{
        flex: 2;
        display: flex;
        .left,
        .right{
            flex: 1;
            display: flex;
            flex-direction: column;
            // &表示直接父元素
            &>div{
                flex: 1;
            }
        }
        .center{
            flex: 2;
            background-image: url(../assets/layout/chart_center_box_bg.png);
            background-size: 100% 100%;
            margin: 0px 5px 10px 5px;
        }
    }
    .bottom{
        flex: 1;
        display: flex;
        &>div{
            flex: 1;
        }
    }
    // 八个图表的样式
    .charts{
        background-image: url(../assets/layout/chart_box_bg.png);
        background-size: 100% 100%;
        margin: 0px 5px 10px 5px;
        padding: 10px 0 0 10px;
        box-sizing: border-box;
    }
}
</style>