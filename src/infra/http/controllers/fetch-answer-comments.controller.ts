import { BadGatewayException, Controller, Get, Param, Query } from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter';

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

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerCommentsComments: FetchAnswerCommentsUseCase) { }

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.fetchAnswerCommentsComments.execute({ page, answerId })

    if (result.isLeft()) throw new BadGatewayException()

    const comments = result.value.comments.map(CommentWithAuthorPresenter.toHTTP)

    return { comments }


  }
}