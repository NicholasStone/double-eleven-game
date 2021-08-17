import { Sequelize } from 'sequelize'
import Config from '../config'

const DatabaseConfig = Config.database

const sequelize = new Sequelize({
  dialect: 'sqlite',
  // host: DatabaseConfig.host,
  // port: DatabaseConfig.port,
  // username: DatabaseConfig.username,
  // password: DatabaseConfig.password,
  // database: DatabaseConfig.database,
  storage: DatabaseConfig.path,
  define: {
    freezeTableName: true,
    paranoid: true, // 采取软删除措施, 如果查询的时候想要查询所有的内容 可以在语句后面加 { paranoid: false }
    timestamps: true,
    underscored: true // 驼峰命名转换为下划线
    // createdAt: 'created_at',
    // updatedAt: 'update_at',
    // deletedAt: 'deleted_at',
  }
})

try {
  sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.')
  })
} catch (error) {
  console.error('Unable to connect to the database:', error)
}

export default sequelize
