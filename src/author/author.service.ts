import { Injectable, Inject } from '@nestjs/common';
import { Author } from './author.model';
import { CreateAuthorDto } from './dto/create-author.dto';
import { Repository } from 'sequelize-typescript';

@Injectable()
export class AuthorService {
  constructor(
    @Inject('AUTHOR_REPOSITORY')
    private authorRepository: Repository<Author>,
  ) {}

  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorRepository.create(createAuthorDto);
  }
}
