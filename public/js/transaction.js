// const dashB = new Dashboard();

let request = window.indexedDB.open("transactionsDatabase", 1),
  db,
  tx,
  store,
  index,
  typeIndex,
  amountIndex,
  noteIdex,
  createdIndex;

let transactions;

request.onupgradeneeded = function (e) {
  let db = request.result,
    store = db.createObjectStore("transactionsStore", { autoIncrement: true });
  typeIndex = store.createIndex("typeIndex", "type");
  amountIndex = store.createIndex("amountIndex", "amount");
  noteIndex = store.createIndex("noteIndex", "note");
  createdIndex = store.createIndex("createdAtIndex", "createdAt");
};

request.onerror = function (e) {
  console.log("error creating indexDB");
};

request.onsuccess = function (e) {
  console.log("test");
  db = request.result;
  tx = db.transaction("transactionsStore", "readwrite");
  store = tx.objectStore("transactionsStore");

  tx.oncomplete = function () {
    db.close();
  };
};

$(document).ready(function () {
  const $transactionForm = $("form.transaction");
  const $typeSelect = $("#typeSelect");
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
    let allTransactions;
    console.log("IM IN OFFLINE TRANSCATIONDS MODE :DDD");
    let request = window.indexedDB.open("transactionsDatabase", 1);
    request.onsuccess = function (e) {
      console.log("entered success");
      db = request.result;
      tx = db.transaction("transactionsStore", "readwrite");
      store = tx.objectStore("transactionsStore");

      allTransactionsRequest = store.getAll();

      allTransactionsRequest.onsuccess = () => {
        const all = allTransactionsRequest.result;
        all.forEach((transaction) => {
          const cardContainer = $("<div>");
          cardContainer.addClass("card");
          cardContainer.addClass("text-center");
          // cardContainer.attr("data-id", transaction.id);

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

          const footContainer = $("<div>");
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
        console.log("scucess!");
      };

      allTransactionsRequest.onerror = function () {
        console.log("faileledd");
      };

      tx.oncomplete = function () {
        db.close();
      };
      console.log("succesfully added");
    };

    request.onerror = function (e) {
      console.log("error adding");
    };
    console.log(request);
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
      note: $noteInput.val().trim(),
    };
    console.log("TRANSACTION DATA", transactionData);
    const { type, amount, note } = transactionData;

    console.log(window.navigator.onLine);
    console.log("offline");
    // Adds data to our objectStore
    let request = window.indexedDB.open("transactionsDatabase", 1);

    request.onsuccess = function (e) {
      console.log("entered success");
      db = request.result;
      tx = db.transaction("transactionsStore", "readwrite");
      store = tx.objectStore("transactionsStore");

      store.add({ type: type, amount: amount, note: note, createdAt: "now" });

      tx.oncomplete = function () {
        db.close();
      };
      console.log("succesfully added");
    };

    request.onerror = function (e) {
      console.log("error adding");
    };

    $("#typeSelect option").prop("selected", function () {
      return this.defaultSelected;
    });

    $amountInput.val("");
    $noteInput.val("");

    await renderTransactions();
    // location.reload();
    setTimeout(function () {
      console.log("refreshed");
    }, 1);

    const $formModal = $("#formModal");

    $formModal.modal("hide");
  });
});
