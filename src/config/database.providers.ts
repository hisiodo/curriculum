import { Sequelize } from 'sequelize-typescript';
import '../bootstrap';
import { EntitiesData } from '../database/entities.data';
import * as dbConfig from './db/db-config';
export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        ...dbConfig,
        repositoryMode: true,
        models: [__dirname + '/**/*.model.ts'],
      });
      sequelize.addModels(EntitiesData);
      await sequelize.sync();
      return sequelize;
    },
  },
];
