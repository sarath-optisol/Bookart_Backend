
import express from "express";
import mysql from "mysql";
import cors from "cors";
import {
    Sequelize,
    Model,
    ModelDefined,
    DataTypes,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    Association,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    Optional,
  } from "sequelize";
const app= express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('bookart', 'root', '', {
    host: 'localhost',
    dialect:'mariadb'
  }); 

const main =async ()=>{
    try {
    await sequelize.authenticate();
    console.log('Connection has been established sucessfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }}

main();