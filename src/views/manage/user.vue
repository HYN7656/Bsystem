<template>
  <div class="user-page">
    <div class="left cell">
      <div class="title">组织机构
          <el-button type="success" icon="el-icon-refresh" circle size="mini" style="float: right" @click="getRes"></el-button>
       </div>
      <div class="content">

        <el-tree
          :data="listOrgAll"
          :props="defaultProps"
          @node-click="getPageCount"
          :expand-on-click-node="false"
          :default-expand-all="true"
        ></el-tree>
      </div>
    </div>
    <div class="right cell">
      <div class="title">用户列表</div>
      <div class="content">
        <div class="search-nav">
          <el-row :gutter="20" style="margin-bottom:20px;">
            <el-col :span="8" class="flex">
              <span class="name">归属机构：</span>
              <el-select filterable v-model="search.org" clearable placeholder="请选择">
                <el-option
                  v-for="item in OrgOpt"
                  :key="item.id"
                  :label="item.mName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="8" class="flex">
              <span class="name">登录名：</span>
              <el-input class="input" placeholder="请输入登录名" v-model="search.loginName"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8" class="flex">
              <span class="name">归属部门：</span>
              <div class="el-select" readonly="readonly">
                <div class="el-input el-input--suffix">
                  <input
                    v-model="udepartmentName"
                    type="text"
                    readonly="readonly"
                    autocomplete="off"
                    placeholder="请选择"
                    class="el-input__inner"
                    @click="choosePop=true"
                  >
                  <span class="del-span" @click="delSpan">x</span>
                </div>
              </div>
            </el-col>
            <el-col :span="8" class="flex">
              <span class="name">姓名：</span>
              <el-input class="input" placeholder="请输入姓名" v-model="search.Name"></el-input>
            </el-col>
            <el-col :span="2" class="flex">
              <el-button type="primary" icon="el-icon-search" @click="goReset">搜索</el-button>
            </el-col>
            <el-col :span="4" class="flex">
              <el-button type="success" @click="addUser">添加</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="result-table">
          <el-table :data="tableData" border style="width: 100%" v-loading="loading">
            <el-table-column prop="umechanismName" label="归属机构" width="200"></el-table-column>
            <el-table-column prop="udepartmentName" label="归属部门" width="120"></el-table-column>
            <el-table-column prop="uname" label="登录名" width="120"></el-table-column>
            <el-table-column prop="uusername" label="姓名" width="120"></el-table-column>
            <el-table-column prop="utelephone" label="电话" width="130"></el-table-column>
            <el-table-column prop="umobilephone" label="手机"></el-table-column>
            <el-table-column prop="urole" label="角色" width="180"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="editOpen(scope.row.id)" type="text" size="small">修改</el-button>
                <el-button @click="del(scope.row.id)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination-box">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!--添加弹框-->
    <el-dialog title="添加用户" :visible.sync="addPop" class="tip-dialog" :close-on-click-modal="false" @close="closeDia">
      <div class="pop-content">
        <el-form ref="addObject" :model="addObject" label-width="100px" status-icon :rules="rules">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="归属机构">
                <el-select v-model="addObject.umechanism" filterable placeholder="请选择归属机构" @change="getDepartment(addObject.umechanism)">
                  <el-option
                    v-for="item in OrgOpt"
                    :key="item.id"
                    :label="item.mName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="归属部门">
                <div class="el-select" readonly="readonly">
                  <div class="el-input el-input--suffix">
                    <input
                      v-model="udepartmentName"
                      type="text"
                      readonly="readonly"
                      autocomplete="off"
                      placeholder="请选择归属部门"
                      class="el-input__inner"
                      @click="choosePop = true"
                    >
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="姓名" prop="uusername">
                <el-input v-model="addObject.uusername" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登录名" prop="uname">
                <el-input v-model="addObject.uname"  placeholder="请输入登录名"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="密码" prop="upasswd">
                <el-input type="password" v-model="addObject.upasswd" autocomplete="off"  placeholder="请输入密码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="确认密码" prop="confirmPas">
                <el-input type="password" v-model="addObject.confirmPas" autocomplete="off" placeholder="请再次输入密码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="电话" prop="utelephone">
                <el-input v-model="addObject.utelephone" placeholder="请输入电话"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机" prop="umobilephone">
                <el-input v-model="addObject.umobilephone" placeholder="请输入手机号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="邮箱" prop="uemail">
                <el-input v-model="addObject.uemail" placeholder="请输入邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否特殊用户">
                <template>
                  <el-radio v-model="tsUserAdd" label="0">否</el-radio>
                  <el-radio v-model="tsUserAdd" label="1">是</el-radio>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="userBox">
            <span><span style="color: #f56c6c">*</span>用户角色</span>
            <el-checkbox-group v-model="checkedRole" @change="AddhandleChecked">
              <el-checkbox v-for="p in power" :label="p.roleName" :key="p.id">{{p.roleName}}</el-checkbox>
            </el-checkbox-group>
          </div>

          <el-form-item label="备注">
            <el-input type="textarea" v-model="addObject.ucontent" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item class="btn">
            <el-button type="primary" @click="addSave('addObject')" :loading='loadingBtn'>保存</el-button>
            <el-button @click="addPop = false">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--编辑弹框-->
    <el-dialog
      title="编辑用户"
      :visible.sync="editPop"
      class="tip-dialog"
      :close-on-click-modal="false"
      @close="closeDia"
    >
      <div class="pop-content">
        <el-form
          ref="editObject"
          :model="editObject"
          label-width="100px"
          status-icon
          :rules="rules"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="归属机构">
                <el-select filterable v-model="editObject.umechanism" placeholder="请选择归属机构" @change="getDepartment(editObject.umechanism)">
                  <el-option
                    v-for="item in OrgOpt"
                    :key="item.id"
                    :label="item.mName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="归属部门">
                <div class="el-select" readonly="readonly">
                  <div class="el-input el-input--suffix">
                    <input
                      v-model="udepartmentName"
                      type="text"
                      readonly="readonly"
                      autocomplete="off"
                      placeholder="请选择归属部门"
                      class="el-input__inner"
                      @click="udeClick"
                    >
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="姓名" prop="uusername">
                <el-input v-model="editObject.uusername" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登录名" prop="uname">
                <el-input v-model="editObject.uname" placeholder="请输入登录名" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="重置密码"  prop="ResetPasswd">
                <el-input v-model="editObject.ResetPasswd" type="password" placeholder="请输入重置密码"></el-input>
              </el-form-item>
            </el-col>
              <el-col :span="12">
                <el-form-item label="确认密码" prop="confirmPas1">
                  <el-input type="password" v-model="editObject.confirmPas1" autocomplete="off" placeholder="请再次输入密码"></el-input>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="邮箱" prop="uemail">
                <el-input v-model="editObject.uemail" placeholder="请输入邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否特殊用户">
                <template>
                  <el-radio v-model="tsUserEdit" label="0">否</el-radio>
                  <el-radio v-model="tsUserEdit" label="1">是</el-radio>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="电话" prop="utelephone">
                <el-input v-model="editObject.utelephone" placeholder="请输入电话"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <div>
                <div class="phoneBox1">
                  <span><span style="color: #f56c6c">*</span>手机</span>
                </div>
                <div class="phoneBox2">
                  <el-input v-model="editObject.umobilephone" placeholder="请输入手机号"></el-input>
                </div>
              </div>
            </el-col>
          </el-row>
            <div class="userBox">
              <span><span style="color: #f56c6c">*</span>用户角色</span>
              <el-checkbox-group v-model="checkedRoleEdit" @change="EdithandleChecked">
                <el-checkbox v-for="p in power" :label="p.roleName" :key="p.id">{{p.roleName}}</el-checkbox>
              </el-checkbox-group>
            </div>

          <el-form-item label="备注">
            <el-input type="textarea" v-model="editObject.ucontent" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item class="btn">
            <el-button type="primary" @click="editSave('editObject')" :loading='loadingBtn'>保存</el-button>
            <el-button @click="editPop = false">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--选择部门弹层-->
    <el-dialog
      title="选择部门"
      :visible.sync="choosePop"
      class="choose-pop"
      :close-on-click-modal="false"
    >
      <div class="pop-content">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        <el-tree
          @node-click="chooseNodeClick"
          class="filter-tree"
          :data="listOrg"
          :props="defaultProps"
          :filter-node-method="filterNode"
          ref="filterTree"
          :default-expand-all="true"
          :expand-on-click-node="false"
        ></el-tree>
      </div>
      <!--<div class="pop-btn">
        <el-button type="success" @click="confirmChooseBranch">确定</el-button>
        <el-button type="info" @click="choosePop = false">取消</el-button>
      </div>-->
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'js-md5';
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        ////console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.addObject.upasswd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var validatePass3 = (rule, value, callback) => {
      if (!!this.editObject.ResetPasswd) {
        if (!value) {
          callback(new Error('请再次输入密码'));
        } else if (value != this.editObject.ResetPasswd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      } else if(this.editObject.ResetPasswd != value){
        callback(new Error('请输入重置密码'));
      }else {
        callback();
      }

    };
    return {
      loadingBtn : false,
      editPop: false,
      addPop: false,
      choosePop: false,
      loading:false,
      OrgOpt: [],
      power: [],
      checkedRole: [],
      checkedRoleEdit: [],
      search: {
        org: '',
        loginName: '',
        branch: '',
        Name: ''
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      middleChooseBranch: '',
      filterText: '',
      udepartmentName: '',
      udepartmentId: '',
      addObject: {
        umechanism: '',
        // udepartment: '',
        uusername: '',
        uname: '',
        upasswd: '',
        confirmPas: '',
        uemail: '',
        utelephone: '',
        umobilephone: '',
        urole: [],
        ucontent: '',
      },
      tsUserAdd: '0',
      editObject: {
        umechanism: '',
        // udepartment: '',
        uusername: '',
        uname: '',
        upasswd: '',
        confirmPas1: '',
        uemail: '',
        utelephone: '',
        umobilephone: '',
        urole: [],
        ucontent: '',
        ResetPasswd: '',
      },
      tsUserEdit: '0',
      tableData: [],
      rules: {
        uusername: [
          { required: true, message: '姓名必填', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符之间', trigger: 'blur' }
        ],
        uname: [
          { required: true, message: '登录名必填', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符之间', trigger: 'blur' }
        ],
        upasswd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度至少6位', trigger: 'blur' }
        ],
        confirmPas: [
          { validator: validatePass2, trigger: 'blur' },
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { min: 6, message: '长度至少6位', trigger: 'blur' }
        ],
        ResetPasswd: [
          { min: 6, message: '长度至少6位', trigger: 'blur' }
        ],
        confirmPas1: [
          { validator: validatePass3, trigger: 'blur' },
          // { required: true, message: '请再次输入密码', trigger: 'blur' },
          { min: 6, message: '长度至少6位', trigger: 'blur' }
        ],
        uemail: [
          { required: true, message: '邮箱必填', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        umobilephone: [
          { validator: checkPhone, trigger: 'blur' },
          { required: true, message: '手机必填', trigger: 'blur' },
        ],
        utelephone: [
          { required: true, message: '电话必填', trigger: 'blur' },
        ],
        urole: [
          { type: 'array', required: true, message: '请至少选择角色', trigger: 'change' }
        ],
      },
      // 搜索归属部门
      listOrg: [],
      // 组织机构列表
      listOrgAll: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      listOrgArr: [],
      num : 0,
      UName : '',
      PageContID : '',
      phoneNum:'',
      searchNum : 0

    };
  },
  methods: {
    //刷新
    getRes(){
      this.getPage();
      this.getAffiliate();
      this.getTree();
    },
    //加载所有机构和部门
    getTree() {
      let params = {};
      API.get('/mechanism/findTreeAll', params, { Authorization: storage.get('Token') }).then((res) => {
        //console.log(res.data)
        if (res.data.code == 200) {
          var arr = res.data.data;
          this.listOrgAll = this.getOrg(arr);
          this.listOrg = this.getOrg(arr);
          //console.log(this.listOrgAll)
          var arr = [];
          for (var i = 0; i < this.listOrgAll.length; i++) {
            arr.push(this.listOrgAll[i].id);
          }
          //console.log(arr)
          this.listOrgArr = arr;
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: 'auth' });
        }
      })
    },
    // 点击左侧树展示列表翻页器控制
    getPageCount(data){
      this.pageSize = 10;
      this.currentPage = 1;
      this.OrgTreeClick(data);
    },
    // 左侧树刷新列表
    OrgTreeClick(data) {
      var arr = [];
      for (var i = 0; i < this.listOrgArr.length; i++) {
        if (data.id == this.listOrgArr[i]) {
          arr.push(this.listOrgArr[i]);
        }
      }
      this.PageContID = data;
      if (arr.length > 0) {
        let params = {};
        params['uMechanism'] = data.id;
        params['uDepartment'] = '';
        params['uName'] = '';
        params['uUsername'] = '';
        params['page'] = this.currentPage;
        params['count'] = this.pageSize;
        API.get('/user/findByName', params, { Authorization: storage.get('Token') }).then((res) => {
          //console.log(res.data)
          if (res.data.code == 200) {
            this.total = res.data.count;
            this.tableData = res.data.data;
          } else if (res.data.code == 1001) {
            this.signOut();
          } else if (res.data.code == 401) {
            this.$router.push({ name: 'auth' });
          }
        })
      } else {
        let params = {};
        params['uMechanism'] = '';
        params['uDepartment'] = data.id;
        params['uName'] = '';
        params['uUsername'] = '';
        params['page'] = this.currentPage;
        params['count'] = this.pageSize;
        API.get('/user/findByName', params, { Authorization: storage.get('Token') }).then((res) => {
          //console.log(res.data)
          if (res.data.code == 200) {
            this.total = res.data.count;
            this.tableData = res.data.data;
          } else if (res.data.code == 1001) {
            this.signOut();
          } else if (res.data.code == 401) {
            this.$router.push({ name: 'auth' });
          }
        })
      }

    },
    //加载归属机构
    getAffiliate() {
      let params = {};
      API.get('/user/findMechanismAndRole', params, { Authorization: storage.get('Token') }).then((res) => {
        //console.log(res.data)
        if (res.data.code == 200) {
          var arr = res.data.data.mechanismAll;
          var role = res.data.data.roleInfos;
          //console.log(arr)
          this.OrgOpt = arr;
          //console.log(role)
          this.power = role;
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: 'auth' });
        }
      })
    },
    // 加载归属部门
    getDepartment(id) {
      // console.log(id)
      this.udepartmentName = '';
      let params = {};
      params['id'] = id;
      API.get('/mechanism/findTreeById', params, { Authorization: storage.get('Token') }).then((res) => {
        //console.log(res.data)
        if (res.data.code == 200) {
          var arr = res.data.data;
          this.listOrg = this.getOrg(arr);
          //console.log(this.listOrg)
        } else if (res.data.code == 1001) {
          this.signOut();
        }/*else if(res.data.code == 401){
            this.$router.push({name: 'auth'})
          }*/
      })
    },
    // 转换树结构
    getOrg(list) {
      for (let i = 0; i < list.length; i++) {
        list[i]["label"] = list[i]["mName"];
        if (list[i]["childnode"]) {
          list[i]["children"] = this.getOrg(list[i]["childnode"]);
          delete list[i]["childnode"];
        }
      }
      return list;
    },
    // 页面初始化
    getPage() {
      this.loading = true;
      let params = {};
      params['page'] = this.currentPage;
      params['count'] = this.pageSize;
      API.get('/user/findAll', params, { Authorization: storage.get('Token') }).then((res) => {
        //console.log(res.data)
        if (res.data.code == 200) {
          this.total = res.data.count;
          this.tableData = res.data.data;
          this.loading = false;
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: 'auth' });
        }
      })
    },
    goReset(){
      this.currentPage = 1;
      this.pageSize = 10;
      this.searchNum = 1;
      this.getSearch();
    },
    // 搜索
    getSearch() {
      this.loading = true;
      let params = {};
      params['uMechanism'] = this.search.org;
      params['uDepartment'] = this.udepartmentId;
      params['uName'] = this.search.loginName;
      params['uUsername'] = this.search.Name;
      params['page'] = this.currentPage;
      params['count'] = this.pageSize;
      // console.log(params)
      API.get('/user/findByName', params, { Authorization: storage.get('Token') }).then((res) => {
        //console.log(res.data)
        if (res.data.code == 200) {
          this.total = res.data.count;
          this.tableData = res.data.data;
          this.loading = false;
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: 'auth' });
        }
      })
    },
    // 清除归属部门
    delSpan(){
      this.udepartmentName = '';
      this.udepartmentId = '';
    },
    // 搜索部门取值
    handleNodeClick(data) {
      this.search.branch = data.label;
    },
    closeDia(){
      this.udepartmentName = '';
      this.udepartmentId = ""
    },
    // 新增
    addUser() {
      this.addPop = true;
      this.loadingBtn = false;
      this.num = 0;
      this.addObject = {
        umechanism: '',
        // udepartment: '',
        uusername: '',
        uname: '',
        upasswd: '',
        confirmPas: '',
        uemail: '',
        utelephone: '',
        umobilephone: '',
        urole: [],
        ucontent: ''
      }
      this.tsUserAdd = '0';
      this.udepartmentName = '';
      this.udepartmentId = '';
      this.checkedRole = [];
      this.listOrg = [];
      if (this.$refs.addObject) {
        this.$refs.addObject.clearValidate();
      } else {
        return;
      }
    },
    // 新增保存
    addSave(formName) {
      if(!this.addObject.urole || !this.addObject.urole.length){
        this.$message({
          type: 'error',
          message: '用户角色必选'
        });
      }else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.num ++;
            if(this.num == 1) {
              this.loadingBtn = true;
              let params = {};
              params['uMechanism'] = this.addObject.umechanism;
              params['uDepartment'] = this.udepartmentId;
              params['uUsername'] = this.addObject.uusername;
              params['uName'] = this.addObject.uname;
              params['uPasswd'] = md5(this.addObject.uname + this.addObject.upasswd);
              // params['confirmPas'] = this.addObject.confirmPas;
              params['uEmail'] = this.addObject.uemail;
              params['uTelephone'] = this.addObject.utelephone;
              params['uMobilephone'] = this.addObject.umobilephone;
              params['uRole'] = this.addObject.urole;
              params['uContent'] = this.addObject.ucontent;
              params['uSpecialUser'] = this.tsUserAdd;

              // console.log(params)
              API.post('/user/create', params, { Authorization: storage.get('Token') }).then((res) => {
                // console.log(res.data)
                if (res.data.code == 200) {
                  this.addPop = false;
                  this.getPage();
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  });
                } else if (res.data.code == 1001) {
                  this.signOut();
                } else if (res.data.code == 401) {
                  this.$router.push({ name: 'auth' });
                } else {
                  // console.log(res);
                  this.$message({
                    type: 'error',
                    message: res.data.message
                  });
                  this.loadingBtn = false;
                  this.num = 0;
                }
              })
            }else {
              return;
            }
          } else {
            this.loadingBtn = false;
            this.num = 0;
          }
        })
      }
    },
    // 新增角色
    AddhandleChecked() {
      this.addObject.urole = []
      for (var i = 0; i < this.power.length; i++) {
        for (var j = 0; j < this.checkedRole.length; j++) {
          if (this.power[i].roleName == this.checkedRole[j]) {
            this.addObject.urole.push(this.power[i].id);
          }
        }
      }
    },
    // 编辑
    editOpen(id) {
      if (this.$refs.editObject) {
        this.$refs.editObject.clearValidate();
      }
      this.editPop = true;
      this.loadingBtn = false;
      this.num = 0;
      this.checkedRoleEdit = [];
      this.editObject = {
        umechanism: '',
        // udepartment: '',
        uusername: '',
        uname: '',
        upasswd: '',
        confirmPas1: '',
        uemail: '',
        utelephone: '',
        umobilephone: '',
        urole: [],
        ucontent: '',
        ResetPasswd: '',
      }
      this.tsUserEdit = '';
      this.udepartmentName = '';
      this.udepartmentId = '';
      this.listOrg = [];
      this.EditID = id;
      let params = {};
      params['id'] = id;
      API.get('/user/findById', params, { Authorization: storage.get('Token') }).then((res) => {
        // console.log(res.data)
        if (res.data.code == 200) {
          this.editObject = res.data.data;
          this.phoneNum = res.data.data.umobilephone;
          this.UName = this.editObject.uname;
          this.tsUserEdit = res.data.data.uspecialUser.toString();
          var obj = res.data.data;
          if (obj.urole) {
            // 角色显示
            var arr = obj.urole.split(',');
            for (var i = 0; i < arr.length; i++) {
              for (var j = 0; j < this.power.length; j++) {
                if (arr[i] == this.power[j].roleName) {
                  this.checkedRoleEdit.push(this.power[j].roleName);
                }
              }
            }
          }

          // 机构显示名称
          var umechanismName = '';
          umechanismName = obj.umechanismName;
          for (var i = 0; i < this.OrgOpt.length; i++) {
            if (this.OrgOpt[i].mName == umechanismName) {
              // 转换为机构id
              this.editObject.umechanism = this.OrgOpt[i].id;
            }
          }

          // 部门显示名称
          this.udepartmentName = obj.udepartmentName;
          this.udepartmentId = obj.udepartmentId;
          if (obj.uroleId) {

            this.editObject.urole = obj.uroleId.split(',');
          }
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: 'auth' });
        }
      })
    },
    // 编辑保存
    editSave(formName) {
      // 角色必选
      if(!this.editObject.urole || !this.editObject.urole.length){
        this.$message({
          type: 'error',
          message: '用户角色必选'
        });
      }else {
        // 进行表单校验
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 判断编辑的用户名是否有改变，如果无改变正常请求，如果有改变则请求后台接口判断是否重名
            if(this.UName == this.editObject.uname){
              // 控制每个按钮只能点击一次
              this.num ++;
              if(this.num == 1) {
                this.loadingBtn = true;
                let params = {};
                params['uId'] = this.editObject.id;
                params['uMechanism'] = this.editObject.umechanism;
                params['uDepartment'] = this.udepartmentId;
                params['uUsername'] = this.editObject.uusername;
                params['uName'] = this.editObject.uname;
                if (this.editObject.ResetPasswd) {
                  params['uPasswd'] = md5(this.editObject.uname + this.editObject.ResetPasswd);
                } else {
                  params['uPasswd'] = this.editObject.ResetPasswd;
                }
                params['uEmail'] = this.editObject.uemail;
                params['uTelephone'] = this.editObject.utelephone;
                let phone = '';
                const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
                if(this.editObject.umobilephone == ''){
                  this.$message({
                    type: 'error',
                    message: '手机号必填'
                  });
                  this.loadingBtn = false;
                  this.num = 0;
                  return;
                }else if(this.editObject.umobilephone == this.phoneNum) {
                  phone = '';
                }else if(!reg.test(this.editObject.umobilephone)){
                  this.$message({
                    type: 'error',
                    message: '请输入正确手机号'
                  });
                  this.loadingBtn = false;
                  this.num = 0;
                  return;
                }else {
                  phone = this.editObject.umobilephone;
                }
                params['uMobilephone'] = phone;
                params['uRole'] = this.editObject.urole;
                params['uContent'] = this.editObject.ucontent;
                params['uSpecialUser'] = this.tsUserEdit;
                // console.log(params)
                API.post('/user/update', params, { Authorization: storage.get('Token') }).then((res) => {
                  //console.log(res.data)
                  if (res.data.code == 200) {
                    this.editPop = false;
                    this.getPage();
                    this.$message({
                      type: 'success',
                      message: '编辑成功，重新登录系统生效!'
                    });
                  } else if (res.data.code == 1001) {
                    this.signOut();
                  } else if (res.data.code == 401) {
                    this.$router.push({ name: 'auth' });
                  } else {
                    this.$message({
                      type: 'error',
                      message: '编辑失败!'+ res.data.message
                    });
                    this.loadingBtn = false;
                    this.num = 0;
                  }
                })
            }else {
              return;
              }
            }else {
              var name = {};
              name['name'] = this.editObject.uname;
              API.get('/user/shiroByName', name, {Authorization: storage.get('Token')}).then((res) => {
                if (res.data.code == 200) {
                  // 控制每个按钮只能点击一次
                  this.num ++;
                  if(this.num == 1) {
                    this.loadingBtn = true;
                    let params = {};
                    params['uId'] = this.editObject.id;
                    params['uMechanism'] = this.editObject.umechanism;
                    params['uDepartment'] = this.udepartmentId;
                    params['uUsername'] = this.editObject.uusername;
                    params['uName'] = this.editObject.uname;
                    if (this.editObject.ResetPasswd) {
                      params['uPasswd'] = md5(this.editObject.uname + this.editObject.ResetPasswd);
                    } else {
                      params['uPasswd'] = this.editObject.ResetPasswd;
                    }
                    params['uEmail'] = this.editObject.uemail;
                    params['uTelephone'] = this.editObject.utelephone;
                    let phone = '';
                    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
                    if(this.editObject.umobilephone == ''){
                      this.$message({
                        type: 'error',
                        message: '手机号必填'
                      });
                      this.loadingBtn = false;
                      this.num = 0;
                      return;
                    }else if(this.editObject.umobilephone == this.phoneNum) {
                      phone = '';
                    }else if(!reg.test(this.editObject.umobilephone)){
                      this.$message({
                        type: 'error',
                        message: '请输入正确手机号'
                      });
                      this.loadingBtn = false;
                      this.num = 0;
                      return;
                    }else {
                      phone = this.editObject.umobilephone;
                    }
                    params['uMobilephone'] = phone;
                    params['uRole'] = this.editObject.urole;

                    params['uContent'] = this.editObject.ucontent;
                    params['uSpecialUser'] = this.tsUserEdit;
                    // console.log(params)
                    API.post('/user/update', params, { Authorization: storage.get('Token') }).then((res) => {
                      //console.log(res.data)
                      if (res.data.code == 200) {
                        this.editPop = false;
                        this.getPage();
                        this.$message({
                          type: 'success',
                          message: '编辑成功!'
                        });
                      } else if (res.data.code == 1001) {
                        this.signOut();
                      } else if (res.data.code == 401) {
                        this.$router.push({ name: 'auth' });
                      } else {
                        this.$message({
                          type: 'error',
                          message: '编辑失败!'+ res.data.message
                        });
                        this.loadingBtn = false;
                        this.num = 0;
                      }
                    })
                  }else {
                    return;
                  }
                }else if (res.data.code == 1001) {
                  this.signOut();
                } else {
                  this.$message({
                    type: 'error',
                    message: '编辑失败!' + res.data.message
                  });
                  this.loadingBtn = false;
                  this.num = 0;
                }
              })
            }
          }else {
            this.loadingBtn = false;
            this.num = 0;
          }
        })

      }

    },
    // 编辑部门模态框树展示
    udeClick() {
      this.choosePop = true;
      this.getDepartment(this.editObject.umechanism);
    },
    // 编辑角色
    EdithandleChecked(val) {
      this.editObject.urole = [];
      var chekc = val;
      for (var i = 0; i < this.power.length; i++) {
        for (var j = 0; j < chekc.length; j++) {
          if (this.power[i].roleName == chekc[j]) {
            this.editObject.urole.push(this.power[i].id);
          }
        }
      }
    },
    // 删除
    del(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {};
        params['id'] = id;
        API.delete('/user/delete', params, { Authorization: storage.get('Token') }).then((res) => {
          if (res.data.code == 200) {
            this.getPage();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          } else if (res.data.code == 1001) {
            this.signOut();
          } else if (res.data.code == 401) {
            this.$router.push({ name: 'auth' });
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'+ res.data.message
            });
          }
        });
      });
    },

    // 新增编辑部门取值
    chooseNodeClick(data) {
      //console.log(data)
      this.udepartmentName = data.label;
      this.udepartmentId = data.id;
      this.choosePop = false;
    },

    /*confirmChooseBranch() {
      if (this.addPop) {
        this.form.branch = this.middleChooseBranch;
      } else {
        this.search.branch = this.middleChooseBranch;
      }
      this.choosePop = false
    },*/
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 翻页器
    handleSizeChange(val) {
      //console.log(val);
      this.pageSize = val;
      if(this.PageContID == ''){
        // this.getPage();
        if(this.searchNum == '1'){
          this.getSearch();
        }else {
          this.getPage();
        }
      }else {
        this.OrgTreeClick(this.PageContID);
      }


    },
    handleCurrentChange(val) {
      //console.log(val);
      this.currentPage = val;
      if(this.PageContID == ''){
        if(this.searchNum == '1'){
          this.getSearch();
        }else {
          this.getPage();
        }
        // this.getPage();

      }else {
        this.OrgTreeClick(this.PageContID);
      }

    },

    signOut() {
      this.$message({
        type: 'error',
        message: '登录失效，请重新登录!'
      });
      // storage.delete('Authorization');
      storage.delete('Auth');
      storage.delete('Token');
      storage.delete('User');
      this.$router.push({ name: 'login' });
    }


  },
  watch: {
    filterText(val) {
      this.$refs.filterTree.filter(val);
    }
  },
  created() {
    this.getPage();
    this.getAffiliate();
    this.getTree();
    // this.abc();

  }
};
</script>
<style>
  .phoneBox1 {
    float: left;
    width: 90px;
    text-align: right;
    padding-right: 10px;
  }
  .phoneBox1 >span {
    line-height: 35px;
  }
  .phoneBox2 {
    float: left;
    width: 265.75px;
  }
  .userBox {
    margin: 0 0 15px 27px;
  }
  .userBox > span {
    margin-bottom: 15px;
    display: block;
    float: left;
    margin-right: 10px;
  }
