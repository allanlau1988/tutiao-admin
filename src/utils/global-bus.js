/**
 * 全局通信组件
 * 呼叫中心
 * 作用：可以让任何组件之间相互通信
 */

 import Vue from 'vue'

 export default new Vue()

 // 假设a组件 要给b组件发送数据

 // b注册通信的事件

 // a发布通信的事件