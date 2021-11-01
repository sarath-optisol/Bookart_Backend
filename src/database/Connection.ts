
import  {Sequelize} from "sequelize";
const db=new Sequelize('bookart','root','',{host:'localhost',dialect:'mariadb'});

export default  db;