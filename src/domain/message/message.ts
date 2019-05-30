import * as _ from "lodash"
import { MessageValidator } from "./validator";
import { IMessage, MessageModel } from "../../models/message";

export interface IMessageCreateParams {
  title: string;
  content: string;
  senderId: string;
  recipientId: string;
}

export interface IMessageQuery {
  id: string;
  senderId: string;
  recipientId: string;
  sort: string;
  limit: number;
  offset: number;
}

class MessageDomainHelper {
  private message: IMessage;

  constructor(message: IMessage) {
    this.message = message;
  }

  public get() {
    this.hasMessage("get");
    return this.message;
  }

  public async save() {
    this.hasMessage("save");
    await this.message.save();
  }

  private hasMessage(callingFunctionName: string) {
    if (!this.message) {
      throw new Error(`A Team has to be set for this function (${callingFunctionName}) to be called`)
    }
  }

  public clear() {
    this.message = undefined;
  }

  public getPublicFields() {
    this.hasMessage("getPublicFields");
    return this.message;
  }

  static async create(params: IMessageCreateParams) {
    MessageValidator.validateNewMessage(params);

    const user = await MessageModel.create(_.pick(params, ['title', 'content', 'recipientId', 'senderId']));
  
    return new MessageDomainHelper(user)
  }

  static async list(query: IMessageQuery) {
    MessageValidator.validateListQuery(query);

    const dbQuery: any = {};
    const dbSort: any = {};
    const dbFields: any = {};
    const dbFilter: any = {
      limit: query.limit || 20,
      skip: query.offset || 0,
    }

    if (query.id) {
      dbQuery._id = {$in: query.id.split(',')}
    }

    if (query.senderId) {
      dbQuery.senderId = {$in: query.senderId.split(',')}
    }

    if (query.recipientId) {
      dbQuery.name = {$in: query.recipientId.split(',')}
    }

    if (query.sort) {
      const sortKey = query.sort.startsWith('-') ? query.sort.substr(1, query.sort.length) : query.sort;
      dbSort[sortKey] = query.sort.startsWith('-') ? 'desc' : 'asc';
    }

    const results = await MessageModel.find(dbQuery, dbFields, dbFilter).sort(query.sort ? dbSort : null);
    const totalCount = await MessageModel.count({});

    const response = {
      count: results.length,
      totalCount,
      data: results,
    }

    return response;
  }
}

export const Message = MessageDomainHelper;