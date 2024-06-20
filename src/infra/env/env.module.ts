import { Injectable, Module } from '@nestjs/common';
import { EnvService } from './env.service';

@Module({
  providers: [
    EnvService
  ],
  exports: [
    EnvService
  ]
})


@Injectable()
export class EnvModule { }