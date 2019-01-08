<template>
  <div class="log-page">
    <div class="right cell">
      <div class="title">
        日志列表
      </div>
      <div class="content">
        <div class="search-nav">
          <el-row :gutter="20" style="margin-bottom:20px;">
            <el-col :span="8" class="flex">
              <span class="name">操作菜单：</span>
              <el-input class="input"
                        placeholder="请输入菜单"
                        v-model="search.menu">
              </el-input>
            </el-col>
            <el-col :span="8" class="flex">
              <span class="name">用户ID：</span>
              <el-input class="input"
                        placeholder="请输入ID"
                        v-model="search.id">
              </el-input>
            </el-col>
            <el-col :span="8" class="flex">
              <span class="name">URL：</span>
              <el-input class="input"
                        placeholder="请输入URL"
                        v-model="search.url">
              </el-input>
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
                :picker-options="pickerOptions">
              </el-date-picker>
              <span style="margin-left: 30px;line-height: 38px;">
                                <el-checkbox v-model="search.normal" true-label="1" false-label="0">只查询异常信息</el-checkbox>
                            </span>
            </el-col>
            <el-col :span="3" class="flex">
              <el-button type="primary" icon="el-icon-search" @click="searchClick">查询</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="result-table">
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="operationMenu"
              label="操作菜单"
              width="150">
            </el-table-column>
            <el-table-column
              prop="operationUser"
              label="操作用户"
              width="120">
            </el-table-column>
            <el-table-column
              prop="mechanism"
              label="所在机构">
            </el-table-column>
            <el-table-column
              prop="department"
              label="所在部门">
            </el-table-column>
            <el-table-column
              prop="operationUri"
              label="URL"
              width="120">
            </el-table-column>
            <el-table-column
              prop="submissionMode"
              label="提交方式"
              width="120">
            </el-table-column>
            <el-table-column
              prop="operationIp"
              label="操作者IP"
              width="120">
            </el-table-column>
            <el-table-column
              prop="time"
              label="操作时间"
              width="120">
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
            :total="total">
          </el-pagination>
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
        pageSize : 10,
        total : 0,
        search: {
          menu: '',
          id: '',
          url: '',
          dateStart: '',
          dateEnd: '',
          normal: 0
        },
        tableData: []
      };
    },
    methods: {
      // 页面初始化
      getPage() {
        let params = {};
        params['page'] = this.currentPage;
        params['count'] = this.pageSize;
        API.get('/journal/findAll', params,{Authorization:storage.get('token')}).then((res) => {
          // console.log(res.data)
          if (res.data.code == 200) {
            this.total = res.data.count;
            var obj = res.data.data;
            for(var i=0;i<obj.length;i++){
              // console.log(obj[i].createTime)
              obj[i].time = obj[i].createTime.replace('T',' ');
            }
            this.tableData = obj;
          }else if(res.data.code == 1001){
            this.signOut()
          }else if(res.data.code == 401){
            this.$router.push({name: 'auth'})
          }
        })
      },
      // 搜索
      searchClick() {
        this.search.dateStart = this.date[0];
        this.search.dateEnd = this.date[1];
        let params = {};
        params['operationMenu'] = this.search.menu;
        params['operationUser'] = this.search.id;
        params['operationUri'] = this.search.url;
        params['startTime'] = this.search.dateStart;
        params['endTime'] = this.search.dateEnd;
        params['abnormal'] = this.search.normal;
        // console.log(params)

        API.get('/journal/findByCondition', params,{Authorization:storage.get('token')}).then((res) => {
          // console.log(res.data)
          if (res.data.code == 200) {
            this.total = res.data.count;
            var obj = res.data.data;
            for(var i=0;i<obj.length;i++){
              obj[i].time = obj[i].createTime.replace('T',' ');
            }
            this.tableData = obj;
          }else if(res.data.code == 1001){
            this.signOut()
          }else if(res.data.code == 401){
            this.$router.push({name: 'auth'})
          }
        })
      },
      // 翻页器
      handleSizeChange(val) {
        // console.log(val);
        this.pageSize = val;
        this.getPage();
      },
      handleCurrentChange(val) {
        // console.log(val);
        this.currentPage = val;
        this.getPage()
      },
      signOut(){
        this.$message({
          type: 'error',
          message: '登录失效，请重新登录!'
        });
        storage.delete('Authorization');
        storage.delete('auth');
        storage.delete('token');
        storage.delete('user');
        this.$router.push({name:'login'})
      }
    },
    created() {
      this.getPage();
    }
  };
</script>
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
