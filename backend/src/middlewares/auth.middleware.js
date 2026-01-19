/**
 * Auth Middleware - Xác thực JWT và phân quyền
 */

const { verifyAccessToken } = require('../utils/jwt.util');
const {
  unauthorizedResponse,
  forbiddenResponse,
} = require('../utils/response.util');
// const { STAFF_ROLES } = require('../config/constants');

/**
 * Authenticate - Verify JWT token
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedResponse(res, 'No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    // Verify token
    const decoded = verifyAccessToken(token);

    // Attach user info to request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      staff_id: decoded.staff_id,
      position: decoded.position,
    };

    console.log(req.user);

    next();
  } catch (error) {
    return unauthorizedResponse(res, error.message);
  }
};

/**
 * Authorize - Check user role
 * Usage: authorize([STAFF_ROLES.ADMIN, STAFF_ROLES.MANAGER])
 */
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return unauthorizedResponse(res, 'Authentication required');
    }

    if (allowedRoles.length === 0) {
      return next();
    }

    if (!allowedRoles.includes(req.user.position)) {
      return forbiddenResponse(
        res,
        'You do not have permission to access this resource'
      );
    }

    next();
  };
};

/**
 * Optional authentication - Không bắt buộc đăng nhập
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);

      req.user = {
        id: decoded.id,
        username: decoded.username,
        staff_id: decoded.staff_id,
        role: decoded.role,
      };
    } catch (error) {
      throw new Error('Invalid token', error);
    }
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
};
