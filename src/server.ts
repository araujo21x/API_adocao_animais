import 'reflect-metadata';
import express from 'express';
import userRouter from './modules/user/index';

class App {
  public app: express.Application;

  constructor () {
    this.app = express();
    this.config();
    this.routes();
  }

  private config (): void {
    this.app.use(express.json());
  }

  private routes (): void {
    this.app.use(userRouter);
  }
}

export default new App().app;
