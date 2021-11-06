const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const router = require("./routers/router");
dotenv.config();

mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use('/users', router);

app.listen(PORT, () => {
    console.log('Connected to server, running on port ' + PORT);
});