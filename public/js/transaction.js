const dashB = new Dashboard();

$(document).ready(function () {
	const $transactionForm = $("form.transaction");
	const $typeSelect = $("#typeSelect" )
	const $amountInput = $("#amountInput");
	const $noteInput = $("#noteInput");
	const $cardContainer = $(".cardContainer");

	
	async function addTransaction(type, amount, note) {
		try {
			const newTransaction = await $.post("/api/transactions", {
				type: type,
				amount: amount,
				note: note,
			});
			console.log(newTransaction);
			// go back to dashboard
			console.log("transaction added");
		} catch (err) {
			console.log(err);
		}
	}

	// add function to get transaction
	async function renderTransactions() {
		$cardContainer.empty();


		const allTransactions = await dashB.getTransactions();
		console.log("ALL TRANS", allTransactions);
		allTransactions.forEach((transaction) => {
			const cardContainer = $("<div>");
			cardContainer.addClass("card");
			cardContainer.addClass("text-center");
			cardContainer.attr("data-id", transaction.id);

			const cardHeader = $("<div>");
			cardHeader.addClass("card-header");

			const flexHeader = $("<div>");
			flexHeader.addClass("flexHeader");

			const spanType = $("<span>");
			spanType.text(transaction.type);

			const numberWithCommas = transaction.amount
				.toString()
				.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			const spanAmount = $("<span>");
			spanAmount.addClass(transaction.type);
			spanAmount.text("$");
			
			const spanDollarSign = $("<span>");
			spanDollarSign.text(numberWithCommas); 
			
			const bodyContainer = $("<div>");
			bodyContainer.addClass("card-body");

			const noteP = $("<p>");
			noteP.addClass("card-text");
			noteP.text(transaction.note);

			const footContainer = $("<div>")
			footContainer.addClass("card-footer");
			footContainer.addClass("text-muted");
			footContainer.text(transaction.createdAt);

			//flex header
			spanAmount.append(spanDollarSign);
			flexHeader.append(spanType);
			flexHeader.append(spanAmount);
			
			//body
			bodyContainer.append(noteP);
			
			//footer
			//pass

			//cardHeader			
			cardHeader.append(flexHeader);

			cardContainer.append(cardHeader);
			cardContainer.append(bodyContainer);
			cardContainer.append(footContainer);

			$cardContainer.append(cardContainer);
		
		});
	}

	function init() {
		renderTransactions();
	}

	init();

	$transactionForm.on("submit", async function (event) {
		event.preventDefault();

		const transactionData = {
			type: $typeSelect.val().trim(),
			amount: $amountInput.val().trim(),
			note: $noteInput.val().trim()
		};
		console.log("TRANSACTION DATA", transactionData);
		const { type, amount, note } = transactionData;
		
		if (type === "Purpose" || !amount) {
			return;
		}
		addTransaction(type, amount, note);
		$('#typeSelect option').prop('selected', function() {
			return this.defaultSelected;
		});
		$amountInput.val("");
		$noteInput.val("");
		await renderTransactions();
		location.reload();
		setTimeout(function(){ console.log(refreshed) }, 1);

		const $formModal = $("#formModal");
		
        $formModal.modal("hide");
	});
});
