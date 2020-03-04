import { Sequelize } from 'sequelize-typescript';
import '../bootstrap';
import { EntitiesData } from '../database/entities.data';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST,
        repositoryMode: true,
        port: (process.env.DB_PORT as unknown) as number,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        models: [__dirname + '/**/*.model.ts'],
      });
      sequelize.addModels(EntitiesData);
      await sequelize.sync();
      return sequelize;
    },
  },
];
