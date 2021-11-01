import {Sequelize,DataTypes, useInflection} from "sequelize";
import {Model} from "sequelize"
import db from "../database/Connection";

interface User {
  username:string,
  password:string
}
export default class UserInstance extends Model<User>{}



UserInstance.init({
  username:{
    allowNull:false,
    unique:true,
    type:DataTypes.STRING,
  },
  password:{
    allowNull:false,
    type:DataTypes.STRING
  }

},
{
  sequelize:db,
  tableName:"user"
})

