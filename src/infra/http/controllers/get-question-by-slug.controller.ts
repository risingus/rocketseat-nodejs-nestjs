import { BadGatewayException, Controller, Get, Param } from '@nestjs/common';
import { QuestionPresenter } from '../presenters/question-presenter';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';


@Controller('/questions/:slug')
export class GetQuetionBySlugController {
  constructor(private getQuetionBySlug: GetQuestionBySlugUseCase) { }

  @Get()
  async handle(
    @Param('slug') slug: string
  ) {
    const result = await this.getQuetionBySlug.execute({ slug })

    if (result.isLeft()) throw new BadGatewayException()

    const question = QuestionPresenter.toHTTP(result.value.question)

    return { question }
  }
}