const form = document.querySelector(".typing-area"),
  incoming_id = form.querySelector(".incoming_id").value,
  inputField = form.querySelector(".input-field"),
  sendBtn = form.querySelector("button"),
  chatBox = document.querySelector(".chat-box"),
  //   twofish = require("./twofish").twofish,
  twF = twofish([
    0xb4, 0x6a, 0x02, 0x60, 0xb0, 0xbc, 0x49, 0x22, 0xb5, 0xeb, 0x07, 0x85,
    0xa4, 0xb7, 0xcc, 0x9e,
  ]),
  key = localStorage.getItem("key"),
  noOfMessages = 0;

form.onsubmit = (e) => {
  e.preventDefault();
};

inputField.focus();
inputField.onkeyup = () => {
  if (inputField.value != "") {
    sendBtn.classList.add("active");
  } else {
    sendBtn.classList.remove("active");
  }
};

sendBtn.onclick = () => {
  inputField.value = twF.encryptCBC(
    twF.stringToByteArray(key),
    twF.stringToByteArray(inputField.value)
  );
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "php/insert-chat.php", true);
  xhr.onload = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        inputField.value = "";
        scrollToBottom();
      }
    }
  };
  let formData = new FormData(form);
  xhr.send(formData);
};
chatBox.onmouseenter = () => {
  chatBox.classList.add("active");
};

chatBox.onmouseleave = () => {
  chatBox.classList.remove("active");
};

setInterval(() => {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "php/get-chat.php", true);
  xhr.onload = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        let data = xhr.response;
        data = JSON.parse(data);
        if (
          data[0]["msg"] ===
          "No messages are available. Once you send message they will appear here."
        ) {
          chatBox.innerHTML =
            '<div class="text">No messages are available. Once you send message they will appear here.</div>';
          return;
        }
        chatBox.innerHTML = "";
        data.map((value) => {
          //   console.log(value["msg"].split(","));
          if (value["msg"])
            if (value["outgoing"]) {
              chatBox.innerHTML +=
                '<div class="chat outgoing"> \
                    <div class="details"> \
                        <p>' +
                twF.byteArrayToString(
                  twF.decryptCBC(
                    twF.stringToByteArray(key),
                    value["msg"].split(",")
                  )
                ) +
                "</p> \
                    </div> \
                </div>";
            } else {
              chatBox.innerHTML +=
                '<div class="chat incoming"> \
                                <img src="php/images/' +
                value["img"] +
                '" alt=""> \
                                <div class="details"> \
                                    <p>' +
                twF.byteArrayToString(
                  twF.decryptCBC(
                    twF.stringToByteArray(key),
                    value["msg"].split(",")
                  )
                ) +
                "</p> \
                                </div> \
                                </div>";
            }
        });
        // chatBox.innerHTML = data;
        if (!chatBox.classList.contains("active")) {
          scrollToBottom();
        }
      }
    }
  };
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send("incoming_id=" + incoming_id);
}, 500);

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}
