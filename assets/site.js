const theme = document.querySelector("[data-theme-toggle]");
theme?.addEventListener("click", () => {
  const dark =
    document.body.dataset.theme === "dark" ||
    (!document.body.dataset.theme &&
      matchMedia("(prefers-color-scheme:dark)").matches);
  document.body.dataset.theme = dark ? "light" : "dark";
  try {
    localStorage.setItem("theme", document.body.dataset.theme);
  } catch {}
});
try {
  const value = localStorage.getItem("theme");
  if (value === "light" || value === "dark")
    document.body.dataset.theme = value;
} catch {}
const examples = {
  Notes: [
    "A place to think",
    ["Project notes", "Ideas worth keeping", "Links between your work"],
  ],
  Tasks: [
    "A little more clarity",
    [
      "Plan the next small step",
      "Group tasks your way",
      "Keep subtasks together",
    ],
  ],
  Data: [
    "Structure, when you need it",
    [
      "Typed CSDB columns",
      "Forms, defaults and dropdowns",
      "Reusable templates and imports",
    ],
  ],
};
for (const button of document.querySelectorAll("[data-preview]"))
  button.addEventListener("click", () => {
    for (const other of document.querySelectorAll("[data-preview]"))
      other.setAttribute("aria-pressed", String(other === button));
    const [title, rows] = examples[button.dataset.preview];
    document.querySelector("[data-preview-title]").textContent = title;
    const list = document.querySelector("[data-preview-rows]");
    list.replaceChildren(
      ...rows.map((text) => {
        const li = document.createElement("li");
        const dot = document.createElement("span");
        dot.className = "dot";
        li.append(dot, document.createTextNode(text));
        return li;
      }),
    );
  });

const search = document.querySelector("[data-search]");
let index;
search?.addEventListener("input", async () => {
  index ??= await fetch("search.json").then((r) => r.json());
  const query = search.value.trim().toLowerCase(),
    results = document.querySelector("[data-results]");
  results.replaceChildren();
  if (query)
    for (const row of index
      .filter((row) => row.text.toLowerCase().includes(query))
      .slice(0, 6)) {
      const link = document.createElement("a");
      link.href = row.url;
      link.textContent = row.title;
      results.append(link);
    }
});
