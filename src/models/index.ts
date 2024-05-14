import { DataTypes, Model } from "sequelize"
import sequelize from "../configs/db.config"

interface StoreAttributes {
  store_id: number
  id: string
  name: string
  data?: Record<string, any> 
}

class Store extends Model<StoreAttributes> implements StoreAttributes {
  public store_id!: number
  public id!: string
  public name!: string
  public data?: Record<string, any> 
}

Store.init(
  {
    store_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSONB,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    tableName: "store",
  }
)

export { Store }
