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
  });
});

const validateStrip = (req, res, next) => {
  const newStrip = req.body.strip;
  if (!newStrip.head || !newStrip.body || !newStrip.background || !newStrip.bubbleType) {
   return res.sendStatus(400)
  }
  next();
};

app.post('/strips', validateStrip, (req, res) => {
  const newStrip = req.body.strip;
  db.run(`INSERT INTO Strip (head, body, bubble_type, background, bubble_text,
    caption) VALUES ($head, $body, $bubbleType, $background, $bubbleText,
    $caption)`,
    {
      $head: newStrip.head,
      $body: newStrip.body,
      $background: newStrip.background,
      $bubbleType: newStrip.bubbleType,
      $bubbleText: newStrip.bubbleText,
      $caption: newStrip.caption 
    }, function(err) {
      if (err) {
        return res.sendStatus(500);
      }
    db.get(`SELECT * FROM Strip WHERE id = ${this.lastID}`, (err, row) => {
      if (!row) {
        return res.sendStatus(500)
      }
      res.send({strip: row}).status(201)
    });
  });
});


app.listen(PORT);
module.exports = app;
