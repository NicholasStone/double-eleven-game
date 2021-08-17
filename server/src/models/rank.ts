import {DataTypes, Model} from 'sequelize'
import sequelize from '../service/DatabaseService'

class Rank extends Model {
  id!: string
  // email!: string
  player1!: string
  player2!: string
  score!:number
  token!:string
}

Rank.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // email: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  //   unique: true
  // },
  player1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  player2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Rank'
})

Rank.sync({alter: true})

export default Rank
