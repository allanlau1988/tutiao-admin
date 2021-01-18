<template>
    <div class="login-container">
      <div class="login-head"></div>

      <!--
          配置Form表单 验证
          1.必须给el-form 绑定 :model 为表单数据对象
          2.给需要验证的表单项 el-form-item 绑定 props
          3.配置rules规则

          手动触发表单验证
          1.给el-form 设置ref起个名字，通过ref获取el-form的 validate方法 进行验证
      -->
      <el-form class="login-form" :model="user" ref="form" :rules="formRules">
        <el-form-item prop="mobile">
            <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item prop="code">
            <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item prop="agree">
            <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" :loading="loginLoading" class="login-btn" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>

import { login } from '@/api/user'
export default {
    name: 'LoginIndex',
    components: {

    },
    data () {
      return {
        user: {
          mobile: '13911111111',
          code: '246810',
          agree: false
        },
        //checked: false,
        loginLoading: false,
        formRules: {
            mobile: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'blur' }
          ],
            code: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { pattern: /^\d{6}$/, message: '请输入正确的验证码格式', trigger: 'blur' }
          ],
            agree: [
              {
                  //自定义校验规则
                  validator :(rule, value, callback) =>{

                      console.log(value)
                      if(value) {
                          callback()
                      }else {
                          callback(new Error("请同意勾选协议"))
                      }
                      
                  },
                  trigger: 'change'

              }
            ]
        }
      }
    },
    methods: {
        onSubmit() {
        //获取表单数据
        //const user = this.user
        //表单验证
        this.$refs['form'].validate((valid)=>{
            console.log(valid)
            //如果验证没有通过，停止请求
            if(!valid) {
                return
            }
             //验证通过
             this.login()
        })
        
        
      },

      login () {
          //开启登录中 loading...
        this.loginLoading = true
        login(this.user).then(res=>{
            console.log(res)
            this.$message({
            message: '登录成功！',
            type: 'success'
          })
          //关闭loading
          this.loginLoading = false

          //将接口返回的用户数据保存在本地，方便应用读取
          //本地存储只能存储字符串
          //如果需要保存对象，数组类型的数据，需要转换为JSON格式的字符串
          window.localStorage.setItem('user',JSON.stringify(res.data.data))

          //跳转到首页
          //this.$router.push('/')
          this.$router.push( {
              name: 'home'
          })

        }).catch(err=>{
            console.log('登录失败',err)
            this.$message.error('登录失败，手机号或验证码错误！')
            //关闭loading
            this.loginLoading = false
        })
      }

    }
}
</script>

<style scoped lang="less">
.login-container {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url('./login_bg.jpg') no-repeat;
    background-size: cover;
    .login-head {
        width: 300px;
        height: 57px;
        margin-bottom: 30px;
        background: url('./logo_index.png') no-repeat;
    }
    .login-form {
        background: #ffffff;
        padding: 50px;
        min-width: 300px;
        .login-btn {
            width: 100%;
        }
    }
}
</style>