<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="form" :model="form" label-width="80px" size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择活动区域">
            <el-option
              label="全部"
              :value="null"
            >

            </el-option>
            <el-option 
                :label="channel.name" 
                :value="channel.id"
                v-for="(channel,index) in channels"
                :key="index"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :default-time="['12:00:00']"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button :disabled="loading" type="primary" @click="loadArticles(1)">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到 {{totalCount}} 条结果：
      </div>
      <!--数据列表-->
      <el-table :data="articles" v-loading="loading" style="width: 100%" class="list-table">
        <el-table-column prop="date" label="封面" width="180">
            <template slot-scope="scope">
                <img 
                  v-if="scope.row.cover.images[0]"
                  class="article-cover"
                  :src="scope.row.cover.images[0]" 
                  alt=""/>
                  <img 
                  v-else
                  class="article-cover"
                  src="./error.gif" 
                  alt=""/>
            </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180">
        </el-table-column>
        <el-table-column prop="status" label="状态"> 
            <template slot-scope="scope">
              <el-tag :type="articleStatus[scope.row.status].type">{{articleStatus[scope.row.status].text}}</el-tag>
              <!-- <el-tag v-if="scope.row.status === 0" type="warning">草稿</el-tag>
              <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
              <el-tag v-else-if="scope.row.status === 2" type="success">审核通过</el-tag>
              <el-tag v-else-if="scope.row.status === 3" type="danger">审核失败</el-tag>
              <el-tag v-else-if="scope.row.status === 4" type="info">已删除</el-tag> -->
            </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" circle icon="el-icon-edit" @click="$router.push('/publish?id='+scope.row.id)"
              ></el-button
            >
            <el-button
              size="mini"
              type="danger"
              circle
              icon="el-icon-delete"
              @click="handleDelete(scope.row.id)"
              ></el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!--end数据列表-->
      <el-pagination 
        background layout="prev, pager, next" 
        :total="totalCount"
        @current-change = "onCurrentChange"
        :current-page.sync="page"
        :disabled="loading"
        :page-size="pageSize"
        />
    </el-card>
  </div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from "@/api/article";
export default {
  name: "ArticleIndex",
  components: {},
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        desc: "",
      },

      articles: [], //文章数据列表
      articleStatus: [
          { status: 0, text: '草稿', type: 'info'},
          { status: 1, text: '待审核', type: ''},
          { status: 2, text: '审核通过', type: 'success'},
          { status: 3, text: '审核失败', type: 'warning'},
          { status: 4, text: '已删除', type: 'danger'}
      ],
      totalCount: 0,
      pageSize: 10,
      status: null, //查询文章的状态 ，不传就是全部
      channels: [], //文章频道列表
      channelId: null, //查询文章的频道
      rangeDate: null,
      page: 1,
      loading: true
    };
  },
  methods: {
   
    loadChannels() {
        getArticleChannels().then(res=>{
            console.log(res)
            this.channels = res.data.data.channels
        })
    },

    loadArticles(page=1) {

      this.loading = true
      getArticles({
          page,
          per_page: this.pageSize,
          status: this.status,
          channel_id: this.channelId,
          begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
          end_pubdate: this.rangeDate ? this.rangeDate[1] :null
      }).then((res) => {
        console.log(res)
        const { results, total_count:totalCount} = res.data.data
        this.articles = results
        this.totalCount = totalCount

        //关闭loading
        this.loading = false
      });
    },
    onSubmit() {
      console.log("submit!");
    },
    onCurrentChange(page) {
        console.log(page)
        this.loadArticles(page)
    },
    handleDelete(articleId) {

       this.$confirm('确认删除吗?', '退出提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteArticle(articleId).then(res=>{
              console.log(res)
              //删除成功，更新第几页的数据列表
              this.loadArticles(this.page)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })        
        })
    }
  },
  created() {
    this.loadChannels();
    this.loadArticles(1);
  },
};
</script>

<style scoped lang="less">
.filter-card {
  margin-bottom: 30px;
}
.list-table {
  margin-bottom: 20px;
}
.article-cover {
    width: 100px;
    background-size:cover;
}
</style>