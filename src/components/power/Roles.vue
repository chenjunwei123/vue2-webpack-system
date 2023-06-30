<template>
<div class="roles_container">
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card>
    <el-button type="primary" @click="showAddRolesDialog">添加角色</el-button>
    <el-table :data="rolesList" border stripe>
      <el-table-column type="expand" align="center">
        <template slot-scope="scope">
          <!-- {{scope.row}} -->
          <el-row :class="['bdbottom',i1==0 ? 'bdtop' : '','vcenter']" v-for="(item,i1) in scope.row.children" :key="item.id">
            <!-- 一级权限 -->
            <el-col :span="5">
              <el-tag type="primary" closable @close="removeRightsById(scope.row,item.id)">{{item.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 二级权限和三级权限 -->
            <el-col :span="19">
              <el-row :class="[i2==0 ? '' : 'bdtop','vcenter']" v-for="(item1,i2) in item.children" :key="item1.id">
                <el-col :span="8">
                  <el-tag type="success"  closable @close="removeRightsById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="16">
                  <el-tag type="warning" v-for="(item2) in item1.children" :key="item2.id" closable @close="removeRightsById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc" align="center"></el-table-column>
      <el-table-column label="操作" prop="level" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="showEditRolesDialog(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteRoles(scope.row.id)">删除</el-button>
          <el-button type="warning" icon="el-icon-setting" @click="showSetRightsDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 分配权限对话框 -->
  <el-dialog
  title="提示"
  :visible.sync="setRightsDialogVisible"
  width="30%"
  @close="setRightsDialogClose">
  <el-tree show-checkbox :data="rightsList" :props="defaulRightstProps" @check-change="handleCheckChange" node-key="id" :default-expand-all="true" :default-checked-keys="defRightIdList" ref="treeRef"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRightsThrottle">确 定</el-button>
  </span>
</el-dialog>
<!-- 添加角色对话框 -->
<el-dialog
  title="添加角色"
  :visible.sync="addRoleDialogVisible"
  width="50%"
  @close="addRolesDialogClose">
  <el-form :model="addRolesForm" :rules="addRolesrules" ref="addRolesFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addRolesForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="addRolesForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoleThrottle">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑角色对话框 -->
<el-dialog
  title="编辑角色"
  :visible.sync="editRoleDialogVisible"
  width="50%"
  @close="editRolesDialogClose">
  <el-form :model="editRolesForm" :rules="editRolesrules" ref="editRolesFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="editRolesForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="editRolesForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoleThrottle">确 定</el-button>
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
      // 角色数据列表
      rolesList: [],
      // 分配权限对话框可视化
      setRightsDialogVisible: false,
      // 权限数组
      rightsList: [],
      // 树形权限规则
      defaulRightstProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的三级权限ID
      defRightIdList: [],
      // 被分配权限的角色ID
      roleId: '',
      // 添加角色对话框可视化
      addRoleDialogVisible: false,
      // 添加角色对象
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色规则
      addRolesrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 编辑角色对话框可视化
      editRoleDialogVisible: false,
      // 编辑角色对象
      editRolesForm: {},
      // 编辑角色规则
      editRolesrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 角色id
      id: ''
    }
  },
  watch: {},
  computed: {
    //  防止用户重复提交添加角色对话框表单按钮
    addRoleThrottle () {
      return this.$throttle(this.addRole, 500)
    },
    //  防止用户重复提交编辑角色对话框表单按钮
    editRoleThrottle () {
      return this.$throttle(this.editRole, 500)
    },
    //  防止用户重复提交分配角色对话框表单按钮
    allotRightsThrottle () {
      return this.$throttle(this.allotRights, 500)
    }
  },
  methods: {
    // 获取角色数据列表方法
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('请求角色列表失败')
      this.$message.success('请求角色列表数据成功')
      this.rolesList = res.data
      // console.log(this.rolesList)
    },
    // 删除三级权限
    removeRightsById (role, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // this.getRolesList()
        role.children = res.data
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击按钮分配权限
    async showSetRightsDialog (row) {
      const { data: res } = await this.$http.get('rights/tree')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.$message({
        type: 'success',
        message: '获取成功!'
      })
      this.setRightsDialogVisible = true
      this.rightsList = res.data
      console.log(row)
      // 将三级权限ID添加至defRightIdList数组中
      this.getLeafKeys(row, this.defRightIdList)
      this.roleId = row.id
    },
    // check点击权限改变事件
    handleCheckChange () {},
    // 定义取得三级权限id的递归函数
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭
    setRightsDialogClose () {
      this.defRightIdList = []
    },
    // 分配权限对话框的确定点击事件方法
    async allotRights () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      // console.log(keys)
      const rids = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('分配失败')
      this.$message({
        type: 'success',
        message: '分配成功!'
      })
      this.setRightsDialogVisible = false
      this.getRolesList()
    },
    // 点击添加角色按,显示添加角色对话框
    showAddRolesDialog () {
      this.addRoleDialogVisible = true
    },
    // 添加角色对话框确定按钮
    addRole () {
      this.$refs.addRolesFormRef.validate(async isValid => {
        if (!isValid) return false
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败')
        this.$message({
          type: 'success',
          message: '添加角色成功!'
        })
        this.addRoleDialogVisible = false
        this.getRolesList()
      })
    },
    // 监听添加角色对话框关闭
    addRolesDialogClose () {
      this.$refs.addRolesFormRef.resetFields()
    },
    // 编辑角色对话框确定按钮点击
    editRole () {
      this.editRoleDialogVisible = false
      this.$refs.editRolesFormRef.validate(async isValid => {
        if (!isValid) return false
        const { data: res } = await this.$http.put(`roles/${this.id}`, this.editRolesForm)
        if (res.meta.status !== 200) return this.$message.error('编辑角色失败')
        this.$message({
          type: 'success',
          message: '编辑角色成功!'
        })
        this.getRolesList()
      })
    },
    // 点击编辑按钮，显示编辑角色对话框
    showEditRolesDialog (row) {
      this.editRoleDialogVisible = true
      // console.log(row)
      const { id, roleName, roleDesc } = row
      this.id = id
      this.editRolesForm = {
        roleName, roleDesc
      }
    },
    // 监听编辑角色对话框的关闭事件
    editRolesDialogClose () {
      this.$refs.editRolesFormRef.resetFields()
    },
    // 点击删除按钮
    deleteRoles (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${id}`)
        if (res.meta.status !== 200) return this.$message.error('删除角色失败')
        this.getRolesList()
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
    }
  },

  created () {
    // 获取角色数据
    this.getRolesList()
  },
  mounted () {}
}
</script>

<style scoped lang='less'>
.el-tag {
  margin: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
