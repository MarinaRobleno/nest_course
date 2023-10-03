import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the roles from the metadata
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
   

    // Get the user from the request object
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Check if the user has the role
    return matchRoles(roles, user.role);
  }
}

function matchRoles(roles, userRoles): boolean {
  if (!roles.includes(userRoles)) {
    return false;
  } else {
    return true;
  }
}
