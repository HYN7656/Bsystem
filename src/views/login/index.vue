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
  </div>
</template>

<script>
import md5 from 'js-md5';
import { encrypt } from '@/utils/utils.js'
  export default {
    data() {
      return {
        show: true,
        userNum: '',
        userPassword: '',
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
          // console.log(params)
          API.post('/user/login', params).then((res) => {
            //console.log(res.data)
            if (res.data.code == 200) {
              this.$message({
                type: 'success',
                message: '登录成功!'
              });
              // storage.set('Authorization', res.data.data.token);
              storage.set('Token', res.data.data.token);
              storage.setJson('User', res.data.data.user);
              storage.setJson('Auth', res.data.data.diction);
              this.$router.push({name: 'home'})
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              });
            }
          })
        }
      },
    },
    created() {

    }
  }
</script>

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
  }
</style>
