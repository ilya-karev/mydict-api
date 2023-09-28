import { Types } from 'mongoose';

export interface ILanguage {
  _id: Types.ObjectId,
  wordId: Types.ObjectId,
}
