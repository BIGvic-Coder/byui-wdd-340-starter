document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("profileForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    const first = form.first_name.value.trim();
    const last = form.last_name.value.trim();
    const bio = form.bio.value.trim();

    const errs = [];
    if (!first) errs.push("First name is required.");
    if (first.length > 50)
      errs.push("First name must be 50 characters or fewer.");
    if (!last) errs.push("Last name is required.");
    if (last.length > 50)
      errs.push("Last name must be 50 characters or fewer.");
    if (bio.length > 500) errs.push("Bio must be 500 characters or fewer.");

    if (errs.length) {
      e.preventDefault();
      alert(errs.join("\\n"));
    }
  });
});
