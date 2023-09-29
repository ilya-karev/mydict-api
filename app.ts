import { NextFunction, Request, Response } from "express";
import cors from 'cors';
import categoryRoutes from './routes/category';
import languageRoutes from './routes/language';
import userRoutes from './routes/user';
import wordRoutes from './routes/word';

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser")
require('./db');

const app = express();

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(cors())
app.use('/api/category', categoryRoutes)
app.use('/api/language', languageRoutes)
app.use('/api/user', userRoutes)
app.use('/api/word', wordRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not found") as any;
  error.status = 404;
  next(error);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("info", `Server started at PORT ${PORT}`))

