const router = require("express").Router();
const passport = require("passport");

router.use("/", require("./swagger"));



router.use("/users", require("./users"));
router.use("/cars", require("./cars"));
router.use("/stores", require("./stores"));
router.use("/repair", require("./repair"));

router.get("/login", passport.authenticate("github"), (req, res) => {});

router.get("/logout", function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect("/");
    });
});

module.exports = router;