export const checkPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    const userPermissions = req.session.permissions || [];
    const hasPermission = requiredPermissions.some(permission =>
      userPermissions.includes(permission)
    );
    console.log(hasPermission);

    if (hasPermission) {
      return next();
    } else {
      return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
    }
  };
};
