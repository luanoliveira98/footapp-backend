import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import dayjs from 'dayjs';
import request from 'supertest';
import { Server } from 'http';
import { UserFactory } from 'test/factories/make-user';

describe('Authenticate (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /sessions', async () => {
    const user = await userFactory.makePrismaUser({
      passwordHash: await hash('123456', 12),
    });

    const response = await request(app.getHttpServer() as unknown as Server)
      .post('/sessions')
      .send({
        email: user.email.toString(),
        password: '123456',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('access_token');
    expect(
      typeof (response.body as { access_token: string }).access_token,
    ).toBe('string');

    const cookies = response.get('Set-Cookie');
    expect(cookies![0]).toContain('refresh_token=');

    const sessionOnDatabase = await prisma.session.findFirst({
      where: { userId: user.id.toString() },
    });

    expect(sessionOnDatabase).toBeTruthy();
    expect(sessionOnDatabase?.expiresAt.getTime()).toBeGreaterThan(
      dayjs().valueOf(),
    );
  });
});
