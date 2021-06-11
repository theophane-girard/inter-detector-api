import { DataTypes, Model } from "sequelize/types"
import { database } from "../config/database"

export class Label extends Model {
  id!: number
  name!: string
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
export interface LabelInterface {
  name: string;
}

Label.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    }
  },
  {
    tableName: "labels",
    sequelize: database,
  }
);
Label.sync({ force: true }).then(() => console.log("Label table created"));