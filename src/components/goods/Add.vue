<template>
<div class="list_container">
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card>
   <el-alert
    title="添加商品信息"
    type="info"
    center
    show-icon
    :closable="false">
  </el-alert>
  <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
  </el-steps>
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm" label-position="top">
  <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabsClick">
      <el-tab-pane label="基本信息" name="0">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="addForm.goods_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="addForm.goods_price" autocomplete="off" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="addForm.goods_number" autocomplete="off" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="addForm.goods_weight" autocomplete="off" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
          <el-cascader
            v-model="addForm.goods_cat"
            :options="cateList"
            :props="cascaderProps"
            @change="parentCateChange">
          </el-cascader>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="1">
         <el-form-item v-for="(item,index) in manyTableData" :key="index" :label="item.attr_name">
            <el-checkbox-group v-model="item.attr_vals" >
              <el-checkbox :label="item1" v-for="(item1,index1) in item.attr_vals" :key="index1" border></el-checkbox>
            </el-checkbox-group>
         </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="2">
        <el-form-item v-for="(item,index) in onlyTableData" :key="index" :label="item.attr_name">
            <el-input v-model="item.attr_vals[0]"></el-input>
         </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="3">
        <el-upload
          class="upload-demo"
          action="https://lianghj.top:8888/api/private/v1/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          list-type="picture"
          :headers="headersObj"
          :on-success="picUploadSuccess">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="4">
        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addGoodsThrottle">添加商品</el-button>
      </el-tab-pane>
  </el-tabs>
  </el-form>
</el-card>
<!-- 预览图片对话框 -->
<el-dialog
  title="图片预览"
  :visible.sync="previewDialogVisible"
  width="50%">
  <img :src="previewPath" alt="">
</el-dialog>
</div>
</template>

<script>
import _ from 'lodash'
export default {
  components: {},
  props: {},
  data () {
    return {
      // tabs|steps相应索引
      activeIndex: 0,
      // 添加商品数据对象
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_cat: [],
        // 图片临时存放路径数组
        pics: [],
        // 商品描述
        goods_introduce: '',
        // 商品的参数（数组），包含 `动态参数` 和 `静态属性`
        attrs: []
      },
      // 添加商品数据规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类数据
      cateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 商品参数数组
      manyTableData: [],
      // 商品属性数组
      onlyTableData: [],
      // 图片上传没有携带token，需要设置该组件的请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片的真实地址
      previewPath: '',
      // 图片预览对话框可视化
      previewDialogVisible: false
    }
  },
  watch: {},
  computed: {
    //  防止用户重复提交添加商品对话框表单按钮
    addGoodsThrottle () {
      return this.$throttle(this.addGoods, 500)
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
    },
    // 级联选择器商品分类的改变事件
    parentCateChange () {
      if (this.addForm.goods_cat.length !== 3) { this.addForm.goods_cat = [] }
    },
    // 离开标签页之前的触发该事件
    beforeTabLeave (newActiveName, oldActiveName) {
      if (this.addForm.goods_cat.length !== 3 && this.activeIndex !== 0) {
        this.activeIndex = oldActiveName
        this.$message.error('请输入商品分类')
        return false
      } else {
        this.activeIndex = newActiveName
      }
    },
    // 点击Tab标签
    tabsClick () {
      //
      if (this.activeIndex === '1') {
        this.getGoodsManyOrOnly('many')
      } else if (this.activeIndex === '2') {
        this.getGoodsManyOrOnly('only')
      }
    },
    // 封装得到商品参数|属性的网络请求方法
    async getGoodsManyOrOnly (sel) {
      const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, { params: { sel } })
      if (res.meta.status !== 200) return this.$message.error('获取商品参数列表失败')
      this.$message.success('获取商品参数列表成功')
      //
      if (sel === 'many') {
        this.manyTableData = res.data
        this.manyTableData.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
      } else {
        this.onlyTableData = res.data
        this.onlyTableData.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
      }
    },
    // 预览图片
    handlePreview (file) {
      console.log(file)
      this.previewPath = file.response.data.url
      console.log(this.previewPath)
      this.previewDialogVisible = true
    },
    // 移除图片
    handleRemove (file) {
      console.log(file)
      const index = this.addForm.pics.forEach((item, index) => {
        if (item.pic === file.response.data.tmp_path) return index
      })
      this.addForm.pics.splice(index, 1)
      console.log(this.addForm.pics)
    },
    // 上传图片成功的回调函数
    picUploadSuccess (response) {
      console.log(response)
      this.addForm.pics.push({ pic: response.data.tmp_path })
      console.log(this.addForm.pics)
    },
    // 添加商品
    async addGoods () {
      this.$refs.addFormRef.validate(isValid => {
        if (!isValid) return this.$message.error('请填写必要的表单项！')
      })
      // 不能这么做(级联选择器所绑定的goods_cat是一个数组)
      // this.addForm.goods_cat = this.addForm.goods_cat.join(',')
      // 解决方法：深拷贝addForm并作为请求参数对象
      const form = _.cloneDeep(this.addForm)
      form.goods_cat = form.goods_cat.join(',')
      // form.goods_introduce.replace(/<[^>]+>/g, '')
      this.manyTableData.forEach(item => {
        const newInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals.join(',') }
        this.addForm.attrs.push(newInfo)
      })
      this.onlyTableData.forEach(item => {
        const newInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals.join(',') }
        this.addForm.attrs.push(newInfo)
      })
      form.attrs = this.addForm.attrs
      // console.log(form)
      const { data: res } = await this.$http.post('goods', form)
      // console.log(res)
      if (res.meta.status !== 201) return this.$message.error('添加商品失败')
      this.$message.success('添加商品成功')
      this.$router.push('/goods')
    }
  },
  created () {
    this.getCateList()
  },
  mounted () {}
}
</script>

<style scoped lang='less'>
.el-steps {
  margin-top: 20px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
img {
  width:100%
}
.ql-editor {
  min-height: 300px;
}
</style>
