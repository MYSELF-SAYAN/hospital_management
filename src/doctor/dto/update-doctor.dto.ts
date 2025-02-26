import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateDoctorDto {
  @IsOptional()
  @IsString()
  specialty?: string;
}
