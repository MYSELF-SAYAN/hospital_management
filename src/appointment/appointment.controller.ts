import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleGuard } from 'src/guards/user-type.guard';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto';

@Controller('v1/appointment')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}
  @Post()
  @Roles('PATIENT')
  @UseGuards(RoleGuard)
  createAppointment(@Body() dto: CreateAppointmentDto, @Req() req) {
    const id = req.user.id;
    return this.appointmentService.createAppointment(id, dto);
  }
  @Get()
  @Roles('ADMIN', 'DOCTOR', 'PATIENT') // Allow Admin, Doctor, or Patient
  @UseGuards(RoleGuard)
  getAppointments(@Req() req) {
    return this.appointmentService.getAppointments(req.user);
  }
  @Get(':id')
  @Roles('ADMIN', 'DOCTOR', 'PATIENT') // Allow Admin, Doctor, or Patient
  @UseGuards(RoleGuard)
  async getAppointmentById(@Param('id') id: string, @Req() req) {
    return this.appointmentService.getAppointmentById(id, req.user);
  }
  @Put(':id')
  @Roles('ADMIN', 'DOCTOR', 'PATIENT') // Access allowed for Admin, Doctor, and Patient
  @UseGuards(RoleGuard)
  async updateAppointment(
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentDto,
    @Req() req
  ) {
    return this.appointmentService.updateAppointment(id, dto, req.user);
  }
}
