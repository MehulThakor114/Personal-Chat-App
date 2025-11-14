const chatBox = document.getElementById("chatBox");
const input = document.getElementById("messageInput");
const selectedFile = document.getElementById("selectedFile");
let fileInput = document.getElementById("fileInput");
let sendBtn = document.getElementById("sendBtn");

/*let ws = new WebSocket("ws://localhost:8080/connect");*/
let ws = new WebSocket("wss://personal-chatapp.azurewebsites.net/connect");

input.addEventListener('keydown', function(event) {
	if (event.key === 'Enter') {
		event.preventDefault();
		sendMessage();
	}
});

ws.onmessage = (event) => {
	showReceivedMessage(JSON.parse(event.data));
};

ws.onerror = (err) => console.error("WebSocket error:", err);
ws.onclose = () => console.warn("WebSocket connection closed");

async function sendMessage() {
    sendBtn.disabled = true;
    sendBtn.innerText = "Sending...";
	const message = input.value.trim();	
	let fileUrl = undefined;

	if (fileInput.files.length > 0) {
		fileUrl = await uploadFile(fileInput.files[0]);
	}
	
	if (message === "" && !fileUrl) {
		sendBtn.disabled = false;
        sendBtn.innerText = "Send";
		return;
	}
	const messageDiv = document.createElement("div");
	messageDiv.classList.add("message", "user");
	messageDiv.textContent = message;
	chatBox.appendChild(messageDiv);

	if (fileUrl) {
		const fileUrlDiv = document.createElement("div");
		fileUrlDiv.classList.add("message", "user");
		fileUrlDiv.innerHTML = `<a href="${fileUrl}" target="_blank">📄 ${fileInput.files[0].name}</a>`;
		chatBox.appendChild(fileUrlDiv);
	}
	input.value = "";
	selectedFile.innerHTML = '';
	fileInput.value = "";
	
	chatBox.scrollTop = chatBox.scrollHeight;
	let payload = {
		message: message,
		fileUrl: fileUrl
	};
	if (ws.readyState === WebSocket.OPEN) {
		ws.send(JSON.stringify(payload));
	} else {
		ws.addEventListener("open", () => ws.send(message), { once: true });
	}
	sendBtn.disabled = false;
    sendBtn.innerText = "Send";
}
async function uploadFile(file) {
	let form = new FormData();
	form.append("file", file);

	let res = await fetch("/upload", {
		method: "POST",
		body: form
	});

	return res.text(); // returns file URL
}
function clearMessage() {
	chatBox.innerHTML = '';
	selectedFile.innerHTML = '';
	fileInput.value = "";
}

function openFilePicker() {
	document.getElementById("fileInput").click();
}

function showLocalPreview() {
	let file = document.getElementById("fileInput").files[0];
	selectedFile.innerHTML = file.name;

	let previewBox = document.getElementById("previewBox");
	let popup = document.getElementById("previewPopup");
	previewBox.innerHTML = "";

	if (!file) return;

	let url = URL.createObjectURL(file);

	if (file.type.startsWith("image/")) {
		previewBox.innerHTML = `<img src="${url}">`;
	}
	else if (file.type.startsWith("audio/")) {
		previewBox.innerHTML = `<audio controls src="${url}"></audio>`;
	}
	else if (file.type.startsWith("video/")) {
		previewBox.innerHTML = `<video controls src="${url}" width="100%"></video>`;
	}
	else if (file.type === "application/pdf") {
		previewBox.innerHTML = `<embed src="${url}" width="100%" height="100%"></embed>`;
	}
	else {
		previewBox.innerHTML = `<p>📄 ${file.name} (no preview available)</p>`;
	}
	popup.style.display = "flex";
}

function showReceivedMessage(msg) {
	let div = document.createElement("div");
	let message = document.createElement("div");
	div.classList.add("message", "other");
	message.classList.add("message", "other");

	if (msg.fileUrl) {
		let ext = msg.fileUrl.split("_").pop().toLowerCase();

		/*if (["png", "jpg", "jpeg", "gif"].includes(ext)) {
			div.innerHTML = `<br><img src="${msg.fileUrl}" width="150">`;
		}
		else if (["m4a", "mp3", "wav"].includes(ext)) {
			div.innerHTML = `<br><audio controls src="${msg.fileUrl}"></audio>`;
		}
		else if (["mp4", "mov", "webm"].includes(ext)) {
			div.innerHTML = `<br><video controls width="200" src="${msg.fileUrl}"></video>`;
		}
		else if (ext === "pdf") {
			div.innerHTML = `<br><embed src="${msg.fileUrl}" width="200" height="200"></embed>`;
		}
		else {*/
			div.innerHTML = `<a href="${msg.fileUrl}" target="_blank">📄 ${ext}</a>`;
		/*}*/
		chatBox.appendChild(div);
	}
	if (msg.message) {
		message.innerHTML = `${msg.message}`;
		chatBox.appendChild(message);
	}

}

function hidePopup() {
	document.getElementById("previewPopup").style.display = "none";
}

function closePopup(event) {
	if (event.target.id === "previewPopup") {
		hidePopup();
	}
}