/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import type { INestApplication } from '@nestjs/common';
import { makeUserFactory, UserFactory } from 'test/factories/make-user';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Resgiter Account (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /accounts', async () => {
    const user = makeUserFactory({
      passwordHash: 'R@wPassword123',
    });

    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: user.name,
      email: user.email.toString(),
      password: user.passwordHash,
    });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: { email: user.email.toString() },
    });

    expect(userOnDatabase).toBeTruthy();
  });

  test('[POST] /accounts - 409', async () => {
    const userFactory = new UserFactory(prisma);
    const user = await userFactory.makePrismaUser({
      passwordHash: 'R@wPassword123',
    });

    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: user.name,
      email: user.email.toString(),
      password: user.passwordHash,
    });

    expect(response.statusCode).toBe(409);

    const usersOnDatabase = await prisma.user.findMany({
      where: { email: user.email.toString() },
    });

    expect(usersOnDatabase).toHaveLength(1);
  });
});
