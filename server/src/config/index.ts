import * as path from 'path'

export default {
  database: {
    path: path.resolve(__dirname, '../sqlite/database.sqlite')
    // path: 'sqlite::memory:'
    // host: '127.0.0.1',
    // port: 3306,
    // username: 'phaser-game',
    // password: '#$AGTR4f)di3DAE@5',
    // database: 'phaser-game',
  },
  secretKey: 'secret'
}
