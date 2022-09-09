import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLE_KEY } from 'src/decorators/role.decorator';
import { RequestWithUser } from '../types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<string>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole || requiredRole.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest() as RequestWithUser;
    const userRole = user.role;
    
    if(userRole === Role.ADMIN) {
      return true;
    }

    return userRole === Role.LEADER && requiredRole !== Role.ADMIN;
  }
}