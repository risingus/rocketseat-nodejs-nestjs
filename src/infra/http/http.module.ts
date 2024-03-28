import { Module } from '@nestjs/common';
import { CreateAccountControler } from './controllers/create-account.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { FetchRecentQuestionController } from './controllers/fetch-recent-question-controller';
import { DatabaseModule } from '../database/database.module';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { GetQuetionBySlugController } from './controllers/get-question-by-slug.controller';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { EditQuestionController } from './controllers/edit-question.controller';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { DeleteQuestionController } from './controllers/delete-question.controller';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';
import { AnswerQuestionController } from './controllers/answer-question.controller';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';
import { EditAnswerController } from './controllers/edit-answer.controller';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';
import { DeleteAnswerController } from './controllers/delete-answer.controller';
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer';


@Module({
  imports: [
    DatabaseModule,
    CryptographyModule
  ],
  controllers: [
    CreateAccountControler,
    AuthenticateController,
    CreateQuestionController,
    EditQuestionController,
    DeleteQuestionController,
    DeleteAnswerController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchRecentQuestionController,
    GetQuetionBySlugController
  ],
  providers: [
    CreateQuestionUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase
  ]
})


export class HttpModule { }