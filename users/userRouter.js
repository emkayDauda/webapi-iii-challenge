const express = require("express");

const router = express.Router();

const userDb = require("./userDb");

router.post("/", validateUser, (req, res) => {
  userDb
    .insert(req.user)
    .then(data => res.status(201).json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post("/:id/posts", [validateUserId, validatePost], (req, res) => {
    
});

router.get("/", (req, res) => {
  userDb
    .get()
    .then(users => {
      res.status(201).json(users);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(201).json({ message: "Success", data: req.user });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  userDb
    .getUserPosts(req.user.id)
    .then(posts => {
      res.status(201).json(posts);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.delete("/:id", validateUserId, (req, res) => {
  userDb.remove(req.user.id).then(flag => {
    if (flag) {
      res.status(201).json({ message: "deleted", data: req.user });
    }
  });
});

router.put("/:id", [validateUserId, validateUser], (req, res) => {
    userDb.update(req.user.id, req.user)
    .then(flag => {
        if (flag) {
            res.status(201).json(req.user)
        }
        else res.status(500).json({error: "Failed to update user"})
    })
    .catch(err => res.status(500).json({error: err.message}))
});

//custom middleware

function validateUserId(req, res, next) {
  userDb.getById(req.params.id).then(user => {
    if (user) {
      req.user = user;
      next();
    } else res.status(404).json({ message: "No user by that ID exists" });
  });
}

function validateUser(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: "missing user data!" });
  } else if (!req.body.name) {
    res.status(400).json({ message: 'missing required "name" field!' });
  } else {
    const user = {
      name: req.body.name
    };
    req.user = {...req.user, name: user.name};
    next();
  }
}

function validatePost(req, res, next) {
    if (!Object.keys(req.body).length) {
        res.status(400).json({ message: "missing user data!" });
      } else if (!req.body.text) {
        res.status(400).json({ message: 'missing required "name" field!' });
      } else {
        const post = {
          name: req.body.text
        };
        req.post = post;
        next();
      }
}

module.exports = router;
