let env=process.env.NODE_ENV || 'local';

let config=require(`./${env}.json`);
if(env==="production"){
    console.log(process.env.dbUserName);
    config.databaseConnection.replace("<username>",process.env.dbUserName);
    config.databaseConnection.replace("<password>",process.env.dbPassword);
    console.log(config.databaseConnection);
}
config.port=process.env.PORT || 3000
module.exports=config;