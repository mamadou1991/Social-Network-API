const { User, Thought, } = require('../models');
const userController = require('./userController');

module.exports = {

// get all thoughts
    getThoughts(req, res) {
        Thought.find({})
            .populate('reactions')
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
// get a single thought by _id
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .populate('reactions')
        .select('-__V')
        .then((thought) => 
            !thought
            ? res.status(404).json({ message: 'No thought with this ID'})
            : res.json(thought));
    },
// create thought
createThought({ body }, res ){
    Thought.create(body)
    .then(dbthougthData => {
            console.log(dbthougthData);
            if (!dbthougthData) {
              res.status(404).json({ message: 'No thought found with this id!' });
              return;
            }
            res.json(dbthougthData);
          })
          .catch(err => res.json(err));
},
// PUT to update a thought by its _id
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            body,
            { runValidators: true, new: true }
        )
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: "No thought with that ID"})
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
// DELETE to remove a thought by its _id
    deleteThought(req, res) {
        Thought.findOneAndDelete({_id: req.params.thoughtId })
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: 'No thought with that ID'})
                : Thought.deleteOne({ _id: req.params.thoughtId })
        )
        .then(() => res.json({ message: 'Thought deleted!'}))
        .catch((err) => res.status(500).json(err));
    },
// /api/thoughts/:thoughtId/reactions
    // POST to create a reaction stored in a single thought's reactions array field 
    addReaction(req, res) {
        Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
            ? res
                .status(404)
                .json({ message: 'No thought found with that ID' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
  // DELETE to pull and remove a reaction by the reaction's reactionId value
  deleteReaction(req, res) {
    console.log(req.params)
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { _id: req.params.reactionId }}},
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID'})
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

};



