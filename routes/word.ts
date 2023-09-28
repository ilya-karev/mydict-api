import { Request, Response } from "express";
import { IWord } from "../types/word";
import { createWord } from "../helpers/words/createWord";
import { MongooseError } from "mongoose";

import express from "express";
import checkAuth from '../middleware/checkAuth';

import Word from "../models/word";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  Word.find()
    .select("translates category")
    .exec()
    .then((docs: IWord[]) => {
      const response = {
        count: docs.length,
        words: docs.map(doc => ({ categories: doc.categories, translates: doc.translates, _id: doc._id }))
      };
      res.status(200).json(response);
    })
    .catch((err: MongooseError) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", checkAuth, async (req: Request, res: Response) => {
  createWord({
    data: req.body,
    resolve: (result) => {
      res.status(201).json({
        message: "Created word successfully",
        createdWord: { _id: result._id, categories: result.categories, translates: result.translates }
      });
    },
    reject: (err: unknown) => res.status(500).json({ error: err })
  })
});

router.get("/:wordId", (req: Request, res: Response) => {
  const id = req.params.wordId;
  Word.findById(id)
    .select('translates category')
    .exec()
    .then((doc: IWord) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({ word: { categories: doc.categories, translates: doc.translates, _id: doc._id } });
      } else {
        res.status(404).json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err: MongooseError) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:wordId", checkAuth, (req: Request, res: Response) => {
  const id = req.params.wordId;
  // const updateOps = {};
  // for (const ops of req.body) {
  //   updateOps[ops.propName] = ops.value;
  // }
  Word.update({ _id: id }, { $set: req.body })
    .exec()
    .then((result: IWord) => {
      res.status(200).json({ message: 'Word updated' });
    })
    .catch((err: MongooseError) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:wordId", checkAuth, (req: Request, res: Response) => {
  const id = req.params.wordId;
  Word.remove({ _id: id })
    .exec()
    .then(() => {
      res.status(200).json({ message: 'Word deleted' });
    })
    .catch((err: MongooseError) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

export default router;