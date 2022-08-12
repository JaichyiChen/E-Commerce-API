const CustomError = require("../errors");
//if user is trying access other people's info with id then throw error
const checkPermissions = (requestUser, resourceUserId) => {
  //   console.log(requestUser);
  //   console.log(resourceUserId);
  //   console.log(typeof resourceUserId);
  if (requestUser.role === "admin") return;
  else if (requestUser.userId === resourceUserId.toString()) return;
  else {
    throw new CustomError.UnauthorizedError(
      "Not authorized to access this route"
    );
  }
};
module.exports = checkPermissions;
