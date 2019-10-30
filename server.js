const express = require('express');
const helmet = require('helmet');
const postsRouter = require('./posts/postRouter')
const userRouter =  require('./users/userRouter')


const server = express();

server.use(helmet())
server.use(express.json())


server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});
server.use('/api/posts', logger, postsRouter)
server.use('/api/users', logger, userRouter)

//custom middleware

function logger(req, res, next) {
  console.log(`Method: ${req.method}\nUrl => ${req.url}\nTimestamp => ${Date.now()}`)
  next()
}

module.exports = server;
