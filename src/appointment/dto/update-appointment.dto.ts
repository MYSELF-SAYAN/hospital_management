import { IsOptional, IsEnum, IsISO8601 } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsISO8601()
  dateTime?: string; // New appointment date/time (ISO format)

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus; // Change status (SCHEDULED, COMPLETED, CANCELED)
}
