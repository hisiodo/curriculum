import { IsNotEmpty, IsDate } from 'class-validator';

export class UpadateAuthorDto {
  public name: string;

  public lastName: string;

  public birthDate: Date;
}
