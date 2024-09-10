import Permission from '../models/permissionModel.js';
import Role from '../models/roleModel.js';

export const createPermissions = async () => {
  const permissions = {};

  const permissionNames = [
    { name: 'manage_users', description: 'Can manage users' },
    { name: 'manage_campaigns', description: 'Can manage campaigns' },
    { name: 'view_contractor_campaigns', description: 'Can view own campaigns' },
    { name: 'upload_images', description: 'Can upload images' },
    { name: 'image_approval', description: 'Can approve images' },
    { name: 'view_completed_campaigns', description: 'Can view completed campaigns' },
    { name: 'manage_client_companies', description: 'Can manage client companies' },
    { name: 'view_all_campaigns', description: 'Can view all campaigns' },
    { name: 'view_pending_campaigns', description: 'Can view pending campaigns' },
    { name: 'view_client_campaigns', description: 'Can view own campaigns' },
    { name: 'get_campaigns', description: 'Get campaigns' },
    { name: 'get_image', description: 'Get Image' },
  ];

  for (const permissionData of permissionNames) {
    let permission = await Permission.findOne({ name: permissionData.name });
    if (!permission) {
      permission = await Permission.create(permissionData);
    }
    permissions[permissionData.name] = permission;
  }

  return permissions;
};

export const createRoles = async (permissions) => {
  const roles = {};

  const roleData = [
    {
      name: 'Employee',
      permissions: [
        permissions['manage_users'].name,
        permissions['manage_campaigns'].name,
        permissions['image_approval'].name,
        permissions['view_completed_campaigns'].name,
        permissions['manage_client_companies'].name,
        permissions['view_all_campaigns'].name,
        permissions['view_pending_campaigns'].name,
      ],
    },
    {
      name: 'Client',
      permissions: [
        permissions['view_client_campaigns'].name,
        permissions['view_completed_campaigns'].name,
        permissions['view_all_campaigns'].name
      ],
    },
    {
      name: 'Contractor',
      permissions: [
        permissions['upload_images'].name,
        permissions['view_contractor_campaigns'].name,
        permissions['view_pending_campaigns'].name,
        permissions['get_campaigns'].name,
        permissions['get_image'].name

      ],
    },
  ];

  for (const role of roleData) {
    let roleDoc = await Role.findOne({ name: role.name });
    if (!roleDoc) {
      roleDoc = await Role.create(role);
    }
    roles[role.name] = roleDoc;
  }

  return roles;
};