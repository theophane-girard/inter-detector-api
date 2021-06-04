import { database } from "../config/database";
import { Sequelize, DataTypes, BuildOptions, Model } from "sequelize";
import { CoreService } from "../core/services/core.service";

export class Player extends Model {
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// export interface PlayerAttributes {
//   id: number;
//   name: string;
//   createdAt: Date;
//   updatedAt: Date;
// }
// export interface PlayerModel extends Model<PlayerAttributes>, PlayerAttributes { }
// export class Player extends Model<PlayerModel, PlayerAttributes> { }

// export type PlayerStatic = typeof Model & {
//   new(values?: object, options?: BuildOptions): PlayerInterface;
// };

// export function PlayerFactory(sequelize: Sequelize): PlayerStatic {
//   return <PlayerStatic>sequelize.define("users", {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     createdAt: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: DataTypes.NOW,
//     },
//     updatedAt: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: DataTypes.NOW,
//     },
//   });
// }

// export const PlayerFactDb = PlayerFactory(database);
export interface PlayerInterface {
  name: string;
}

Player.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    tableName: "players",
    sequelize: database, // this bit is important
  }
);

Player.sync({ force: true }).then(() => console.log("Player table created"));