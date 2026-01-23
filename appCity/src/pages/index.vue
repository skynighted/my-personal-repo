<template>
    <div>
        <div class="header">智慧城市大气环境监测系统</div>
        <div class="content">
            <div class="top">
                <div class="left">
                    <div class="charts">
                        <Left1 />
                    </div>
                    <div class="charts">
                        <Left2 />
                    </div>
                </div>
                <div class="center"><Map /></div>
                <div class="right">
                    <div class="charts">
                        <Right1 />
                    </div>
                    <div class="charts">
                        <Right2 />
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="charts">
                    <Bottom1 />
                </div>
                <div class="charts">
                    <Bottom2 />
                </div>
                <div class="charts">
                    <Bottom3 />
                </div>
                <div class="charts">
                    <Bottom4 />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Left1 from './components/Left1.vue'
import Left2 from './components/Left2.vue'
import Right1 from './components/Right1.vue'
import Right2 from './components/Right2.vue'
import Bottom1 from './components/Bottom1.vue'
import Bottom2 from './components/Bottom2.vue'
import Bottom3 from './components/Bottom3.vue'
import Bottom4 from './components/Bottom4.vue'
import Map from './components/map.vue'
</script>

<style lang="less" scoped>
.header {
    height: 60px;
    background-image: url(../assets/layout/header.png);
    background-size: 100% 200px;
    color: white;
    text-align: center;
    line-height: 45px;
    font-size: 32px;
    font-family: "楷体";
}

.content {
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;

    .top {
        flex: 2;
        display: flex;

        .left,
        .right {
            flex: 1;
            display: flex;
            flex-direction: column;

            &>div {
                flex: 1;
            }
        }

        .center {
            flex: 2;
            background-image: url(../assets/layout/chart_center_box_bg.png);
            background-size: 100% 100%;
            margin: 0px 5px 10px 5px;
            min-height: 400px;
        }
    }

    .bottom {
        flex: 1;
        display: flex;

        &>div {
            flex: 1;
        }
    }

    .charts {
        background-image: url(../assets/layout/chart_box_bg.png);
        background-size: 100% 100%;
        margin: 0px 5px 10px 5px;
        padding: 10px 0 0 10px;
        box-sizing: border-box;
    }
}
</style>