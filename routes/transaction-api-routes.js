const db = require("../models");

module.exports = (app) => {
	// get all transactions
	app.get("/api/transactions", async (req, res) => {
		try {
			const allTransactions = await db.Transaction.findAll();
			res.json(allTransactions);
		} catch (err) {
			throw new Error("Unable to get all transaction data.");
		}
	});
	// create a new transaction
	app.post("/api/transactions", async (req, res) => {
		try {
			console.log("post transaction");
			const newTransaction = await db.Transaction.create(req.body);
			console.log("NEW TRANSACTION", newTransaction);
			res.json(newTransaction);
		} catch (err) {
			res.status(401).json(err);
		}
	});
	
};
