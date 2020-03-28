const config = require('config');
const getFileName = require('./getGCSDirectory')

module.exports = function(reqBody, file){
    const bucketName = config.get("gcsBucketName");
    const fileName = getFileName(reqBody, file);
    return `https://storage.googleapis.com/${bucketName}/${fileName}`
}