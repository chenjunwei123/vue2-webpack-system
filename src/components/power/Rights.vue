<template>
<div class="rights_container">
   <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card>
    <el-table :data="rightList" border stripe>
      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column label="权限名称" prop="authName" align="center"></el-table-column>
      <el-table-column label="路径" prop="path" align="center"></el-table-column>
      <el-table-column label="权限等级" prop="level" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level == 0">一级</el-tag>
          <el-tag v-if="scope.row.level == 1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.level == 2" type="warning">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      // 权限列表数据
      rightList: []
    }
  },
  watch: {},
  computed: {},
  methods: {
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      this.rightList = res.data
    }
  },
  created () {
    this.getRightsList()
  },
  mounted () {}
}
</script>

<style scoped lang='less'>
</style>
