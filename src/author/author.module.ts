import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../src/database/database.module';
import { authorProviders } from './author.providers';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthorController],
  providers: [AuthorService, ...authorProviders],
})
export class AuthorModule {}
