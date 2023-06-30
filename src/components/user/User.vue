<template>
<div class="users_container">
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card>
  <div style="margin-top: 5px;">
    <!-- 搜索与添加区域 -->
    <el-row :gutter="40">
      <el-col :span="8">
         <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
           <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
         </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addUsersDialogVisiable = true">添加用户</el-button>
      </el-col>
    </el-row>
  </div>
  <!-- //用户数据表格区域 -->
<el-table
      border
      stripe
      :data="userList"
      style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        align="center"
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        align="center"
        prop="role_name"
        label="角色">
      </el-table-column>
      <el-table-column
        align="center"
        label="状态">
        <!-- scope.row代表这一行的数据 -->
        <template slot-scope="scope">
          <!-- {{scope.row}} -->
          <el-switch
            @change="userStateChange(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <!-- {{scope.row}} -->
          <el-tooltip class="item" effect="dark" content="编辑用户" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" round size="mini" @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" round size="mini" @click="delUserById(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" round size="mini" @click="setRole(scope.row)"></el-button>
          </el-tooltip>
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
<!-- 添加用户对话框区域 -->
<el-dialog
@close="handleCloseAddUserDialog"
  title="添加用户"
  :visible.sync="addUsersDialogVisiable"
  width="50%">
  <el-form :model="addUsersForm" :rules="addUsersRules" ref="addUsersFromRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addUsersForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addUsersForm.password" type="password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addUsersForm.email" type="email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="addUsersForm.mobile" type="tel"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addUsersDialogVisiable = false">取 消</el-button>
    <el-button type="primary" @click="addUserThrottle">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑用户对话框 -->
<el-dialog
@close="handleEditUserDialogClose"
  title="编辑用户"
  :visible.sync="editUserDialogVisiable"
  width="50%">
 <el-form :model="editUserForm" :rules="addUsersRules" ref="editUsersFromRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="editUserForm.username" :disabled="true"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editUserForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="editUserForm.mobile"></el-input>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editUserDialogVisiable = false">取 消</el-button>
    <el-button type="primary"  id="chen" @click="editUserThrottle">确 定</el-button>
  </span>
