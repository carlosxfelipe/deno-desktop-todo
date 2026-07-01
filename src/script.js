const STORAGE_KEY = "deno-todos";

let filter = "all";
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const listEl = document.getElementById("list");
const countEl = document.getElementById("count");
const input = document.getElementById("newTodo");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearDone");

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function render() {
  const visible = todos.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.done : t.done,
  );

  if (visible.length === 0) {
    listEl.innerHTML = `<p class="empty">Nenhuma tarefa aqui.</p>`;
  } else {
    listEl.innerHTML = "";
    visible.forEach((t) => {
      const li = document.createElement("li");
      if (t.done) li.classList.add("done");

      li.innerHTML = `
        <input type="checkbox" ${t.done ? "checked" : ""} data-id="${t.id}" />
        <span>${escHtml(t.text)}</span>
        <button class="del" data-id="${t.id}" title="Remover">✕</button>
      `;
      listEl.appendChild(li);
    });
  }

  const pending = todos.filter((t) => !t.done).length;
  countEl.textContent = `${pending} pendente${pending !== 1 ? "s" : ""}`;
}

function escHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function addTodo() {
  const text = input.value.trim();
  if (!text) return;
  todos.unshift({ id: Date.now(), text, done: false });
  input.value = "";
  save();
  render();
}

addBtn.addEventListener("click", addTodo);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});

listEl.addEventListener("change", (e) => {
  if (e.target.type !== "checkbox") return;
  const id = Number(e.target.dataset.id);
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.done = e.target.checked;
    save();
    render();
  }
});

listEl.addEventListener("click", (e) => {
  if (!e.target.classList.contains("del")) return;
  const id = Number(e.target.dataset.id);
  todos = todos.filter((t) => t.id !== id);
  save();
  render();
});

document.querySelectorAll(".filters button").forEach((btn) => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    document
      .querySelectorAll(".filters button")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    render();
  });
});

clearBtn.addEventListener("click", () => {
  todos = todos.filter((t) => !t.done);
  save();
  render();
});

render();
