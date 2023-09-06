<template>
    <div>
    <div id='map'></div>
    </div>
    
</template>
    

<script setup>
    import 'mapbox-gl/dist/mapbox-gl.css';
    import mapboxgl from 'mapbox-gl';
    import { onMounted } from 'vue';
    import light from '../data/log/lightinfo.json'
    import time1 from '../data/log/time0.json'

     mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbmRlcm1hbm4iLCJhIjoiY2xramlxbW5xMHB6OTN0cWx2YXdyOWMyNiJ9.11h9QepknHdlVU2j-0r5EA';
     function Init_Map() {//地图初始化
        const map = new mapboxgl.Map({
            container: 'map',
            // maxZoom: 15.99,
            // minZoom: 4,
            zoom: 15,
            // center: [114.080444, 22.550486],
            center: [114.07922, 22.547064],
            // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
            // style: 'mapbox://styles/mapbox/dark-v11'
            style: 'mapbox://styles/mapbox/streets-v12', // 样式url
        });
    return map;
    }
    function change(){//根据交通灯的坐标生成添加图像的四个坐标
        var data_total = [];//存储添加图像的四个坐标
       for(var i=0;i<light.length;i++){
           var temp =[[light[i][0]-0.00005, light[i][1] + 0.00006], 
                    [light[i][0] + 0.00005, light[i][1] + 0.00006],
                     [light[i][0] + 0.00005, light[i][1] - 0.00006], 
                     [light[i][0] - 0.00005, light[i][1] - 0.00006]];
            data_total.push(temp);
            }
            console.log(data_total);
            return data_total;
    }
    onMounted(() => {
    // console.log(light);
    // var UrlArr =['https://s2.loli.net/2023/09/05/1jCmgdfA8L9HnVw.png',
    //     'https://s2.loli.net/2023/09/04/qjw2bFE6UkJQvxf.png',
    //     'https://s2.loli.net/2023/09/04/KPtnC6Ggl4Xo9AO.png',
    //     'https://s2.loli.net/2023/09/04/QY9OczkL5RUIKvD.png',
    //     'https://s2.loli.net/2023/09/04/7ORFA49MQwihv1x.png',
    //     'https://s2.loli.net/2023/09/04/apN8qXd4IbR2xBg.png',
    //     'https://s2.loli.net/2023/09/04/i1o3CDUsXNfrJdV.png',
    //     'https://s2.loli.net/2023/09/04/TfiM1b5gN4JPBmX.png',
    //    ' https://s2.loli.net/2023/09/04/8J4PO9Azt1GV3uf.png'];
    //存储照片URL的数组
    var UrlArr = ['https://s2.loli.net/2023/09/05/o7jfui26X1ND4Ga.png',
        'https://s2.loli.net/2023/09/05/n4tB5xXMzgecL7S.png',
        'https://s2.loli.net/2023/09/05/2vM9Jz8huPRwNjF.png',
        'https://s2.loli.net/2023/09/05/ixZ7uIEOzj1BJgr.png',
        'https://s2.loli.net/2023/09/05/eN6w5JUkPDd1qEO.png',
        'https://s2.loli.net/2023/09/05/sfGPgymTbSALYz5.png',
        'https://s2.loli.net/2023/09/05/kj2oyMHn1YpuKCr.png',
        'https://s2.loli.net/2023/09/05/qHahvDXzZtLpBGV.png',
        'https://s2.loli.net/2023/09/05/EbdfUct1zyMQeWr.png'];

    var data_total = change();
    var map = Init_Map(); 
    map.on('load', () => {//当地图加载后执行  
        //先加载第0秒的交通灯状态展示在地图上      
        for(var i=0;i<light.length;i++){
            //每个交通灯新建一个图层
            var sourceid = 'radar' + i;
            var layerid='radar-layer'+i;   
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
    
        var timecount = 1;//记录当前秒数，用于文件读取的文件名
        setInterval(() => {//每隔一秒，读取一个文件,然后更新图层
            var fileName = '../data/log/time'+timecount+'.json';
            timecount++;
            import(fileName)
                .then((module) => {//module.default是每个文件中数据
                        for(var i=0;i<light.length;i++){
                             var sourceid = 'radar' + i;
                             //更新图像地址url，(可选更新位置coordinates),网址 https://docs.mapbox.com/mapbox-gl-js/api/sources/#imagesource#updateimage
                             map.getSource(sourceid).updateImage({url: UrlArr[module.default[1][i]],});
                        }
                })
                .catch((error) => {
                    console.error(`Failed to import new file${fileName}:`, error);
                });
        }, 1000); 
        

    
    });
     })


    
</script>


<style>
      #map{
        width: 100vw;
        height: 100vh;
      }
     
</style>