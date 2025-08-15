const profileModel = require("../models/profileModel");

async function buildProfile(req, res) {
  try {
    const testUserId = 1; // TEMP: testing without login
    const profileData = await profileModel.getProfileByUserId(testUserId);

    if (!profileData) {
      return res.status(404).send("Profile not found.");
    }

    res.render("profile/index", {
      title: "My Profile",
      profile: profileData,
      // flash messages are handled via res.locals.messages
    });
  } catch (error) {
    console.error("Error loading profile:", error);
    res
      .status(500)
      .render("errors/500", { message: error.message, title: "Server Error" });
  }
}

async function updateProfile(req, res) {
  const { first_name, last_name, bio } = req.body;
  const testUserId = 1; // TEMP: testing without login

  // Server-side validation
  const errors = [];
  if (!first_name || first_name.trim() === "")
    errors.push("First name is required.");
  if (!last_name || last_name.trim() === "")
    errors.push("Last name is required.");
  if (errors.length > 0) {
    req.flash("errors", errors);
    return res.redirect("/profile");
  }

  try {
    await profileModel.updateProfile(testUserId, first_name, last_name, bio);
    req.flash("success", "Profile updated successfully.");
    res.redirect("/profile");
  } catch (error) {
    console.error("updateProfile error:", error);
    req.flash("errors", ["Error updating profile."]);
    res.redirect("/profile");
  }
}

module.exports = {
  buildProfile,
  updateProfile,
};
