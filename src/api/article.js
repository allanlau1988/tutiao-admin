/**
 * 文章相关的接口
 */
import request from '@/utils/request'
export const getArticles = params => {
    return request({
        method: 'GET',
        url: '/mp/v1_0/articles',
        // body 参数使用 data设置
        // query 参数使用 params设置
        //headers 参数使用 headers设置
        params
    })
}

/**
 * 获取频道列表
 * @param {} params 
 */
export const getArticleChannels = () => {
    return request({
        method: 'GET',
        url: '/mp/v1_0/channels',
    })
}

/**
 * 删除文章
 * @param {} params 
 */
export const deleteArticle = articleId => {
    return request({
        method: 'DELETE',
        url: `/mp/v1_0/articles/${articleId}`,
    })
}

/**
 * 新建文章
 * @param {} params 
 */
export const addArticle = (data,draft=false) => {
    return request({
        method: 'POST',
        url: 'mp/v1_0/articles',
        params: {
            draft //是否存为草稿，true为草稿
        },
        data
    })
}

/**
 * 编辑文章
 * @param {} params 
 */
export const updateArticle = (articleId,data,draft=false) => {
    return request({
        method: 'PUT',
        url: `mp/v1_0/articles/${articleId}`,
        params: {
            draft //是否存为草稿，true为草稿
        },
        data
    })
}

/**
 * 获取指定文章
 * @param {} params 
 */
export const getArticle = articleId => {
    return request({
        method: 'GET',
        url: `mp/v1_0/articles/${articleId}`,
    })
}

/**
 * 修改文章评论状态
 * @param {} params 
 */
export const updateCommentStatus = (articleId,allowComment) => {
    return request({
        method: 'PUT',
        url: 'mp/v1_0/comments/status',
        //query参数
        params: {
            article_id: articleId
        },
        //body请求体
        data: {
            allow_comment: allowComment
        }
    })
}