import { AppModule } from '@/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserFactory } from 'test/factories/make-user';
import request from 'supertest';
import type { Server } from 'http';
import { hash } from 'bcryptjs';
import type { AuthenticateResponseDto } from '../dtos/authenticate.dto';
import cookieParser from 'cookie-parser';

describe('Logout (e2e)', () => {
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

    app.use(cookieParser());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[DELETE] /sessions', async () => {
    const user = await userFactory.makePrismaUser({
      passwordHash: await hash('123456', 12),
    });

    const authenticatedResponse = await request(
      app.getHttpServer() as unknown as Server,
    )
      .post('/sessions')
      .send({ email: user.email.toString(), password: '123456' });

    const authenticatedCookies = authenticatedResponse.get('Set-Cookie');
    const authenticatedBody =
      authenticatedResponse.body as AuthenticateResponseDto;

    const response = await request(app.getHttpServer() as unknown as Server)
      .delete('/sessions')
      .set('Cookie', authenticatedCookies!)
      .set('Authorization', `Bearer ${authenticatedBody.access_token}`)
      .send();

    console.log(response.body);

    expect(response.statusCode).toBe(204);

    const cookies = response.get('Set-Cookie');
    expect(cookies![0]).toContain('Expires=Thu, 01 Jan 1970 00:00:00 GMT');

    const sessionOnDatabase = await prisma.session.findMany({
      where: { userId: user.id.toString() },
    });
    expect(sessionOnDatabase).toHaveLength(0);
  });
});
