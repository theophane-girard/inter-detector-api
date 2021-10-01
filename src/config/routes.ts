import { Application } from "express";
import { CoreController } from "../controllers/core.controller";
import { PlayerController } from "../controllers/player.controller";
import { Container } from 'typedi';
import 'reflect-metadata';

export class Routes {
  public playerController: PlayerController = Container.get(PlayerController);
  public coreController: CoreController = new CoreController();

  public routes(app: Application): void {
    app.route("/playload")
      .post(this.coreController.onDeployEvent.bind(this.coreController));
    app.route("/players")
      .get(this.playerController.index)
      .post(this.playerController.create);
    app.route("/summoners/:name")
      .get(this.playerController.getSummonerByName.bind(this.playerController))
    app.route("/summoners")
      .post(this.playerController.getSummoners.bind(this.playerController))
    app.route("/summoners/leagues/:id")
      .get(this.playerController.getSummonerLeague.bind(this.playerController))
    app.route("/summoners/matches/ref")
      .post(this.playerController.getLastMatchRefList.bind(this.playerController))
    app.route("/summoners/matches/:id")
      .get(this.playerController.getMatchById.bind(this.playerController))
    app.route("/summoners/matches/csv")
      .post(this.playerController.getMatchesToCSV.bind(this.playerController))
    app.route("/summoners/decay-date")
      .post(this.playerController.getDecayCountDownIframe.bind(this.playerController))
  }
}