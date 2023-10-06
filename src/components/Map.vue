<template>
  <div>
    <div class="mapbox">
      <div id="map1"></div>
      <div id="map2"></div>
    </div>
    <p>当前道路车辆数目：{{ CarCountOnRoad }}</p>
    <button @click="startUpdating">开始</button>
    <button @click="pauseUpdating">暂停</button>
    <button @click="restart">重新开始</button>
    <p>{{ currentIndex }}/1000</p>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import road from '../store/log/roadinfo.json';


// import { addTrafficLightLayers } from '@/utils/imageLoader';

import light from '../store/log/lightinfo.json'
import time1 from '../store/log/time0.json'
import { defineCustomElement } from 'vue';

const position = ref([]);
const CarCountposition = ref([]);
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
let CarCountOnRoad = 0;
const lineCoordinates = road;//道路对象
let clickmap;
var ClickedRoadPosition = [];
var LightCarNumbers = [];
// const LightCarColors = 'green';
let circletemp = 0;
let circleIDtemp = 'light0';

// 在数据发生变化时，更新 clickmap 的样式
watch(CarCountposition, (newValue) => {
  // 更新线段的颜色
  clickmap.setPaintProperty('road-line', 'line-color', UpdateRoadColor(ClickedRoadPosition[0], ClickedRoadPosition[1]));
});

// 在数据发生变化时，更新 clickmap 的样式
watch(LightCarNumbers, (newValue) => {
  // 更新圆的半径
  map.setPaintProperty(circleIDtemp, 'circle-radius', countLightCarRadius(circletemp));
  map.setPaintProperty(circleIDtemp, 'circle-color', setLightColor(circletemp));
  map.setPaintProperty(circleIDtemp, 'circle-opacity', setLightColorOpacity(circletemp));

});

var UrlArr = [
  'https://s2.loli.net/2023/09/26/pbHTWUrw8zJVDMO.png',
  'https://s2.loli.net/2023/09/26/mp6gYjsF3IDaWch.png',
  'https://s2.loli.net/2023/09/26/YdcU1D2lPsM5rjT.png',
  'https://s2.loli.net/2023/09/26/haiGdRypum6xsDc.png',
  'https://s2.loli.net/2023/09/26/9zHiAGMIUmN8hO5.png',
  'https://s2.loli.net/2023/09/26/q5jpiIk7dGMuPwY.png',
  'https://s2.loli.net/2023/09/26/E5cyxzrwCoplkTs.png',
  'https://s2.loli.net/2023/09/26/tr7zham9TKC8GIg.png',
  'https://s2.loli.net/2023/09/26/Qbr7ygqA1D4dYTs.png'
]

// 计算当前交通灯附近车辆数目
function countLightCarNumber() {
  // 遍历每个交通灯的坐标
  LightCarNumbers = [];
  light.forEach((lightCoord) => {
    // 初始化车辆数目为0
    let carCount = 0;

    // 遍历每辆车的坐标
    position.value.forEach((carCoord) => {
      // 使用欧几里得距离计算交通灯和车辆之间的距离

      const distance = Math.sqrt(
          Math.pow(lightCoord[0] - carCoord.geometry.coordinates[0], 2) +
          Math.pow(lightCoord[1] - carCoord.geometry.coordinates[1], 2)
      );

      // 如果距离小于等于0.004，则车辆在交通灯的影响范围内
      if (distance <= 0.004) {
        carCount++;
      }
    });

    // 将车辆数目存储在LightCarNumbers数组中
    LightCarNumbers.push(carCount);
  });
}

// 交通灯可视化——设置交通灯颜色
function setLightColor(lightindex) {
  var LightColor = 'green';

  if (LightCarNumbers[lightindex] > 10 && LightCarNumbers[lightindex] < 300) {
    LightColor = 'yellow'
  } else if (LightCarNumbers[lightindex] > 300) {
    LightColor = 'red'
  }
  return LightColor;
}

