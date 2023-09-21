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

  <div style="float: left; "><AvgSpeed/></div>
  <div style="float: left; "><StopTimes/></div>
  <div style="float: left; "><TotalWithoutInterferenceRate/></div>


</template>
