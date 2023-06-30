<template>
  <el-container>
    <!-- 头部区域 -->
  <el-header>
    <div>
      <img src="../assets/huya.jpg" alt="">
      <span>后台管理系统</span>
    </div>
    <el-button ref="fulScreenBtn"  @click="fullScreenButtonHandle">{{fulScreenBtnName}}</el-button>
    <el-button @click="logOut">退出</el-button>
  </el-header>
  <!-- 页面主体区域 -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="toggle_button" @click="toggleCollapse" >|||</div>
      <el-menu
      :default-active="activePath"
      router
      :collapse-transition="false"
      mode="vertical"
      :collapse="isCollapse"
      background-color="#4ed8eb"
      text-color="red"
      active-text-color="#ffd04b"
      unique-opened>
      <!-- 一级菜单 -->
      <el-submenu :index="String(item.id)" v-for="item in menuList" :key="item.id">
        <!-- 一级菜单模板区域 -->
        <template slot="title">
          <i :class="iconObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/'+item1.path" v-for="item1 in item.children" :key="item1.id" @click="saveNavState('/'+item1.path)">
           <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{item1.authName}}</span>
        </template>
        </el-menu-item>
        </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 右侧 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import screenfull from 'screenfull'
const sf = screenfull
export default {
  props: {},
  data () {
    return {
      menuList: [],
      // 菜单栏icon,以每个1级菜单的id为属性名
      iconObj: {
        125: 'iconfont icon-morentouxiang',
        103: 'iconfont icon-volumemeasurement',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-mianxingdanju',
        145: 'iconfont icon-_baobiao'
      },
      // 菜单栏折叠属性
      isCollapse: false,
      // 激活菜单栏路径
      activePath: '',
      // 全屏
      isFullScreen: false
    }
  },
  watch: {},
  computed: {
    // 全屏按钮文本
    fulScreenBtnName () {
      return this.isFullScreen ? '退出全屏' : '全屏'
    }
  },
  methods: {
    // 点击全屏按钮
    fullScreenButtonHandle (e) {
      if (!sf.isEnabled) {
        return
      }
      sf.toggle()
    },
    // // 监听全屏事件
    change () {
      if (sf.isEnabled) {
        this.isFullScreen = sf.isFullscreen
        // 这里修改按钮的文本，确实改变了，但是因为不是data或计算属性或者监听之类的，页面是不会重新渲染的
      }
    },
    // 推迟登陆功能，并返回登录界面
    logOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 定义发起网络请求，得到左侧菜单栏数据的方法
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('菜单数据获取失败，请重新刷新页面')
      this.menuList = res.data
      // console.log(this.menuList)
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 点击二级菜单使其保持高亮状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = window.sessionStorage.getItem('activePath')
    }
  },
  created () {
    if (sf.isEnabled) {
      sf.on('change', this.change)
    }
    // 发起网络请求，得到左侧菜单栏数据
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  mounted () {

  }
}
</script>

<style scoped lang='less'>
.el-container {
  height: 100%;
}
.el-header {
  background-color: rgb(103, 243, 189);
  img {
    background-color: rgb(103, 243, 189);
    height: 100%;
    margin-right: 10px;
  }
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: black;
  font-size: 20px;
  font-weight: 600;
  div {
    height: 80%;
    display: flex;
    align-items: center;
  }
}
.el-aside {
  background-color: rgb(78, 216, 235);
  .toggle_button {
    background-color: rgb(78, 216, 235);
    color: red;
    font-size: 18px;
    display: flex;
    justify-content: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
.el-main {
  background-color: #eee;
}
.iconfont {
  margin-right: 10px;
}
span {
  font-size: 18px;
}
.el-menu {
  border-right: 0px;
}
.bg {
    // position: absolute;
    height: 800px;
    bottom: 0;
    right: 0;
  }
</style>
