// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

module.exports = function (app) {
	app.get("/", function (req, res) {
		// If the user already has an account send them to the members page
		res.sendFile(path.join(__dirname, "../public/index.html"));
	});
};
