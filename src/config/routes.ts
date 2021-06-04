import { Application, Request, Response } from "express";
import { PlayerController } from "../controllers/player.controller";

export class Routes {
  public playerController: PlayerController = new PlayerController();

  public routes(app: Application): void {
    app.route("/players")
      .get(this.playerController.index)
      .post(this.playerController.create);
    app.route("/summoner/:name")
      .get(this.playerController.getSummoner)
  }
}