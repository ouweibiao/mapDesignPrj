  <template>
    <div>
      <div ref="map" style="height: 500px;"></div>
    </div>
  </template>
  
  <script>
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import road from '../store/log/roadinfo.json';
  
  export default {
    name: 'MapboxMap',
    data() {
      return {
        map: null,
        accessToken: 'pk.eyJ1IjoiZnJhbmRlcm1hbm4iLCJhIjoiY2xramlxbW5xMHB6OTN0cWx2YXdyOWMyNiJ9.11h9QepknHdlVU2j-0r5EA',
        center: [114.08026355,22.5471340316],
        zoom: 15,
        //添加线段
        lineCoordinates: road,
      };
    },
    mounted() {
      mapboxgl.accessToken = this.accessToken;
      this.map = new mapboxgl.Map({
        container: this.$refs.map,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: this.center,
        zoom: this.zoom,
      });
  
      // 在地图上添加线段
      this.map.on('load', () => {
        this.lineCoordinates.forEach((coordinates, index) => {
            this.map.addLayer({
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
        })
      });
    },
  };
  </script>