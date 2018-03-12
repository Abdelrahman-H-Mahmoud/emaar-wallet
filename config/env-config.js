let env=process.env.NODE_ENV || 'local';

let config=require(`./${env}.json`);
if(env==="production"){
    config.databaseConnection=config.databaseConnection.replace("<password>",process.env.dbPassword)
                                                       .replace("<username>",process.env.dbUserName);
    console.log(config.databaseConnection);
}
config.port=process.env.PORT || 3000
module.exports=config;