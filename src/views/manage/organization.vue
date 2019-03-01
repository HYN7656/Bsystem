<template>
  <div class="org-page">
    <div class="left cell">
      <div class="title">组织机构
        <el-button type="success" icon="el-icon-refresh" circle size="mini" style="float: right" @click="getRes"></el-button></div>
      <div class="content">
        <el-tree
          :data="listOrg"
          :props="defaultProps"
          @node-click="getPageCount"
          :expand-on-click-node="false"
          :default-expand-all="true"
        ></el-tree>
      </div>
    </div>
    <div class="right cell">
      <div class="title">机构列表</div>
      <div class="content">
        <el-row :gutter="20">
          <el-col :span="4" class="flex btn">
            <el-button type="success" @click="addOrg">添加机构</el-button>
          </el-col>
        </el-row>
        <div class="result-table">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="mName" label="机构名称" ></el-table-column>
            <el-table-column prop="mCode" label="机构编码" width="120"></el-table-column>
            <el-table-column prop="mType" label="机构类型" width="120"></el-table-column>
            <el-table-column prop="superiorName" label="上级机构" ></el-table-column>
            <el-table-column prop="mContent" label="备注" width="200"></el-table-column>
            <el-table-column label="操作" width="140">
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
    <el-dialog title="添加机构" :visible.sync="addPop" class="tip-dialog" :close-on-click-modal="false">
      <div class="pop-content">
        <el-form ref="addObject" :model="addObject" label-width="100px" status-icon :rules="rules">
          <el-form-item label="上级机构">
            <div class="el-select" readonly="readonly">
              <div class="el-input el-input--suffix">
                <input
                  v-model="OrgName"
                  type="text"
                  readonly="readonly"
                  autocomplete="off"
                  placeholder="请选择"
                  class="el-input__inner"
                  @click="choosePop = true"
                >
                <span class="del-span" @click="delSpan">x</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="机构名称" prop="mName">
            <el-input v-model="addObject.mName" placeholder="请输入机构名称"></el-input>
          </el-form-item>
          <el-form-item label="机构编码">
            <el-input v-model="addObject.mCode" placeholder="请输入机构编码"></el-input>
          </el-form-item>
          <el-form-item label="机构类型" prop="mType">
            <el-select v-model="addObject.mType" placeholder="请选择机构类型">
              <el-option label="机构" value="机构"></el-option>
              <el-option label="部门" value="部门"></el-option>
              <el-option label="小组" value="小组"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系地址" prop="mAddress">
            <el-input v-model="addObject.mAddress" placeholder="请输入联系地址"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mPhone">
            <el-input v-model="addObject.mPhone" placeholder="请输入电话或手机号"></el-input>
          </el-form-item>
          <el-form-item label="传真">
            <el-input v-model="addObject.mFax" placeholder="请输入传真"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="mEmail">
            <el-input v-model="addObject.mEmail" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="addObject.mContent" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addSave('addObject')" :loading='loadingBtn'>保存</el-button>
            <el-button @click="addPop=false">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--编辑弹框-->
    <el-dialog
      title="编辑机构"
      :visible.sync="editPop"
      class="tip-dialog"
      :close-on-click-modal="false"
    >
      <div class="pop-content">
        <el-form
          ref="editObject"
          :model="editObject"
          label-width="100px"
          status-icon
          :rules="rules"
        >
          <el-form-item label="上级机构" v-show="sjjg">
            <div class="el-select" readonly="readonly">
              <div class="el-input el-input--suffix">
                <input
                  v-model="OrgName"
                  type="text"
                  readonly="readonly"
                  autocomplete="off"
                  placeholder="请选择"
                  class="el-input__inner"
                  @click="choosePop = true"
                >
                <span class="del-span" @click="delSpan">x</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="机构名称" prop="mName">
            <el-input v-model="editObject.mName" placeholder="请输入机构名称"></el-input>
          </el-form-item>
          <el-form-item label="机构编码">
            <el-input v-model="editObject.mCode" placeholder="请输入机构编码"></el-input>
          </el-form-item>
          <el-form-item label="机构类型" prop="mType">
            <el-select v-model="editObject.mType" placeholder="请选择机构类型">
              <el-option label="机构" value="机构"></el-option>
              <el-option label="部门" value="部门"></el-option>
              <el-option label="小组" value="小组"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系地址" prop="mAddress">
            <el-input v-model="editObject.mAddress" placeholder="请输入联系地址"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mPhone">
            <el-input v-model="editObject.mPhone" placeholder="请输入电话或手机号"></el-input>
          </el-form-item>
          <el-form-item label="传真">
            <el-input v-model="editObject.mFax" placeholder="请输入传真"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="mEmail">
            <el-input v-model="editObject.mEmail" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="editObject.mContent" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editSave('editObject')" :loading='loadingBtn'>保存</el-button>
            <el-button @click="editPop=false">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--选择部门弹层-->
    <el-dialog
      title="选择部门"
      :visible.sync="choosePop"
      class="choose-branch-pop"
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
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sjjg:false,
      loadingBtn : false,
      filterText: '',
      editPop: false,
      addPop: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      choosePop: false,
      tableData: [],
      // 机构树容器
      listOrg: [],
      // 树默认
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 机构名称展示
      OrgName: '',
      // 机构id获取
      OrgId: 0,
      // 新增
      addObject: {
        mName: '',
        mCode: '',
        mType: '',
        mAddress: '',
        mPhone: '',
        mFax: '',
        mEmail: '',
        mContent: ''
      },
      editObject: {
        mName: '',
        mCode: '',
        mType: '',
        mAddress: '',
        mPhone: '',
        mFax: '',
        mEmail: '',
        mContent: ''
      },
      rules: {
        mName: [
          { required: true, message: '机构名称必填' }
        ],
        mType: [
          { required: true, message: '机构类型必填' }
        ],
        mPhone: [
          { required: true, message: '电话或手机必填' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符之间', trigger: 'blur' }
        ],
        mEmail :[
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
          { min: 1, max: 40, message: '长度在 1 到 40 个字符之间', trigger: 'blur' }
        ],
        mAddress : [
          {  max: 50, message: '长度在 50 个字符之内', trigger: 'blur' }
        ],
      },
      num : 0,
      EditID : '',
      OrgMId : '',
      PageContID : ''

    };
  },
  methods: {
    //刷新
    getRes(){
      this.getPage();
      // this.getAffiliate();
      this.getTree();
      this.PageContID = '';
    },
    //加载所有机构和部门
    getTree() {
      let params = {};
      API.get('/mechanism/findTreeAll', params, { Authorization: storage.get('Token') }).then((res) => {
        // console.log(res.data)
        if (res.data.code == 200) {
          var arr = res.data.data;
          this.listOrg = this.getOrg(arr);
          // console.log(this.listOrg)
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
      this.getAllTreeList(data);
      this.PageContID = data;
    },
    // 树选择机构
    chooseNodeClick(data) {
      // console.log(data)
      this.OrgMId = data.mId;
      this.OrgName = data.label;
      this.OrgId = data.id;
      this.choosePop = false;
    },
    // 通过左侧树选择后展示右侧列表
    getAllTreeList(data) {
      // console.log(this.PageContID.id);
      let params = {};
      params['id'] = data.id;
      params['page'] = this.currentPage;
      params['count'] = this.pageSize;
      API.get('/mechanism/findById', params, { Authorization: storage.get('Token') }).then((res) => {
        // console.log(res.data)
        if (res.data.code == 200) {
          this.total = res.data.count;
          this.tableData = res.data.data;
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: 'auth' });
        }
      })
    },
    /*handleNodeClick(data) {
      //console.log(data.label);
      this.getAllTreeList(data.id)
    },*/
    // 页面初始化
    getPage() {
      let params = {};
      params['page'] = this.currentPage;
      params['count'] = this.pageSize;
      API.get('/mechanism/findAll', params, { Authorization: storage.get('Token') }).then((res) => {
        // console.log(res.data)
        if (res.data.code == 200) {
          this.total = res.data.count;
          this.tableData = res.data.data;
          this.getTree();
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: 'auth' });
        }
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

    // 新增
    addOrg() {
      if (this.$refs.addObject) {
        this.$refs.addObject.clearValidate();
      }
      this.addPop = true;
      this.loadingBtn = false;
      this.num = 0;
      this.getTree();
      this.addObject = {
        mName: '',
        mCode: '',
        mType: '',
        mAddress: '',
        mPhone: '',
        mFax: '',
        mEmail: '',
        mContent: ''
      }
      this.OrgId = 0;
      this.OrgName = '';
    },

    // 新增保存
    addSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.num ++;
          if(this.num == 1){
            this.loadingBtn = true;
            let params = {};
            params['mId'] = this.OrgId;
            params['mName'] = this.addObject.mName;
            params['mCode'] = this.addObject.mCode;
            params['mType'] = this.addObject.mType;
            params['mAddress'] = this.addObject.mAddress;
            params['mPhone'] = this.addObject.mPhone;
            params['mFax'] = this.addObject.mFax;
            params['mEmail'] = this.addObject.mEmail;
            params['mContent'] = this.addObject.mContent;

            // console.log(params)
            API.post('/mechanism/create', params, { Authorization: storage.get('Token') }).then((res) => {
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
                this.$router.push({ name: 'auth' })
              } else {
                this.$message({
                  type: 'error',
                  message: '新增失败!'+res.data.message
                });
                this.loadingBtn = false;
                this.num = 0;
              }
            })
          }else {
            return;
          }
        }else {
          this.loadingBtn = false;
          this.num = 0;
        }
      })
    },
    // 清除上级机构
    delSpan(){
      this.OrgName = '';
      this.OrgId = 0;
    },
    // 编辑
    editOpen(id) {
      if (this.$refs.editObject) {
        this.$refs.editObject.clearValidate();
      }
      this.editPop = true;
      this.loadingBtn = false;
      this.EditID = id;
      this.num = 0;
      this.getTree();
      this.editObject = {
        mName: '',
        mCode: '',
        mType: '',
        mAddress: '',
        mPhone: '',
        mFax: '',
        mEmail: '',
        mContent: ''
      }
      this.OrgId = 0;
      this.OrgName = '';
      let params = {};
      params['id'] = id;
      API.get('/mechanism/findOneById', params, { Authorization: storage.get('Token') }).then((res) => {
        // console.log(res.data)
        if (res.data.code == 200) {
          if(res.data.message == '10080'){
            this.sjjg = false;
          }else {
            this.sjjg = true;
          }
          this.editObject = res.data.data[0];
          // console.log(this.editObject)
          var obj = res.data.data[0];

          // 机构显示名称
          this.OrgName = obj.superiorName;
          this.OrgId = obj.mid;
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: 'auth' });
        }
      })
    },

    // 编辑保存
    editSave(formName) {
      if(this.EditID == this.OrgId||this.OrgMId == this.editObject.id) {
        this.$message({
          type: 'error',
          message: '上级机构不可为当前机构或当前机构的下级机构'
        });
      }else {
        this.$refs[formName].validate((valid) => {
        if (valid) {
          this.num ++;
          if(this.num == 1) {
            this.loadingBtn = true;
            let params = {};
            params['id'] = this.editObject.id;
            params['mId'] = this.OrgId;
            params['mName'] = this.editObject.mName;
            params['mCode'] = this.editObject.mCode;
            params['mType'] = this.editObject.mType;
            params['mAddress'] = this.editObject.mAddress;
            params['mPhone'] = this.editObject.mPhone;
            params['mFax'] = this.editObject.mFax;
            params['mEmail'] = this.editObject.mEmail;
            params['mContent'] = this.editObject.mContent;

            // console.log(params)
            API.post('/mechanism/update', params, { Authorization: storage.get('Token') }).then((res) => {
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
        }else {
          this.loadingBtn = false;
          this.num = 0;
        }
      })
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
        API.delete('/mechanism/delete', params, { Authorization: storage.get('Token') }).then((res) => {
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
              message: '删除失败!' + res.data.message
            });
          }
        })
      })
    },

    // 翻页器
    handleSizeChange(val) {
      // console.log(this.PageContID)
      //console.log(val);
      this.pageSize = val;
      if(this.PageContID.id == ''||!this.PageContID){
        this.getPage();
      }else {
        this.getAllTreeList(this.PageContID);
      }
    },
    handleCurrentChange(val) {
      // console.log(this.PageContID)
      //console.log(val);
      this.currentPage = val;
      if(this.PageContID.id == '' ||!this.PageContID){
        this.getPage();
      }else {
        this.getAllTreeList(this.PageContID);
      }
    },


    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },



    chooseBranchPop() { },
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
    // this.getmechAll();


  }
};
</script>
<style>
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
.org-page {
  .del-span {
    position: absolute;
    right: 12px;
    top: 0px;
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
        width: 120px;
        font-size: 17px;
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
  .el-dialog__wrapper.choose-branch-pop {
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
.org-page {
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
      .btn {
        button {
          padding: 10px 15px;
          font-size: 12px;
        }
      }
      .result-table {
        margin-top: 20px;
      }
      .pagination-box {
        margin-top: 20px;
        text-align: center;
      }
    }
    .title {
      height: 40px;
      background: #026ab3;
      text-align: center;
      line-height: 40px;
      color: #fff;
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
