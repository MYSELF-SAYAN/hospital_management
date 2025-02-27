import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleGuard } from 'src/guards/user-type.guard';
import { CreatePatientDto, UpdatePatientDto } from './dto';

@Controller('v1/patient')
export class PatientController {
  constructor(private patientService: PatientService) {}
  @Post('create')
  @Roles('ADMIN', 'PATIENT')
  @UseGuards(RoleGuard)
  async create(@Body() dto: CreatePatientDto) {
    return this.patientService.create(dto);
  }
  @Get('all')
  @Roles('ADMIN', 'PATIENT')
  @UseGuards(RoleGuard)
  async getAll() {
    return this.patientService.getAll();
  }
  @Get(':id')
  @Roles('ADMIN', 'PATIENT')
  @UseGuards(RoleGuard)
  getPatientDetails(@Param('id') id: string) {
    return this.patientService.getPatientById(id);
  }
  @Put(':id')
  @Roles('ADMIN', 'PATIENT')
  @UseGuards(RoleGuard)
  updatePatientProfile(@Param('id') id: string, @Body() dto:UpdatePatientDto) {
      return this.patientService.updatePatient(id, dto);
  }
   @Delete(':id')
  @Roles('ADMIN', 'PATIENT')
  @UseGuards(RoleGuard)
  deletePatientProfile(@Param('id') id: string) {
    return this.patientService.deletePatient(id);
  }

}
