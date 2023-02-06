import { Chatroom } from "./chat.js";
import { ChatUI } from "./ui.js";
//DOM
let ul = document.querySelector("ul");
let formMsg = document.querySelector("#form_message");
let inputMsg = document.querySelector("#message");
let formUserName = document.getElementById("form_username");
let inputUsername = document.getElementById("username");
let nav = document.querySelector("nav");
let divMsg = document.getElementById("divMessage");
let divUsername = document.getElementById("divUsername");
let inputColor = document.getElementById("color");
let formColor = document.getElementById("form_color");
let validator = false;

//check localStorage
let username = "anonymus";
if (localStorage.username) {
  localStorage.setItem("username", username);
}
if (localStorage.getItem("room") === null) {
  localStorage.setItem("room", "#general");
}
if (localStorage.color) {
  let color = localStorage.getItem("color");
  document.body.style.backgroundColor = color;
}

//instance
let room = localStorage.getItem("room");
let chatroom = new Chatroom(room, username);
let chatUI = new ChatUI(ul);

//messages on page
chatroom.getChats((data) => {
  if (validator === false) {
    chatUI.templateLI(data, "left");
  } else if (validator === true) {
    chatUI.templateLI(data, "right");
  }
});

// display messages by room
let lastClickedButton;
nav.addEventListener("click", (e) => {
  if (e.target.tagName == "BUTTON") {
    let room = e.target.textContent;
    let button = e.target;
    chatUI.clearUL();
    chatroom.updateRoom(room);

    localStorage.setItem("room", room);
    if (lastClickedButton) {
      lastClickedButton.style.backgroundColor = "";
    }
    // Set the background color of the current clicked button
    button.style.backgroundColor = "rgb(238, 219, 113)";
    // Store the reference to the current clicked button
    lastClickedButton = button;

    chatroom.getChats((data) => {
      chatUI.templateLI(data);
    });
  }
});

//form message
formMsg.addEventListener("submit", (e) => {
  e.preventDefault();
  let message = inputMsg.value;
  if (!message.trim().length == 0) {
    chatroom
      .addChat(message)
      .then(() => formMsg.reset())
      .catch((err) => console.log(err));
  } else {
    divMsg.textContent = "Invalid input";

    setTimeout(() => {
      divMsg.textContent = "";
    }, 1000);
  }
});

//form update username
formUserName.addEventListener("submit", (e) => {
  e.preventDefault();
  let newUsername = inputUsername.value;
  if (validator == false) {
    validator = true;
  } else {
    validator = false;
  }
  localStorage.setItem("validator", validator);

  if (!newUsername.trim().length == 0) {
    chatroom.username = newUsername;
    //alert
    if (localStorage.username != "anonymus") {
      divUsername.textContent = ` Username updated: ${newUsername}`;
    }
    setTimeout(() => {
      divUsername.textContent = "";
    }, 3000);
    clearTimeout();
    formUserName.reset();
  } else {
    divUsername.textContent = "Invalid input";
    setTimeout(() => {
      divUsername.textContent = "";
    }, 1000);
  }
});

// btn update color

formColor.addEventListener("submit", (e) => {
  e.preventDefault();
  let color = inputColor.value;
  localStorage.setItem("color", color);
  setTimeout(() => {
    document.body.style.backgroundColor = color;
  }, 500);
});

// click on bin

ul.addEventListener("click", (e) => {
  if (e.target.tagName == "IMG") {
    let img = e.target;
    let li = img.parentElement;
    console.log(li.id);
    let liMess = document.querySelector("li .message");
    let message = liMess.textContent;
    console.log(message);
    if (chatroom.username != "anonymus") {
      li.remove();
      db.collection("chats")
        .doc()
        .where("message", "==", message)
        .delete()
        .then(() => console.log("Uspesno obrisano"))
        .catch((err) => console.log(err));
    } else {
      li.remove();
    }
  }
});
/*db.collection("customers")
  .doc("cust001")
  .delete()
  .then(() => {
    console.log(`Dokument uspesno izbrisan`);
  })
  .catch((e) => {
    console.log(`Desila se greska: ` + e);
  });
*/
