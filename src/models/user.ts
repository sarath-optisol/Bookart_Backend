import {Sequelize,STRING} from "sequelize";
const sequelize=new Sequelize('bookart','root','',{host:'localhost',dialect:'mariadb'});

module.exports = (sequelize:Sequelize, DataTypes:any) => {
    const Users = sequelize.define("Users", {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    return Users;
  };