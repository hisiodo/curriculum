import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthorModule } from '../../src/author/author.module';
import { AuthorService } from '../../src/author/author.service';

import { FakeFactory } from '../../test/factory/fake-factory';
import { Fakes } from '../../test/factory/enum-fakes';

import { DatabaseModule } from '../../src/database/database.module';

import { dbTestProvider } from '../db-test-provider';
import { EntitiesData } from '../../src/database/entities.data';
import { CreateAuthorDto } from 'src/author/dto/create-author.dto';
import * as dbModuleConfig from './db-config-module';
describe('Author Controller (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthorModule,
        DatabaseModule,
        SequelizeModule.forRoot({ ...dbModuleConfig }),
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

  it('Shuold create a author / (POST)', async () => {
    const authorFake: CreateAuthorDto = await FakeFactory.getFactory(
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

  it('Shuold update a auhor by /:id (PUT)', async () => {
    const authorFake: CreateAuthorDto = await FakeFactory.getFactory(
      Fakes.AUTHOR,
    ).create();

    const dataToUpdate = { name: 'Name Updated' };

    const client = await request(app.getHttpServer())
      .put(`/authors/${authorFake.id}`)
      .send(dataToUpdate);

    expect(client.status).toBe(200);
    expect(client.body.name).toBe(dataToUpdate.name);
  });

  it('Shuold failure when update a auhor does not exist /:id (PUT)', async () => {
    const dataToUpdate = { name: 'Name Updated' };

    const client = await request(app.getHttpServer())
      .put(`/authors/00000000`)
      .send(dataToUpdate);

    expect(client.status).toBe(404);
    expect(client.body.error).toBe('Not Found');
  });

  it('Shuold delete a auhor by /:id (DELETE)', async () => {
    const authorFake: CreateAuthorDto = await FakeFactory.getFactory(
      Fakes.AUTHOR,
    ).create();

    const client = await request(app.getHttpServer()).delete(
      `/authors/${authorFake.id}`,
    );

    expect(client.status).toBe(200);
    expect(client.body).toEqual({});
  });

  it('Shuold failure when delete a auhor does not exist /:id (DELETE)', async () => {
    const client = await request(app.getHttpServer()).delete(
      `/authors/00000000`,
    );

    expect(client.status).toBe(404);
    expect(client.body.error).toBe('Not Found');
  });

  it('Shuold failure when create a author without name / (POST)', async () => {
    const {
      birthDate,
      lastName,
    }: CreateAuthorDto = await FakeFactory.getFactory(Fakes.AUTHOR).generate();
    const client = await request(app.getHttpServer())
      .post('/authors')
      .send({ birthDate, lastName });

    expect(client.status).toBe(400);

    expect(client.body.message[0].property).toBe('name');
    expect(client.body.message[0].constraints.isNotEmpty).toBe(
      'name should not be empty',
    );
  });

  it('Shuold failure when create a author without lastName / (POST)', async () => {
    const { birthDate, name }: CreateAuthorDto = await FakeFactory.getFactory(
      Fakes.AUTHOR,
    ).generate();
    const client = await request(app.getHttpServer())
      .post('/authors')
      .send({ birthDate, name });

    expect(client.status).toBe(400);

    expect(client.body.message[0].property).toBe('lastName');
    expect(client.body.message[0].constraints.isNotEmpty).toBe(
      'lastName should not be empty',
    );
  });
  it('Shuold failure when create a author without birthDate / (POST)', async () => {
    const { name, lastName }: CreateAuthorDto = await FakeFactory.getFactory(
      Fakes.AUTHOR,
    ).generate();
    const client = await request(app.getHttpServer())
      .post('/authors')
      .send({ lastName, name });

    expect(client.status).toBe(400);

    expect(client.body.message[0].property).toBe('birthDate');
    expect(client.body.message[0].constraints.isNotEmpty).toBe(
      'birthDate should not be empty',
    );
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
