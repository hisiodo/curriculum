import { AuthorService } from './author.service';
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { Author } from './author.model';

@Controller('authors')
export class AuthorController {
  constructor(private authorService: AuthorService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createAuthor(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorService.createAuthor(createAuthorDto);
  }

  @Get('/:id')
  getAuthorByid(@Param('id', ParseIntPipe) id: number): Promise<Author> {
    return this.authorService.getAuthorById(id);
  }
}
