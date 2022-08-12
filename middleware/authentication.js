const CustomError = require("../errors");
const { isTokenValid } = require("../utils");
//authenticate user and decode the token in the cookie
const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.NotFoundError(`Authentication Failed`);
  }
  try {
    const payload = isTokenValid({ token });
    //alternate syntax const {name, userId, role} = isTokenValid({ token });
    req.user = {
      name: payload.name,
      userId: payload.userId,
      role: payload.role,
    };
    next();
  } catch (error) {
    throw new CustomError.NotFoundError(`Authentication Failed`);
  }
};
// the roles passed in the admin and owner, if the current user trying to access this route is not in the roles, they are not authorized
const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthoized to access this route"
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermission };
