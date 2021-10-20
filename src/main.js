import Vue from 'vue'
import App from './App.vue'

import 'element-ui/lib/theme-chalk/index.css';

import {Dialog,Button,Table,TableColumn,Loading,Tag,Message,Divider} from 'element-ui'
Vue.use(Dialog)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Loading)
Vue.use(Tag)
Vue.use(Divider)
// Vue.use(Message)
Vue.component(Message.name,Message)
Vue.prototype.$message = Message

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
