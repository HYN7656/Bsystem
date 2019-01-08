<template>
  <div>

    <div class="my-page">
      <div class="cell">
        <div class="title">
          个人信息
        </div>
        <div class="content">
          <div class="pop-content">
            <el-tabs v-model="activeName" type="card" @tab-click="settingUserClick">
              <el-tab-pane label="个人信息" name="first">
                <el-form ref="form" :model="form" label-width="80px">
                  <el-form-item label="工号:">
                    <el-input v-bind:disabled="edit"></el-input>
                  </el-form-item>
                  <el-form-item label="姓名:">
                    <el-input v-model="form.uUsername" v-bind:disabled="edit"></el-input>
                  </el-form-item>
                  <el-form-item label="登录名:">
                    <el-input v-model="form.uName" v-bind:disabled="edit"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱:">
                    <el-input v-model="form.uEmail" v-bind:disabled="edit"></el-input>
                  </el-form-item>
                  <el-form-item label="电话:">
                    <el-input v-model="form.uTelephone" v-bind:disabled="edit"></el-input>
                  </el-form-item>
                  <el-form-item label="手机:">
                    <el-input v-model="form.uMobilephone" v-bind:disabled="edit"></el-input>
                  </el-form-item>
                  <!--编辑-->
                  <el-form-item>
                    <!--<el-button type="primary" @click="onSubmitInfo" v-show="!edit">保存</el-button>-->
                    <!--<el-button @click="settingPop = false" v-show="!edit">返回</el-button>-->
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <!--<el-tab-pane label="密码" name="second" class="password-cell" :disabled="edit">
                <el-form ref="form" :model="form" label-width="100px">
                  <el-form-item label="原密码:">
                    <el-input v-model="form.num" ></el-input>
                  </el-form-item>
                  <el-form-item label="新密码:">
                    <el-input v-model="form.name"></el-input>
                  </el-form-item>
                  <el-form-item label="新密码确认:">
                    <el-input v-model="form.loginName"></el-input>
                  </el-form-item>
                  &lt;!&ndash;编辑&ndash;&gt;
                  <el-form-item>
                    <el-button type="primary" @click="onSubmitPassword">保存</el-button>
                    &lt;!&ndash;<el-button @click="settingPop = false">返回</el-button>&ndash;&gt;
                  </el-form-item>
                </el-form>
              </el-tab-pane>-->
            </el-tabs>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: '',
    data() {
      return {
        edit:true,
        settingPop : true,
        activeName: 'first',
        // edit: false,
        user:storage.getJson('user'),
        form : {
          uUsername : '',
          uName : '',
          uEmail : ' ',
          uTelephone : '',
          uMobilephone : ''
        }
      }
    },
    methods:{
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
      settingUserClick() {

      },
    },

    created() {
      this.form = this.user;
    },
    mounted() {

    }
  }
</script>

<style lang="less">
  .my-page {
    min-height: 800px;
    background: #fff;
    width: 100%;
    background-color: #F8F8F8;
    .cell {
      width: 60%;
      margin: 20px auto;
      /*float: left;*/
      min-height: 600px;
      height: auto;
      border-radius: 3px;
      overflow: hidden;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border: 1px solid #ccc;
      background: #fff;
      .content {
        padding: 20px 10px;
        box-sizing: border-box;
        width: 75%;
        margin: 20px auto;
        background-color: #fff;
        text-align: center;
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
    }
  }



</style>
