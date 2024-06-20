import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { NotificationFactory } from 'test/factories/make-notification';
import { StudentFactory } from 'test/factories/make-student';

describe('Read notification (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let notificationFactory: NotificationFactory


  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, NotificationFactory, PrismaService]
    }).compile();

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    notificationFactory = moduleRef.get(NotificationFactory)

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService)

    await app.init();
  });


  test('[PATCH] /notifications/:notificationId/read', async () => {
    const user = await studentFactory.makePrismaStudent({ name: 'John Doe' })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const notification = await notificationFactory.makePrismaNotification({ recipientId: user.id })
    const notificationId = notification.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const notificationOnDataBase = await prisma.notification.findFirst({
      where: {
        recipientId: user.id.toString()
      }
    })

    expect(notificationOnDataBase?.readAt).not.toBeNull()
  })
})