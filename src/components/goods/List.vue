<template>
<div class="list_container">
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-input
    placeholder=""
    v-model="queryInfo.query" clearable @clear="getGoodsList">
    <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
  </el-input>
    </el-col>
    <el-col :span="4">
    <el-button type="primary"
    @click="goAddGoodsPage">添加商品</el-button>
    </el-col>
  </el-row>
  <el-table :data="goodsList" border stripe>
      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name" align="center"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price" align="center"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" align="center"></el-table-column>
      <el-table-column label="创建时间" prop="add_time" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="warning" icon="el-icon-delete" @click="delGoodsById(scope.row)">删除</el-button>
        </template>
      </el-table-column>
   </el-table>
   <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1,3,5,9]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<!-- 编辑用户对话框 -->
<!-- <el-dialog
@close="handleEditUserDialogClose"
  title="编辑商品"
  :visible.sync="editGoodsDialogVisiable"
  width="50%">
 <el-form :model="editGoodsForm" :rules="addGoodssRules" ref="editUsersFromRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="editGoodsForm.username" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editGoodsForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="editGoodsForm.mobile"></el-input>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editGoodsDialogVisiable = false">取 消</el-button>
    <el-button type="primary" @click="editGoods">确 定</el-button>
  </span>
</el-dialog> -->
</div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      // 商品列表请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表数据
      goodsList: [],
      // 总商品数量
      total: 0,
      antiShakeTimer: null
    }
  },
  watch: {
    'queryInfo.query' () {
      this.antiShakeTimer = this.$antiShake(this.getGoodsList, 500, this.antiShakeTimer)
    }
  },
  computed: {},
  methods: {
    // 发起网络请求，得到商品列表数据方法
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      //
      if (res.meta.status !== 200) return this.$message.error('获取商品数据列表失败')
      this.$message.success('获取商品数据列表成功')
      //
      this.goodsList = res.data.goods
      this.total = res.data.total
      // console.log(this.goodsList)
      this.goodsList.forEach(item => {
        item.add_time = new Date(item.add_time).toLocaleString()
      })
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听pagenum改变的事件
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 删除商品
    delGoodsById (row) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // console.log(1)
        const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('删除商品数据列表失败')
        // console.log(3)
        this.getGoodsList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 跳转至添加商品页面
    goAddGoodsPage () {
      this.$router.push('/goods/add')
    }
  },
  created () {
    this.getGoodsList()
  },
  mounted () {}
}
</script>

<style scoped lang='less'>
</style>
