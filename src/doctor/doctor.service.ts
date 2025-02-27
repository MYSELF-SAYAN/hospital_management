import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDoctorDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    private prisma: PrismaService,
  ) {}
  async create(dto: CreateDoctorDto) {
    const { userId, specialty } = dto;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.prisma.doctor.create({
      data: {
        userId,
        specialty,
        schedule: {},
      },
    });
  }
  async getAll() {
    return await this.prisma.doctor.findMany();
  }
  async getDoctorById(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      select: { id: true, userId: true, specialty: true },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    return doctor;
  }
  async updateDoctor(id: string, updateDoctorDto: UpdateDoctorDto) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const updatedDoctor = await this.prisma.doctor.update({
      where: { id },
      data: updateDoctorDto,
    });

    return { message: 'Doctor updated successfully', data: updatedDoctor };
  }
  async deleteDoctor(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    await this.prisma.doctor.delete({
      where: { id },
    });

    return { message: 'Doctor deleted successfully' };
  }
}
