const express = require('express');
const app = express();
const morgan = require('morgan');
const PORT = process.env.PORT || 4001;
const bodyParser = require('body-parser');
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './db.sqlite');

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/strips', (req, res) => {
  db.all('SELECT * FROM Strip', (err, rows) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send({strips: rows});
    }
  })
});

const validateStrip = (req, res, next) => {
  const stripToCreate = req.body.strip;
  if (!stripeToCreate.head || !stripeToCreate.body || !stripeToCreate.background || !stripeToCreate.bubbleType) {
   return res.sendStatus(400)
  }
  next();
}

app.post('/strips', validateStrip, (req, res) => {
  const newStrip = req.body.strip;
})


app.listen(PORT);
module.exports = app;
