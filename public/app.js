const output = document.getElementById("output");

function show(data) {
  output.textContent = JSON.stringify(data, null, 2);
}

async function loadHealth() {
  const res = await fetch("/api/health");
  const data = await res.json();
  show(data);
}

async function getRandom() {
  const res = await fetch("/api/random");
  const data = await res.json();
  show(data);
}

async function sendMessage() {
  const text = document.getElementById("msgInput").value;

  const res = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  const data = await res.json();
  show(data);

  loadMessages();
}

async function loadMessages() {
  const res = await fetch("/api/messages");
  const data = await res.json();

  const container = document.getElementById("messages");
  container.innerHTML = "";

  data.forEach(m => {
    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = `
      <b>${m.text}</b><br/>
      <small>${m.createdAt}</small><br/>
      <button onclick="deleteMsg('${m.id}')">Delete</button>
    `;
    container.appendChild(div);
  });
}

async function deleteMsg(id) {
  await fetch("/api/messages/" + id, { method: "DELETE" });
  loadMessages();
}
