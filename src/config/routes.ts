import { Application } from "express";
import { PlayerController } from "../controllers/player.controller";
import { MatchesService } from "../services/matches.service";

export class Routes {
  public m = new MatchesService()
  public playerController: PlayerController = new PlayerController(this.m);

  public routes(app: Application): void {
    app.route("/players")
      .get(this.playerController.index)
      .post(this.playerController.create);
    app.route("/summoners/:name")
      .get(this.playerController.getSummonerByName.bind(this.playerController))
    app.route("/summoners")
      .post(this.playerController.getSummoners.bind(this.playerController))
    app.route("/summoners/leagues/:id")
      .get(this.playerController.getSummonerLeague.bind(this.playerController))
    app.route("/summoners/matches/ref/:id")
      .get(this.playerController.getLastMatchRefList.bind(this.playerController))
    app.route("/summoners/matches/:id")
      .get(this.playerController.getMatchById.bind(this.playerController))
    app.route("/summoners/matches/csv/:id")
      .get(this.playerController.getMatchById.bind(this.playerController))
  }
}