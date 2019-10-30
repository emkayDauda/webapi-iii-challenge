const express = require('express');
const postsDb = require('./postDb')
const router = express.Router();

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

router.put('/:id', (req, res) => {

});

// custom middleware

function validatePostId(req, res, next) {
    const { id } = req.params;
    postsDb.getById(id)
    .then(post => {
        if(post) {
            req.post = post;
            next();
        }
        else res.status(404).json({message: "Post with that ID exists not"})
    })
    .catch(err => res.status(500).json({error: err, message: "Failed to hit server"}))
}

module.exports = router;