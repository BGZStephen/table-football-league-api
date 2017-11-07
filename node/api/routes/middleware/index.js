const mongoose = require('mongoose');
const User = mongoose.model('User');
const League = mongoose.model('League');

const resources = {
  league: async function(id) {return await League.findById(ObjectId(id))};
  user: async function(id) {await User.findById(ObjectId(id))};
}

async function fetchResource(req, res, next) {
  const id = req.params.id;
  if (!id) {
    return res.status(500).json({message: 'ID is required'});
  }

  if (!/[A-Fa-f0-9]{24}/g.test(id)) {
    return res.status(500).json({message: 'Invalid ID'});
  }

  // get route resource
  const query = req.url.split('/')[1];
  const resource = resources[query](id)

  if(!resource) {
    return res.status(404).json('Resource not found');
  }

  req[resource] = resource
  next();
}
