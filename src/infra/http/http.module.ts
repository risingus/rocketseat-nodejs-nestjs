import { Module } from '@nestjs/common';
import { CreateAccountControler } from './controllers/create-account.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { FetchRecentQuestionController } from './controllers/fetch-recent-question-controller';
import { DatabaseModule } from '../database/database.module';


@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [
    CreateAccountControler,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionController
  ],
})


export class HttpModule { }