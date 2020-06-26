<template>
  <div>
    <div class="app-container">
      <el-form :inline="true">
        <el-form-item label="姓名:">
          <el-input v-model="pageData.name" size="small" placeholder="请输入姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" size="small" @click="getList">查询 </el-button>
          <el-upload class="upload-demo" action="" :limit="1" :http-request="importExcel" :show-file-list="false" :file-list="fileList">
            <el-button size="small" type="primary" icon="el-icon-upload">导入</el-button>
          </el-upload>
          <el-button type="primary" icon="el-icon-download" :loading="downloadLoading" size="small"
            @click="exportExcel">导出 </el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="listLoading" :data="userList" element-loading-text="Loading" border fit highlight-current-row
        size="small">
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.sex==0"> {{ sexOption[scope.row.sex] }}</el-tag>
            <el-tag v-if="scope.row.sex==1" type="success"> {{ sexOption[scope.row.sex] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="年龄" align="center">
          <template slot-scope="scope">{{ scope.row.age }}</template>
        </el-table-column>
        <el-table-column label="籍贯" align="center">
          <template slot-scope="scope">{{ scope.row.address }}</template>
        </el-table-column>
      </el-table>
    </div>
    <pagination v-show="pageData.total>0" :pageData="pageData" @pageChange="pageChange"></pagination>

  </div>
</template>

<script>
  import Pagination from 'components/Pagination'
  import { home } from 'api/home'
  import fileDownload from "js-file-download"
  export default {
    name: 'Home',
    components: { Pagination },
    computed: {},
    created() {
      this.getList()
    },
    data() {
      return {
        userList: null,
        listLoading: false,
        downloadLoading: false,
        pageData: {
          total: 0,
          page: 1,
          limit: 10,
          name: '',
        },
        sexOption: ['男', '女'],
        fileList: []
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        home.getList(this.pageData).then(res => {
          this.userList = res.data
          this.pageData.total = res.total
          this.listLoading = false
        }).catch(err => {
          console.log(err)
        })
      },
      //页码改变
      pageChange(curr, size) {
        this.pageData.page = curr
        this.pageData.limit = size
        this.getList()
      },
      //导出
      exportExcel() {
        this.downloadLoading = true
        home.exportExcel({
          title: '用户基本信息',
          sheetName: '用户信息',
          fileName: '用户信息表',
          name: this.pageData.name,
          page: this.pageData.page,
          limit: this.pageData.limit,
        }).then(res => {
          //使用js下载文件
          fileDownload(res, '用户信息表.xlsx')
        }).finally(() => {
          this.downloadLoading = false;
        });
      },
      //导入
      importExcel(param) {
        const formData = new FormData()
        formData.append('file', param.file)
        home.upload(formData).then(res => {
          if (res.code == 200) {
            this.fileList = []
            this.$message.success("导入成功")
            this.getList()
          } else {
            this.$message.error("导入失败")
          }
        }).catch(err =>{
          console.log(err)
          this.$message.error("导入失败")
        })
      }
    },
  }
</script>

<style scoped>
  .app-container {
    text-align: center;
    padding-bottom: 0px;
  }

  .upload-demo {
    display: inline-block;
    padding-left: 10px;
    padding-right: 10px;
  }
</style>