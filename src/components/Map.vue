<template>
  <div>
    <div id="map"></div>
    <button @click="startUpdating">开始</button>
    <button @click="pauseUpdating">暂停</button>
    <button @click="restart">重新开始</button>
    <p>{{ currentIndex }}/1000</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import road from '../store/log/roadinfo.json';
import {addTrafficLightLayers} from '@/utils/imageLoader';



const position = ref([]);
const carTrace = ref([]);
const oneCarTrace = ref([]);
const pointColor = ref('#4264fb');
const clickedId = ref();
let clickFlag = false;
const isUpdating = ref(false);
let currentIndex = ref(0);
let intervalId = null;
const updateInterval = 1000;
let map;
const lineCoordinates = road;//道路对象


//更新位置
const updatePosition = (data) => {
  position.value = [];
  data.forEach(element => {
    position.value.push({
      'type': 'Feature',
      'properties': {
        'id': element.slice(0, 1),
      },
      'geometry': {
        'type': 'Point',
        'coordinates': element.slice(1, 3),
      },
    });
  });
};

//创建地图
const createMap = () => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbmRlcm1hbm4iLCJhIjoiY2xramlxbW5xMHB6OTN0cWx2YXdyOWMyNiJ9.11h9QepknHdlVU2j-0r5EA';
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [114.08026355,22.5471340316],
    zoom: 16,
    antialias: true,
    lineCoordinates: road,
  });
  map.on('load', () => {
    lineCoordinates.forEach((coordinates, index) => {
      map.addLayer({
        id: `line${index}`,
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates,
            },
          },
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': 'green',
          'line-width': 2,
        },
      });
    });
  });
  map.addControl(new MapboxLanguage({ defaultLanguage: 'zh-Hans' }));
  // 增加交通灯图层并更新
  logoPosition:"bottom-right"   //右下角
};

const removeLayerAndSource = id => {
  if (map.getLayer(id)) {
    map.removeLayer(id);
  }
  if (map.getSource(id)) {
    map.removeSource(id);
  }
};


const updateMap = () => {
  removeLayerAndSource('places');
  map.addSource('places', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': position.value,
    },
  });
  map.addLayer({
    'id': 'places',
    'type': 'circle',
    'source': 'places',
    'paint': {
      'circle-color': pointColor.value,
      'circle-radius': 5,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff',
    },
  });
};

const drawTrace = () => {
  removeLayerAndSource('oneCar');
  removeLayerAndSource('route');
  carTrace.value = [];
  oneCarTrace.value = [];
  let index = 1;
  const promises = [];
  while (index <= currentIndex.value) {
    const promise = import(`../store/vehicle/vehicle${index}.json`).then(data => {
      data.default.forEach(element => {
        if (element[0] == clickedId.value) {
          carTrace.value.push(element.slice(1, 3));
          oneCarTrace.value.push({
            'type': 'Feature',
            'properties': {
              'id': element.slice(0, 1),
            },
            'geometry': {
              'type': 'Point',
              'coordinates': element.slice(1, 3),
            },
          });
        }
      });
    });
    promises.push(promise);
    index = index + 1;
  }
  Promise.all(promises).then(() => {
    map.addSource('oneCar', {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': oneCarTrace.value,
      },
    });
    map.addLayer({
      'id': 'oneCar',
      'type': 'circle',
      'source': 'oneCar',
      'paint': {
        'circle-color': '#4264fb',
        'circle-radius': 5,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff',
      },
    });
    map.addSource('route', {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': carTrace.value,
        },
      },
    });
    map.addLayer({
      'id': 'route',
      'type': 'line',
      'source': 'route',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round',
      },
      'paint': {
        'line-color': '#4264fb',
        'line-width': 4,
      },
    });
  });
};

const startUpdating = () => {
  if (!intervalId) {
    intervalId = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1);
      import(`../store/vehicle/vehicle${currentIndex.value}.json`).then(data => {
        updatePosition(data.default);
        if (clickFlag) {
          pointColor.value = ('#778899');
          updateMap();
          drawTrace(clickedId.value);
        } else {
          pointColor.value = ('#4264fb');
          updateMap();
        }
      });
      /*if (currentIndex.value >= 50) {
        clearInterval(intervalId);
        intervalId = null;
      }*/
    }, updateInterval);
  }
};

const pauseUpdating = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const restart = () => {
  currentIndex.value = 0;
  pointColor.value = ('#4264fb');
  removeLayerAndSource('places');
  removeLayerAndSource('route');
  removeLayerAndSource('oneCar');
};




//hook
onMounted(() => {
  // 创建地图
  createMap();

      map.on('mouseenter', 'places', (e) => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
      });
      map.on('click', 'places', (e) => {
        const clickedFeature = e.features[0];
        clickedId.value = clickedFeature.properties.id.slice(1, -1);
        clickFlag = !clickFlag;
        if (clickFlag) {
          pointColor.value = ('#778899');
          updateMap();
          drawTrace(clickedId.value);
        } else {
          removeLayerAndSource('route');
          removeLayerAndSource('oneCar');
          pointColor.value = ('#4264fb');
          updateMap();
        }
      });
    })
</script>

<style scoped>
#map{
  width: 100%;
  height: 500px;
}
</style>
