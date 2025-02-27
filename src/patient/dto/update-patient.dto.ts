import { IsOptional, IsString, IsEmail, IsJSON } from 'class-validator';

export class UpdatePatientDto {
  @IsOptional()
  @IsJSON()
  medicalHistory: JSON;
}
