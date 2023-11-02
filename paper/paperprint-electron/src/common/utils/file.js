
/**
 * 将文件上传到服务器中 返回文件的fileId
 * @param {string} server_url 文件服务路径
 * @param {string} file_path 文件路径
 */
async function upload(server_url,file_path){
    const options = {
        method:'POST',
        url:`${server_url}formUpload`,
        headers: {
            'Content-Type': 'multipart/form-data'
          },
        formData:{
            file:fse.createReadStream(file_path)
        }
    }
    let result = await http.Request(options);
    return result?.data?.fileId;
}

module.exports = {upload}