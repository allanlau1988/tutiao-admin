//基于axios 封装的请求模块
import axios from 'axios'
//创建一个axios实例，说白了就是复制一个axios
//我们通过这个实例去发送请求，把需要的配置 配置给这个实例
import router from '@/router'

const request = axios.create({
    baseURL: 'http://api-toutiao-web.itheima.net/',
    //baseURL: 'http://ttapi.research.itcast.cn/'
})
//请求拦截器
request.interceptors.request.use(
    //所有请求会经过这里
    //config 是当前请求对象的配置信息
    //config 是可以修改的
    function (config) {
        console.log(config)
        const user =JSON.parse( window.localStorage.getItem('user'))
        //如果有用户信息，则统一设置 token
        if(user) {
          config.headers.Authorization = `Bearer ${user.token}`
        }
        return config
    },
    //请求失败会经过这里
    function (error) {
        return Promise.reject(error)
    }
)

//响应拦截器
request.interceptors.response.use(response => {
// Do something before response is sent
return response;
},error => {
// Do something with response error
console.log('状态码异常')
if(error.response && error.response.status === 401) {
    window.localStorage.removeItem('user')
    router.push('/login')
}
return Promise.reject(error);
});
//导出请求方法
export default request