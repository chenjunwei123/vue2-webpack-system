<template>
<div class="login_container">
<div class="login_box">
  <!-- 头像区域 -->
  <div class="avatar_box">
    <img src="../assets/logo.png" alt="">
  </div>
  <!-- 表单区域 -->
  <el-form ref="loginFormRef" label-width="80px" class="login_form" :model="loginForm" :rules="LoginRules">
  <el-form-item label="用户名" prop="username">
    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input prefix-icon="iconfont icon-suo" v-model="loginForm.password" type="password"></el-input>
  </el-form-item>
  <el-form-item class="btns">
    <el-button type="primary" @click="startLogin">登陆</el-button>
    <el-button type="info" @click="resetLoginForm">重置</el-button>
  </el-form-item>
  </el-form>
</div>
<LoginBackground class="bg"/>
</div>
</template>

<script>
import LoginBackground from './background/loginBackground'
export default {
  components: { LoginBackground },
  props: {},
  data () {
    return {
      // 表单数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      LoginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  methods: {
    // 点击重置按钮，重置表单数据为初始值
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 点击登陆按钮，验证表单规则，消息提示，token身份保存sessionstorage,跳转/home
    startLogin () {
      this.$refs.loginFormRef.validate(async (isValid) => {
        if (!isValid) return false
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(await this.$http.post('login', this.loginForm))
        if (res.meta.status !== 200) {
          this.$message.error('登录失败')
        } else {
          this.$message.success('登陆成功')
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push({ path: '/home' })
        }
      })
    }
  },
  created () {},
  mounted () {}
}
</script>

<style scoped lang='less'>
.login_container {
  height: 100%;
  background-color: #1e1e1e;
  .login_box {
    height: 300px;
    width: 450px;
    border-radius: 5px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box {
      height: 120px;
      width: 120px;
      border-radius: 60px;
      background-color: #fff;
      border: 1px solid #fff;
      padding: 5px;
      overflow: hidden;
      position: absolute;
      left: 50%;
      // top: 50%;
      transform: translate(-50%,-50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .btns {
      display: flex;
      justify-content: flex-end;
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 85%;
      padding: 10px 20px;
    }
  }
  .bg {
    // position: absolute;
    height: 99%;
    top:0
  }
}
</style>
