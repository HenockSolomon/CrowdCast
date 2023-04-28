const express = require('express');
const mongoose = require('mongoose');
const port= process.env.PRIVATE_URL;



const app = express();
app.use(express.json());

















app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });