import { BadGatewayException, Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';


const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string()
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/questions')
export class CreateQuestionController {
  constructor(
    private createQuestion: CreateQuestionUseCase
  ) { }

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema
  ) {
    const { title, content } = body
    const userId = user.sub

    const result = await this.createQuestion.execute({
        title,
        content,
        authorId: userId,
      attachmentsIds: []
    })

    if (result.isLeft()) throw new BadGatewayException()
  }
}