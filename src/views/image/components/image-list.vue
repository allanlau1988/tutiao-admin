<template>
    <div class="image-list">
        <div class="action-head">
        <el-radio-group @change="collectChange" v-model="collect" size="mini">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>

        <el-button
          type="success"
          size="mini"
          v-if="isShowAdd"
          @click="dialogUploadVisible = true"
          >上传素材</el-button
        >
      </div>

      <!-- 素材列表  :span="4"-->
      <el-row>
        <el-col
          :xs="12"
          :sm="6"
          :md="6"
          :lg="4"
          v-for="(img, index) in images"
          :key="index"
          class="image-item"
          @click.native="selected = index"
        >
          <el-image
            style="width: 100px; height: 100px"
            :src="img.url"
            fit="cover"
          ></el-image>

          <div class="selected" v-if="isShowSelected && selected === index">

          </div>

          <div v-if="isShowAction" class="action-image">
            <i :class="{
              'el-icon-star-on': img.is_collected,
              'el-icon-star-off': !img.is_collected
            }"></i>
            <i class="el-icon-delete-solid"></i>
          </div>
        </el-col>
      </el-row>

      <el-pagination @current-change="onPageChange" 
        background layout="prev, pager, next" 
        :total="total_count"
        :page-size="pageSize"
        :current-page.sync="page"
        >
      </el-pagination>

      <el-dialog
      title="上传素材"
      :visible.sync="dialogUploadVisible"
      :append-to-body="true"
    >
      <el-upload
        class="upload-demo"
        drag
        
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        :on-success="uploadSuccess"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>


    </div>
</template>

<script>
import { getImage } from "@/api/image";
export default {
  name: "ImageList",
  components: {},
  props: {
      //传给 按钮 上传素材
      isShowAdd: {
          type: Boolean,
          default: true
      },
      isShowAction: {
          type: Boolean,
          default: true
      },
      isShowSelected: {
          type: Boolean,
          default: false
      }
  },
  data() {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return {
      collect: false,
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      images: [],
      total_count: 0,
      pageSize: 10,
      page: 1,//当前页数
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
      selected: null //选中的索引
    };
  },
  created() {
    this.loadImage(1,false)
  },
  methods: {
    loadImage(page=1) {
      this.page = page
      getImage({
        collect:this.collect,
        page,
        per_page: this.pageSize
      }).then((res) => {
        console.log(res);
        this.images = res.data.data.results
        this.total_count = res.data.data.total_count
      });
    },
    collectChange(value) {
      this.loadImage(1,value);
    },
    uploadSuccess() {
      //关闭对话框
      this.dialogUploadVisible = false
      //更新图片素材
      this.loadImage( this.page)
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    onPageChange(value) {
      console.log(value)
      this.loadImage(value)
    }
  },
};
</script>

<style scoped lang="less">
.action-head {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.image-item{
  position: relative;
  .selected{
    background: url(./selected.png) no-repeat;
    background-size: cover;
    position: absolute;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
  }
  .action-image{
    font-size: 22px;
    color: #ffffff;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    position: absolute;
    height: 35px;
    background-color: rgba(204, 204, 204, .5);
    bottom: 4px;
    right: 0px;
    left: 0px;
    width: 57%;
  }

}


</style>