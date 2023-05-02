const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const port = 8000;
const UserData = require('./models/UserData');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET_KEY;
app.use(cookieParser());


// this is for connecting to the database
(async () => {
  try {
    await mongoose.connect(process.env.SERVER_URI);
    console.log('Connected to database');
  } catch (error) {
    console.error(error);
  }
})();


// this is for Get request to be checked on postman

app.get ('/', (req, res) => {
    try {
        const message = 'connection is working now'; 
        res.send(message);
    } catch(error){
        res.send(error);
    }
});

//this is post request to be checked on postman the user data inputs for signup

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
      return res.json({ msg: 'Please provide all required fields' });
    }

  try {
    const existingUser = await UserData.findOne({ username, email });
    if (existingUser) {
      return res.status(409).json({ msg: 'Username already exists' });
    }
    
    if (!existingUser) {const newUserData = await UserData.create({
      username,
      email,
      password:bcrypt.hashSync(password,salt)
    });
    res.status(200).json(newUserData);
  }

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error occurred while creating new user' });
  }
});



//this is post request to be checked on postman the user data inputs for login

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }

  try {
    const userData = await UserData.findOne({ username });

    if (!userData) {
      return res.status(401).json({ msg: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, userData.password);

    if (!passwordMatch) {
      return res.status(401).json({ msg: 'Invalid username or password' });
    }

    const token = jwt.sign({ username, id: userData._id, email:userData.email }, secret, { expiresIn: '10h' });
    res.cookie('token', token, { httpOnly: true}); 

    return res.status(200).json({
      id: userData._id,
      username,
      email:userData.email,
      msg: 'Successfully logged in',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' }); 
  }
}); 

 





























app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
