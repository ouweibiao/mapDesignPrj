<script setup>
//import { UploadOutlined } from '@ant-design/icons-vue';
import Frame from './components/Frame.vue'
import TestMap from "@/components/TestMap.vue";
import Map from "@/components/Map.vue";
import Datavisualization from "@/components/avgSpeed.vue";
import AvgSpeed from "@/components/avgSpeed.vue";
import StopTimes from "@/components/StopTimes.vue";
import TotalWithoutInterferenceRate from "@/components/TotalWithoutInterferenceRate.vue";  //整体的框架组件
//import BaiduMap from './components/BaiduMap.vue'





</script>

<template>

    <Map/>
  <div id="left">
    <div id="indexbox">
      交通路况
    </div>
    <div id="colormean">
      <div>良好</div>
      <div>拥堵</div>
    </div>
  </div>

  <div style="float: left; "><AvgSpeed/></div>
  <div style="float: left; "><StopTimes/></div>
  <div style="float: left; "><TotalWithoutInterferenceRate/></div>


</template>
<style>
#indexbox {
  height: 20px;
  margin: 15px;
  text-align: center;
  color: black;
  /* 设置文本颜色 */
  font-weight: bold;
  /* 设置文本粗细，根据需要调整 */
  line-height: 20px;
  /* 保持文本垂直居中 */
}

#colormean {
  width: 100%;
  /* 设置宽度，根据需要调整 */
  height: 20px;
  /* 设置高度，根据需要调整 */

  background: linear-gradient(to right,
  rgb(193, 255, 0),
  rgb(255, 0, 0));
  text-align: center;
  color: black;
  /* 设置文本颜色 */
  font-weight: bold;
  /* 设置文本粗细，根据需要调整 */
  line-height: 20px;
  /* 保持文本垂直居中 */
  display: flex;
  justify-content: space-between;
}

</style>
