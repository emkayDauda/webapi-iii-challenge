const express = require('express');
const postsDb = require('./postDb')
const router = express.Router();
const userDb = require("../users/userDb");


router.get('/', (req, res) => {
    postsDb.get()
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({error: err, message: "Failed to hit server"}))
});

router.get('/:id',validatePostId, (req, res) => {
    res.status(201).json(req.post)
});

router.delete('/:id', validatePostId, (req, res) => {
    const { id } = req.post
    postsDb.remove(id)
    .then(flag => {
        if (flag) {
            res.status(201).json({message: 'deleted', data: req.post})
        }
    })
});

router.put('/:id', [validatePostBody, validatePostId, validateUserId], (req, res) => {
    const { id } = req.post
    postsDb.update(id, req.post)
    .then(flag => {
        if (flag) {
            res.status(201).json(req.post)
        } else res.status(500).json({error: "random error"})
    }).catch(err => res.status(500).json({error: err.message}))
});

// custom middleware

function validateUserId(req, res, next) {
    userDb.getById(req.body.user_id).then(user => {
      if (user) {
        req.user = user;
        next();
      } else res.status(404).json({ message: "No user by that ID exists" });
    })
    .catch(err => res.status(500).json({err: err.message}))
    ;
  }

function validatePostId(req, res, next) {
    const { id } = req.params;
    postsDb.getById(id)
    .then(post => {
        if(post) {
            req.post = {...post, text: req.post.text};
            next();
        }
        else res.status(404).json({message: "Post with that ID exists not"})
    })
    .catch(err => res.status(500).json({error: err, message: "Failed to hit server"}))
}

function validatePostBody(req, res, next) {
    // const {} = req.body;
    if (!Object.keys(req.body).length) {
        res.status(400).json({ message: "missing user data!" });
      } else if (!req.body.text) {
        res.status(400).json({ message: 'missing required "name" field!' });
      } else {
        const post = {
          text: req.body.text
        };
        req.post = post;
        next();
      }
}

module.exports = router;