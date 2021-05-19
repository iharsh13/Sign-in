const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')
const User = require('./model/user')
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/credentialsDB', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex : true});


const app = express();
app.use(bodyParser.json())
app.use('/',express.static(path.join(__dirname, 'public')))

app.post('/api/register' , async (req,res)=>{
    console.log(req.body)
    const {username, password : plainTextPassword} = req.body
    const password = await bcrypt.hash(plainTextPassword, 10)

    
    try {
        const response=await User.create({
            username,
            password
        }) 
        console.log('user creater successfully', response)
        
    } catch (error){
        console.log(error)
		return res.json({ status: 'error'})
    }



    res.json({status:'ok'})
})
app.listen(3000,()=>{
    console.log("server started on http://localhost:3000");
})


    
    

