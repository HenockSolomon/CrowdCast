const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const port = 8000;
const UserData = require('./models/UserData');


const app = express();
app.use(express.json());
dotenv.config();


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
        const message = 'connection is working';
        res.send(message);
    } catch(error){
        res.send(error);
    }
});

//this is post request to be checked on postman the user data inputs for signup

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }
  try {
    const newUserData = await UserData.create({
      username,
      email,
      password
    });
    res.json(newUserData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'user already registered' });
  }
}); 


//this is post request to be checked on postman the user data inputs for login


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username ||!password) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }
  try {
    const userData = await UserData.findOne({ username });
    if (!userData) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }else{
      return res.json({ msg: 'Successfully logged in' });
    }
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Invalid Credentials' });
  }
});






























app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
