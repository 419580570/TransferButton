<template>
  <div>
    <button @click.prevent.stop="doBatch">
      批量操作
    </button>
  
    <el-dialog
      title="转账结果"
      :visible.sync="dialogVisible"
      width="50%"
      height="50%"
      >
      <el-table 
        :data='requestResult'
        v-loading="TransferResult"
        element-loading-text="拼命加载中"
        element-loading-background="rgba(255, 255, 255, 0.7)">
        <el-table-column 
          label="转帐目标"
          type="index"
          width="150px"
          :index="indexMethod">
        </el-table-column>
        <el-table-column label="状态" width="200px">
          <template #default="scope">
            <el-tag v-if="scope.row.code !== 1" :type="scope.row.code == 0 ? 'success' : 'danger'">{{scope.row.code | parseCode}}</el-tag>
            <span class="el-icon-loading" 
                  v-else 
                  style="font-size: 18px;"></span>
          </template>
        </el-table-column>
        <el-table-column label="转账结果" width="350px">
          <template #default="scope">
            {{scope.row.message}}
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <span class="text-bottom" v-show="!TransferResult">合计转账成功：{{success}}
          <el-divider direction="vertical"></el-divider>失败：{{total-success}}</span>
        <el-button type="primary" @click="close">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import requestApi from '../server/api'
  export default{
    data(){
      return{
        total:20,
        requestResult:[],
        dialogVisible: false,
        success:0,
        fail:0
      }
    },
    computed:{
      TransferResult(){
        if(this.success + this.fail == this.total){
          return false
        }else{
          return true
        }
      }
    },
    methods:{
      doBatch(){
        this.dialogVisible = true
        for(let i = 0 ; i < this.total ; i++){
          let item = requestApi().catch(reject=>Promise.resolve(reject))
          this.$set(this.requestResult,i,{code:1,message:'请稍等...'})
          item.then(value => {
            if(value.message == 'ok'){
              value.message = '转账成功'
              this.success++
            }else{
              this.fail++
            }
            this.$set(this.requestResult,i,value)
          })
        }
      },
      indexMethod(index){
        return `用户${index+1}`
      },
      close(){
        this.dialogVisible = false
        this.success = 0
        this.fail = 0
      }
    },
    filters:{
      parseCode(code){
        if(code == 0){
          return '成功'
        }else if(code == -1 || code == -2){
          return '失败'
        }
      }
    },
    watch:{
      TransferResult(newVal,oldVal){
        if(this.fail + this.success == this.total){
          if(newVal == true){
            this.$message.success('批量执行成功')
          }else{
            this.$message.error('批量执行失败')
          }
        }
      }
    }
  }
</script>

<style scoped>
  .text-bottom{
    position: absolute;
    left: 0;
    margin-left: 50px;
  }

  ::v-deep .el-table__body,::v-deep .el-table__header{
    margin: 0 auto;
  }
  ::v-deep .el-dialog__header{
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #fff;
  }
  ::v-deep .el-table .cell{
    text-align: center;
  }
  ::v-deep .el-table__body-wrapper{
    height: 350px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  ::v-deep .el-table__body-wrapper::-webkit-scrollbar{
    width: 5px;
  }
  ::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
		  background-color: #fff;
  }
  ::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
		  background-color: rgba(0, 0, 0, 0.2); 
      border-radius: 3px;
	}
</style>