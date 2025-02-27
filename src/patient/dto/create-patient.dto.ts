import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePatientDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

}