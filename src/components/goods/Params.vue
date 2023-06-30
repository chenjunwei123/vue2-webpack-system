<template>
<div class="params_container">
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>参数列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card>
  <el-alert
    :closable=false
    title="注意:只允许为第三级分类设置相关参数"
    type="warning"
    show-icon>
  </el-alert>
  <el-row>
    <el-col>
      <span>选择商品分类:  </span>
      <el-cascader
        v-model="selectKey"
        :options="cateList"
        :props="cascaderProps"
        @change="parentCateChange">
        </el-cascader>
    </el-col>
  </el-row>
  <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <el-tab-pane label="动态参数" name="many">
      <el-button type="primary" :disabled="!isBtnDisable" @click="addAttrThrottle">添加参数</el-button>
      <el-table :data="manyTableData" border stripe>
        <el-table-column type="expand" align="center">
          <template slot-scope="scope">
            <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="removeTags(scope.row,index)">{{item}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInputRef"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
          </template>
        </el-table-column>
         <el-table-column type="index" label="#" align="center"></el-table-column>
         <el-table-column label="参数名称" align="center" prop="attr_name"></el-table-column>
         <el-table-column label="操作" align="center">
           <template slot-scope="scope">
             <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
             <el-button type="danger" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
           </template>
         </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only">
      <el-button type="primary" :disabled="!isBtnDisable" @click="addAttr">添加参数</el-button>
      <el-table :data="onlyTableData" border stripe>
        <el-table-column type="expand" align="center">
          <template slot-scope="scope">
            <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="removeTags(scope.row,index)">{{item}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInputRef"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
          </template>
        </el-table-column>
         <el-table-column type="index" label="#" align="center"></el-table-column>
         <el-table-column label="属性名称" align="center" prop="attr_name"></el-table-column>
         <el-table-column label="操作" align="center">
           <template slot-scope="scope">
             <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
             <el-button type="danger" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
           </template>
         </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</el-card>
<!-- 添加参数对话框 -->
<el-dialog
  @close="addAttrDialogClose"
  :title="'添加'+titleText"
  :visible.sync="addAttrDialogVisible"
  width="50%">
  <el-form :model="addAttrForm" :rules="addAttrFormRules" ref="addAttrFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addAttrForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addAttrDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addAttrSubmit">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑参数对话框 -->
<el-dialog
  @close="editAttrDialogClose"
  :title="'编辑参数'+titleText"
  :visible.sync="editAttrDialogVisible"
  width="50%">
  <el-form :model="editAttrForm" :rules="editAttrFormRules" ref="editAttrFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editAttrForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editAttrDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editAttrSubmit">确 定</el-button>
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
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 选中的父级Id数组
      selectKey: [],
      // 被选中标签名字
      activeName: 'many',
      // 动态属性列表
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],
      // 添加参数对话框可视化
      addAttrDialogVisible: false,
      // 添加对话框参数/属性
      addAttrForm: {
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
      // 添加对话框表单规则
      addAttrFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 编辑对话框可视化
      editAttrDialogVisible: false,
      // 编辑表单数据对象
      editAttrForm: {},
      // 编辑表单数据规则对象
      editAttrFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 添加标签Input的可视化
      inputVisible: false,
      // 添加标签Input的Value值
      inputValue: ''
    }
  },
  watch: {},
  computed: {
    // 添加参数按钮是否启用
    isBtnDisable () {
      return this.selectKey.length === 3
    },
    // 当前选中的三级分类ID
    cateId () {
      return this.selectKey[this.selectKey.length - 1]
    },
    // 区分添加参数/添加属性对话框的title
    titleText () {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    },
    //  防止用户重复添加动态参数
    addAttrThrottle () {
      return this.$throttle(this.addAttr, 500)
    }
  },
  methods: {
    // 发起网络请求，得到商品分类数据方法
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      //
      if (res.meta.status !== 200) return this.$message.error('获取商品数据列表失败')
      this.$message.success('获取商品数据列表成功')
      //
      this.cateList = res.data
      // console.log(this.cateList)
    },
    // 选择项发生变法
    async parentCateChange () {
      this.getParamsData()
    },
    // 标签点击事件方法
    handleTabClick () {
      this.getParamsData()
    },
    // 获取参数列表数据
    async getParamsData () {
      if (this.selectKey.length !== 3) {
        this.selectKey = []
        this.manyTableData = []
        this.onlyTableData = []
        return false
      } else {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
        if (res.meta.status !== 200) return this.$message.error('获取分类参数失败')
        this.$message.success('获取分类参数成功')
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals === '' ? [] : item.attr_vals.split(',')
          item.inputVisible = false
          item.inputValue = ''
        })
        console.log(res.data)
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      }
    },
    // 添加参数/属性
    addAttr () {
      this.addAttrDialogVisible = true
    },
    // 监听添加参数/属性对话框的关闭
    addAttrDialogClose () {
      this.$refs.addAttrFormRef.resetFields()
      this.addAttrForm = {}
    },
    // 添加参数对话框确定按钮点击事件
    addAttrSubmit () {
      this.$refs.addAttrFormRef.validate(async isValid => {
        if (!isValid) return false
        this.addAttrForm.attr_sel = this.activeName
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, this.addAttrForm)
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.getParamsData()
        this.addAttrDialogVisible = false
      })
    },
    // 显示编辑对话框
    async showEditDialog (cate) {
      this.editAttrDialogVisible = true
      const { data: res } = await this.$http.get(`categories/${cate.cat_id}/attributes/${cate.attr_id}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('添加失败')
      this.$message.success('添加成功')
      this.editAttrForm = res.data
      console.log(res.data)
      // console.log(cate)
    },
    // 监听编辑对话框的关闭
    editAttrDialogClose () {
      this.$refs.editAttrFormRef.resetFields()
    },
    // 编辑属性对话框确定按钮点击事件
    editAttrSubmit () {
      this.$refs.editAttrFormRef.validate(async isValid => {
        if (!isValid) return false
        const { attr_name, attr_sel, attr_id } = this.editAttrForm
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${attr_id}`, { attr_name, attr_sel })
        if (res.meta.status !== 200) return this.$message.error('编辑失败')
        this.$message.success('编辑成功')
        this.getParamsData()
        this.editAttrDialogVisible = false
      })
    },
    // 删除参数
    async deleteParams (row) {
      console.log(row)
      const { attr_id, cat_id } = row
      const { data: res } = await this.$http.delete(`categories/${cat_id}/attributes/${attr_id}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getParamsData()
    },
    // 显示添加标签的Input框
    showInput (item) {
      item.inputVisible = true
      // $nextTick()的作用，就是当页面元素被重新渲染之后才会执行灰调函数中的代码
      this.$nextTick(() => {
        this.$refs.saveTagInputRef.$refs.input.focus()
      })
    },
    // 处理输入添加标签数据INput中的数据
    async handleInputConfirm (item) {
      if (item.inputValue.trim() === '') {
        item.inputValue = ''
        return false
      }
      // 添加标签
      item.inputVisible = false
      item.attr_vals.push(item.inputValue.trim())
      item.inputValue = ''
      const attr_vals = item.attr_vals.join(',')
      const { attr_id, cat_id, attr_name } = item
      const { data: res } = await this.$http.put(`categories/${cat_id}/attributes/${attr_id}`, { attr_name, attr_sel: this.activeName, attr_vals })
      if (res.meta.status !== 200) return this.$message.error('添加失败')
      this.$message.success('添加成功')
      // this.getParamsData()
    },
    async removeTags (item, index) {
      // 删除标签
      // console.log('del')
      item.attr_vals.splice(index, 1)
      // console.log(item.attr_vals)
      const attr_vals = item.attr_vals.join(',')
      const { attr_id, cat_id, attr_name } = item
      const { data: res } = await this.$http.put(`categories/${cat_id}/attributes/${attr_id}`, { attr_name, attr_sel: this.activeName, attr_vals })
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      // this.getParamsData()
    }
  },
  created () {
    this.getCateList()
  },
  mounted () {}
}
</script>

<style scoped lang='less'>
.input-new-tag {
  width: 100px !important;
}
</style>
