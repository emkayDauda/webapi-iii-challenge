const express = require('express');

const router = express.Router();

const userDb = require('./userDb')

router.post('/', (req, res) => {
    
});

router.post('/:id/posts', validateUserId, (req, res) => {
    
});

router.get('/', (req, res) => {
    userDb.get()
    .then(users => {
        res.status(201).json(users);
    })
    .catch(err => res.status(500).json({error: err.message}))
});

router.get('/:id', (req, res) => {

});

router.get('/:id/posts', validateUserId, (req, res) => {
    userDb.getUserPosts(req.user.id)
    .then(posts => {
        res.status(201).json(posts)
    })
    .catch(err => res.status(500).json({error: err.message}))
});

router.delete('/:id', validateUserId, (req, res) => {
    userDb.remove(req.user.id)
    .then(flag => {
        if (flag) {
            res.status(201).json({message: "deleted", data: req.user})
        }
    })
});

router.put('/:id', (req, res) => {

});

//custom middleware

function validateUserId(req, res, next) {
    userDb.getById(req.params.id)
    .then(user => {
        if (user) {
            req.user = user;
            next()
        } else res.status(404).json({message: "No user by that ID exists"})
    })
}

function validateUser(req, res, next) {

};

function validatePost(req, res, next) {

};

module.exports = router;
