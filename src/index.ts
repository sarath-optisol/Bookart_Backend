import express from "express";
import mysql from "mysql";
import cors from "cors";
const app= express();
app.use(cors());
app.use(express.json());
const db=mysql.createConnection({
    user:"root",
    password:"",
    host:"localhost",
    database:"bookart"
})


app.listen(3001,():void=>{
    console.log("connected to port 3001")
})

app.get("/booksget",(req,res)=>{
    db.query("SELECT * FROM book",(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result)
        }
    })

})