// 交通灯可视化——交通灯颜色透明度
function setLightColorOpacity(lightindex) {
  var Opacity = 0.1;
  if (LightCarNumbers[lightindex] > 60 && LightCarNumbers[lightindex] < 120) {
    Opacity = 0.1 + (LightCarNumbers[lightindex] - 60) * 0.01;
  } else if (LightCarNumbers[lightindex] > 120) {
    Opacity = 0.6;
  }
  return Opacity;
}

// 交通灯可视化——定义半径（根据在交通灯固定范围内的车辆数目变化而变化）
function countLightCarRadius(lightindex) {
  var radius = 1;

  if (LightCarNumbers[lightindex] > 10 && LightCarNumbers[lightindex] < 300) {
    radius = 1.5 + LightCarNumbers[lightindex] * 0.05;
  } else if (LightCarNumbers[lightindex] > 300) {
    radius = 17;
  }

  return radius;

}


// 计算具体道路上车的数目，并且根据不同数目设置不同颜色
function isPointOnLine(point, lineStart, lineEnd) {
  // 计算点到线段起点的向量
  const vector1 = [point[0] - lineStart[0], point[1] - lineStart[1]];

  // 计算线段的向量
  const vector2 = [lineEnd[0] - lineStart[0], lineEnd[1] - lineStart[1]];



  // 计算点到线段的投影向量的长度
  const dotProduct = vector1[0] * vector2[0] + vector1[1] * vector2[1];
  const lineLength = vector2[0] * vector2[0] + vector2[1] * vector2[1];
  const projectionLength = dotProduct / lineLength;

  // 如果投影长度在 0 到线段长度之间，点在线段上
  return projectionLength >= 0 && projectionLength <= 0.5;

}

// 更新选中道路的颜色
function UpdateRoadColor(RoadFirstPoint, RoadEndPoint) {

  CarCountOnRoad = 0

  CarCountposition.value.forEach((coord) => {
    if (isPointOnLine(coord, RoadFirstPoint, RoadEndPoint)) {
      CarCountOnRoad = CarCountOnRoad + 1;
    }
  });

  let RoadColor = 'green';

  if (CarCountOnRoad > 25 && CarCountOnRoad <= 50) {
    RoadColor = 'yellow';
  } else if (CarCountOnRoad > 50) {
    RoadColor = 'red';
  }

  return RoadColor;

}


//更新位置
const updatePosition = (data) => {
  position.value = [];
  CarCountposition.value = [];
  data.forEach(element => {
    CarCountposition.value.push(
        element.slice(1, 3)
    );
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
    container: 'map1',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [114.08352, 22.547432022],
    zoom: 15.1,
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
          'line-opacity': 0.5,
          'line-width': 3,
        },
      });

      // 监听每个线图层的点击事件——用于展示具体道路
      map.on('click', `line${index}`, (e) => {
        // 获取点击的线段的坐标
        const clickedLineCoordinates = e.features[0].geometry.coordinates;

        // 计算两个端点的中点坐标
        const startPoint = clickedLineCoordinates[0];
        const endPoint = clickedLineCoordinates[1];
        const midPoint = [
          (startPoint[0] + endPoint[0]) / 2, // 计算经度的平均值
          (startPoint[1] + endPoint[1]) / 2  // 计算纬度的平均值
        ];

        const clickedRoad = [
          startPoint,
          endPoint
        ]

        ClickedRoadPosition = clickedRoad;

        responseRoadClick(midPoint, clickedRoad);

      });

    });

    var data_total = change();
    //添加一个标注点，light[4]
    // console.log("标注点所在位置=", light[12]);
    const marker = new mapboxgl.Marker()
        .setLngLat(light[4])
        .addTo(map);
    //先加载第0秒的交通灯状态展示在地图上
    for (var i = 0; i < light.length; i++) {
      //每个交通灯新建一个图层
      var sourceid = 'radar' + i;
      var layerid = 'radar-layer' + i;
      //为每个交通灯的图片展示添加数据源，以sourceid为该源的id
      map.addSource(sourceid, {
        'type': 'image',
        'url': UrlArr[time1[1][i]],
        // 'url':'../images/2左转.jpeg',
        'coordinates': data_total[i]
      });
      //利用上述的数据源，新增一个图层
      map.addLayer({
        id: layerid,
        'type': 'raster',
        'source': sourceid,
        'paint': {
          'raster-fade-duration': 0
        }
      });
    }

  });



  map.addControl(new MapboxLanguage({ defaultLanguage: 'zh-Hans' }));
  // 增加交通灯图层并更新
  // logoPosition: "bottom-right"   //右下角

};


