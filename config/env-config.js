let env=process.env.NODE_ENV || 'local';

let config=require(`./${env}.json`);
if(env==="production"){
    config.databaseConnection.replace("<username>",process.env.dbUserName);
    config.databaseConnection.replace("<password>",process.env.dbPassword);
}
config.port=process.env.PORT || 3000
module.exports=config;