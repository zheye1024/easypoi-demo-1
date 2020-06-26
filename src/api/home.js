import request from 'network/request'



//把接口放在一起，方便接口统一管理
export const home = {  
    
  
   /**
    * 查询用户信息
    * @param {*} query 
    */
   getList(query){
    return request.get('user/list',query)
   },

   /**
    * 导出
    */
   exportExcel(query){
    return request.postResponse('user/exportExcel',query)
   },

   /**
    * 导入
    * @param {*} file 
    */
   upload(file){
      return request.post('user/import',file)
   },

      /**
    * 导入excel图片
    * @param {*} file 
    */
   upload2(file){
      return request.post('user/imgimport',file)
   },
}