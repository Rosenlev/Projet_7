const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());


const { dbConnection } = require('./config/db');

const userRoute = require('./routes/user')
const postRoute = require('./routes/post')
const likeRoute = require('./routes/like')
const commentRoute = require('./routes/comment')

dbConnection();


app.use(express.json());
const PORT = 4000;


// Gestion des fichiers statiques
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use( userRoute)
app.use( postRoute )
app.use(likeRoute )
app.use(commentRoute )

app.listen(PORT, () => console.log('Server is running on port ' + PORT))
