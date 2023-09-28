import { Request, Response } from "express";
import { MongooseError } from "mongoose";
import { ILanguage } from "../types/language";

import express from "express";
import mongoose from "mongoose";
import checkAuth from '../middleware/checkAuth';

import Language from "../models/language";
import addName from "../middleware/addName";
import { addTranslates, addTranslate } from "../helpers/words/addTranslate";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  Language.find()
    .select("wordId")
    .exec()
    .then((docs: ILanguage[]) => {
      const categories = addTranslates(docs)
      const response = { count: docs.length, categories };
      res.status(200).json(response);
    })
    .catch((err: MongooseError) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:languageId", (req: Request, res: Response) => {
  const id = req.params.wordId;
  Language.findById(id)
    .select('wordId')
    .exec()
    .then((doc: ILanguage) => {
      if (doc) {
        const language = addTranslate(doc)
        res.status(200).json({ language });
      } else {
        res.status(404).json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err: MongooseError) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/", checkAuth, addName, (req: Request, res: Response) => {
  const language = new Language({
    _id: new mongoose.Types.ObjectId(),
    wordId: req.body.wordId, 
  });
  language
    .save()
    .then((result: ILanguage) => {
      console.log(result);
      res.status(201).json({
        message: "Created language successfully",
        createdLanguage: { _id: result._id }
      });
    })
    .catch((err: MongooseError) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.patch("/:languageId", checkAuth, addName, (req: Request, res: Response) => {
  const id = req.params.wordId;
  // const updateOps = {};
  // for (const ops of req.body) {
  //   updateOps[ops.propName] = ops.value;
  // }
  Language.update({ _id: id }, { $set: req.body })
    .exec()
    .then((result: ILanguage) => {
      res.status(200).json({ message: 'Language updated' });
    })
    .catch((err: MongooseError) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:languageId", checkAuth, (req: Request, res: Response) => {
  const id = req.params.languageId;
  Language.remove({ _id: id })
    .exec()
    .then(() => {
      res.status(200).json({ message: 'Language deleted' });
    })
    .catch((err: MongooseError) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

export default router;