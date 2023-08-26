
import { createApp } from 'vue'
import App from './App.vue'

//导入AntdV的UI组件
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

//使用该组件并挂载到具有’app‘id的dom元素上
const app = createApp(App);


app.use(Antd).mount('#app')
