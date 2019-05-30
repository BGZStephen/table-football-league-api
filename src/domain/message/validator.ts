import * as joi from 'joi';
import * as joiUtils from '../../utils/joi';
import { IMessageCreateParams, IMessageQuery } from './message';

class MessageValidatorService {
  public validateNewMessage(params: IMessageCreateParams) {
    const schema = joi.object().keys(newMessageConstraint);
    joiUtils.validateThrow(params, schema);
  }

  public validateListQuery(params: IMessageQuery) {
    const schema = joi.object().keys(messageListConstraint);
  
    joiUtils.validateThrow(params, schema);
  }
}

export const MessageValidator = new MessageValidatorService();

export const newMessageConstraint = {
  title: joi.string().required().label('Title'),
  content: joi.string().required().label('Sender ID'),
  senderId: joi.string().alphanum().required().label('Sender ID'),
  recipientId: joi.string().alphanum().required().label('Sender ID'),

}

export const messageListConstraint = {
  id: joi.string().alphanum().label('Message ID'),
  senderId: joi.string().alphanum().label('Sender ID'),
  recipientId: joi.string().alphanum().label('Sender ID'),
  sort: joi.string().label("Sort"),
  limit: joi.number().min(1).label("Limit"),
  offset: joi.number().min(0).label("Offset"),
}