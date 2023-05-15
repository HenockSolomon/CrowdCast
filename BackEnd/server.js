const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const port = 8000;
const UserData = require('./models/UserData');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Post= require('./models/Posts');
const multer = require('multer');
const uploadMiddleware= multer({dest : './middle'});
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors({credentials:true, origin:'http://localhost:3000'}));
dotenv.config();
const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET_KEY;
app.use(cookieParser());
app.use('/middle', express.static(__dirname + '/middle'));



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
    
    if (!existingUser) {
      const userData = await UserData.create({
      username,
      email,
      password:bcrypt.hashSync(password,salt)
    });
    res.status(200).json(userData);
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

    const passwordMatch = await bcrypt.compareSync(password, userData.password);

    if (!passwordMatch) {
      return res.status(401).json({ msg: 'Invalid username or password' });
    }

    if (passwordMatch) {
     jwt.sign({ username, id: userData._id, email: userData.email, password: userData.password }, secret, {}, (err, token) => {
      if (err) throw err;

      res.cookie('token', token).json({
       
        username,
        id: userData._id,
        email: userData.email,
        password : userData.password,
        msg: 'Successfully logged in',
      });
    });
    } else {
      res.json({ status: 'error', userData: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' }); 
  }
}); 


// this is for userprofile only
app.get('/userprofile', async (req, res) => {
  try {
    const {token} = req.cookies; // assuming the name of the cookie is "token"
    if (!token) {
      return res.status(401).json({ msg: 'Unauthorized access' });
    }
    const decodedToken = jwt.verify(token, secret);
    res.json(decodedToken);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});


// this is for posting something on the timeline
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        throw err;
      }

      const { title, numberOfPeople, dateTime, eventType, privetPublic, postCode, summary } = req.body;
      const postDoc = await Post.create({
        title,
        numberOfPeople,
        dateTime,
        eventType,
        privetPublic,
        postCode,
        coverImg: newPath,
        summary,
        author: info.id,
      });

      res.json(postDoc);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


//put request
// app.put(`/post/:postId`, middleware.single('file'), async (req, res) => {
//   try {
//     const { postId } = req.params;
  
//     if (!req.file) {
//       throw new Error('No file uploaded');
//     }
  
//     const { originalname, path } = req.file;
//     const parts = originalname.split('.');
//     const ext = parts[parts.length - 1];
//     const newPath = path + '.' + ext;
//     fs.renameSync(path, newPath);
  
//     const { token } = req.cookies;
//     jwt.verify(token, secret, {}, async (err, info) => {
//       if (err) {
//         throw err;
//       }
  
//       const { title, numberOfPeople, dateTime, eventType, privetPublic, postCode, summary } = req.body;
  
//       // Find the post to be updated
//       const postDoc = await Post.findById(postId);
  
//       if (!postDoc) {
//         return res.status(404).json({ error: 'Post not found' });
//       }
  
//       // Update the post properties
//       postDoc.title = title;
//       postDoc.numberOfPeople = numberOfPeople;
//       postDoc.dateTime = dateTime;
//       postDoc.eventType = eventType;
//       postDoc.privetPublic = privetPublic;
//       postDoc.postCode = postCode;
//       postDoc.coverImg = newPath; // Assign the uploaded file path to the coverImg field
//       postDoc.summary = summary;
  
//       // Save the updated post
//       await postDoc.save();
  
//       res.json(postDoc);
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


 
app.get('/post', async (req,res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', 'username');
    
    if (!postDoc) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(postDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// handling deletion 
app.delete('/post/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    await Post.deleteOne({ _id: postId });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'An error occurred while deleting the post' });
  }
});









app.post('/logout', (req, res) => {
  res.cookie('token','').json({ message:'logged out'}); 
});
























app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
