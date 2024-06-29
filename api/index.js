const express=require('express');
const cors=require('cors');
const bcrypt = require('bcryptjs');
const { default: mongoose } = require('mongoose');
const User = require('./models/user');
const app=express();
const salt=bcrypt.genSaltSync(10);
const secret='agyt6r6yubyfr5t7gby78i9k9i0hf4e365j9';
const jwt=require('jsonwebtoken');

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());

mongoose.connect('mongodb+srv://blog:nHPwRdaJP6iypuhT@cluster0.efxu6vx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.post('/register',async (req,res)=>{
    const {username,password}=req.body;
    try{
    const userDoc=await User.create({
        username,
        password:bcrypt.hashSync(password,salt),
    });
    res.json(userDoc);
    }
    catch(e){
        res.status(400).json(e);
    }
});

app.post('/login',async (req,res)=>{
    const{username,password}=req.body;
    const userDoc=await User.findOne({username});
    const passOk=bcrypt.compareSync(password, userDoc.password); 
    if(passOk){
        jwt.sign({username,id:userDoc._id}, secret,{},(err,token)=>{
            if(err) throw err;
            res.cookie('token',token).json('ok');
        });
    }else{
        res.status(400).json('wrong credentials');
    }
})
app.listen(4000);
