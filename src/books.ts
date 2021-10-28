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
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }}

main();
const db=mysql.createConnection({
    user:"root",
    password:"",
    host:"localhost",
    database:"bookart"
})


app.listen(3001,():void=>{
    console.log("connected to port 3001")
})

app.get("/books",(req,res)=>{
    db.query("SELECT * FROM book",(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result)
        }
    })

})

app.post("/book",(req,res)=>{
    const name=req.body.name;
    const price=req.body.price;
    const description=req.body.description;

    db.query("INSERT INTO books (name,price,description) VALUES (?,?,?)",[name,price,description],(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send("Book created")
        }
    })
})

app.put("/update/book",(req,res)=>{
    const id=req.body.id;
    const price=req.body.price;
    db.query("UPDATE books SET price=? WHERE ID=?",[price,id],(err,result)=>{
        if(err)
        {console.log(err)}
        else{
            res.send(result);
        }
    })
})

app.delete("/delete/book/:id",(req,res)=>{
    const id=req.params.id;
    db.query("DELETE FROM books WHERE ID =?",id,(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send(result)
        }
    })
})