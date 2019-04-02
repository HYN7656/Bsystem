<template>
  <div class="up_header">
    <div class="up_nav">
      <div class="up_nav_content">
        <span>
          <img src="./../assets/logo.png" alt="">
          <span class="title">空域中心业务系统用户管理</span>
        </span>
        <span class="welcome">
            <i class="iconfont icon-yonghu"></i><strong>欢迎您：{{userName}}</strong>
            <i class="icon iconfont icon-shenqing"></i><strong @click="OpenPassword">修改密码</strong>
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
    <!--<el-dialog
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
          <el-col :span="8"><el-button v-bind:disabled="code">获取验证码{{auth_time}}</el-button></el-col>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>-->
    <el-dialog
      title="修改密码"
      :visible.sync="editPassword"
      width="20%"
      class="tip-dialog pass-top">
      <div class="content">
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="80px"
                 class="demo-ruleForm">
          <el-form-item label="原始密码" prop="passOld">
            <el-input type="password" v-model="ruleForm2.passOld" autocomplete="off"  placeholder="请输入原始密码"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass" >
            <el-input type="password" v-model="ruleForm2.pass" autocomplete="off" placeholder="请输入6-18位数字或字母" ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass" >
            <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off" placeholder="请再次输入密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('ruleForm2')" class="confirm">提交</el-button>
          <el-button @click="resetForm('ruleForm2')" class="cancel">重置</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import md5 from 'js-md5';
  export default {
    name: 'PHeader',
    data() {
      var validatePass = (rule, value, callback) => {
        const reg = /^[0-9a-zA-Z]*$/g;
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if(reg.test(value)){
          callback();
        } else {
          return callback(new Error('密码只能为字母和数字'));
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        code:false,
        auth_time:'',
        PhoneDia:false,
        userS: false,
        orgS: false,
        menuS: false,
        roleS: false,
        logS: false,
        offHeight: 0,
        userName: storage.getJson('User').uName,
        editPassword: false,
        ruleForm2: {
          passOld: '',
          pass: '',
          checkPass: ''
        },
        rules2: {
          passOld: [
            {required: true, message: '请输入旧密码', trigger: 'blur'},
          ],
          pass: [
            {validator: validatePass, trigger: 'blur'},
            // {required: true, message: '请输入新密码', trigger: 'blur'},
            {min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur'}

          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'},
            {required: true, message: '请再次输入密码', trigger: 'blur'},
          ]
        },
      }
    },
    methods: {
      OpenPassword() {
        this.editPassword = true
        if (this.$refs.ruleForm2) {
          this.$refs.ruleForm2.clearValidate();
        }
      },
      // 修改密码提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          console.log(this.ruleForm2)
          if (valid) {
            let params = {};
            this.user = storage.getJson('User');
            console.log(this.user)
            params['id'] = this.user.id;
            params['passwd'] =  md5(this.user.uName + this.ruleForm2.passOld);
            params['newPasswd'] =  md5(this.user.uName + this.ruleForm2.pass);
            console.log(params)
            API.post('/user/updatePwds', params, {Authorization: storage.get('Token')}).then((res) => {
              console.log(res.data)
              if (res.data.code == 200) {
                this.editPassword = false;
                this.$message({
                  type: 'success',
                  message: '密码修改成功!需重新登录生效'
                });
                storage.delete('Auth');
                storage.delete('Token');
                storage.delete('User');
                this.$router.push({name: 'login'})
              } else if (res.data.code == 1001) {
                this.signOut()
              } else {
                this.$message({
                  type: 'error',
                  message: '密码修改失败!'+ res.data.message
                });
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      getAuto() {
        this.auth = storage.getJson('Auth')
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
      quit() {
        this.$confirm('您确定要退出管理平台?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {};
          API.post('/user/signout', params).then((res) => {
            //console.log(res.data)
            if (res.data.code == 200) {
              storage.delete('Auth');
              storage.delete('Token');
              storage.delete('User');
              this.$message({
                type: 'success',
                message: '您已成功退出!'
              });
              let that = this;
              setTimeout(function () {
                that.$router.push({name: 'login'})
              }, 300)
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              });
            }
          })
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
        storage.delete('Auth');
        storage.delete('Token');
        storage.delete('User');
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
