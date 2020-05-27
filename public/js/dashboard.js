/* eslint-disable indent */
// eslint-disable-next-line no-unused-vars
class Dashboard {

	async getTransactions() {
		try {
			const allTransactions = await $.get("/api/transactions/");
			console.log(allTransactions);
			return allTransactions;
		} catch {
			throw new Error("Cant get all transactions");
		}
	}
}

// export default Dashboard;
