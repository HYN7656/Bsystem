<template>
  <div class="login-box">
    <div class="masker">
      <div class="box inner-c">
        <div class="login">
          <router-link :to="{name:'home'}" class="home">
            <img src="./../../assets/logo.png" alt="" class="img">
          </router-link>
          <!--登陆-->
          <div class="input-table" v-show="show">
            <div class="cell user">
              <span class="name">账号</span>
              <input type="text" class="input" placeholder="请输入账号" v-model="userNum">
            </div>
            <div class="cell password">
              <span class="name">密码</span>
              <input type="password" class="input" placeholder="请输入密码" v-model="userPassword">
            </div>
            <button class="login-btn" @click="login">登录</button>
            <!--<div class="tip">没有账号？ <span class="link" @click="showRegister">立即注册</span></div>-->
          </div>
          <div class="copyright">中国民用航空局空中交通管理局空域管理中心 &copy;版权所有</div>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="PhoneDia"
      width="25%"
      title="提示"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form label-width="70px" class="PhoneForm">
        <p>登录需要手机验证</p>
        <p>您的手机是{{phoneNum}}，请输入验证码</p>
        <div class="PhoneForm-box">
          <el-col :span="16">
            <span>验证码：</span>
            <input type="text" v-model="FirstCode">
          </el-col>
          <el-col :span="8">
            <el-button
              size="medium"
              v-bind:disabled="codePhon"
              @click="Countdown"
            >获取验证码{{auth_time}}</el-button>
          </el-col>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="PhoneDia = false">取 消</el-button>
        <el-button type="primary" @click="verCode">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import md5 from 'js-md5';
import { encrypt } from '@/utils/utils.js';
  export default {
    data() {
      return {
        show: true,
        userNum: '',
        userPassword: '',
        PhoneDia: false,
        phoneNum:'',
        codePhon: false,
        auth_time: "",
        FirstCode: "",
        IdNum:''
      }
    },
    methods: {
      //登陆
      login() {
        if (!this.userNum) {
          this.$message('请填写用户名');
          return
        } else if (!this.userPassword) {
          this.$message('请输入密码');
          return
        } else {
          let params = {};
          params['uName'] = this.userNum;
          params['uPasswd'] = encrypt(this.userPassword);
          // params['uPasswd'] = this.userPassword;
          console.log(params)
          API.post('/user/login', params).then((res) => {
            console.log(res.data)
            if (res.data.code == 200) {
              this.$message({
                type: 'success',
                message: '登录成功!'
              });
              // storage.set('Authorization', res.data.data.token);
              storage.set('Token', res.data.data.token);
              storage.setJson('User', res.data.data.user);
              storage.setJson('Auth', res.data.data.diction);
              this.$router.push({name: 'home'});
            } else if(res.data.code == 10014) {
              this.$message({
                type: 'warning',
                message: res.data.message
              });
              this.FirstCode = '';
              this.PhoneDia = true;
              this.phoneNum = res.data.data.uMobilephone;
              this.IdNum = res.data.data.id;
            }else{
              this.$message({
                type: 'error',
                message: res.data.message
              });
            }
          })
        }
      },
      // 获取验证码、倒计时
      Countdown() {
        this.codePhon = true;
        this.auth_time = 60;
        var auth_timetimer = setInterval(() => {
          this.auth_time--;
          if (this.auth_time <= 0) {
            this.auth_time = "";
            this.codePhon = false;
            clearInterval(auth_timetimer);
          }
        }, 1000);

        let params = {};
        // 验证码
        params["userId"] = this.IdNum;
        params["type"] = 2;
        console.log(params)
        API.get("/code/userVerificationCode", params).then(res => {
          console.log(res.data)
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "验证码发送成功!"
            });
          }else {
            this.$message({
              type: "error",
              message: res.data.message
            });
          }
        });
      },
      // 校验验证码
      verCode() {
        //console.log(this.FirstCode)
        this.PhoneDia = false;
        let params = {};
        params["code"] = this.FirstCode;
        params['uName'] = this.userNum;
        params['uPasswd'] = encrypt(this.userPassword);
        console.log(params)
        API.post("/user/login", params).then(res => {
          console.log(res.data)
          if (res.data.code == 200) {
            //登录成功后 执行跳转，把数据传过去
            this.$message({
              type: "success",
              message: "登录成功！"
            });
            storage.set('Token', res.data.data.token);
            storage.setJson('User', res.data.data.user);
            storage.setJson('Auth', res.data.data.diction);
            this.$router.push({name: 'home'});
          }else {
            this.$message({
              type: "error",
              message: res.data.message
            });
          }
        });
      },
    },
    created() {

    }
  }
</script>
<style>
  .login-box .el-dialog__title {
    font-size: 18px;
  }
  .login-box .el-dialog__footer {
    padding: 30px 20px 20px;
  }
  .login-box .pf2 .el-dialog__body {
    padding: 10px 20px 0px;
  }
  .login-box .pf2 .el-dialog__footer {
    padding: 20px 20px 20px;
  }
</style>

<style lang="less" scoped>
  .login-box {
    width: 100%;
    height: 100vh;
    min-height: 800px;
    max-height: 1080px;
    background: url(./../../assets/images/banner-bg.jpg) no-repeat center center;
    -webkit-background-size: cover;
    background-size: cover;
    .masker {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .3);
    }
    .box {
      height: 100%;
      position: relative;
      .login {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        position: absolute;
        .home {
          position: absolute;
          top: -37px;
          left: 213px;
        }
        .input-table {
          width: 500px;
          height: 335px;
          background: #fff;
          padding: 70px 45px 0;
          box-sizing: border-box;
          .cell {
            font-size: 18px;
            text-align: left;
            color: #000;
            line-height: 35px;
            .input {
              font-size: 14px;
              height: 35px;
              width: 345px;
              float: right;
              padding-left: 10px;
              border: 1px solid #999999;
              box-sizing: border-box;
            }
            &.password {
              margin-top: 40px;
            }
          }
          .login-btn {
            width: 100%;
            margin-top: 40px;
            height: 40px;
            font-size: 18px;
            line-height: 40px;
            color: #fff;
            border: none;
            background: #026ab3;
          }
          .tip {
            text-align: right;
            margin-top: 25px;
            font-size: 15px;
            font-weight: 600;
            .link {
              margin-left: 15px;
              color: #d92b2b;
              cursor: pointer;
            }
          }
          &.register-table {
            height: 446px;
            .cell {
              margin: 0 0 20px;
              .opacity {
                opacity: 0;
                filter: alpha(opacity=0);
              }
              .input {
                width: 340px;
              }
              &.code {
                .input {
                  width: 180px;
                }
                .code-btn {
                  float: right;
                  width: 130px;
                  line-height: 35px;
                  height: 35px;
                  color: #fff;
                  font-size: 14px;
                  cursor: pointer;
                  text-align: center;
                  margin-left: 30px;
                  background: #026ab3;
                }
              }
            }
          }
        }
        .copyright {
          text-align: center;
          color: #fff;
          margin-top: 98px;
          letter-spacing: 1px;
          font-size: 18px;
        }
      }
    }
    .PhoneForm {
      text-align: left;
      p {
        line-height: 30px;
      }
      .PhoneForm-box {
        margin: 5px 0;
      }
      .pb2 {
        overflow: hidden;
      }

      input {
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 35px;
        line-height: 35px;
        outline: 0;
        padding: 0 15px;
        -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }
  }
</style>
