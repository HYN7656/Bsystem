<template>
  <div class="up_header">
    <div class="up_nav">
      <div class="up_nav_content">
        <span>
          <img src="./../assets/logo.png" alt="">
          <span class="title">空域中心业务系统用户管理</span>
        </span>
        <span class="welcome">
            <i class="iconfont icon-yonghu"></i><strong>{{userName}}</strong>
            <!--<i class="icon iconfont icon-shenqing"></i><strong @click="settingClick">设置</strong>-->
            <i class="iconfont icon-tuichu-copy"></i><strong @click="quit">退出</strong>
        </span>
      </div>
    </div>
    <div class="p-content">
      <div class="p-left" v-bind:style="{ minHeight: offHeight + 'px' }">
        <div class="p-left-height">
          <div class="nav_left active">
            <div class="slider">
              <ul>
                <li v-show="userS">
                  <router-link
                    :to="{name:'platform.user'}"
                    class="left-cell"
                    :class="{active: $route.name == 'platform.user'}">
                    <i class="icon iconfont icon-yonghuguanli"></i>用户管理
                  </router-link>
                </li>
                <li v-show="orgS">
                  <router-link
                    :to="{name:'platform.org'}"
                    :class="{active: $route.name == 'platform.org'}"
                    class="left-cell"><i class="icon iconfont icon-guanli"></i>机构管理
                  </router-link>
                </li>
                <li v-show="menuS">
                  <router-link
                    :to="{name:'platform.menu'}"
                    :class="{active: $route.name == 'platform.menu'}"
                    class="left-cell"><i class="icon iconfont icon-liucheng"></i>菜单管理
                  </router-link>
                </li>
                <li v-show="roleS">
                  <router-link
                    :to="{name:'platform.role'}"
                    :class="{active: $route.name == 'platform.role'}"
                    class="left-cell"><i class="icon iconfont icon-huiyi"></i>角色管理
                  </router-link>
                </li>
                <li v-show="logS">
                  <router-link
                    :to="{name:'platform.log'}"
                    :class="{active: $route.name == 'platform.log'}"
                    class="left-cell"><i class="icon iconfont icon-youjiantou"></i>日志查询
                  </router-link>
                </li>
                <li>
                  <router-link :to="{name:'platform.index'}"
                               class="left-cell"
                               :class="{active: $route.name == 'platform.index'}">
                    <i class="icon iconfont icon-xinwen"></i>个人信息
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="view"
           :class="{views : $route.meta.hideLeft,manager_statistics:$route.name == 'platform.flowstatistics'}">
        <slot name="right-view"></slot>
      </div>
    </div>
    <el-dialog
      title="手机验证"
      :visible.sync="PhoneDia"
      width="25%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="手机号:">
          <el-col :span="16"><el-input v-model="form.num"></el-input></el-col>
          <el-col :span="8"></el-col>
        </el-form-item>

        <el-form-item label="验证码:">
          <el-col :span="16"><el-input v-model="form.name"></el-input></el-col>
          <el-col :span="8"><el-button v-bind:disabled="code" @click="Countdown">获取验证码{{auth_time}}</el-button></el-col>


        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'PHeader',
    data() {
      return {
        edit:false,
        code:false,
        auth_time:'',
        PhoneDia:false,
        userS: false,
        orgS: false,
        menuS: false,
        roleS: false,
        logS: false,
        isActive: 1,
        isLeftNav: 1,
        offHeight: 0,
        settingPop: false,
        choosePop: false,
        activeName: 'first',
        userName: storage.getJson('user').uName,
        form: {
          branch: '',
          num: '',
          org: '',
          name: '',
          loginName: '',
          password: '',
          confirmPas: '',
          mail: '',
          tel: '',
          phone: '',
          isLogin: '',
          role: '',
          desc: ''
        },
        data: [{
          label: '中国民用航空局空中交通管理局',
          children: [{
            label: '空域管理中心',
            children: [{
              label: '空域管理室'
            },
              {
                label: '程序设计室'
              }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        filterText: '',
      }
    },
    methods: {
      Countdown(){
        this.code = true;
        this.auth_time = 60;
        var auth_timetimer =  setInterval(()=>{
          this.auth_time--;
          if(this.auth_time<=0){
            this.auth_time = '';
            this.code = false;
            clearInterval(auth_timetimer);
          }
        }, 1000);
      },
      getAuto() {
        this.auth = storage.getJson('auth')
        // console.log(this.auth)
        for (var i = 0; i < this.auth.length; i++) {
          if (this.auth[i] == 1) {
            this.userS = true
          } else if (this.auth[i] == 2) {
            this.orgS = true
          } else if (this.auth[i] == 3) {
            this.menuS = true
          } else if (this.auth[i] == 4) {
            this.roleS = true
          } else if (this.auth[i] == 5) {
            this.logS = true
          }
        }
      },
      settingClick() {
        this.settingPop = true
      },
      settingUserClick() {

      },
      onSubmitInfo() {
        this.$message({
          type: 'success',
          message: '修改成功!'
        });
        let that = this
        setTimeout(function () {
          that.settingPop = false;
        }, 400)
      },
      // 选择部门pop
      chooseBranchPop() {
        this.choosePop = true
      },
      onSubmitPassword() {
        this.$message({
          type: 'success',
          message: '修改成功!'
        });
        let that = this
        setTimeout(function () {
          that.settingPop = false;
        }, 400)
      },
      quit() {
        this.$confirm('您确定要退出管理平台?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          storage.delete('Authorization');
          storage.delete('auth');
          storage.delete('token');
          storage.delete('user');
          this.$message({
            type: 'success',
            message: '您已成功退出!'
          });
          let that = this
          setTimeout(function () {
            that.$router.push({name: 'login'})
          }, 300)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });
        });
      },
      signOut() {
        this.$message({
          type: 'error',
          message: '登录失效，请重新登录!'
        });
        storage.delete('Authorization');
        storage.delete('auth');
        storage.delete('token');
        storage.delete('user');
        this.$router.push({name: 'login'})
      }
    },
    mounted() {
      let hei = document.documentElement.clientHeight - 110;
      // console.log(hei)
      this.offHeight = hei;
      // console.log(this.offHeight)
      this.getAuto()
    }
  }
</script>
<style lang="less">
  .up_header {
    .tip-dialog {
      &.setting-pop {
        .el-dialog {
          overflow: hidden;
          height: 600px;
          .password-cell {
            margin-top: 40px;
          }
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .up_header {
    min-width: 1200px;
    height: 100%;
    margin: 0 auto;
    font-size: 18px;
    font-weight: bold;
  }

  .up_nav {
    background-color: #026ab3;
    width: 100%;
    margin: auto;
    .up_nav_content {
      width: 90%;
      height: 75px;
      overflow: hidden;
      line-height: 75px;
      margin: auto;
      img {
        float: left;
        margin-top: 0.8%;
        width: 50px;
      }
      .title {
        color: #fff;
        margin-left: 8px;
        font-size: 18px;
        float: left;
      }
      .welcome {
        cursor: pointer;
        float: right;
        color: #d5e0ee;
        .iconfont {
          margin-right: 8px;
        }
        strong {
          margin-right: 15px;
          font-size: 13px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }

  .iconfont {
    font-size: 16px;
  }

  a, a:hover {
    text-decoration: none;
    color: #a3afbc;
  }

  a:hover {
    color: #ffffff;
    font-weight: bolder;
  }

  .p-content {
    width: 100%;
    overflow: hidden;
    position: relative;
    zoom: 1;
    .p-left {
      width: 16%;
      float: left;
      height: 100%;
      background-color: #003b64;
      .p-left-height {
        position: absolute;
        width: 16%;
        top: 0;
        left: 0;
        background-color: #003b64;
        height: 100%;
        .nav_left {
          width: 100%;
          height: auto;
          font-weight: bolder;
          font-size: 18px;
          display: none;
          &.active {
            display: block;
          }
          li {
            list-style: none;
            height: 65px;
            line-height: 65px;
            font-size: 15px;
            .left-cell, .left-cell:hover {
              display: block;
              text-decoration: none;
              color: #a3afbc;
            }
            .left-cell:hover {
              color: #003b64 !important;
              background-color: white !important;
            }
            a {
              padding-left: 40px;
              box-sizing: border-box;
              .icon {
                margin-right: 15px;
              }
              &.active {
                color: #003b64 !important;
                background-color: white !important;
              }
            }
            a:hover {
              color: #003b64 !important;
              background-color: white !important;
            }
          }
        }
      }
    }
    .view {
      float: left;
      width: 84%;
      padding: 0 0 0 0;
      box-sizing: border-box;
      &.views {
        width: 100%;
      }
      &.manager_statistics {
        padding: 0 5% 0 0;
      }
    }
  }
</style>
