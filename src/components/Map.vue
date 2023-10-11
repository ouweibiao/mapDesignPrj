<template>
  <div>
    <div id="map"></div>
    <button @click="startUpdating">开始</button>
    <button @click="pauseUpdating">暂停</button>
    <button @click="restart">重新开始</button>
    <!-- 上传文件的按钮 -->
    <div class="custom-file-upload">
      <input type="file" id="folderInput_log" ref="folderInput" @change="(event) => handleFolderUpload(event)" multiple directory webkitdirectory>
      <button type="button" id="logbutton" onclick="document.getElementById('folderInput_log').click()">上传数据文件夹</button>
      <span id="log">log文件上传成功</span>
    </div>
    <!-- 提示框 -->
   <div id="loading-overlay">
    <div id="loading-box">正在处理，请等待...</div>
</div>
   
    <p>{{ currentIndex }}/1000</p>
  </div>
</template>

<script setup>
import { UploadOutlined } from '@ant-design/icons-vue';
import { onMounted,reactive } from 'vue';
import { markRaw } from "vue";
import { ref, watchEffect,watch} from 'vue'
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import road from '../store/log/roadinfo.json';

//导入交通灯的图片
import L0 from '../store/images/L0.jpg'
import L1 from '../store/images/L1.jpg'
import L2 from '../store/images/L2.jpg'
import L3 from '../store/images/L3.jpg'
import L4 from '../store/images/L4.jpg'
import L5 from '../store/images/L5.jpg'
import L6 from '../store/images/L6.jpg'
import L7 from '../store/images/L7.jpg'
import L8 from '../store/images/L8.jpg'
var UrlArr = [L0, L1, L2, L3, L4, L5, L6, L7, L8]    //存储交通灯图片的数组

//定义一些全局变量(监控变量)
//log文件夹中的所有文件
var lightinfo = ref({});//存储交通灯的位置的lightinfo.json
var time = ref({});//存储所有的timeX.json文件内容
var roadinfo = ref({});//存储roadinfo.json
//indicator文件夹中的所有文件
var global = ref({});//存储所有的globalX.json文件内容
var signal = ref({});//存储所有的signalX.json文件内容
var vehicle = ref({});//存储所有的vehicleX.json文件内容

//同上，是真正存储数据的变量
// var Global = [] ;
// var Signal = [] ;
// var Vehicle = [];
// var Roadinfo = [];
// var Time = [];
// var Lightinfo = [];
var Global ;
var Signal ;
var Vehicle ;
var Roadinfo ;
var Time ;
var Lightinfo ;

//处理上传文件,保证文件按顺序读取
async function handleFolderUpload(event){
   showLoadingOverlay('正在上传文件.....'); // 显示方框和背景层，并禁用页面上的操作
   var selectedFiles = Array.from(event.target.files);//存储整个文件夹的所有文件
   console.log(`selectedFiles=`,selectedFiles);
   var filename = ['lightinfo.json','roadinfo.json','time','global','signal','vehicle'];
   var arr = [];
   for (var file of selectedFiles) {
      var FileName = file.name;//获取每个文件的文件名
      var fileContent = JSON.parse(await readFileContent(file));//将每个文件内容（JSON字符串）转换成对象
      for(var i = 0;i < filename.length; i++){//将符合文件名的文件内容存储到arr中的对应索引
        if(FileName === filename[i]){//是lightinfo.json或roadinfp.json
          arr[i] = fileContent;
          break;
        }
         const regex = new RegExp(filename[i] + "(\\d+)");
         const match = FileName.match(regex);//存储xxxxxxX.json中的X
         if(match){//符合这个名字   是剩余的4种文件
          var index = match[1];
          if(arr[i]==null){
            arr[i] = [];
          }
          arr[i][index] = fileContent;
          break;
         }
      }
   }
   [lightinfo.value,roadinfo.value,time.value,global.value,signal.value,vehicle.value] = arr;
       
    hideLoadingOverlay();// 隐藏方框和背景层，并重新启用页面上的操作
}
function readFileContent(file) {
  return new Promise(function (resolve, reject) {
    var fileReader = new FileReader();

    fileReader.onload = function () {
      var fileContent = fileReader.result;
      resolve(fileContent);
    };

    fileReader.onerror = function () {
      reject(new Error('文件读取失败'));
    };

    fileReader.readAsText(file);
  });
}

// 显示方框和背景层，并禁用页面上的操作
function showLoadingOverlay(str) {
    var loadingBox = document.getElementById("loading-box");
    loadingBox.innerText =str; // 设置文本内容
    document.getElementById("loading-overlay").style.display = "block";
    document.body.style.pointerEvents = "none"; // 禁用页面上的操作
    // ...
}
// 隐藏方框和背景层，并重新启用页面上的操作
function hideLoadingOverlay() {
    document.getElementById("loading-overlay").style.display = "none";
    document.body.style.pointerEvents = "auto"; // 启用页面上的操作
}

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
let map;let tempmap;
const lineCoordinates = road;//道路对象




