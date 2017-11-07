async function deleteOne(req, res) {
  try {
    await User.findById(ObjectId(req.params.id)).remove();
    res.status(200).send();
  } catch (error) {
    winston.error(error);
    res.status(500).json(error);
  }
}

async function updateOne() {
  const updateFields = 'administrators name teams fixtures'.split(' ');
  const updateParams = {};

  try {
    Object.keys(req.body).forEach(function (key) {
      if(updateFields.indexOf(key)) {
        updateParams[key] = req.body[key]
      }
    })

    await League.update({_id: ObjectId(req.params.id)}, updateParams);
    const league = await League.findById(ObjectId(req.params.id));
    res.json(league);
  } catch (error) {
    winston.error(error);
    res.status(500).json(error);
  }
}

async function fetchLeague(req, res, next) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(500).json({message: 'League ID is required'});
    }

    if (!/[A-Fa-f0-9]{24}/g.test(id)) {
      return res.status(500).json({message: 'Invalid League Id'});
    }

    const league = await League.findById(ObjectId(id));
    if (!league) {
      return res.status(404).json({message: 'League not found'});
    }

    req.league = league;
    next();
  } catch (error) {
    winston.error(error);
    res.status(500).json(error);
  }
}

async function duplicateLeagueUpdateCheck(currentLeagueId, leagueName) {
  const league = await League.findOne({name: leagueName});
  if (league && league._id !== currentLeagueId) {
    throw new Error('League name already in use');
  }
}

module.exports = {
  deleteOne,
  updateOne,
  fetchLeague,
}
