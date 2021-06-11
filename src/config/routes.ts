import { Application, Request, Response } from "express";
import { PlayerController } from "../controllers/player.controller";

export class Routes {
  public playerController: PlayerController = new PlayerController();

  public routes(app: Application): void {
    app.route("/players")
      .get(this.playerController.index)
      .post(this.playerController.create);
    app.route("/summoners/:name")
      .get(this.playerController.getSummonerByName)
    app.route("/summoners")
      .get(this.playerController.getSummoners.bind(this.playerController))
    app.route("/summoners/leagues/:id")
      .get(this.playerController.getSummonerLeague)
    app.route("/summoners/lastMatchRef/:id")
      .get(this.playerController.getLastMatchRefList)
    app.route("/summoners/match/:id")
      .get(this.playerController.getMatchById)
  }
}