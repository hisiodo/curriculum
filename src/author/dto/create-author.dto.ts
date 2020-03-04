import { IsNotEmpty, IsDate } from 'class-validator';

export class CreateAuthorDto {
  id?: number;

  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public lastName: string;

  @IsNotEmpty()
  public birthDate: Date;
}
