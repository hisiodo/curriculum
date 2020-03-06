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
  Put,
  Delete,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { Author } from './author.model';
import { UpadateAuthorDto } from './dto/update-author.dto';

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
  @Get()
  getAuthors(): Promise<Author[]> {
    return this.authorService.getAuthors();
  }

  @Put('/:id')
  updateAuthorById(
    @Param('id', ParseIntPipe) id: number,
    @Body() contentUpdate: UpadateAuthorDto,
  ): Promise<Author> {
    return this.authorService.updateAuthorById(id, contentUpdate);
  }

  @Delete('/:id')
  deleteAuthorById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.authorService.deleteAuthorById(id);
  }
}
