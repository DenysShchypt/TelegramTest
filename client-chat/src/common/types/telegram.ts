export interface IConfirmCode {
  phone_number: string;
  code: string;
}
export interface IConnect {
  phone_number: string;
}
export interface ITelegramData {
  chats: ReadonlyArray<IChat>;
  messages: ReadonlyArray<IMessage>;
  isLoading: boolean;
  isConnect: boolean;
  isConfirmCode: boolean;
}

export interface IChatList {
  chats: ReadonlyArray<IChat>;
}

export interface IChat {
  id: number;
  name: string;
  type: string;
}
export interface IMessageList {
  messages: ReadonlyArray<IMessage>;
}

export interface IMessage {
  id: number;
  text: string;
  date: string;
}
