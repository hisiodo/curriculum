import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Author } from './author.model';
import { CreateAuthorDto } from './dto/create-author.dto';
import { Repository } from 'sequelize-typescript';
import { UpadateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorService {
  constructor(
    @Inject('AUTHOR_REPOSITORY')
    private authorRepository: Repository<Author>,
  ) {}

  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorRepository.create(createAuthorDto);
  }

  async getAuthorById(id: number): Promise<Author> {
    const authorExist = await this.authorRepository.findByPk(id);

    if (!authorExist) {
      throw new NotFoundException(`The author with id: ${id} doesn't exist`);
    }

    return authorExist;
  }

  async getAuthors(): Promise<Author[]> {
    const authors = await this.authorRepository.findAll();
    return authors;
  }

  async updateAuthorById(
    id: number,
    contentUpdate: UpadateAuthorDto,
  ): Promise<Author> {
    const authorExist = await this.authorRepository.findByPk(id);

    if (!authorExist) {
      throw new NotFoundException(`The author with id: ${id} doesn't exist`);
    }

    await authorExist.update(contentUpdate);

    return authorExist;
  }

  async deleteAuthorById(id: number): Promise<void> {
    const authorExist = await this.authorRepository.findByPk(id);
    if (!authorExist) {
      throw new NotFoundException(`The author with id: ${id} doesn't exist`);
    }

    await authorExist.destroy();
  }
}
