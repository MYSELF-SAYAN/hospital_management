import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}
  async createAppointment(
    id: string,
    createAppointmentDto: CreateAppointmentDto,
  ) {
    const { doctorId, dateTime } = createAppointmentDto;
    const getPatientId = await this.prisma.patient.findUnique({
      where: { userId: id },
      select: { id: true },
    });

    // Check if doctor exists
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Check if patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: getPatientId.id },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Create appointment
    const appointment = await this.prisma.appointment.create({
      data: {
        doctorId: doctorId,
        patientId: getPatientId.id,
        dateTime: new Date(dateTime),
      },
    });

    return appointment;
  }
  async getAppointments(user) {
    if (user.role === 'ADMIN') {
      // Admin gets all appointments
      return this.prisma.appointment.findMany({
        include: {
          doctor: { include: { user: true } },
          patient: { include: { user: true } },
        },
      });
    }

    if (user.role === 'DOCTOR') {
      // Doctor sees their own appointments
      const doctor = await this.prisma.doctor.findUnique({
        where: { userId: user.id },
      });

      if (!doctor) {
        throw new ForbiddenException(
          'Only doctors can access their appointments',
        );
      }

      return this.prisma.appointment.findMany({
        where: { doctorId: doctor.id },
        include: { patient: { include: { user: true } } },
      });
    }

    if (user.role === 'PATIENT') {
      // Patient sees their own appointments
      const patient = await this.prisma.patient.findUnique({
        where: { userId: user.id },
      });

      if (!patient) {
        throw new ForbiddenException(
          'Only patients can access their appointments',
        );
      }

      return this.prisma.appointment.findMany({
        where: { patientId: patient.id },
        include: { doctor: { include: { user: true } } },
      });
    }

    throw new ForbiddenException('Unauthorized access');
  }
  async getAppointmentById(id: string, user) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: { include: { user: true } },
        patient: { include: { user: true } },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Admin can access all appointments
    if (user.role === 'ADMIN') {
      return appointment;
    }

    // Doctor can only access their own appointments
    if (user.role === 'DOCTOR') {
      const doctor = await this.prisma.doctor.findUnique({
        where: { userId: user.id },
      });

      if (!doctor || appointment.doctorId !== doctor.id) {
        throw new ForbiddenException('You can only view your own appointments');
      }
      return appointment;
    }

    // Patient can only access their own appointments
    if (user.role === 'PATIENT') {
      const patient = await this.prisma.patient.findUnique({
        where: { userId: user.id },
      });

      if (!patient || appointment.patientId !== patient.id) {
        throw new ForbiddenException('You can only view your own appointments');
      }
      return appointment;
    }

    throw new ForbiddenException('Unauthorized access');
  }
  async updateAppointment(id: string, dto: UpdateAppointmentDto, user) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: { include: { user: true } },
        patient: { include: { user: true } },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Admin can update any appointment
    if (user.role === 'ADMIN') {
      return this.prisma.appointment.update({
        where: { id },
        data: { ...dto },
      });
    }

    // Doctor can only update their own appointments
    if (user.role === 'DOCTOR') {
      const doctor = await this.prisma.doctor.findUnique({
        where: { userId: user.id },
      });
      if (!doctor || appointment.doctorId !== doctor.id) {
        throw new ForbiddenException(
          'You can only update your own appointments',
        );
      }
    }

    // Patient can only update their own appointments
    if (user.role === 'PATIENT') {
      const patient = await this.prisma.patient.findUnique({
        where: { userId: user.id },
      });
      if (!patient || appointment.patientId !== patient.id) {
        throw new ForbiddenException(
          'You can only update your own appointments',
        );
      }
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { ...dto },
    });
  }
}
