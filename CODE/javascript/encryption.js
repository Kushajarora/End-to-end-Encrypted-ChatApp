const form = document.querySelector(".typing-area"),
  incoming_id = form.querySelector(".incoming_id").value,
  inputField = form.querySelector(".input-field"),
  sendBtn = form.querySelector("button"),
  chatBox = document.querySelector(".chat-box");

form.onsubmit = (e) => {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "php/get-single-chat.php", true);
  xhr.onload = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        let data = xhr.response;
        let key = inputField.value;

        var IV = [
          0xb4, 0x6a, 0x02, 0x60, 0xb0, 0xbc, 0x49, 0x22, 0xb5, 0xeb, 0x07,
          0x85, 0xa4, 0xb7, 0xcc, 0x9e,
        ];
        // const twofish = require("./twofish").twofish;
        const twF = twofish(IV);
        if (data !== "No messages are available.$$##@@!!") {
          if (
            twF.decryptCBC(
              twF.stringToByteArray(key),
              twF.stringToByteArray(data)
            ) === ""
          ) {
            errorText.style.display = "block";
            errorText.textContent = "Key is incorrect";
            // e.preventDefault();
            return false;
          }
        }

        localStorage.setItem("key", key);
        // window.location.href = "chat.php";
      }
    }
  };
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send("incoming_id=" + incoming_id);
};

inputField.focus();
inputField.onkeyup = () => {
  if (inputField.value != "") {
    sendBtn.classList.add("active");
  } else {
    sendBtn.classList.remove("active");
  }
};

// sendBtn.onclick = () => {
// let xhr = new XMLHttpRequest();
// xhr.open("POST", "php/get-single-chat.php", true);
// xhr.onload = () => {
//   if (xhr.readyState === XMLHttpRequest.DONE) {
//     if (xhr.status === 200) {
//       let data = xhr.response;
//       let key = inputField.value;

//       var IV = [
//         0xb4, 0x6a, 0x02, 0x60, 0xb0, 0xbc, 0x49, 0x22, 0xb5, 0xeb, 0x07,
//         0x85, 0xa4, 0xb7, 0xcc, 0x9e,
//       ];
//       // const twofish = require("./twofish").twofish;
//       const twF = twofish(IV);
//       if (data !== "No messages are available.$$##@@!!") {
//         if (
//           twF.decryptCBC(
//             twF.stringToByteArray(key),
//             twF.stringToByteArray(data)
//           ) === ""
//         ) {
//           errorText.style.display = "block";
//           errorText.textContent = "Key is incorrect";
//           return;
//         }
//       }

//       localStorage.setItem("key", key);
//       window.location.href = "chat.php";
//     }
//   }
// };
// xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
// xhr.send("incoming_id=" + incoming_id);
// };
