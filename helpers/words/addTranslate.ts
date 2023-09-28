import { MongooseError } from "mongoose";
import { ICategory } from "../../types/category";
import { ILanguage } from "../../types/language";
import { IWord } from "../../types/word";

const Word = require("../../models/word");

export const addTranslate = async (item: ILanguage | ICategory) => {
  const word = await Word.findOne({ '_id': { $in: item.wordId } }, (err: MongooseError, doc: IWord) => console.log(doc));
  return { ...item, word }
}

type TranslatesKeyValue = {
  [key: string]: IWord
}
export const addTranslates = async (items: ILanguage[] | ICategory[]) => {
  const wordIds = items.map(item => item.wordId)
  const words = await Word.find({ '_id': { $in: wordIds } }, (err: MongooseError, docs: IWord[]) => console.log(docs));
  const wordsKeyValue = words.reduce((acc: TranslatesKeyValue, word: IWord) => ({ ...acc, [word._id]: word }), {})
  return items.reduce(
    (acc, item: ILanguage | ICategory) => ([...acc, { ...item, word: wordsKeyValue[`${item.wordId}`] }]),
    [] as ILanguage[] | ICategory[]
  )
}
