import { NextFunction, Request, Response } from "express";
import { MongooseError } from "mongoose";
import { IWord } from "../types/word";
import { createWord } from "../helpers/words/createWord";

import Word from "../models/word";

export default (req: Request, res: Response, next: NextFunction) => {
  const nextStep = (word: IWord) => {
    req.body = { ...req.body, wordId: word._id }
    next()
  }

  const existedWord = Word.findOne({
    'defaultName.spelling': { $in: req.body.word }
  }, function(err: MongooseError, docs: IWord[]){
     console.log(docs);
  });

  if (existedWord) nextStep(existedWord)
  else {
    createWord({
      data: req.body.word,
      resolve: nextStep,
      reject: () => res.status(500).json({ message: 'Что-то сломалось, наша программа тоже' })
    })
  }
};
