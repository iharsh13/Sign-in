const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')
const User = require('./model/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'
const https = require('https');


mongoose.connect('mongodb://localhost/credentialsDB', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex : true});


const app = express();
app.use(bodyParser.json())
app.use('/',express.static(path.join(__dirname, 'public')))

// app.get('/people',(req,res)=>{
//     const url = 'https://jsonplaceholder.typicode.com/photos';
//     let answer = []

//     https.get(url,function(response){
//         console.log(response.statusCode)
//         let chunks = [];

//        response.on('data', function(data) {
//         chunks.push(data);
//         }).on('end', function() {
//         let data   = Buffer.concat(chunks);
//         let userData = JSON.parse(data);
        
//         userData.forEach( (person) => {
//            res.write(`<p>${person.titie}</p>`)

//         });
       
        
//       });

       
//    })
//     res.send()

// })

app.post('/api/register' , async (req,res)=>{
    const {username, password : plainTextPassword} = req.body
    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}


    const password = await bcrypt.hash(plainTextPassword, 10)

    
    try {
        const response=await User.create({
            username,
            password
        }) 
        console.log('user creater successfully', response)
        
    } catch (error){
        if(error.code ===11000){
            return res.json({ status: 'error', error: 'Username already in use'})

        }
        throw error
		
    }



    res.json({status:'ok'})
})

app.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful
        console.log('user found!')
		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})

app.listen(3000,()=>{
    console.log("server started on http://localhost:3000");
})


    
    

