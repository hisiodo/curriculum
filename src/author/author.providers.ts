import { Author } from './author.model';

export const authorProviders = [
  {
    provide: 'AUTHOR_REPOSITORY',
    useValue: Author,
  },
];
