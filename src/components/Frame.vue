<!--UI骨架组件-->
<script setup>
import Map from './Map.vue'
import Lineplot from "@/components/DataDisplay/Lineplot.vue";
import BaiduMap from "@/App.vue";
import TestMap from "@/components/TestMap.vue";

</script>

<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1">
          <pie-chart-outlined />
          <span>Map Display</span>
        </a-menu-item>
        <a-menu-item key="2">
          <desktop-outlined />
          <span>Data Analysis Results</span>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <user-outlined />
              <span>User</span>
            </span>
          </template>
          <a-menu-item key="3">Tom</a-menu-item>
          <a-menu-item key="4">Bill</a-menu-item>
          <a-menu-item key="5">Alex</a-menu-item>
        </a-sub-menu>

        <a-menu-item key="9">
          <file-outlined />
          <span>File Load</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content style="margin: 0 16px">
        <!--<a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>User</a-breadcrumb-item>
          <a-breadcrumb-item>Bill</a-breadcrumb-item>
        </a-breadcrumb>!-->
        <div>
          <Map/>
          <!--把地图渲染到这里面来-->
        </div>
        <div>


          <!--这里放数据图-->
        </div>
      </a-layout-content>
      <a-layout-content>
        <div>

          <!--此处用于存放简单的数据结果-->
        </div>
      </a-layout-content>

    </a-layout>
  </a-layout>
</template>

<style scoped>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgb(255, 255, 255);
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}

</style>
