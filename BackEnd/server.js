const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const port = process.env.PORT || 8000;



const app = express();
app.use(express.json());
dotenv.config();



(async () => {
  try {
    await mongoose.connect(process.env.SERVER_URI);
    console.log('Connected to database');
  } catch (error) {
    console.error(error);
  }
})();

app.get ('/', (req, res) => {
    try {
        const message = 'connection is working';
        res.send(message);
    } catch(error){
        res.send(error);
    }
});














app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
