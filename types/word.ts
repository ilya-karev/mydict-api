import { Types } from 'mongoose';
import { ICategory } from './category';
import { ILanguage } from './language';

interface ITranslate {
  languageId: Types.ObjectId,
  spelling: string,
}

export interface IWord {
  _id: string,
  defaultName: ITranslate,
  categories: [ICategory],
  languages: [ILanguage],
  translates: [ITranslate],
}