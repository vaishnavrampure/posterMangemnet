import { createPermissions, createRoles } from './permissionsUtils.js';
import User from '../models/userModel.js'

export const setupRolesAndPermissions = async (userConfig) => {
  try {
    const permissions = await createPermissions();
    const roles = await createRoles(permissions);

   // console.log('Roles:', roles); 

    const userRole = userConfig.role;
   // console.log('User Role from Config:', userRole); 

    const assignedRole = roles[userRole] ? roles[userRole].name : null;

    //console.log('Assigned Role:', assignedRole);

    const user = await User.create({
      username: userConfig.username,
      password: userConfig.password,
      roles: assignedRole ? [assignedRole] : [],
    });

    //console.log('Created User:', user); 
    return { message: 'Setup completed', user };
  } catch (error) {
    console.error('Error setting up roles and permissions', error);
    throw new Error('Setup failed');
  }
};
