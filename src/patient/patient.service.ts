import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePatientDto, UpdatePatientDto } from './dto';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreatePatientDto) {
    const { userId } = dto;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const res = await this.prisma.patient.create({
      data: { userId: userId, medicalHistory: {} },
    });
    return { message: 'Patient created successfully', data: res };
  }
  async getAll() {
    const res = await this.prisma.patient.findMany();
    return res;
  }
  async getPatientById(id: string) {
    const res = await this.prisma.patient.findUnique({ where: { id } });
    if (!res) {
      throw new NotFoundException('Patient not found');
    }
    return res;
  }
  async updatePatient(id: string, dto: UpdatePatientDto) {
    const { medicalHistory } = dto;
    const res = await this.prisma.patient.update({
      where: { id },
      data: { medicalHistory: JSON.stringify(medicalHistory) },
    });
    return { message: 'Patient updated successfully', data: res };
  }
  async deletePatient(id: string) {
    const res = await this.prisma.patient.delete({ where: { id } });
    return { message: 'Patient deleted successfully', data: res };
  }
}
