// const { max, min } = require('lodash');
const Sequelize = require('sequelize');
// const { Pool } = require('undici-types');
require("dotenv").config({ path: ".env" });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port:3307,
  pool:{max:5,min:0,idle:10000}
}); 

sequelize.authenticate().then(()=>{
    console.log("connected");
})
.catch(err=>{
    console.log("Error" + err);
})

module.exports = sequelize;