const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const cookieParser = require("cookie-parser");
import  UserInstance  from "./models/user";
import db from  "./database/Connection";
import { DatabaseError } from "sequelize";
import { error } from "console";
app.use(express.json());
app.use(cookieParser())

app.listen(3001, () => {
  console.log("running");
});




app.post("/register",  (req:any, res:any) => {
  const { username, password } = req.body;
   bcrypt
    .hash(password, 10)
    .then((hash:any) => {
      UserInstance.create({
        username: username,
        password: hash,
      }
      ).catch((err)=>{
        if(err)
        {
          console.log(err)
        }
      })
    })
    
    .then(() => res.json("USER REGISTERED"))
     
});


app.post("/login", async(req:any ,res:any)=>{
const {username,password}=req.body;
const user= await UserInstance.findOne({where:{username:username }})
if(!user){
  res.status(400).json({error:"user dosent exist"})
}
const pwd = (user: any) =>{
  return user.password  
}
const dbpass=pwd(user);
bcrypt.compare(password,dbpass).then((match:any)=>{
  if(!match){
    res.status(400).json("Wrong pass")
  }
  else{
    res.json("LOGGED IN")
  }
})

     
})

db.sync().then(() => {
     console.log("DB Connected")
});
