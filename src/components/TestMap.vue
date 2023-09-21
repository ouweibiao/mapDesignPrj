<template>
  <div>
    <!-- 这里放置 ECharts 图表的容器 -->
    <div ref="chart" style="width: 600px; height: 400px;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const chart = ref(null);

// 文件路径的前缀，你可以根据需要修改
const filePathPrefix = '../store/global/global';

onMounted(async () => {
  try {
    const startTime = 1; // 起始时间戳
    const endTime = 10; // 结束时间戳
    const data = [];

    // 通过循环按顺序读取 JSON 文件
    for (let timecount = startTime; timecount <= endTime; timecount++) {
      // 构建文件路径
      const filePath = `${filePathPrefix}${timecount}.json`;

      // 使用 ESM 语法直接引入 JSON 文件
      const jsonData = import(filePath);

      // 提取所需的数据
      const extractedData = {
        trafficLights: {
          totalWithoutInterference: jsonData[0][0],
          totalPassengers: jsonData[0][1],
          totalWithoutInterferenceRate: jsonData[0][2],
        },
        vehicles: {
          totalTravelTime: jsonData[1][0],
          totalVehiclesGenerated: jsonData[1][1],
          averageTravelTime: jsonData[1][2],
          averageSpeed: jsonData[1][3],
          totalParkingCount: jsonData[1][4],
          averageParkingCount: jsonData[1][5],
          totalParkingTime: jsonData[1][6],
          averageParkingTime: jsonData[1][7],
          parkingTimeRatio: jsonData[1][8],
        },
      };

      // 将提取的数据添加到数组中
      data.push(extractedData);
    }

    // 初始化 ECharts 图表实例
    const myChart = echarts.init(chart.value);

    // 配置图表选项
    const option = {
      title: {
        text: '折线图示例',
      },
      xAxis: {
        type: 'category',
        data: Object.keys(data[0].vehicles), // X 轴数据，可以根据需要自定义
      },
      yAxis: {
        type: 'value',
      },
      series: data.map((item, index) => ({
        data: Object.values(item.vehicles), // 使用您想要显示的数据，这里示例使用 vehicles 内的数据
        type: 'line',
        smooth: true,
        name: `Time ${startTime + index}`, // 使用时间戳作为线条名称
      })),
    };

    // 使用配置项设置图表
    myChart.setOption(option);
  } catch (error) {
    console.error('Failed to fetch and process data:', error);
  }
});
</script>
