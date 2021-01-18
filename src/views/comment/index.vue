<template>
    <div class="comment-container">
        <el-card class="box-card">
  <div slot="header" class="clearfix">
    <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
  </div>
   <el-table
      v-loading="loading"
      :data="articles"
      class="table-list"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题"
        >
      </el-table-column>
      <el-table-column
        prop="total_comment_count"
        label="总评论数"
        >
      </el-table-column>
      <el-table-column
        prop="fans_comment_count"
        label="粉丝评论数">
      </el-table-column>
      <el-table-column
        prop="address"
        label="状态">

        <template slot-scope="scope">
            {{scope.row.comment_status ? '正常' : '关闭'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
            <el-switch
            v-model="scope.row.comment_status"
            @change="onStatusChange(scope.row)"
            :disabled="scope.row.statusDisabled"
            active-color="#13ce66"
            inactive-color="#ff4949">
            </el-switch>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[10, 20, 30, 40]"
      :page-size.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      background
      :total="totalCount">
    </el-pagination>
</el-card>
    </div>
</template>

<script>
import { getArticles, updateCommentStatus } from "@/api/article"
export default {
    name: "CommentIndex",
    data() {
        return {
          loading: true,
          statusDisabled: false,
          totalCount: 0,
          pageSize:10,
          articles: []//文章数据列表
        }
      },
      created() {
          this.loadArticles()
      },
      methods: {

          //获取评论
          loadArticles(page=1) {
              getArticles({
                  response_type: 'comment',
                  page,
                  per_page: this.pageSize
              }).then(res=>{
                  console.log(res)
                  this.loading = true
                  const { results } = res.data.data
                  results.forEach(article => {
                      article.statusDisabled = false
                  })
                  this.articles = results
                  this.totalCount = res.data.data.total_count
                  this.loading = false
              })
          },
          handleSizeChange() {
              this.loadArticles(1)
          },
          handleCurrentChange(page) {
              console.log(page)
              this.loadArticles(page)
          },
          //改变状态
          onStatusChange(article) {
              article.statusDisabled = true
              updateCommentStatus(article.id.toString(),article.comment_status).then(res=>{
                    console.log(res)
                    article.statusDisabled = false
                    this.$message({
                        type: 'success',
                        message: article.comment_status ? '开启评论状态': '关闭评论状态'
                    })
              })
          }
      }
}
</script>

<style scoped lang="less">
.table-list {
    margin-bottom: 30px;
}
</style>