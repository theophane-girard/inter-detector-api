import express = require("express");
import * as bodyParser from "body-parser";
import { Routes } from "./config/routes";
import cors from "cors"
require('dotenv').config()
class App {
  public app: express.Application;
  public routePrv: Routes = new Routes();

  constructor() {
    this.app = express();
    this.config();
    this.routePrv.routes(this.app);
  }

  private config(): void {
    const allowedOrigins = [
      'http://localhost:5000',
      'http://localhost:4200'
    ];

    const options: cors.CorsOptions = {
      origin: allowedOrigins
    };
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors(options))
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', '*');
      res.header('Access-Control-Allow-Headers', '*');
      next()
    })
    this.app.use(express.json());
  }
}

export default new App().app;