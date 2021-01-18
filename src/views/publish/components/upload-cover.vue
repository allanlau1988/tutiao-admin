<template>
  <div class="upload-container">
    <div class="upload-cover" @click="showCoverSelect">
      <img
        class="upload-img"
        ref="cover-image"
        :src="value"
      />
    </div>
    <el-dialog title="选择图片" :visible.sync="dialogVisible" append-to-body>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
           <image-list 
             :is-show-add="false" 
             :is-show-action="false"
             is-show-selected
             ref="image-list"
          />
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
            <input type="file" ref="fileImg" @change="onFileChange" />
            <!-- <img ref="preview-image" src="" width="100" /> -->
            <img :src="previewImage" ref="preview-image" width="100"/>
        </el-tab-pane>
        
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '@/api/image'
import imageList from '../../image/components/image-list.vue';
export default {
  components: { imageList },
  name: "UploadIndex",
  //props: ['cover-image'],
  props: ['value'], //v-model 默认给子组件传递了一个 value 参数 同时默认 监听了 input 事件
  data() {
    return {
      dialogVisible: false,
      activeName: 'second',
      previewImage: ''
    };
  },
  methods: {
    showCoverSelect() {
      this.dialogVisible = true;
    },
     handleClick(tab, event) {
      console.log(tab, event);
    },
    onFileChange() {
        // 读取文件对象
        // const file = this.$refs.file.files[0];
        //获取预览图片
        // var blob = window.URL.createObjectURL(file);
        const file = this.$refs.fileImg;
        console.log(file.files[0])
        const blobData = window.URL.createObjectURL(file.files[0]);
        console.log(blobData)
        this.previewImage = blobData;
      

        //this.$refs.file.value = ''
    },
    onCoverConfirm() {
        // 如果tab 选项卡是 上传图片 并且 input-file 有选择的文件 才执行 上传的操作

        if(this.activeName === 'second') {
            const file = this.$refs.fileImg.files[0];
            if(!file) {
                this.$message('请选择文件！');
                return
            }
            // 执行上传文件的操作
            const fd = new FormData();
            fd.append('image',file)
            uploadImage(fd).then(res => {
                this.dialogVisible = false;
                //展示图片
                this.$refs['cover-image'].src = res.data.data.url;
                //将图片地址发送给父组件
                //this.$emit('update-cover',res.data.data.url)

                this.$emit('input',res.data.data.url)
            })
        }else if(this.activeName === 'first') {
          const imageList = this.$refs['image-list']
          console.log(imageList.selected)
          const selected = imageList.selected
          if(selected ==='null') {
            this.$message('请选择封面')
            return
          }

          this.dialogVisible = false
          this.$emit('input',imageList.images[selected].url)
        }
    }
  },
};
</script>

<style scoped lang="less">
.upload-cover {
  width: 150px;
  height: 120px;
  border: 1px solid #ddd;
  .upload-img {
    height: 120px;
    max-width: 100%;
  }
}
</style>