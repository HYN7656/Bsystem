<template>
  <div class="menu-page">
    <div class="left cell">
      <div class="title">菜单管理<el-button type="success" icon="el-icon-refresh" circle size="mini" style="float: right" @click="getRes"></el-button></div>
      <div class="content">
        <div>
          <el-tree
          :data="listMenu"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :expand-on-click-node="false"
          :default-expand-all="true"
        ></el-tree>
        </div>
      </div>
    </div>
    <div class="right cell">
      <div class="title">菜单列表</div>
      <div class="content">
        <el-row :gutter="20">
          <el-col :span="4" class="flex btn">
            <el-button type="success" @click="addMenu">添加菜单</el-button>
          </el-col>
        </el-row>
        <div class="result-table">
          <el-table :data="tableData" border style="width: 100%" max-height="600">
            <el-table-column prop="name" label="名称" width="200"></el-table-column>
            <el-table-column prop="url" label="链接"></el-table-column>
            <!--<el-table-column prop="hide" label="可见" width="140">
              <template slot-scope="scope">
                <span v-if="scope.row.hide=='0'">显示</span>
                <span v-if="scope.row.hide=='1'">隐藏</span>
              </template>
            </el-table-column>-->
            <el-table-column prop="permission" label="权限标识" width="240"></el-table-column>
            <el-table-column label="操作" width="140">
              <template slot-scope="scope">
                <el-button @click="editOpen(scope.row.id)" type="text" size="small">修改</el-button>
                <el-button @click="del(scope.row.id)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!--添加-->
    <el-dialog title="添加菜单" :visible.sync="addPop" class="tip-dialog" :close-on-click-modal="false">
      <div class="pop-content">
        <el-form ref="addObject" :model="addObject" label-width="100px" :rules="rules">
          <el-form-item label="上级菜单">
            <div class="el-select" readonly="readonly">
              <div class="el-input el-input--suffix">
                <input
                  v-model="addObject.branch"
                  type="text"
                  readonly="readonly"
                  autocomplete="off"
                  placeholder="请选择上级菜单"
                  class="el-input__inner"
                  @click="isBranchPop"
                >
              </div>
            </div>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="addObject.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="链接" prop="url">
            <el-input v-model="addObject.url" placeholder="请输入链接"></el-input>
            <span>点击菜单跳转的页面，如/quarterly/handle/replyExport</span>
          </el-form-item>
          <!--<el-form-item label="图标">
            <i class="fa" :class="addObject.icon">{{addObject.icon}}</i>
            <el-button type="primary" @click="chooseIcon" size="small">选择</el-button>
          </el-form-item>
          <el-form-item label="可见">
            <el-radio-group v-model="addObject.hide">
              <el-radio label="0">显示</el-radio>
              <el-radio label="1">隐藏</el-radio>
            </el-radio-group>
            <span>该菜单或操作是否显示到系统菜单中</span>
          </el-form-item>-->
          <el-form-item label="权限标识" prop="permission">
            <el-input v-model="addObject.permission" placeholder="请输入权限标识"></el-input>
            <span>控制器中定义的权限标识，如：replyExport</span>
          </el-form-item>
          <el-form-item label="备注" prop="des">
            <el-input type="textarea" v-model="addObject.des" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addSave('addObject')" :loading='loadingBtn'>保存</el-button>
            <el-button @click="addPop=false">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--编辑-->
    <el-dialog
      title="编辑菜单"
      :visible.sync="editPop"
      class="tip-dialog"
      :close-on-click-modal="false"
    >
      <div class="pop-content">
        <el-form ref="editObject" :model="editObject" label-width="100px" :rules="rules">
          <el-form-item label="上级菜单">
            <div class="el-select" readonly="readonly">
              <div class="el-input el-input--suffix">
                <input
                  v-model="editObject.branch"
                  type="text"
                  readonly="readonly"
                  autocomplete="off"
                  placeholder="请选择上级菜单"
                  class="el-input__inner"
                  @click="isBranchPop"
                >
              </div>
            </div>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="editObject.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="链接" prop="url">
            <el-input v-model="editObject.url" placeholder="请输入链接"></el-input>
            <span>点击菜单跳转的页面，如/quarterly/handle/replyExport</span>
          </el-form-item>
          <!--<el-form-item label="图标">
            <i class="fa" :class="editObject.icon">{{editObject.icon}}</i>
            <el-button type="primary" @click="chooseIcon" size="small">选择</el-button>
          </el-form-item>
          <el-form-item label="可见">
            <el-radio-group v-model="editObject.hide">
              <el-radio label="0">显示</el-radio>
              <el-radio label="1">隐藏</el-radio>
            </el-radio-group>
            <span>该菜单或操作是否显示到系统菜单中</span>
          </el-form-item>-->
          <el-form-item label="权限标识" prop="permission">
            <el-input v-model="editObject.permission" placeholder="请输入权限标识"></el-input>
            <span>控制器中定义的权限标识，如：replyExport</span>
          </el-form-item>
          <el-form-item label="备注" prop="des">
            <el-input type="textarea" v-model="editObject.des" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editSave('editObject')" :loading='loadingBtn'>保存</el-button>
            <el-button @click="editPop=false">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--选择图表弹层-->
    <el-dialog
      title="选择菜单"
      :visible.sync="choosePop"
      class="choose-pop dialog-menu"
      :close-on-click-modal="false"
    >
      <div class="pop-table">
        <div class="pop-content">
          <div class="choose-cell" v-for="(item,index) in iconArr.data" :key="'title' + index">
            <h1 class="title">{{item.title}}</h1>
            <div class="detail-content">
              <div
                class="content-cell"
                v-for="(i,idx) in item.data"
                :key="'menu' + idx"
                @click="chooseMenu(i)"
              >
                <i class="fa" :class="i.class"></i>
                {{i.name}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--选择部门弹层-->
    <el-dialog
      title="选择菜单"
      :visible.sync="chooseBranchPop"
      class="choose-branch-pop"
      :close-on-click-modal="false"
    >
      <div class="pop-content">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        <el-tree
          @node-click="chooseNodeClick"
          class="filter-tree"
          :data="listMenu"
          :props="defaultProps"
          :filter-node-method="filterNode"
          ref="filterTree"
          :default-expand-all="true"
          :expand-on-click-node="false"
        ></el-tree>
      </div>
      <!--<div class="pop-btn">
        <el-button type="success" @click="confirmChooseBranch">确定</el-button>
        <el-button type="info" @click="chooseBranchPop = false">取消</el-button>
      </div>-->
    </el-dialog>
  </div>
</template>

<script>
import IconArr from './../../assets/json/icons.json';

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
      ////console.log(reg.test(value));
      if (!reg.test(value)) {
        callback();
      } else {
        return callback(new Error('请输入正确链接格式'));
      }
    };
    return {
      loadingBtn : false,
      editPop: false,
      addPop: false,
      // 上级菜单模态框
      chooseBranchPop: false,
      // icon模态框
      choosePop: false,
      listMenu: [],
      tableData: [],
      addObject: {
        branch: '',
        pId: '',
        name: '',
        url: '',
        // icon: '',
        // hide: '0',
        permission: '',
        des: ''
      },
      editObject: {
        branch: '',
        pId: '',
        name: '',
        url: '',
        // icon: '',
        // hide: '',
        permission: '',
        des: '',
        sId: ''
      },
      // 上级菜单标题和id
      middleChooseId: '',
      middleChooseBranch: '',
      filterText: '',
      // icon
      iconArr: IconArr,
      // 树默认绑定
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      num : 0,
      rules: {
        name: [
          { required: true, message: '名称必填' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符之间', trigger: 'blur' }
        ],
        url: [
          { validator: validatePass, trigger: 'blur' },
          { required: true, message: '链接必填' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符之间', trigger: 'blur' }
        ],
        permission: [
          { validator: validatePass, trigger: 'blur' },
          { required: true, message: '权限标识必填' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符之间', trigger: 'blur' }
        ],
        des: [
          { min: 1, max: 150, message: '长度在 1 到 150 个字符之间', trigger: 'blur' }
        ],
      },

    };
  },
  methods: {
    //刷新
    getRes(){
      this.getPage();
      // this.getAffiliate();
      // this.getTree();
    },
    // 页面初始化
    getPage() {
      let params = {};
      API.get('/menu/findMenuList', params, { Authorization: storage.get('Token') }).then((res) => {
        // console.log(res.data)
        if (res.data.code == 200) {
          this.tableData = res.data.data.menuList;
          var arr3 = res.data.data.treeList;
          this.listMenu = this.getOrg(arr3);
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: 'auth' });
        } else {
          this.$message({
            type: 'error',
            message: res.data.message
          });
        }
      })
    },
    // 转换树结构
    getOrg(list) {
      for (let i = 0; i < list.length; i++) {
        list[i]["label"] = list[i]["name"];
        if (list[i]["children"]) {
          list[i]["children"] = this.getOrg(list[i]["children"]);
          // delete list[i]["children"];
        }
      }
      return list;
    },
    // 通过左侧树选择后展示右侧列表
    getAllTreeList(id) {
      let params = {};
      params['id'] = id;
      API.get('/menu/findChildList', params, { Authorization: storage.get('Token') }).then((res) => {
        // console.log(res.data);
        if (res.data.code == 200) {
          this.tableData = res.data.data;
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: 'auth' });
        } else {
          this.$message({
            type: 'error',
            message: res.data.message
          });
        }
      })
    },
    handleNodeClick(data) {
      //console.log(data.label);
      this.getAllTreeList(data.id);
    },
    // 新增
    addMenu() {
      this.addPop = true;
      this.loadingBtn = false;
      this.num = 0;
      this.addObject = {
        branch: '',
        pId: '',
        name: '',
        url: '',
        // icon: '',
        // hide: '0',
        permission: '',
        des: ''
      }
    },
    // 新增保存
    addSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.num ++;
          if(this.num == 1) {
            this.loadingBtn = true;
            let params = {};
            if(!this.addObject.pId){
              params['pId'] = 0;
            }else {
              params['pId'] = this.addObject.pId;
            }
            params['name'] = this.addObject.name;
            params['url'] = this.addObject.url;
            // params['icon'] = this.addObject.icon;
            // params['hide'] = this.addObject.hide;
            params['permission'] = this.addObject.permission;
            params['des'] = this.addObject.des;
            // console.log(params)
            API.post('/menu/addMenuInfo', params, { Authorization: storage.get('Token') }).then((res) => {
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
                this.$message({
                  type: 'error',
                  message: '新增失败!'+ res.data.message
                });
                this.loadingBtn = false;
                this.num = 0;
              }
            })
          }else{
            return
          }
        }else {
          this.loadingBtn = false;
          this.num = 0;
        }
      })
    },
    editOpen(id) {
      this.editPop = true;
      this.loadingBtn = false;
      this.num = 0;
      this.editObject = {
        branch: '',
        pId: '',
        name: '',
        url: '',
        // icon: '',
        // hide: '',
        permission: '',
        des: '',
        sId: ''
      }
      let params = {};
      params['id'] = id;
      API.get('/menu/findMenuListById', params, { Authorization: storage.get('Token') }).then((res) => {
        //console.log(res.data)
        if (res.data.code == 200) {
          this.editObject = res.data.data.menuInfo;
          this.editObject.hide = String(res.data.data.menuInfo.hide);
          this.editObject.pId = res.data.data.menuInfo.pid;
          this.editObject.sId = res.data.data.menuInfo.id;
          this.editObject.branch = res.data.data.pname;
          //console.log(this.editObject)
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: 'auth' });
        } else {
          this.$message({
            type: 'error',
            message: res.data.message
          });
        }
      })
    },
    editSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.num ++;
          if(this.num == 1) {
            this.loadingBtn = true;
            let params = {};
            params['sId'] = this.editObject.sId;
            if(!this.editObject.pId){
              params['pId'] = 0;
            }else {
              params['pId'] = this.editObject.pId;
            }
            params['name'] = this.editObject.name;
            params['url'] = this.editObject.url;
            // params['icon'] = this.editObject.icon;
            // params['hide'] = this.editObject.hide;
            params['permission'] = this.editObject.permission;
            params['des'] = this.editObject.des;
            //console.log(params)
            // /menu/updateMenuInfo
            API.post('/menu/updateMenuInfo', params, { Authorization: storage.get('Token') }).then((res) => {
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
          }else{
            return;
          }

        }else {
          this.loadingBtn = false;
          this.num = 0;
        }
      })
    },
    /*// 打开icon
    chooseIcon() {
      this.choosePop = true;
    },
    // 选择icon
    chooseMenu(item) {
      this.addObject.icon = item.class;
      this.editObject.icon = item.class;
      this.choosePop = false;
    },*/
    // 打开上级菜单模态框
    isBranchPop() {
      this.chooseBranchPop = true;
    },
    // 选择上级菜单
    chooseNodeClick(data) {
      //console.log(data)
      this.middleChooseBranch = data.label;
      this.middleChooseId = data.id;
      this.addObject.pId = this.middleChooseId;
      this.editObject.pId = this.middleChooseId;
      this.addObject.branch = this.middleChooseBranch;
      this.editObject.branch = this.middleChooseBranch;
      this.chooseBranchPop = false;
    },
    // 保存上级菜单
    /*confirmChooseBranch() {
      this.addObject.pId = this.middleChooseId;
      this.editObject.pId = this.middleChooseId;
      this.addObject.branch = this.middleChooseBranch;
      this.editObject.branch = this.middleChooseBranch;
      this.chooseBranchPop = false
    },*/
    // 菜单过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
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
        API.post('/menu/del', params, { Authorization: storage.get('Token') }).then((res) => {
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
    signOut() {
      this.$message({
        type: 'error',
        message: '登录失效，请重新登录!'
      });
      storage.delete('Authorization');
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
  }
};
</script>
<style>
  .menu-page .el-dialog__wrapper .el-tree {
    max-height: 550px;
    height: 550px;
    overflow: auto;
  }
  .menu-page .left .el-tree {
    max-height: 750px;
    height: 750px;
    overflow: auto;
  }
</style>
<style lang="less">
.menu-page {
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
  .el-form-item__content {
    .el-radio-group {
      .el-radio {
        margin: 0 10px 0;
      }
    }
  }
  .dialog-menu .el-dialog__body {
    height: 60vh;
    padding: 0 20px 30px;
    overflow: hidden;
    .choose-cell {
      clear: both;
      .title {
        font-size: 30px;
        line-height: 60px;
        color: #026ab3;
      }
      .detail-content {
        width: 100%;
        .content-cell {
          float: left;
          width: 25%;
          cursor: pointer;
          height: 30px;
          line-height: 30px;
          text-align: left;
          color: #333;
          font-size: 16px;
          &:hover {
            color: #026ab3;
          }
        }
      }
    }
  }
  .pop-table {
    height: 100%;
    overflow: auto;
  }
  .el-dialog__wrapper.choose-branch-pop {
    .el-dialog {
      margin: 15vh auto !important;
      width: 400px;
      .pop-content {
        min-height: 280px;
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
      width: 1000px;
      .pop-content {
        min-height: 280px;
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
.menu-page {
  min-height: 780px;
  background: #fff;
  width: 100%;
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
        margin-top: 20px;
        text-align: center;
      }
      .btn {
        button {
          padding: 10px 15px;
          font-size: 12px;
        }
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
