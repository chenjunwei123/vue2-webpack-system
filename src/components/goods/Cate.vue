<template>
<div class="cate_containers">
<!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card>
  <el-row>
    <el-col>
      <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
    </el-col>
  </el-row>
  <zk-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" class="treetable" :show-index="true" index-text="#" border :show-row-hover="true">
    <!-- 是否有效模板列 -->
    <template slot="isok" slot-scope="scope">
      <i class="el-icon-success" v-if="scope.row.cat_deleted" style="color:lightgreen;"></i>
      <i class="el-icon-error" v-if="!scope.row.cat_deleted" style="color:red;"></i>
    </template>
    <!-- 排序等级模板列 -->
    <template slot="order" slot-scope="scope">
      <el-tag type="primary" v-if="scope.row.cat_level == 0">一级</el-tag>
      <el-tag type="danger" v-if="scope.row.cat_level == 1">二级</el-tag>
      <el-tag type="warning" v-if="scope.row.cat_level == 2">三级</el-tag>
    </template>
     <!-- 操作模板列 -->
    <template slot="opt">
      <el-button type="primary">编辑</el-button>
      <el-button type="danger">删除</el-button>
    </template>
  </zk-table>
  <!-- 分页区域 -->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1,3,5,7,9]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>

<!-- 添加分类对话框 -->
<el-dialog
@close="addCateDialogClose"
  title="添加分类"
  :visible.sync="addCateDialogVisible"
  width="50%">
  <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类">
  <el-cascader
      v-model="selectKeys"
      :options="parentCateList"
      :props="cascaderProps"
      @change="parentCateChange" size="mini" clearable :change-on-select="true"></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCateThrottle">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      // 商品分类数据列表
      cateList: [],
      // 请求 商品分类数据列表 参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总商品分类数量
      total: 0,
      // 为TableTree指定列的定义
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        {
          label: '是否有效',
          // 将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ],
      // 添加分类对话框可视化
      addCateDialogVisible: false,
      // 添加分类数据表单
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      },
      // 父级分类数据列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 选中的父级Id数组
      selectKeys: []
    }
  },
  watch: {},
  computed: {
    //  防止用户重复提交添加角色对话框表单按钮
    addCateThrottle () {
      return this.$throttle(this.addCate, 500)
    }
  },
  methods: {
    // 发起网络请求，得到商品分类数据方法
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      //
      if (res.meta.status !== 200) return this.$message.error('获取商品数据列表失败')
      this.$message.success('获取商品数据列表成功')
      //
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听pageSize的改变
    handleSizeChange (newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getCateList()
      //
    },
    // 监听dpagenum的改变
    handleCurrentChange (newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getCateList()
    },
    // 点击按钮显示添加分类对话框
    showAddCateDialog () {
      this.addCateDialogVisible = true
      this.getParentCateList()
    },
    // 打开添加分类对话框之后，获取父级分类的数据列表
    async getParentCateList () {
      const queryInfo = {
        type: 2
      }
      const { data: res } = await this.$http.get('categories', { params: queryInfo })

      //
      if (res.meta.status !== 200) return this.$message.error('获取父级分类商品数据列表失败')
      this.$message.success('获取父级分类商品数据列表成功')
      this.parentCateList = res.data
      //
    },
    // 选择项发生变法
    parentCateChange () {
      //
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addCateForm.cat_level = this.selectKeys.length
        return true
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加商品分类，点击确定按钮
    addCate () {
      this.$refs.addCateFormRef.validate(async isvalid => {
        if (!isvalid) return false
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类商品数据失败')
        this.$message.success('添加分类商品数据成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听添加商品分类对话框的关闭
    addCateDialogClose () {
      this.$refs.addCateFormRef.resetFields()
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
      this.selectKeys = []
    }
  },
  created () {
    this.getCateList()
  },
  mounted () {}
}
</script>

<style scoped lang='less'>
.treetable {
  margin-top: 20px;
}
</style>
