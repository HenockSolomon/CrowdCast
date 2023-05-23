const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const port = 8000;

const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User= require('./models/UserData');
const Post= require('./models/Posts');
const Attend = require('./models/Attend');
const multer = require('multer');
const uploadMiddleware= multer({dest : './middle'});
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(cors({credentials:true, origin:'http://localhost:3000'}));
dotenv.config();
const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET_KEY;
const { body, validationResult } = require('express-validator');
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
    const existingUser = await User.findOne({ username, email });
    if (existingUser) {
      return res.status(409).json({ msg: 'Username already exists' });
    }
    
    if (!existingUser) {
      const user = await User.create({
      username,
      email,
      password:bcrypt.hashSync(password,salt)
    });
    res.status(200).json(user);
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
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ msg: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ msg: 'Invalid username or password' });
    }

    if (passwordMatch) {
     jwt.sign({ 
      username, 
      id: user._id, 
      email: user.email, 
      password: user.password , 
      eventsAttending: user.eventsAttending
    }, 
    secret, {}, (err, token) => {
      if (err) throw err;

      res.cookie('token', token).json({
       
        username,
        id: user._id,
        email: user.email,
        password : user.password,
        eventsAttending: user.eventsAttending,
        msg: 'Successfully logged in',
      });
    });
    } else {
      res.json({ status: 'error', user: false });
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
      return res.status(401).json({ msg: 'Unauthorized access!' });
    }
    const decodedToken = jwt.verify(token, secret);
    res.json(decodedToken);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});



const { ObjectId } = require('mongoose').Types;

app.put('/userprofile', async (req, res) => {
  try {
    const { id, attendedEvents } = req.body;

    // Assuming you have a User model/schema defined
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Convert the attendedEvents array to an array of ObjectId values
    const attendedEventIds = attendedEvents.map(event => new ObjectId(event.id));

    // Update the attendedEvents array in the user document
    user.attendedEvents = attendedEventIds;

    // Save the updated user document
    await user.save();

    res.json({ msg: 'Attended events updated successfully' });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});







//a post request

app.post(
  '/post',
  uploadMiddleware.single('file'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('numberOfPeople')
      .notEmpty()
      .withMessage('Number of people is required')
      .isInt({ min: 0 })
      .withMessage('Number of people must be a positive integer'),
    // Add more validation rules for other fields
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { originalname, path } = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      const newPath = path + '.' + ext;
      fs.renameSync(path, newPath);

      const { token } = req.cookies;
      jwt.verify(token, secret, {}, async (err, decodedToken) => {
        if (err) {
          throw err;
        }

        const {title,numberOfPeople,dateTime,eventType, privatePublic,postCode,  summary,
        } = req.body;
        const postDoc = await Post.create({ title, numberOfPeople,  dateTime, eventType, privatePublic, postCode, coverImg: newPath, summary, attendingCounter: 0,   author: decodedToken.id,
        });

        res.json(postDoc);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// PUT /post/:id - Update a post
app.put('/post/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      numberOfPeople,
      dateTime,
      eventType,
      privatePublic,
      postCode,
      summary,
      attendingUsers,
      attendingCounter,
    } = req.body;
    
    
    const postDoc = await Post.findById(id);

    if (!postDoc) {
      return res.status(404).json({ error: 'Post not found' });
    }
    postDoc.title = title || postDoc.title;
    postDoc.numberOfPeople = numberOfPeople || postDoc.numberOfPeople;
    postDoc.dateTime = dateTime || postDoc.dateTime;
    postDoc.eventType = eventType || postDoc.eventType;
    postDoc.privatePublic = privatePublic || postDoc.privatePublic;
    postDoc.postCode = postCode || postDoc.postCode;
    postDoc.summary = summary || postDoc.summary;
    postDoc.attendingCounter = attendingCounter || postDoc.attendingCounter;

    await postDoc.save();

    res.json(postDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



app.post('/userprofile/eventsAttending', async (req, res) => {
  try {
    // Get the user's ID and event details from the request body
    const { userID, postID, title } = req.body;

    // Find the user by their ID
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add the event details to the user's eventsAttending array
    user.eventsAttending.push({ postID, title });

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: 'User eventsAttending updated successfully' });
  } catch (error) {
    console.error('Error updating user eventsAttending:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/post/:postID', async (req, res) => { 
  try {
    const { postId } = req.params;
    const { attending } = req.body;

    // Find the post by its ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Update the attendingUsers array based on the attending flag
    if (attending) {
      post.attendingUsers.push(req.user._id); // Assuming you have authenticated and have access to the user ID
    } else {
      post.attendingUsers = post.attendingUsers.filter(userId => userId.toString() !== req.user._id.toString());
    }

    // Save the updated post object
    await post.save();

    res.status(200).json({ message: 'Post attendingUsers updated successfully' });
  } catch (error) {
    console.error('Error updating post attendingUsers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});






 
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