<template>
  <div class="role-page">
    <div class="right cell">
      <div class="title">角色管理</div>
      <div class="content">
        <el-row :gutter="20">
          <el-col :span="4" class="flex btn">
            <el-button type="success" @click="addMenu">添加角色</el-button>
          </el-col>
        </el-row>
        <div class="result-table">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="mechanismName" label="归属机构"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                  @click="allotOpen(scope.row.id,scope.row.roleName,scope.row.mechanismName)"
                  type="text"
                  size="small"
                >分配</el-button>
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
    <!--新增-->
    <el-dialog title="新增" :visible.sync="addPop" class="tip-dialog" :close-on-click-modal="false">
      <div class="pop-content">
        <el-form ref="addObject" :model="addObject" label-width="100px">
          <el-form-item label="归属机构">
            <el-select v-model="addObject.umechanism" placeholder="请选择归属机构">
              <el-option v-for="item in OrgOpt" :key="item.id" :label="item.mName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色名称">
            <el-input v-model="addObject.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色授权">
            <el-tree
              :data="listMenu"
              show-checkbox
              node-key="id"
              ref="Tree"
              :default-expand-all="true"
              :props="defaultPropsRole"
              @check-change="handleCheckChange"
            ></el-tree>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="addObject.desc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addSave">保存</el-button>
            <el-button @click="addPop=false">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--修改-->
    <el-dialog title="修改" :visible.sync="editPop" class="tip-dialog" :close-on-click-modal="false">
      <div class="pop-content">
        <el-form ref="editObject" :model="editObject" label-width="100px">
          <el-form-item label="归属机构">
            <el-select v-model="mechanismId" placeholder="请选择归属机构">
              <el-option v-for="item in OrgOpt" :key="item.id" :label="item.mName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色名称">
            <el-input v-model="editObject.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色授权">
            <el-tree
              :data="listMenu"
              show-checkbox
              node-key="id"
              ref="Tree"
              :default-expand-all="true"
              :props="defaultPropsRole"
              @check-change="handleCheckChange"
            ></el-tree>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="editObject.desc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editSave">保存</el-button>
            <el-button @click="editPop=false">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--选择部门弹层-->
    <el-dialog
      title="选择部门"
      :visible.sync="chooseBranchPop"
      class="choose-branch-pop"
      :close-on-click-modal="false"
    >
      <div class="pop-content">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        <el-tree
          @node-click="chooseNodeClick"
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          :filter-node-method="filterNode"
          ref="filterTree"
          :default-expand-all="true"
          :expand-on-click-node="false"
        ></el-tree>
      </div>
      <div class="pop-btn">
        <el-button type="success" @click="confirmChooseBranch">确定</el-button>
        <el-button type="info" @click="choosePop = false">取消</el-button>
      </div>
    </el-dialog>
    <!--分配角色弹层-->
    <el-dialog
      title="分配角色"
      :visible.sync="assignRolePop"
      class="tip-dialog assign-dialog"
      :close-on-click-modal="false"
    >
      <div class="pop-content">
        <div class="search-nav">
          <el-row :gutter="20" style="margin-bottom:20px;">
            <el-col :span="8" class="flex">
              <span class="name">
                角色名称：
                <span class="bold">{{fpName}}</span>
              </span>
            </el-col>
            <el-col :span="8" class="flex">
              <span class="name">
                归属机构：
                <span class="bold">{{fpJg}}</span>
              </span>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8" class="flex">
              <el-button type="primary" @click="assignClick">分配角色</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="result-table">
          <el-table :data="fptableData" border style="width: 100%">
            <el-table-column prop="umechanismName" label="归属机构"></el-table-column>
            <el-table-column prop="udepartmentName" label="归属部门"></el-table-column>
            <el-table-column prop="uname" label="登录名" width="120"></el-table-column>
            <el-table-column prop="uusername" label="姓名" width="120"></el-table-column>
            <el-table-column prop="utelephone" label="电话" width="120"></el-table-column>
            <el-table-column prop="umobilephone" label="手机" width="120"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="handleRoleDel(scope.row.id)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <!--分配角色弹层-->
    <el-dialog
      title="分配角色"
      :visible.sync="assignRoleDetailPop"
      class="tip-dialog assign-detail-dialog"
      :close-on-click-modal="false"
    >
      <div class="pop-content">
        <div class="role-cell">
          <div class="role-cell-title">所在部门：</div>
          <div class="role-cell-content">
            <el-tree
              :data="listOrg"
              :props="defaultProps"
              @node-click="fpTreeClick"
              :expand-on-click-node="false"
              :default-expand-all="true"
            ></el-tree>
          </div>
        </div>
        <div class="role-cell">
          <div class="role-cell-title">待选人员：</div>
          <div class="role-cell-content">
            <div
              class="user"
              v-for="list in userData"
              :key="list.id"
              @click="chooseRoleClick(list)"
            >
              <i class="fa fa-user"></i>
              {{list.label}}
            </div>
          </div>
        </div>
        <div class="role-cell">
          <div class="role-cell-title">已选人员：</div>
          <div class="role-cell-content">
            <div
              class="user"
              :style="{color:'red'}"
              v-for="(list,index) in chooseUserData"
              :key="list.id"
              @click="delRoleClick1(index)"
            >
              <i class="fa fa-user"></i>
              {{list.label}}
            </div>
            <div
              class="user"
              v-for="(list,index) in chooseUserData2"
              :key="list.id"
              @click="delRoleClick2(index)"
            >
              <i class="fa fa-user"></i>
              {{list.label}}
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmAssign" type="success">确定分配</el-button>
        <el-button type="primary" @click="clearAssign">清除已选</el-button>
        <el-button type="info" @click="closeAssign">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addPop: false,
      editPop: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      roleData: [],
      listMenu: [],
      OrgOpt: [],
      addObject: {
        umechanism: "",
        roleName: "",
        desc: ""
      },
      menus: "",
      editObject: {
        roleName: "",
        desc: ""
      },
      mechanismId: "",
      // 分配
      assignRolePop: false,
      chooseBranchPop: false,
      assignRoleDetailPop: false,
      fpName: "",
      fpJg: "",
      fptableData: [],
      listOrg: [],
      defaultPropsRole: {
        children: "children",
        label: "label"
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 已选人员（原有）
      chooseUserData: [],
      //已选人员（新加）
      chooseUserData2: [],
      // 待选人员
      userData: [],
      // 最终已选人员总和
      arrFP: [],
      arrXZ: [],
      roleId: "",

      middleChooseBranch: "",

      filterText: "",
      data: []
    };
  },
  methods: {
    // 页面初始化
    getPage() {
      let params = {};
      params["page"] = this.currentPage;
      params["count"] = this.pageSize;
      API.get("/role/showRoleList", params, {
        Authorization: storage.get("token")
      }).then(res => {
        // console.log(res.data)
        if (res.data.code == 200) {
          // console.log(obj)
          this.total = res.data.count;
          this.tableData = res.data.data;
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: "auth" });
        }
      });
    },
    //用户树
    getTree() {
      let params = {};
      API.get("/menu/findMenuList", params, {
        Authorization: storage.get("token")
      }).then(res => {
        // console.log(res.data)
        if (res.data.code == 200) {
          var arr = res.data.data.treeList;
          this.listMenu = this.getOrg(arr);
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: "auth" });
        }
      });
    },
    // 转换用户角色树结构
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
    //加载归属机构
    getAffiliate() {
      let params = {};
      API.get("/user/findMechanismAndRole", params, {
        Authorization: storage.get("token")
      }).then(res => {
        // console.log(res.data)
        if (res.data.code == 200) {
          var arr = res.data.data.mechanismAll;
          // console.log(arr)
          this.OrgOpt = arr;
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: "auth" });
        }
      });
    },
    // 新增
    addMenu() {
      this.addPop = true;
      this.addObject = {
        umechanism: "",
        roleName: "",
        desc: ""
      };
      this.menus = "";
    },
    // 新增保存
    addSave() {
      let params = {};
      params["mechanismId"] = this.addObject.umechanism;
      params["roleName"] = this.addObject.roleName;
      params["menus"] = this.menus.join(",");
      params["desc"] = this.addObject.desc;
      console.log(params)
      API.post("/role/addRole", params, {
        Authorization: storage.get("token")
      }).then(res => {
        //console.log(res.data)
        if (res.data.code == 200) {
          this.addPop = false;
          this.getPage();
          this.$message({
            type: "success",
            message: "新增成功!"
          });
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: "auth" });
        } else {
          this.$message({
            type: "error",
            message: "新增失败!"
          });
        }
      });
    },
    // 角色选择
    handleCheckChange(data, checked, indeterminate) {
      this.menus = this.$refs.Tree.getCheckedKeys(false);
    },
    // 编辑
    editOpen(id) {
      this.editPop = true;
      this.editObject = {
        roleName: "",
        desc: ""
      };
      // this.menus = "";
      this.mechanismId = "";
      let params = {};
      params["id"] = id;
      API.get("/role/findRoleById", params, {
        Authorization: storage.get("token")
      }).then(res => {
        console.log(res.data)
        if (res.data.code == 200) {
          this.editObject = res.data.data.roleInfo;
          this.mechanismId = res.data.data.roleInfo.mechanismId;
          // 角色权限返显
          var keyList = res.data.data.menuInfo;
          if (keyList) {
            var arr = keyList.split(",");
            var arr2 = [];
            for (var i = 0; i < arr.length; i++) {
              arr2.push(parseInt(arr[i]));
            }
            this.$refs.Tree.setCheckedKeys(arr2);
          }
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: "auth" });
        }
      });
    },
    // 编辑保存
    editSave() {
      let params = {};
      params["id"] = this.editObject.id;
      params["mechanismId"] = this.mechanismId;
      params["roleName"] = this.editObject.roleName;
      console.log(this.menus)
      params["menus"] = this.menus.join(",");
      params["desc"] = this.editObject.desc;
      console.log(params)
      API.post("/role/updateRole", params, {
        Authorization: storage.get("token")
      }).then(res => {
        //console.log(res.data)
        if (res.data.code == 200) {
          this.editPop = false;
          this.getPage();
          this.$message({
            type: "success",
            message: "修改成功!"
          });
        } else if (res.data.code == 401) {
          this.$router.push({ name: "auth" });
        } else if (res.data.code == 1001) {
          this.signOut();
        } else {
          this.$message({
            type: "error",
            message: "修改失败!"
          });
        }
      });
    },
    // 翻页器
    handleSizeChange(val) {
      //console.log(val);
      this.pageSize = val;
      this.getPage();
    },
    handleCurrentChange(val) {
      //console.log(val);
      this.currentPage = val;
      this.getPage();
    },
    // 删除
    del(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {};
        params["id"] = id;
        API.post("/role/del", params, {
          Authorization: storage.get("token")
        }).then(res => {
          if (res.data.code == 200) {
            this.getPage();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          } else if (res.data.code == 401) {
            this.$router.push({ name: "auth" });
          } else if (res.data.code == 1001) {
            this.signOut();
          } else if (res.data.code == 10013) {
            this.$message({
              type: "error",
              message: "有权限不可删除!"
            });
          } else {
            this.$message({
              type: "error",
              message: "删除失败!"
            });
          }
        });
      });
    },
    /***********************角色分配模块**************************************/
    // 分配
    allotOpen(id, name, jg) {
      this.assignRolePop = true;
      this.fpName = name;
      this.fpJg = jg;
      this.roleId = id;
      let params = {};
      params["RoleId"] = id;
      API.get("/user/findByRoleId", params, {
        Authorization: storage.get("token")
      }).then(res => {
        // console.log(res.data)
        if (res.data.code == 200) {
          if (res.data.data) {
            this.fptableData = res.data.data;
            this.chooseUserData = this.getStaff(this.fptableData).concat();
            this.arrXZ = [];
            for (var i = 0; i < this.fptableData.length; i++) {
              this.arrXZ.push(this.fptableData[i].id);
            }
          }
        } else if (res.data.code == 1001) {
          this.signOut();
        } /*else if(res.data.code == 401){
            this.$router.push({name: 'auth'})
          }*/
      });
    },
    // 分配按钮点击
    assignClick() {
      this.assignRoleDetailPop = true;
      this.chooseUserData2 = [];
      this.getTree2();
    },
    //加载所有机构和部门
    getTree2() {
      let params = {};
      API.get("/mechanism/findTreeAll", params, {
        Authorization: storage.get("token")
      }).then(res => {
        // console.log(res.data)
        if (res.data.code == 200) {
          var arr = res.data.data;
          this.listOrg = this.getOrg2(arr);
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: "auth" });
        }
      });
    },
    // 转换机构树结构
    getOrg2(list) {
      for (let i = 0; i < list.length; i++) {
        list[i]["label"] = list[i]["mName"];
        if (list[i]["childnode"]) {
          list[i]["children"] = this.getOrg2(list[i]["childnode"]);
          delete list[i]["childnode"];
        }
      }
      return list;
    },
    // 点击所在部门展示待选人员
    fpTreeClick(val) {
      this.userData = [];
      //console.log(val)
      if (val.mId == "0") {
        let params = {};
        params["MechanismId"] = val.id;
        params["userId"] = this.arrXZ.join(",");
        API.get("/user/findUserByMechanismId", params, {
          Authorization: storage.get("token")
        }).then(res => {
          // console.log(res.data)
          if (res.data.code == 200) {
            if (res.data.data) {
              this.userData = this.getStaff(res.data.data);
            }
          } else if (res.data.code == 1001) {
            this.signOut();
          } else if (res.data.code == 401) {
            this.$router.push({ name: "auth" });
          }
        });
      } else {
        let params = {};
        params["DepartmentId"] = val.id;
        params["userId"] = this.arrXZ.join(",");
        API.get("/user/findUserByDepartmentId", params, {
          Authorization: storage.get("token")
        }).then(res => {
          // console.log(res.data)
          if (res.data.code == 200) {
            if (res.data.data) {
              this.userData = this.getStaff(res.data.data);
            }
          } else if (res.data.code == 1001) {
            this.signOut();
          } else if (res.data.code == 401) {
            this.$router.push({ name: "auth" });
          }
        });
      }
    },
    // 点击待选人员
    chooseRoleClick(item) {
      let isHas = false;
      this.chooseUserData2.forEach(ele => {
        if (ele.id == item.id) {
          isHas = true;
        }
      });
      if (!isHas) {
        this.chooseUserData2.push(item);
      }
    },

    // 点击已选人员(原)
    delRoleClick1(idx) {
      this.chooseUserData.splice(idx, 1);
    },
    // 点击已选人员(新)
    delRoleClick2(idx) {
      this.chooseUserData2.splice(idx, 1);
    },
    // 清除已选
    clearAssign() {
      this.chooseUserData2 = [];
      this.chooseUserData = this.getStaff(this.fptableData).concat();
    },
    // 点击确定分配
    confirmAssign() {
      this.arrFP = this.chooseUserData.concat(this.chooseUserData2);
      var arr = [];
      for (var i = 0; i < this.arrFP.length; i++) {
        arr.push(this.arrFP[i].id);
      }
      arr = this.uniq(arr);
      let params = {};
      params["userIds"] = arr.join(",");
      params["roleId"] = this.roleId;
      //console.log(params)
      API.post("/userRole/create", params, {
        Authorization: storage.get("token")
      }).then(res => {
        //console.log(res.data)
        if (res.data.code == 200) {
          this.assignRoleDetailPop = false;
          this.$message({
            type: "success",
            message: "分配成功，需重新登录才起效!"
          });
          this.assignRolePop = true;
          this.allotOpen(this.roleId, this.fpName, this.fpJg);
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: "auth" });
        } else {
          this.$message({
            type: "error",
            message: "分配失败!"
          });
        }
      });
    },
    //转换已选人员
    getStaff(list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i]["uusername"]) {
          list[i]["label"] = list[i]["uusername"];
        } else if (list[i]["uUsername"]) {
          list[i]["label"] = list[i]["uUsername"];
        }
      }
      return list;
    },
    // 数组去重
    uniq(array) {
      var temp = []; //一个新的临时数组
      for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1) {
          temp.push(array[i]);
        }
      }
      return temp;
    },

    // 移除按钮
    handleRoleDel(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {};
        params["userId"] = id;
        params["roleId"] = this.roleId;
        //console.log(params)
        API.delete("/userRole/delete", params, {
          Authorization: storage.get("token")
        }).then(res => {
          if (res.data.code == 200) {
            this.assignRolePop = true;
            this.allotOpen(this.roleId, this.fpName, this.fpJg);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          } else if (res.data.code == 1001) {
            this.signOut();
          } else if (res.data.code == 401) {
            this.$router.push({ name: "auth" });
          } else if (res.data.code == 10013) {
            this.$message({
              type: "error",
              message: "有权限不可删除!"
            });
          } else {
            this.$message({
              type: "error",
              message: "删除失败!"
            });
          }
        });
      });
    },
    // 关闭分配模态框
    closeAssign() {
      this.assignRoleDetailPop = false;
    },
    // 选择部门
    chooseNodeClick(data) {
      this.middleChooseBranch = data.label;
    },
    // 选择部门确定
    confirmChooseBranch() {
      // this.form.branch = this.middleChooseBranch;
      this.chooseBranchPop = false;
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    signOut() {
      this.$message({
        type: "error",
        message: "登录失效，请重新登录!"
      });
      storage.delete("Authorization");
      storage.delete("auth");
      storage.delete("token");
      storage.delete("user");
      this.$router.push({ name: "login" });
    }
  },
  watch: {
    filterText(val) {
      this.$refs.filterTree.filter(val);
    }
  },
  created() {
    this.getPage();
    this.getTree();
    this.getAffiliate();
    this.getTree2();
  }
};
</script>
<style lang="less">
.role-page {
  .content {
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
      width: 1000px;
    }
  }
  .el-dialog__wrapper.tip-dialog {
    &.assign-dialog {
      .el-dialog {
        margin: 0 auto !important;
        height: 100%;
        width: 100%;
        .el-dialog__body {
          padding: 0 20px;
          color: #606266;
          font-size: 14px;
        }
        .pop-content {
          .search-nav {
            padding: 30px 15px;
            box-sizing: border-box;
            background: #efefef;
            .name {
              font-weight: normal;
              font-size: 15px;
              .bold {
                font-weight: bold;
              }
            }
          }
          .result-table {
            margin-top: 30px;
          }
        }
      }
    }
    &.assign-detail-dialog {
      .el-dialog {
        margin: 10vh auto !important;
        width: 1000px;
        position: relative;
        height: 700px;
        .pop-content {
          overflow-y: auto;
          height: 100%;
          width: 100%;
          .role-cell {
            float: left;
            height: auto;
            margin: 0 1%;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            border-right: 1px solid #ccc;
            width: 31%;
            &:last-child {
              border-right: none;
            }
          }
          .role-cell-content {
            margin-top: 20px;
            .user {
              height: 30px;
              cursor: pointer;
              line-height: 30px;
            }
          }
        }
        .el-dialog__body {
          height: 500px;
          overflow: hidden;
        }
        .el-dialog__footer {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
        }
      }
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
.role-page {
  min-height: 800px;
  background: #fff;
  width: 100%;
  .cell {
    min-height: 800px;
    height: auto;
    width: 98%;
    margin: 0 1%;
    border-radius: 3px;
    overflow: hidden;
    box-sizing: border-box;
    border: 1px solid #ccc;
    margin-top: 20px;
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
        margin-top: 40px;
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
  }
}
</style>