// 响应道路点击
const responseRoadClick = (midPoint, clickedRoad) => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbmRlcm1hbm4iLCJhIjoiY2xramlxbW5xMHB6OTN0cWx2YXdyOWMyNiJ9.11h9QepknHdlVU2j-0r5EA';

  if (clickmap) {
    clickmap.remove();
  }

  clickmap = new mapboxgl.Map({
    container: 'map2',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: midPoint,
    zoom: 16.5,
    antialias: true,
    lineCoordinates: road,
  });



  // 添加道路线图层
  clickmap.on('load', () => {
    clickmap.addLayer({
      id: 'road-line',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: clickedRoad,
          },
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': UpdateRoadColor(clickedRoad[0], clickedRoad[1]), // 设置线的颜色
        'line-width': 5,
      },
    });
  });

}







function change() {//根据交通灯的坐标生成添加图像的四个坐标
  var data_total = [];//存储添加图像的四个坐标
  for (var i = 0; i < light.length; i++) {
    var temp = [[light[i][0] - 0.00005, light[i][1] + 0.00006],
      [light[i][0] + 0.00005, light[i][1] + 0.00006],
      [light[i][0] + 0.00005, light[i][1] - 0.00006],
      [light[i][0] - 0.00005, light[i][1] - 0.00006]];
    data_total.push(temp);
  }
  // console.log(data_total);
  return data_total;
}


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
      'circle-radius': 3,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff',
    },
  });

  light.forEach((lightCoord, index) => {
    // 为每个交通灯创建一个唯一的ID
    const layerId = `light${index}`;
    circleIDtemp = layerId;
    circletemp = index;
    removeLayerAndSource(layerId);

    // 创建圆的GeoJSON对象，以交通灯坐标为圆心，0.001为半径
    const circleGeoJSON = {
      id: layerId,
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: lightCoord, // 交通灯坐标
      },
    };

    // 添加圆图层
    map.addLayer({
      id: layerId, // 使用唯一的ID
      type: 'circle',
      source: {
        type: 'geojson',
        data: circleGeoJSON,
      },
      paint: {
        'circle-color': setLightColor(index), // 自定义颜色
        'circle-radius': countLightCarRadius(index),     // 半径大小
        'circle-opacity': setLightColorOpacity(index),   // 透明度
      },
    });
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


//按下开始键后执行
const startUpdating = () => {
  if (!intervalId) {
    intervalId = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1);
      import(`../store/vehicle/vehicle${currentIndex.value}.json`).then(data => {
        // console.log(`vehicle${currentIndex.value}.json=`, data.default);
        updatePosition(data.default);
        countLightCarNumber();
        // console.log(LightCarNumbers[1]);

        if (clickFlag) {
          pointColor.value = ('#778899');
          updateMap();
          drawTrace(clickedId.value);
        } else {
          pointColor.value = ('#4264fb');
          updateMap();
        }
      });


      //交通灯的变化
      import(`../store/log/time${currentIndex.value}.json`).then(data => {
        // console.log(`time${currentIndex.value}.json=`, data.default)

        for (var i = 0; i < light.length; i++) {
          var sourceid = 'radar' + i;
          //更新图像地址url，(可选更新位置coordinates),网址 https://docs.mapbox.com/mapbox-gl-js/api/sources/#imagesource#updateimage
          map.getSource(sourceid).updateImage({ url: UrlArr[data.default[1][i]] });
        }
      });
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


  var data_total = change();
  // var map = Init_Map();
  map.on('load', () => {//当地图加载后执行


  });


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
.mapbox {
  display: flex;
  justify-content: space-around;

  background-color: black;
}


#map1 {
  width: 59%;
  height: 500px;
}

#map2 {

  width: 39%;
  height: 500px;
}
</style>

