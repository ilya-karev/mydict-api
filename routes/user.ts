import { Request, Response } from "express";
import { IUser } from "../types/user";
import { Hash } from "crypto";
import { MongooseError } from "mongoose";

import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user";

const router = express.Router();

router.post("/signup", (req: Request, res: Response) => {
  User.find({ email: req.body.email })
    .exec()
    .then((users: IUser[]) => {
      if (users.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then((result: IUser) => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch((err: MongooseError) => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

router.post("/login", (req: Request, res: Response) => {
  User.find({ email: req.body.email })
    .exec()
    .then((users: IUser[]) => {
      if (users.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, users[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: users[0].email,
              userId: users[0]._id
            },
            process.env.JWT_KEY!,
            {
                expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch((err: MongooseError) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:userId", (req: Request, res: Response) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((result: IUser) => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch((err: MongooseError) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

export default router;