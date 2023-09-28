import { Request, Response } from "express";
import { ICategory } from "../types/category";
import { MongooseError } from "mongoose";

import express from "express";
import mongoose from "mongoose";
import checkAuth from '../middleware/checkAuth';

import Category from "../models/category";
import addName from "../middleware/addName";
import { addTranslates, addTranslate } from "../helpers/words/addTranslate";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  Category.find()
    .select("wordId")
    .exec()
    .then((docs: ICategory[]) => {
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

router.get("/:categoryId", (req: Request, res: Response) => {
  const id = req.params.wordId;
  Category.findById(id)
    .select('wordId')
    .exec()
    .then((doc: ICategory) => {
      if (doc) {
        const category = addTranslate(doc)
        res.status(200).json({ category });
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
  const category = new Category({
    _id: new mongoose.Types.ObjectId(),
    wordId: req.body.wordId, 
  });
  category
    .save()
    .then((result: ICategory) => {
      console.log(result);
      res.status(201).json({
        message: "Created category successfully",
        createdCategory: { _id: result._id }
      });
    })
    .catch((err: MongooseError) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.patch("/:categoryId", checkAuth, addName, (req: Request, res: Response) => {
  const id = req.params.wordId;
  // const updateOps = {};
  // for (const ops of req.body) {
  //   updateOps[ops.propName] = ops.value;
  // }
  Category.update({ _id: id }, { $set: req.body })
    .exec()
    .then((result: ICategory) => {
      res.status(200).json({ message: 'Category updated' });
    })
    .catch((err: MongooseError) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:categoryId", checkAuth, (req: Request, res: Response) => {
  const id = req.params.categoryId;
  Category.remove({ _id: id })
    .exec()
    .then(() => {
      res.status(200).json({ message: 'Category deleted' });
    })
    .catch((err: MongooseError) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

export default router
