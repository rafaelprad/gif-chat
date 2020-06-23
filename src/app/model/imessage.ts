import { ETypeMessage } from './etype-message';

export interface IMessage {
  from: string;
  to: string;
  text: string;
  type: ETypeMessage;

}