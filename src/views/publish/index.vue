<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            $route.query.id ? "修改文章" : "发布文章"
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form 
        ref="publish-form" 
        :model="article" 
        label-width="60px"
        :rules="formRules"
        >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
          <el-tiptap
            lang="zh"
            v-model="article.content"
            :extensions="extensions"
            height="350"
            placeholder="请输入文章内容"
          />
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>

          <!-- 在组件上使用 v-model -->
          <template v-if="article.cover.type > 0">
            <!-- <upload-cover
            :key="cover"
            :cover-image="article.cover.images[index]"
            v-for="(cover, index) in article.cover.type"
            @update-cover="onUpdateCover(index,$event)"
          /> -->


          <upload-cover
            :key="cover"
            v-model="article.cover.images[index]"
            v-for="(cover, index) in article.cover.type"
           
          />

          </template>
          

        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              v-for="(channel, index) in channels"
              :label="channel.name"
              :value="channel.id"
              :key="index"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit(false)"
            >立即创建</el-button
          >
          <el-button @click="onSubmit(true)">草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  getArticleChannels,
  addArticle,
  getArticle,
  updateArticle,
} from "@/api/article";
import { uploadImage } from "@/api/image";
import "element-tiptap/lib/index.css";
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Image,
} from "element-tiptap";

import UploadCover from './components/upload-cover.vue';

export default {
  name: "PublishIndex",
  components: {
    "el-tiptap": ElementTiptap,
    UploadCover
  },

  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      channels: [], //频道数组
      article: {
        title: "",
        content: "",
        cover: {
          type: 1, //默认写0 -1:自动 0:没有图 1:一张 3:三张
          images: [],
        },
        channel_id: null,
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // render command-button in bubble menu.
        new Image({
          uploadRequest(file) {
            const fd = new FormData();
            fd.append("image", file);
            return uploadImage(fd).then((res) => {
              console.log(res);
              return res.data.data.url;
            });
          },
        }),
        new Underline({ bubble: true, menubar: false }), // render command-button in bubble menu but not in menubar.
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
      ],
      formRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur'},
          { min: 5, max: 30, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        content: [
          {
            //自定义验证规则
            validator (rule,value,callback) {
              if(value === "<p></p>") {
                //验证失败
                callback(new Error('请输入文章内容'))
              }else {
                //验证通过
                callback()
              }
            }
          },
          { required: true, message: '请输入内容', trigger: 'blur'},
        ],
        channel_id: [
          { required: true, message: '请选择文章频道', trigger: 'blur'}
        ]
      }
    };
  },
  created() {
    this.loadArticleChannels();

    if (this.$route.query.id) {
      this.loadArticle();
    }
  },
  methods: {
    onSubmit(draft = false) {
      this.$refs['publish-form'].validate(valid=>{
        if(!valid) {
          return
        }

        //验证通过
        const articleId = this.$route.query.id;
      if (articleId) {
        updateArticle(articleId, this.article, draft).then((res) => {
          console.log(res);
          this.$message({
            message: "修改成功",
            type: "success",
          });
        });
      } else {
        addArticle(this.article, draft).then((res) => {
          console.log(res);
          this.$message({
            //message: "发布成功",
            message: `${draft ? "存入草稿" : "发布"}成功`,
            type: "success",
          });
          this.$router.push("/article");
        });
      }

      })
      
    },
    loadArticleChannels() {
      getArticleChannels().then((res) => {
        this.channels = res.data.data.channels;
      });
    },
    loadArticle() {
      getArticle(this.$route.query.id).then((res) => {
        console.log(res);
        this.article = res.data.data;
      });
    },

    onUpdateCover (index,url) {
      console.log(index,url)
      //this.article.cover.images[0] = url;
      this.article.cover.images[index] = url;
    }

  },
};
</script>

<style scoped lang="less">
</style>