//更新位置
const updatePosition = (data) => {
  position.value = [];

  data.forEach(element => {
    // print("element=",element)
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
const createMap = (flag) => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbmRlcm1hbm4iLCJhIjoiY2xramlxbW5xMHB6OTN0cWx2YXdyOWMyNiJ9.11h9QepknHdlVU2j-0r5EA';
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [114.08026355, 22.5471340316],
    zoom: 16,
    antialias: true,
    lineCoordinates: road,
  });
  showLoadingOverlay('正在更新地图');// 显示方框和背景层，并禁用页面上的操作
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

    var data_total = change(Lightinfo);//根据交通灯的位置计算出置放交通灯图片的坐标
    if(data_total){//data_total不为空,再画交通灯
      console.log('data_total不为空');
      //先加载第0秒的交通灯状态展示在地图上   time[0]  ==>time0.json
      for (var i = 0; i < data_total.length; i++) {
        //每个交通灯新建一个图层
        var sourceid = 'radar' + i;
        var layerid = 'radar-layer' + i;
        //为每个交通灯的图片展示添加数据源，以sourceid为该源的id
        map.addSource(sourceid, {
          'type': 'image',
          'url': UrlArr[Time[0][1][i]],
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
  }
  hideLoadingOverlay (); // 隐藏方框和背景层，并重新启用页面上的操作
  });


  map.addControl(new MapboxLanguage({ defaultLanguage: 'zh-Hans' }));
  // 增加交通灯图层并更新
  logoPosition: "bottom-right"   //右下角
};

function change(light) {//根据交通灯的坐标生成添加图像的四个坐标
  if(!light)
  {
    console.log('change中,light为空');
    return null;
  }
  var data_total = [];//存储添加图像的四个坐标
  for (var i = 0; i < light.length; i++) {
    var temp = [[light[i][0] - 0.00005, light[i][1] + 0.00006],
      [light[i][0] + 0.00005, light[i][1] + 0.00006],
      [light[i][0] + 0.00005, light[i][1] - 0.00006],
      [light[i][0] - 0.00005, light[i][1] - 0.00006]];
    data_total.push(temp);
  }
  console.log('data_total=',data_total);
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
   
    // const promise = import(`../store/vehicle/vehicle${index}.json`).then(data => {
    //   data.default.forEach(element => {
    //     if (element[0] == clickedId.value) {
    //       carTrace.value.push(element.slice(1, 3));
    //       oneCarTrace.value.push({
    //         'type': 'Feature',
    //         'properties': {
    //           'id': element.slice(0, 1),
    //         },
    //         'geometry': {
    //           'type': 'Point',
    //           'coordinates': element.slice(1, 3),
    //         },
    //       });
    //     }
    //   });
    // });
    // vehicle[index]    ==>vehicleX.json
    vehicle[index].forEach(element => {
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
  console.log('开始的函数中,Vehicle=',Vehicle);
  console.log('开始的函数中,Lightinfo=',Lightinfo);
  // console.log('vehicle.length',Vehicle.length,vehicle);
  //  console.log('lightinfo.length',Lightinfo.length,);
 //判断用户是否已经传入数据
  if((!Vehicle)&&(!Lightinfo)){
        alert('车辆、交通灯的相关数据为空,请检查是否已经上传 indicator文件夹、log文件夹 ');
        return;
    }
  else if(!Vehicle){
    alert('车辆的相关数据为空,请检查是否已经上传 indicator文件夹 ');
        return;
  }
  else if(!Lightinfo){
    alert('交通灯的相关数据为空,请检查是否已经上传 log文件夹 ');
        return;
  }


  if (!intervalId) {
    intervalId = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1);
      
        updatePosition(Vehicle[currentIndex.value]);
        if (clickFlag) {
          pointColor.value = ('#778899');
          updateMap();
          drawTrace(clickedId.value);
        } else {
          pointColor.value = ('#4264fb');
          updateMap();
        }
      // import(`../store/vehicle/vehicle${currentIndex.value}.json`).then(data => {
      //   console.log(`vehicle${currentIndex.value}.json=`, data.default);
      //   updatePosition(data.default);
      //   if (clickFlag) {
      //     pointColor.value = ('#778899');
      //     updateMap();
      //     drawTrace(clickedId.value);
      //   } else {
      //     pointColor.value = ('#4264fb');
      //     updateMap();
      //   }
      // });


      //交通灯的变化     time[currentIndex.value]是当前的秒数下的交通灯状态文件的内容
      // import(`../store/log/time${currentIndex.value}.json`).then(data => {
      //   console.log(`time${currentIndex.value}.json=`,data.default);
      //   for (var i = 0; i < light.length; i++) {
      //     var sourceid = 'radar' + i;
      //     map.getSource(sourceid).updateImage({ url: UrlArr[data.default[1][i]]});
      //   }
      // });
         for (var i = 0; i < Lightinfo.length; i++) {
          var sourceid = 'radar' + i;
          map.getSource(sourceid).updateImage({ url: UrlArr[Time[currentIndex.value][1][i]]});
        }
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
function ProxytoArr(arr){//将Proxy对象转换回真正的
  var temp;
  if(arr.value==undefined)
   {
    temp=null;
   }
  else{
     temp = JSON.parse(JSON.stringify(arr.value));
  }
  return temp;
}

var flag=0;
watch([global, signal, vehicle, lightinfo, roadinfo, time], () => {
  //watch用来监护这6个变量的变化，一发生变化，就执行下面的函数
  console.log('watch中,变量发生了变化');
  //更新变量
   Global = ProxytoArr(global);
   Signal = ProxytoArr(signal);
   Vehicle = ProxytoArr(vehicle);
   Roadinfo = ProxytoArr(roadinfo);
   Time = ProxytoArr(time);
   Lightinfo =  ProxytoArr(lightinfo);


  if(flag!=0)
  {//不是第一次创建地图，则需先移除地图
    map.remove();
  }
  createMap(flag);
  flag++;
  console.log('可以加载地图了');


})



//hook
// onMounted(() => {
//   //   var flag = false;
//   //      while(!flag){
//   //       //console.log(time);
//   //       //if(time){
//   //       //  console.log('time不为空');
//   //       //}
//   //       //else{
//   //       //  console.log('time为空');
//   //       //}
//   //       if(global&&signal&&vehicle&&lightinfo&&roadinfo&&time){
//   //           // 创建地图
//   //   console.log(111111);
//   // let button1Clicked = false;
//   // let button2Clicked = false;

//   // function executeFunction() {
//   //   // 在这里执行所需的功能
//   //   console.log("两个按钮都被点击了！");
//   // }

//   // document.getElementById("folderInput_log").addEventListener("click", function() {
//   //   button1Clicked = true;
//   //   if (button2Clicked) {
//   //     executeFunction();
//   //   }
//   // });

//   // document.getElementById("folderInput_indicator").addEventListener("click", function() {
//   //   button2Clicked = true;
//   //   if (button1Clicked) {
//   //     executeFunction();
//   //   }
//   // });

//   //   // while(global&&signal&&vehicle&&lightinfo&&roadinfo&&time)
//   //   // { 
//   // // watchEffect(() => {
//   //     // watch(time, (newValue, oldValue) => {
        
//   //     //  if(time.value!=null){
//   //     //   console.log(11111);
//   //     //  }
//   //     //   if (global.value&&signal.value&&vehicle.value&&lightinfo.value&&roadinfo.value&&time.value) {
//   //         // if (newValue) {
            
//   //       // 执行需要在变量赋值之后执行的操作
//   //         // 执行你想要执行的操作
//   //        console.log('可以执行了');
//   //         var data_total;
//   //     data_total = change(lightinfo);
//   //     createMap();
//   //     console.log('可以加载地图了');
      

//   //    var logButton = document.getElementById('logbutton');
//   //   logButton.addEventListener('click', function () {
//   //     // 在这里执行其他操作
//   //     console.log('按钮被点击了！');
      
//   //     // 执行其他操作的代码...
//   //   });
    
//   //   // var map = Init_Map();
//   //   map.on('load', () => {//当地图加载后执行


//   //   });


//   //   map.on('mouseenter', 'places', (e) => {
//   //     map.getCanvas().style.cursor = 'pointer';
//   //   });
//   //   map.on('mouseleave', 'places', () => {
//   //     map.getCanvas().style.cursor = '';
//   //   });
//   //   map.on('click', 'places', (e) => {
//   //     const clickedFeature = e.features[0];
//   //     clickedId.value = clickedFeature.properties.id.slice(1, -1);
//   //     clickFlag = !clickFlag;
//   //     if (clickFlag) {
//   //       pointColor.value = ('#778899');
//   //       updateMap();
//   //       drawTrace(clickedId.value);
//   //     } else {
//   //       removeLayerAndSource('route');
//   //       removeLayerAndSource('oneCar');
//   //       pointColor.value = ('#4264fb');
//   //       updateMap();
//   //     }
//   //   });
//   //   flag = true;
//   //       }
//   //      }
   
//      })

 
// // })
</script>

<style scoped>
#map {
  width: 100%;
  height: 500px;
}
.custom-file-upload input[type="file"] {
  display: none;
}
.custom-file-upload{
  display: inline;
}
span{
  color: aquamarine;
  display: none;
}
#loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
    z-index: 9999; /* 设置层级，确保覆盖在其他内容之上 */
    display: none; /* 初始状态隐藏 */
}

#loading-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #f1f1f1;
    color: #333;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>

