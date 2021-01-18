<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div slot="header" class="clearfix">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人设置</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <el-row>
        <el-col :span="15">
          <el-form ref="form" :model="user" label-width="80px">
            <el-form-item label="编号">
              {{ user.id }}
            </el-form-item>

            <el-form-item label="手机">
              {{ user.mobile }}
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>

            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>

            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="updateProfileLoading" @click="onSubmit">保存</el-button>
              
            </el-form-item>
          </el-form>
        </el-col>

        <el-col :span="4" :offset="2">
          <el-avatar
            shape="square"
            :size="150"
            fit="fit"
            :src="user.photo"
            @click="$refs.file.click()"
          ></el-avatar>
          <p @click="$refs.file.click()">点击修改图像</p>
          <!-- <label for="file">点击修改图像</label> -->
          <input
            id="file"
            type="file"
            hidden
            ref="file"
            @change="onFileChange"
          />
        </el-col>
      </el-row>

      <el-dialog
        title="修改头像"
        :visible.sync="dialogVisible"
        append-to-body
        @opened="onDialogOpened"
        @closed="closeDialogOpend"
      >
        <div class="preview-wrap">
          <img :src="previewImage" ref="preview-image" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onUpdatePhoto" :loading="updateLoading"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from "@/api/user";
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
import globalBus from '@/utils/global-bus';
export default {
  name: "settingsIndex",
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
      user: {
        email: "",
        id: null,
        intro: "",
        mobile: "",
        name: "",
        photo: "",
      }, //用户资料
      dialogVisible: false,
      previewImage: '',
      cropper: null,
      updateLoading: false,
      updateProfileLoading: false
    };
  },
  mounted() {
    //初始化
  },
  created() {
    this.loadUser();
  },
  methods: {
    loadUser() {
      getUserProfile().then((res) => {
        console.log(res);
        this.user = res.data.data;
      });
    },
    onSubmit() {
      //验证表单

      this.updateProfileLoading = true;
      //表单通过
      const {name, intro, email } = this.user;
      updateUserProfile({
        name,
        intro,
        email
      }).then( res=>{
        console.log(res);
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.updateProfileLoading = false;

        // 发布通知，用户信息已经修改
        globalBus.$emit('update-user',this.user)

      })
    },
    onFileChange() {
      // 获取预览图片
      const file = this.$refs.file;
      const blobData = window.URL.createObjectURL(file.files[0]);
      console.log(blobData)
      this.previewImage = blobData;


      this.dialogVisible = true;

      

            // 解决选择相同图片 不触发 change事件
      this.$refs.file.value = "";

    },
    onDialogOpened () {
      const image = this.$refs['preview-image'];
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'none',
        // cropBoxMovable: false,
        // movable: true
        // crop(event) {
        //   console.log(event.detail.x)
        //   console.log(event.detail.y)
        //   console.log(event.detail.width)
        //   console.log(event.detail.height)
        //   console.log(event.detail.rotate)
        //   console.log(event.detail.scaleX)
        //   console.log(event.detail.scaleY)
        // }
      })
    },
    closeDialogOpend () {
      this.cropper.destroy()
    },

    onUpdatePhoto () {

      this.updateLoading = true;
      //获取裁切图片对象
      this.cropper.getCroppedCanvas().toBlob(file => {
        console.log(file)
        const fd = new FormData();
        fd.append('photo',file);
        //请求更新用户头像
        updateUserPhoto(fd).then( res => {
          console.log(res)
          this.dialogVisible = false;

          this.user.photo = window.URL.createObjectURL(file);
          // 把服务端返回的数据进行预览有点慢
          //this.user.photo = res.data.data.photo;

          this.updateLoading = false;
          this.$message({
            type: 'success',
            message: '更新头像成功'
          })

          globalBus.$emit('update-user',this.user)

        })

      })
      
      //关闭对话框
      //更新视图展示

    }
  },
};
</script>

<style scoped lang="less">
.preview-wrap {
  img {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>