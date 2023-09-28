import express from 'express';
import categoryRoutes from './category';
import languageRoutes from './language';
import userRoutes from './user';
import wordRoutes from './word';

export const routes = express.Router();

routes.use(categoryRoutes);
routes.use(languageRoutes);
routes.use(userRoutes);
routes.use(wordRoutes);
