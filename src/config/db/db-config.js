
import '../../bootstrap'
module.exports =  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    repositoryMode: true,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    define: {
        timestamps: true,
        underscored: true,
      }
}