import { Chatroom } from "./chat.js";
import { ChatUI } from "./ui.js";
//DOM
let ul = document.querySelector("ul");
let formMsg = document.querySelector("#form_message");
let inputMsg = document.querySelector("#message");
let formUserName = document.getElementById("form_username");
let inputUsername = document.getElementById("username");
let nav = document.querySelector("nav");
let navBtns = document.querySelectorAll("nav button");
let divMsg = document.getElementById("divMessage");
let divUsername = document.getElementById("divUsername");
let inputColor = document.getElementById("color");
let formColor = document.getElementById("form_color");
let validator = false;

//check localStorage
let username = "anonymus";
if (localStorage.username) {
  username = localStorage.getItem("username");
}
let room = "#general";
if (localStorage.room) {
  room = localStorage.getItem("room");
}
if (localStorage.color) {
  let color = localStorage.getItem("color");
  document.body.style.backgroundColor = color;
}
// current room
navBtns.forEach((btn) => {
  if (btn.textContent == room) {
    btn.style.backgroundColor = "rgba(84, 58, 183, 1)";
  } else {
    btn.style.backgroundColor = "";
  }
});

//instance
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

nav.addEventListener("click", (e) => {
  if (e.target.tagName == "BUTTON") {
    let room = e.target.textContent;
    chatroom.updateRoom(room);
    localStorage.setItem("room", room);
    chatUI.clearUL();

    //btn active background color
    navBtns.forEach((btn) => {
      if (btn.textContent == room) {
        btn.style.backgroundColor = "rgba(84, 58, 183, 1)";
      } else {
        btn.style.backgroundColor = "";
      }
    });

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
    if (confirm("Are you sure you want to delete the message?") === true) {
      let img = e.target;
      let li = img.parentElement;
      let currentUsername = li.querySelector(".username").textContent;
      currentUsername = currentUsername.substring(
        0,
        currentUsername.length - 2
      );
      let id = li.id;

      if (chatroom.username == currentUsername) {
        li.remove();
        chatroom
          .deleteChat(id)
          .then(() => console.log("Uspesno obrisano"))
          .catch((err) => console.log(err));
      } else {
        li.remove();
      }
    }
  }
});

//click on icon user

let iconUser = document.querySelector(".user");
let formPopup = document.querySelector(".formPopup");
let closePopup = document.querySelector(".close");
let blurDiv = document.getElementById("blur");

iconUser.addEventListener("click", () => {
  blurDiv.classList.add("blurDiv");
  formPopup.style.display = "block";
});

closePopup.addEventListener("click", () => {
  formPopup.style.display = "none";
});
