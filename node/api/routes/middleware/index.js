const mongoose = require('mongoose');
const User = mongoose.model('User');
const League = mongoose.model('League');
const ObjectId = mongoose.Types.ObjectId;

async function fetchResource(req, res, next) {
  const resources = {
    league: async function(id) {return await League.findById(ObjectId(id))},
    user: async function(id) {return await User.findById(ObjectId(id))},
  }

  const id = req.params.id;
  if (!id) {
    return res.status(500).json({message: 'ID is required'});
  }

  if (!/[A-Fa-f0-9]{24}/g.test(id)) {
    return res.status(500).json({message: 'Invalid ID'});
  }

  // get route resource
  let query = req.url.split('/')[1];

  // strip plural resource names
  if(query.endsWith('s')) {
    query = query.slice(0, query.length -1);
  }
  const resource = await resources[query].call(null, id);

  if(!resource) {
    return res.status(404).json('Resource not found');
  }

  req[query] = resource
  next();
}

module.exports = {
  fetchResource,
}
