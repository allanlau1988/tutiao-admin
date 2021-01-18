<template>
  <el-container class="layout-container">
    <el-aside 
      width="auto"
      class="aside"
    >
    <app-aside :is-collapse="isCollapse" class="aside-menu"/>
    </el-aside>
    <el-container>
      <el-header class="header">
          <div>
            <i 
              :class="{
                  'el-icon-s-fold':isCollapse,
                  'el-icon-s-unfold':!isCollapse
              }"
              @click="isCollapse=!isCollapse"
            ></i>
            <span>云迹体育后台管理系统</span>
          </div>
          <el-dropdown>
            <div class="avatar-wrap">
                <img class="avatar" :src="user.photo" alt=""/>
                <span>{{user.name}}</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>用户设置</el-dropdown-item>
                <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown>
      </el-header>
      <el-main class="main">
          <!--子路由出口-->
          <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/aside'
import { getUserProfile } from '@/api/user'
import globalBus from '@/utils/global-bus'
export default {
  name: "LayoutIndex",
  components: {
      AppAside
  },
  data() {
      return {
          user: {},
          isCollapse: false
      }
  },
  created() {
      this.loadUserProfile()

      //注册事件，监听事件
      globalBus.$on('update-user',(data)=>{
        console.log('update-user',data)
        this.user.name = data.name
        this.user.photo = data.photo
      })

  },
  methods:{
      loadUserProfile() {
          getUserProfile().then(res=>{
              this.user = res.data.data;
          })
      },
      loginOut() {

          this.$confirm('确认退出吗?', '退出提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //把用户的登录信息清空
          window.localStorage.removeItem('user')
          //跳转到登录页面
          this.$router.push('/login')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })        
        })
          
          
      }
  }
};
</script>

<style scoped lang="less">
  .layout-container{
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      .aside{
          .aside-menu{
              height: 100%;
          }
      }
      .header{
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #cccccc;
      }
      .main{
          
      }
      .avatar-wrap{
          display: flex;
          align-items: center;
          .avatar{
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-right: 10px;
          }
      }
      
  }
</style>