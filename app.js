// get variables to work with
// create classe
//Write main function

//**************************************************************************************
// Store class: Handle storage
class Store {
  static getId() {
    let id = JSON.parse(localStorage.cards).length; // get the number of item in cards of localstorage and put it in id
    id += 1;
    return id;
  }

  static getCards() {
    let cards; // create container for the data from the local storage
    if (localStorage.getItem("cards") === null) {
      cards = [];
    } else {
      cards = JSON.parse(localStorage.getItem("cards")); //load local storage to cards as array
    }

    return cards;
  }
  static addCard(card) {
    const cards = Store.getCards(); //fetch data from local storage and put it in cards as array
    cards.push(card); //update it with a card
    localStorage.setItem("cards", JSON.stringify(cards)); //sent it back to local storage
  }

  static removeCard(id) {
    const cards = Store.getCards(); //Load data from storage to card
    cards.forEach((card, i) => {
      // find card with this Id and
      if (card.id === id) {
        cards.splice(i, 1); //delete/remove it
      }
    });
    localStorage.setItem("cards", JSON.stringify(cards)); //put cards back to localStorage in string format
  }
}

// flash card class for manufacturing cards
class Card {
  constructor(question, answer) {
    this.id = Store.getId();
    this.question = question;
    this.answer = answer;
  }
}
// Ui class (handle task)
class UI {
  static displayCards() {
    const cards = Store.getCards();
    cards.forEach(card => UI.addCardToList(card));
  }
  static addCardToList(card) {
    const display = document.querySelector(".display");
    const article = document.createElement("article");

    article.setAttribute("class", "display-fash-card");
    article.innerHTML = `
     <h1 class='flash-card-question'>${card.question}</h1>
     <p class='flash-card-answer'>${card.answer}</p>
     <p class='flash-card-id'>${card.id}</p>
     <button type='button' class='click-btn'><label class='delete'>Remove</label></button>
    `;
    display.appendChild(article);
  }
  static deleteCard(label) {
    // Delete an article
    if (label.classList.contains("delete")) {
      label.parentElement.parentElement.remove();
      console.log(this);
      this.showAlert("Card removed", "removed");
    }
  }
  static showAlert(message, className) {
    //<body><header><div>hi whatup</div></header><header><main></body>
    // const div = document.createElement("div");
    const div = document.createElement("div");

    div.className = `alert alert-${className}`;
    div.innerText = message;

    const body = document.querySelector(".display");
    const main = document.querySelector(".display-fash-card");
    body.insertBefore(div, main); //u can use showInfo.insertBefore(what, beforewhat)
    setTimeout(() => document.querySelector(".alert").remove(), 1000); //Vanish in 1 seconds
  }
  static clearfield() {
    document.querySelector("#question").value = " ";
    document.querySelector("#answer").value = " ";
  }
}

// Event : to display cards
document.addEventListener("DOMContentLoaded", UI.displayCards);

// Event: to add a flash card
const form = document.querySelector("#card-form");
form.addEventListener("submit", event => {
  event.preventDefault(); // Prevent default event: preventing actuall submit
  // gnerate id

  // Get form value
  const question = document.querySelector("#question").value;
  const answer = document.querySelector("#answer").value;

  // Validate
  if (question === " " || answer === " ") {
    UI.showAlert("please fill in the empty fields", "danger");
    UI.clearfield();
  } else {
    const card = new Card(question, answer); // Create a card:  (instantiate)
    console.log(card); //deburging
    UI.addCardToList(card); // Add card .--> to ui
    Store.addCard(card); // Add card .--> to local storage
    UI.clearfield(); // Clears input fields
    UI.showAlert("Card created", "success"); // Display that it is succesfull
  }
});

// Event: to remove a flash card
const cardsDisplay = document.querySelector(".display"); //select the display part of UI
cardsDisplay.addEventListener("click", event => {
  UI.deleteCard(event.target); // Removed from display UI
  console.log(
    "this is the id",
    event.target.parentElement.previousElementSibling.textContent
  );
  Store.removeCard(
    Number.parseInt(
      event.target.parentElement.previousElementSibling.textContent
    )
  ); //Remove From local storage
}); //listen for click event
