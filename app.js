const express = require('express');
const app = express();
const PORT = process.env.PORT || 4001;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(bodyParser.json());




app.listen(PORT);
module.exports = app;
