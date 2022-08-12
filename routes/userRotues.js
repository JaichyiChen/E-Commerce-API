const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controller/userController");
//middleware for checking if user is authentiacted, not for admin
const {
  authenticateUser,
  authorizePermission,
} = require("../middleware/authentication");
//authenticate user then authorize
//now we're invoking authorizePermission function as soon as we hit this route, authorizePermission will be invoked and params will be passed in
// express will throw error and require a callback, now we modifying authorizePermission so that it will return afunction
router
  .route("/")
  .get(authenticateUser, authorizePermission("admin"), getAllUsers);

router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
