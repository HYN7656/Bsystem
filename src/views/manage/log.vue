<template>
  <div class="log-page">
    <div class="right cell">
      <div class="title">日志列表</div>
      <div class="content">
        <div class="search-nav">
          <el-row :gutter="20" style="margin-bottom:20px;">
            <el-col :span="8" class="flex">
              <span class="name">操作菜单：</span>
              <el-select filterable v-model="search.menu" clearable placeholder="请选择操作菜单" style="width: 100%">
                <el-option
                  v-for="item in OrgOpt"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <!--<el-input class="input" placeholder="请输入菜单" v-model="search.menu"></el-input>-->
            </el-col>
            <el-col :span="8" class="flex">
              <span class="name">登录名：</span>
              <el-input class="input" placeholder="请输入登录名" v-model="search.name"></el-input>
            </el-col>
            <el-col :span="8" class="flex">
              <span class="name">URL：</span>
              <el-input class="input" placeholder="请输入URL" v-model="search.url"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="16" class="flex">
              <span class="name">日期范围：</span>
              <el-date-picker
                v-model="date"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
              ></el-date-picker>
              <span style="margin-left: 30px;line-height: 38px;">
                <el-checkbox v-model="search.normal" true-label="1" false-label="0">只查询异常信息</el-checkbox>
              </span>
            </el-col>
            <el-col :span="3" class="flex">
              <el-button type="primary" icon="el-icon-search" @click="goReset">查询</el-button>
              <el-button type="primary" icon="el-icon-delete" @click="selectDel">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="result-table">
          <el-table :data="tableData" border style="width: 100%" max-height="550" v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              width="55"
              class="column">
            </el-table-column>
            <el-table-column prop="operationMenu" label="操作菜单" width="150"></el-table-column>
            <el-table-column prop="operationUser" label="操作用户" width="120"></el-table-column>
            <el-table-column prop="mechanism" label="所在机构"></el-table-column>
            <el-table-column prop="department" label="所在部门"></el-table-column>
            <el-table-column prop="operationUri" label="URL" width="120"></el-table-column>
            <el-table-column prop="submissionMode" label="提交方式" width="120"></el-table-column>
            <el-table-column prop="operationIp" label="操作者IP" width="120"></el-table-column>
            <el-table-column prop="time" label="操作时间" width="120"></el-table-column>
            <el-table-column label="操作" width="50">
              <template slot-scope="scope">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      pickerOptions: {},
      date: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      search: {
        menu: '',
        name: '',
        url: '',
        dateStart: '',
        dateEnd: '',
        normal: 0
      },
      tableData: [],
      loading : false,
      searchNum:0,
      OrgOpt:[
        {id:'查看单条',name:'查看单条'},
        {id:'查看全部',name:'查看全部'},
        {id:'根据条件查询',name:'根据条件查询'},
        {id:'修改',name:'修改'},
        {id:'添加',name:'添加'},
        {id:'删除',name:'删除'}
      ]
    };
  },
  methods: {
    // 页面初始化
    getPage() {
      this.loading = true;
      let params = {};
      params['page'] = this.currentPage;
      params['count'] = this.pageSize;
      API.get('/journal/findAll', params, { Authorization: storage.get('Token') }).then((res) => {
        console.log(res.data)
        if (res.data.code == 200) {
          this.total = res.data.count;
          var obj = res.data.data;
          for (var i = 0; i < obj.length; i++) {
            console.log(obj[i].createTime)
            obj[i].time = obj[i].createTime.slice(0,19);
          }
          this.tableData = obj;
          this.loading = false;
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: 'auth' });
        }  else {
          this.$message({
            type: 'error',
            message: res.data.message
          });
          this.loading = false;
        }

      })
    },

    goReset(){
      this.currentPage = 1;
      this.pageSize = 10;
      this.searchNum = 1;
      this.searchClick();
    },
    // 搜索
    searchClick() {
      this.loading = true;
      if(!this.date){
        this.search.dateStart = null;
        this.search.dateEnd = null;
      }else {
        this.search.dateStart = this.date[0];
        this.search.dateEnd = this.date[1];
      }
      let params = {};
      params['operationMenu'] = this.search.menu;
      params['operationUser'] = this.search.name;
      params['operationUri'] = this.search.url;
      params['startTime'] = this.search.dateStart;
      params['endTime'] = this.search.dateEnd;
      params['abnormal'] = this.search.normal;
      params['page'] = this.currentPage;
      params['count'] = this.pageSize;
      // console.log(params)

      API.get('/journal/findByCondition', params, { Authorization: storage.get('Token') }).then((res) => {
        // console.log(res.data)
        if (res.data.code == 200) {
          this.total = res.data.count;
          var obj = res.data.data;
          for (var i = 0; i < obj.length; i++) {
            obj[i].time = obj[i].createTime.replace('T', ' ');
          }
          this.tableData = obj;
          this.loading = false;
        } else if (res.data.code == 1001) {
          this.signOut();
        } else if (res.data.code == 401) {
          this.$router.push({ name: 'auth' });
        }  else {
          this.$message({
            type: 'error',
            message: res.data.message
          });
          this.loading = false;
        }
      })
    },
    // 选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 选择删除
    selectDel() {
      this.activeTableDataId = [];
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: 'info',
          message: '请选择需要删除的数据'
        });
        return;
      }
      this.multipleSelection.forEach(ele => {
        this.activeTableDataId.push(ele.id);
      })
      this.activeTableDataId2 = this.activeTableDataId.join(',');
      this.$confirm('您确定要删除这' + this.multipleSelection.length + '条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {};
        params['id'] = this.activeTableDataId2;
        // params['fSystemId'] = storage.get('sysid');
        API.post('/journal/delete', params,{Authorization:storage.get('Token')}).then((res) => {
          // console.log(res.data);
          if (res.data.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getPage();
          } else if(res.data.code == 1001){
            this.signOut();
          } else {
              this.$message({
                type: 'error',
                message:"删除失败"+ res.data.message
              });
          }
        });
      });
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
        API.post('/journal/delete', params, { Authorization: storage.get('Token') }).then((res) => {
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
      this.pageSize = val;
      if(this.searchNum == '1'){
        this.searchClick();
      }else {
        this.getPage();
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      if(this.searchNum == '1'){
        this.searchClick();
      }else {
        this.getPage();
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
  created() {
    this.getPage();
  }
};
</script>
<style>

  .log-page .el-table__row .cell:nth-of-type(1){
    text-align: center;
  }
</style>
<style lang="less">
.log-page {
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
.log-page {
  min-height: 780px;
  background: #fff;
  width: 100%;
  .cell {
    min-height: 780px;
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
  }
}
</style>
