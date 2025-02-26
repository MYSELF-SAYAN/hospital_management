import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDoctorDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  specialty: string;
}