.user-page .el-select {
  width: 100%;
}
.user-page .btn .el-form-item__content {
  margin-left: initial !important;
  text-align: center;
}
  .el-dialog__wrapper .el-tree {
    max-height: 550px;
    height: 550px;
    overflow: auto;
  }
  .left .el-tree {
    max-height: 750px;
    height: 750px;
    overflow: auto;
  }
</style>
<style lang="less">
.user-page {
  .del-span {
    position: absolute;
    right: 12px;
    top: 9px;
    color: #c0c4cc;
    cursor: pointer;
  }
  .content {
    .search-nav {
      .flex {
        display: flex;
      }
      .name {
        display: block;
        line-height: 40px;
        font-weight: 600;
        width: 100px;
        font-size: 14px;
      }
    }
    .result-table {
      .has-gutter {
        tr {
          th {
            background: #026ab3;
            color: #fff;
            font-weight: 700;
            text-align: center;
          }
        }
      }
    }
  }
  .el-dialog__wrapper.tip-dialog {
    .el-dialog {
      margin: 15vh auto !important;
      width: 50%;
      max-width: 1200px;
      min-width: 500px;
    }
  }
  .el-dialog__wrapper.choose-pop {
    .el-dialog {
      margin: 15vh auto !important;
      width: 400px;
      .pop-content {
        height: 600px;
      }
    }
  }
  .el-radio {
    margin: 0 30px 20px 0;
  }
  .el-radio + .el-radio {
    margin: 0 30px 20px 0;
  }
}
</style>

<style lang="less" scoped>
.user-page {
  min-height: 780px;
  background: #fff;
  width: 100%;
  overflow: hidden;
  .cell {
    float: left;
    min-height: 780px;
    height: auto;
    border-radius: 3px;
    overflow: hidden;
    box-sizing: border-box;
    border: 1px solid #ccc;
    .content {
      padding: 20px 10px;
      box-sizing: border-box;
      .result-table {
        margin-top: 20px;
      }
      .pagination-box {
        margin-top: 40px;
        text-align: center;
      }
    }
    .title {
      height: 30px;
      background: #026ab3;
      text-align: center;
      line-height: 30px;
      color: #fff;
      font-size: 13px;
    }
    &.left {
      width: 18%;
      margin: 20px 1%;
    }
    &.right {
      width: 79%;
      margin: 20px 1% 0 0;
    }
  }
}
</style>
