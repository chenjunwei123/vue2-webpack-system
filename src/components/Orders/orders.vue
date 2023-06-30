<template>
<div class="orders_container">
   <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card>
  <div style="margin-top: 5px;">
    <!-- 搜索与添加区域 -->
    <el-row :gutter="40">
      <el-col :span="8">
         <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
           <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
         </el-input>
      </el-col>
    </el-row>
  </div>
  <!-- //用户数据表格区域 -->
<el-table
      border
      stripe
      :data="orderList"
      style="width: 100%">
      <el-table-column align="center" type="index" width="50" label="#"></el-table-column>
      <el-table-column align="center" prop="order_number" label="订单编号" width="250">
      </el-table-column>
      <el-table-column align="center" prop="order_price" label="订单价格" width="180">
      </el-table-column>
      <el-table-column align="center" label="是否付款">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pay_status" type="primary">已付款</el-tag>
          <el-tag v-else type="danger">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="is_send" label="是否发货">
      </el-table-column>
      <el-table-column align="center" prop="create_time" label="下单时间">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" round @click="showEditDialog"></el-button>
            <el-button type="success" icon="el-icon-location" round  @click="showProgressDialog(scope.row)"></el-button>
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
<!-- 修改地址对话框 -->
<el-dialog
@close="handleEditAddressDialogClose"
  title="修改地址"
  :visible.sync="editAddressDialogVisiable"
  width="50%">
 <el-form :model="editAddressForm.address" :rules="addAddressRules" ref="editAddressFromRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="省市区/县" prop="address">
    <el-cascader :options="cityData" v-model="editAddressForm.address"></el-cascader>
  </el-form-item>
  <el-form-item label="详细地址" prop="moreAddress">
    <el-input v-model="editAddressForm.moreAddress"></el-input>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editAddressDialogVisiable = false">取 消</el-button>
    <el-button type="primary" @click="editAddressDialogVisiable = false">确 定</el-button>
  </span>
</el-dialog>
<!-- 物流信息对话框 -->
<el-dialog
  title="物流信息"
  :visible.sync="progressDialogVisiable"
  width="50%">
   <el-timeline :reverse="false">
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.ftime">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>
</div>
</template>

<script>
import cityData from './citydata'
export default {
  components: {},
  props: {},
  data () {
    return {
      // 用于发起网络请求获取用户列表所需的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 所取得的订单数据数组
      orderList: [],
      // 总页数
      total: 0,
      // 编辑订单对话框可视化
      editAddressDialogVisiable: false,
      // 修改地址对象
      editAddressForm: {
        address: [],
        moreAddress: ''
      },
      // 修改地址股则
      addAddressRules: {
        address: [
          { required: true, message: '请输入省市区/县', trigger: 'blur' }
        ],
        moreAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 地址数据
      cityData,
      // 物流信息对话框可视化
      progressDialogVisiable: false,
      // 物流信息
      progressInfo: [],
      // 防抖定时器
      antiShakeTimer: null
    }
  },
  watch: {
    'queryInfo.query' () {
      this.antiShakeTimer = this.$antiShake(this.getOrderList, 500, this.antiShakeTimer)
    }
  },
  computed: {},
  methods: {
    // 获取用户数据列表方法
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      //
      if (res.meta.status !== 200) return this.$message.error('获取订单数据列表失败')
      this.$message.success('获取订单数据列表成功')
      this.orderList = res.data.goods
      this.total = res.data.total
      this.orderList.forEach(item => {
        item.create_time = new Date(item.create_time).toLocaleString()
      })
    },
    // 显示修改地址对话框
    showEditDialog () {
      this.editAddressDialogVisiable = true
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      //
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听pagenum改变的事件
    handleCurrentChange (newPage) {
      //
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 监听修改地址对话框的关闭事件
    handleEditAddressDialogClose () {
      this.$refs.editAddressFromRef.resetFields()
    },
    // 监听打开物流信息的对话框
    async showProgressDialog (row) {
      this.progressDialogVisiable = true
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取订单物流进度失败')
      this.$message.success('获取订单物流进度成功')
      this.progressInfo = res.data
    }
  },
  created () {
    this.getOrderList()
  },
  mounted () {}
}
</script>

<style scoped lang='less'>
</style>
