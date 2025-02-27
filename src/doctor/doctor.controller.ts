import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/user-type.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Controller('v1/doctor')
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Post('create')
  @Roles('ADMIN', 'DOCTOR')
  @UseGuards(RoleGuard)
  async create(@Body() dto: CreateDoctorDto) {
    return this.doctorService.create(dto);
  }

  @Get('all')
  @Roles('ADMIN', 'DOCTOR')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAll() {
    return this.doctorService.getAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DOCTOR', 'PATIENT')
  @UseGuards(RoleGuard)
  getDoctorDetails(@Param('id') id: string) {
    return this.doctorService.getDoctorById(id);
  }

  @Put(':id')
  @Roles('DOCTOR', 'ADMIN')
  @UseGuards(RoleGuard)
  updateDoctorProfile(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorService.updateDoctor(id, updateDoctorDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  deleteDoctorProfile(@Param('id') id: string) {
    return this.doctorService.deleteDoctor(id);
  }
}
