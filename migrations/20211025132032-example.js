
'use strict';

const sequelize=require('sequelize');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable( 'example',{id:{
      type:sequelize.INTEGER(11),
      allowNull:false,
      autoIncrement:true,
      primaryKey:true
  },
  content:sequelize.STRING(200)})
    
  },

  down: async (queryInterface, Sequelize) => {
    
   return queryInterface.dropTable("example")
  }
};
