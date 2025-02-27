import { IsUUID, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  doctorId: string;

  @IsDateString()
  dateTime: string;
}
