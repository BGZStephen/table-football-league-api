const mongoose = require('mongoose');
const AsyncWrap = require('../../utils/async-wrapper');
const validate = require('../../services/validate')

const Message = mongoose.model('Message');
const ObjectId = mongoose.Types.ObjectId;

/**
 * @api {get} /messages/text-message Get one user
 * @apiName TextMessage
 * @apiGroup Message
 *
 * @apiParam {req} Express request object.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {status} 200.
 */
const textMessage = AsyncWrap(async function (req, res) {
  if (!req.body.messageContent) {
    res.error({message: 'A message is required', statusCode: 400})
  }

  const message = new Message({
    type: 'sent',
    sender: req.body.user._id,
    messageContent: req.body.messageContent,
    recipients: req.body.recipients,
    private: req.body.private,
  })

  await message.sendToRecipients();
  res.sendStatus(200);
})

/**
 * @api {get} /messages Get messages based on query
 * @apiName GetMessages
 * @apiGroup Message
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.query} Query parameters to build a search from.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {array[object]} Message objects.
 */
const get = AsyncWrap(async function (req, res) {
  const searchableFields = 'userId sender type'.split(' ')
  const query = {}

  for (const queryParam of Object.key(req.query)) {
    if (queryParam.indexOf(searchableFields) > 0) {
      query[queryParam] = req.query[queryParam];
    }
  }

  const messages = await Message.find(query);

  res.json(messages);
})

/**
 * @api {get} /messages Get messages based on query
 * @apiName GetMessages
 * @apiGroup Message
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.params} Query parameters to build a search from.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {array[object]} Message objects.
 */
const getOne = AsyncWrap(async function (req, res) {
  const message = req.message;
  res.json(message);
})

module.exports = {
  get,
  getOne,
  textMessage,
}
