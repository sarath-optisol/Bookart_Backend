import express from "express";
import cors from "cors";
import { NUMBER, Sequelize, STRING, INTEGER } from "sequelize";
import { any, values } from "sequelize/types/lib/operators";

const sequelize=new Sequelize('bookart','root','',{host:'localhost',dialect:'mariadb'});

module.exports=sequelize;
const checkcon=async ()=>{
    try {
        await sequelize.authenticate();
        console.log("connection sucess")
    }
    catch(err){
        console.log(err);
    }
}

checkcon();