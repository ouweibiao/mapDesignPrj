<script setup>
import { onMounted, ref } from 'vue';
import mapboxgl from 'mapbox-gl'
import MapboxLanguage from '@mapbox/mapbox-gl-language'

let map
const initMap = () => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbmRlcm1hbm4iLCJhIjoiY2xramlxbW5xMHB6OTN0cWx2YXdyOWMyNiJ9.11h9QepknHdlVU2j-0r5EA';
  Map = new mapboxgl.Map({
    container: 'map', // container id 绑定的组件的id
    style: 'mapbox://styles/mapbox/streets-v11', //地图样式，可以使用官网预定义的样式,也可以自定义
    center: [115.8574663, 28.65622505], // 初始地图中心点位置
    zoom: 11,     // starting zoom 地图初始的层级
    antialias: true, //抗锯齿，通过false关闭提升性能
  });
  Map.addControl(new MapboxLanguage({ defaultLanguage: 'zh-Hans' }))//切换成中文
}



onMounted(() => {
  initMap()
})



</script>




