import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: any;
}
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    if (!requiredRoles) {
      return true; // No role restriction
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new ForbiddenException('Access Denied: No Token Provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Decode JWT token
      const decodedToken = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      const userId = decodedToken.id; // Extract user ID from token

      // Fetch user's role from Prisma database
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      if (!user) {
        throw new ForbiddenException('User not found');
      }
      const data={
        id:decodedToken.id,
        email:decodedToken.email,
        role:user.role
      }
      request.user = data;
      return requiredRoles.includes(user.role);
    } catch (error) {
      console.error(error);
      throw new ForbiddenException('Access Denied: Invalid Token');
    }
  }
}
