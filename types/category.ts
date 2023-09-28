import { Types } from 'mongoose';

export interface ICategory {
  _id: Types.ObjectId,
  wordId: Types.ObjectId,
}
