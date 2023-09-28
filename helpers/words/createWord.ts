import { IWord } from "../../types/word";

import mongoose from "mongoose";
import Word from "../../models/word";

type CreateWordProps = {
  data: IWord,
  resolve: (result: IWord) => void
  reject: (error: unknown) => void
}
export const createWord = async ({ data, resolve, reject }: CreateWordProps) => {
  const word = new Word({
    _id: new mongoose.Types.ObjectId(),
    categories: data.categories, 
    languages: data.translates.map(translate => translate.languageId),
    translates: data.translates
  });

  try {
    const result = await word.save()
    resolve(result);
  } catch (error) {
    reject(error)
  };
}