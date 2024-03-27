import { BadGatewayException, Controller, Get, Query } from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { QuestionPresenter } from '../presenters/question-presenter';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(
    z.number().min(1)
  )

const queryValidationPipe = new ZodValidationPipe(
  pageQueryParamSchema
)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions')
export class FetchRecentQuestionController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) { }

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema
  ) {
    const result = await this.fetchRecentQuestions.execute({ page })

    if (result.isLeft()) throw new BadGatewayException()

    const questions = result.value.questions.map(QuestionPresenter.toHTTP)

    return { questions }
  }
}