const { ObjectId } = require('mongoose').Types;
const { User, Thought, } = require('../models');

module.exports = {

// Get all users
getUsers(req, res) {
User.find({})
    .populate({
      path: 'thougths',
      select: '-__v',
      path: 'friends',
      select: '-__v'
    })
    .select('-__v')
    .sort({ _id: -1 })
    .then(userData => res.json(userData))
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });

},
// GET one user bu ID
getSingleUser({ params }, res) {
    User.findOne({ _id: params.userId })
    .populate({
      path: 'thougths',
      select: '-__v',
      path: 'friends',
      select: '-__v'
    })
    .select('-__v')
    .sort({ _id: -1 })
    .then(userData => res.json(userData))
    .catch(err => {
      console.log(err);
      res.sendStatus(400).json({message: 'No user with this ID'});
    });
},
// create a user
createUser({body}, res) {
    User.create(body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
},
// Update user by _id
updateUser({ params, body }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
       body ,
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
// Delete a user
deleteUser(params, res) {
    User.findOneAndDelete({ _id: params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

// /api/users/:userId/friends/:friendId
//adding friend.
addFriend(req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $push: { friends: req.params.friendId } },
    { runValidators: true, new: true }
  )
    .then((user) =>
      !user
        ? res
            .status(404)
            .json({ message: 'No user found with that ID' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
},
// remove a friend 
deleteFriend(req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { friends: req.params.friendId } },
    { runValidators: true, new: true }
  )
    .then((user) =>
      !user
        ? res
            .status(404)
            .json({ message: 'No user found with that ID' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
},

};


