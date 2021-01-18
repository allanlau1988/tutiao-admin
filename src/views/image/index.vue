<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <image-list/>
    </el-card>

    <!-- 上传图片素材 -->
    <!-- action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images" -->
    <!-- action="http://192.168.0.127:8080/file/uploadPic" -->

  </div>
</template>

<script>
import ImageList from './components/image-list.vue';

export default {
  name: "ImageIndex",
  components: {ImageList},
  data() {
    return {
      
    }
  },
  created() {
    
  },
  methods: {
    
  },
};
</script>

<style scoped lang="less">
// .action-head {
//   padding-bottom: 20px;
//   display: flex;
//   justify-content: space-between;
// }

// .image-item{
//   position: relative;
//   .action-image{
//     font-size: 22px;
//     color: #ffffff;
//     display: flex;
//     justify-content: space-evenly;
//     align-items: center;
//     position: absolute;
//     height: 35px;
//     background-color: rgba(204, 204, 204, .5);
//     bottom: 4px;
//     right: 0px;
//     left: 0px;
//     width: 57%;
//   }
// }
</style>