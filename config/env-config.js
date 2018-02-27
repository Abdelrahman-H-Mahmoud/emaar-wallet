let env=process.env.NODE_ENV || 'local';

let config=require(`./${env}.json`)
config.port=process.env.PORT || 3000
module.exports=config;