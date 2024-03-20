import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs';
import request from 'supertest'

describe('Authenticate (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService)

    await app.init();
  });


  test('[POST] /sessions', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456'
    }

    await prisma.user.create({
      data: {
        name: newUser.name,
        email: newUser.email,
        password: await hash(newUser.password, 8),
      }
    })

    const response = await request(app.getHttpServer()).post('/sessions').send(newUser)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: newUser.email
      }
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String)
    })
    expect(userOnDatabase).toBeTruthy()
  })
})