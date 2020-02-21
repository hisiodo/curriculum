import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthorModule } from '../../src/author/author.module';
import { AuthorService } from '../../src/author/author.service';

describe('Author Controller (e2e)', () => {
  let app: INestApplication;

  const authorData = {
    createAuthor: () => ({
      name: 'Author name',
      lastName: 'Author Last Name',
      birthDate: '2019-12-01',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthorModule],
    })
      .overrideProvider(AuthorService)
      .useValue(authorData)
      .compile();
    app = module.createNestApplication();
    await app.init();
  });

  it('Shuold create a author / (Post)', async () => {
    const client = await request(app.getHttpServer())
      .post('/authors')
      .send(authorData.createAuthor());

    expect(client.status).toBe(201);
    expect(client.body).toEqual(authorData.createAuthor());
  });
});
