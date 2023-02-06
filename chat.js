export class Chatroom {
  constructor(r, u) {
    this.room = r;
    this.username = u;
    this.chats = db.collection("chats");
    this.unsub;
  }
  // room
  set room(r) {
    this._room = r;
  }
  get room() {
    return this._room;
  }

  //username
  set username(u) {
    if (u.length > 2 && u.length < 10 && u.trim().length != 0) {
      this._username = u;
      localStorage.setItem("username", u);
    } else {
      alert(`Invalid input for username property`);
    }
  }
  get username() {
    return this._username;
  }
  // update room

  updateRoom(ur) {
    this.room = ur;
    if (this.unsub) {
      this.unsub();
    }
  }

  // method for adding chat
  async addChat(mess) {
    let date = new Date();

    let docChat = {
      message: mess,
      username: this.username,
      room: this.room,
      created_at: firebase.firestore.Timestamp.fromDate(date),
    };
    let response = await this.chats.add(docChat);
    return response;
  }
  

  // callback method which listens changes in database
  getChats(callback) {
    this.unsub = this.chats
      .where("room", "==", this.room)
      .orderBy("created_at")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type == "added") {
            callback(change.doc.data());
          }
        });
      });
  }
}