</el-dialog>
<!-- 分配角色对话框 -->
<el-dialog
@close="setRoleDialogClose"
  title="分配角色"
  :visible.sync="setRoleDialogVisible"
  width="50%">
  <p><label>当前用户: </label><span>{{setRoleUserInfo.username}}</span></p>
  <p>
    <label>当前角色: </label><span>{{setRoleUserInfo.role_name}}</span>
  </p>
  <div>
    <label>分配新角色: </label>
    <el-select v-model="selectRoleId" placeholder="请选择">
    <el-option
      v-for="(item,index) in rolesList"
      :key="index"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRoleByIdThrottle">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    // 验证邮箱的规则
    var checkEmail = (_, value, callback) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEmail.test(value)) return callback()
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机的规则
    var checkMobile = (_, value, callback) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regMobile.test(value)) return callback()
      callback(new Error('请输入合法的手机号'))
    }
    return {
      // 用于发起网络请求获取用户列表所需的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 所取得的用户数据数组
      userList: [],
      // 总页数
      total: 0,
      // 添加用户对话框可视化
      addUsersDialogVisiable: false,
      // 添加用户对象
      addUsersForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户规则
      addUsersRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 编辑用户对话框可视化
      editUserDialogVisiable: false,
      // 编辑用户信息对象
      editUserForm: {
        id: '',
        mobile: '',
        username: '',
        email: ''
      },
      // 分配角色对话框可视化
      setRoleDialogVisible: false,
      // 设置分配角色的用户信息
      setRoleUserInfo: {
        username: '',
        role_name: '',
        id: ''
      },
      // 角色列表数据
      rolesList: [],
      // 已选中的角色ID
      selectRoleId: '',
      // 防抖定时器
      antiShakeTimer: null
      // 防抖编辑窗口处理函数
      // throttleData: null
    }
  },
  watch: {
    'queryInfo.query' () {
      this.antiShakeTimer = this.$antiShake(this.getUserList, 500, this.antiShakeTimer)
    }
  },
  computed: {
    //  防止用户重复提交编辑用户对话框表单按钮
    editUserThrottle () {
      return this.$throttle(this.editUser, 500)
    },
    //  防止用户重复提交添加用户对话框表单按钮
    addUserThrottle () {
      return this.$throttle(this.addUser, 500)
    },
    //  防止用户重复提交分配角色对话框表单按钮
    setRoleByIdThrottle () {
      return this.$throttle(this.setRoleById, 500)
    }
  },
  methods: {
    // 获取用户数据列表方法
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取用户数据列表失败')
      this.$message.success('获取用户数据列表成功')
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听pagenum改变的事件
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 用户状态改变方法
    async  userStateChange (userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('状态设置失败')
      }
      this.$message.success('用户状态设置成功')
    },
    // 监听添加用户对话框的关闭
    handleCloseAddUserDialog () {
      this.$refs.addUsersFromRef.resetFields()
    },
    // 添加用户对话框点击确定,发起网络请求保存至后台，关闭对话框，重新更新用户数据列表
    addUser () {
      this.$refs.addUsersFromRef.validate(async (isValid) => {
        console.log(isValid)
        if (!isValid) return false
        const { data: res } = await this.$http.post('users', this.addUsersForm)
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        // console.log(res)
        this.addUsersDialogVisiable = false
        this.getUserList()
      })
    },
    // 打开编辑用户对话框
    showEditDialog (userInfo) {
      this.editUserDialogVisiable = true
      // console.log(userInfo)
      const { id, email, mobile, username } = userInfo
      this.editUserForm = {
        id,
        email,
        mobile,
        username
      }
    },
    // 监听编辑用户对话框关闭
    handleEditUserDialogClose () {
      this.$refs.editUsersFromRef.resetFields()
    },
    // 点击编辑用户对话框确定按钮
    editUser () {
      this.$refs.editUsersFromRef.validate(async (isValid) => {
        if (!isValid) return false
        const { email, mobile, id } = this.editUserForm
        const { data: res } = await this.$http.put(`users/${id}`, { email, mobile })
        if (res.meta.status !== 200) return this.$message.error('编辑用户失败')
        this.$message.success('编辑用户成功')
        this.editUserDialogVisiable = false
        this.getUserList()
      })
    },
    // 删除用户
    delUserById (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`users/${id}`)
        if (res.meta.status !== 200) return this.$message.error('删除用户失败')
        this.$message.success('编辑用户成功')
        this.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 分配角色
    async setRole (userInfo) {
      this.setRoleDialogVisible = true
      // console.log(userInfo)
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.$message.success('获取角色列表成功')
      this.rolesList = res.data
      this.setRoleUserInfo = {
        username: userInfo.username,
        role_name: userInfo.username,
        id: userInfo.id
      }
      // console.log(this.setRoleUserInfo)
      console.log(this.rolesList)
    },
    // 分配角色对话框，确定按钮点击事件
    async setRoleById () {
      if (!this.selectRoleId) {
        return this.$message.error('请选择角色')
      }
      const { data: res } = await this.$http.put(`users/${this.setRoleUserInfo.id}/role`, { rid: this.selectRoleId })
      if (res.meta.status !== 200) return this.$message.error('分配角色失败')
      this.$message.success('分配角色成功')
      // console.log(res.data)
      this.setRoleDialogVisible = false
      this.getUserList()
    },
    // 监听分配角色对话框关闭
    setRoleDialogClose () {
      this.selectRoleId = ''
    }
  },
  created () {
    this.getUserList()
    // this.throttleData = this.$throttle(this.editUser, 3000)
  },
  mounted () {
    // document.querySelector('#chen').addEventListener('click', this.$throttle(this.editUser, 2000))
  }
}
</script>

<style scoped lang='less'>
</style>
