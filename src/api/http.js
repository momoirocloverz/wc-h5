import axios from 'axios';
import Url from './config';

const Http=axios.create({
    baseUrl:Url.baseUrl,
    timeout:Url.timeout
})

// 请求配置项
Http.interceptors.request.use(config=>{
    return config;
},error=>{
    return Promise.reject(error);
});

// 请求相应项
Http.interceptors.response.use(res=>{
    let code=res.data.code;
    if(code===200){

    }else if(code===500){

    }
},error=>{
    return Promise.reject(error);
});

export default Http;