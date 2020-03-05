import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthorModule } from '../../src/author/author.module';
import { AuthorService } from '../../src/author/author.service';

import { Author } from '../../src/author';
import { FakeFactory } from '../../test/factory/fake-factory';
import { Fakes } from '../../test/factory/enum-fakes';

import { DatabaseModule } from '../../src/database/database.module';

import { dbTestProvider } from '../db-test-provider';
import { EntitiesData } from '../../src/database/entities.data';

describe('Author Controller (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthorModule,
        DatabaseModule,
        SequelizeModule.forRoot({
          dialect: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'docker',
          database: 'curriculum',
          autoLoadModels: true,
          synchronize: true,
          models: [Author],
        }),
      ],
      providers: [
        {
          provide: AuthorService,
          useFactory: () => ({
            getAuthorById: jest.fn(),
          }),
        },
      ],
    }).compile();
    app = module.createNestApplication();

    await app.init();
  });

  it('Shuold create a author / (Post)', async () => {
    const authorFake: Author = await FakeFactory.getFactory(
      Fakes.AUTHOR,
    ).generate();
    const client = await request(app.getHttpServer())
      .post('/authors')
      .send(authorFake);
    const { name, lastName } = client.body;
    const result: any = { name, lastName };
    result.birthDate = new Date(client.body.birthDate);
    expect(client.status).toBe(201);
    expect(result).toEqual(authorFake);
  });
  it('Shuold show a author /:id (GET)', async () => {
    const authorFake = await FakeFactory.getFactory(Fakes.AUTHOR).create();

    const client = await request(app.getHttpServer()).get(
      `/authors/${authorFake.id}`,
    );

    expect(client.status).toBe(200);
    expect(client.body.name).toEqual(authorFake.name);
  });
  it('Shuold  failure when not found author by  /:id (GET)', async () => {
    const client = await request(app.getHttpServer()).get(`/authors/000000`);

    expect(client.status).toBe(404);
    expect(client.body.error).toBe('Not Found');
  });

  it('Shuold show a list of authors (GET)', async () => {
    const authorsFake = await FakeFactory.getFactory(Fakes.AUTHOR).createMany(
      3,
    );

    const client = await request(app.getHttpServer()).get(`/authors`);

    expect(client.status).toBe(200);
    expect(client.body.length).toEqual(authorsFake.length);
  });

  afterEach(async () => {
    await Promise.all(
      EntitiesData.map(model => {
        return dbTestProvider
          .getRepository(model)
          .destroy({ truncate: true, force: true });
      }),
    );
  });
});
