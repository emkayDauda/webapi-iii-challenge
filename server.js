const express = require('express');

const server = express();

server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  console.log(`Method: ${req.method}\nUrl => ${req.url}\nTimestamp => ${Date.now()}`)
  next()
}

module.exports = server;
