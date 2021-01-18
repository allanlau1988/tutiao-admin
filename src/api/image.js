/**
 * 素材相关的接口
 */
import request from '@/utils/request'
/**
 * 上传图片素材
 */

 export const uploadImage = data => {
     return request({
        method: 'POST',
        url: '/mp/v1_0/user/images',
        //一般文件上传的接口都要求把请求头中的Conten-Type 设置为 multipart/form-data,使用Axios 不需要手动设置
        //只要给data一个FormData 对象即可 new FormData()
        data
     })
 }

 /**
 * 获取图片素材
 */

export const getImage = params => {
    return request({
       method: 'GET',
       url: '/mp/v1_0/user/images',
       params
    })
}