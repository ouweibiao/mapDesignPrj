<template>
  <div>
    <!-- 图表容器 -->
    <div ref="chart" style="width: 200px; height: 200px; "></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const chart = ref(null); // 图表容器的引用
const data = ref([]); // 存储从 JSON 文件中读取的数据
const currentIndex = ref(0); // 当前加载的文件索引
const maxIndex = 1000; // 最大文件索引，根据实际情况修改

// 异步函数，用于读取 JSON 文件并处理数据
async function fetchData() {
  try {
    // 构建文件路径
    const filePath = `../store/global/global${currentIndex.value}.json`;

    // 使用 ESM 语法直接引入 JSON 文件
    const jsonData = await import(filePath);

    // 提取所需的数据并添加到数组中
    data.value.push(jsonData.default);

    // 初始化 ECharts 图表实例
    const myChart = echarts.init(chart.value);

    // 配置图表选项
    const option = {
      title: {
        text: ' Total_Rate',
      },
      xAxis: {
        type: 'category',
        data: Array.from({ length: currentIndex.value }, (_, i) => i + 1), // X 轴数据，从 1 到 currentIndex
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: data.value.map(item => item[0][2]), // 使用数据中的某一字段作为 Y 轴数据
          type: 'line',
          smooth: true,
        },
      ],
    };

    // 使用配置项设置图表
    myChart.setOption(option);

    // 更新文件索引
    currentIndex.value++;

    // 如果还有文件需要加载，继续定时加载下一个文件
    if (currentIndex.value <= maxIndex) {
      setTimeout(fetchData, 1000); // 每隔0.1秒加载一个文件
    }else {
      // 如果处于暂停状态，等待一段时间后再继续加载
      setTimeout(fetchData, 1000); // 每隔1秒检查一次是否需要继续加载
    }

  } catch (error) {
    console.error('Failed to fetch and process data:', error);
  }
}

// 在组件加载时调用 fetchData 函数来获取数据并绘制图表
onMounted(() => {
  fetchData();
});
</script>
