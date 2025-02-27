import { Module } from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { AppointmentModule } from './appointment/appointment.module';
@Module({
  imports: [AuthModule, PrismaModule, DoctorModule, PatientModule, AppointmentModule],
  providers: [PrismaService],
})
export class AppModule {}
