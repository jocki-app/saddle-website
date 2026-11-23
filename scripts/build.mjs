import { mkdir, cp, rm } from "node:fs/promises";
await rm("dist", { recursive: true, force: true });
await mkdir("dist");
for (const name of ["index.html", "assets"])
  await cp(name, "dist/" + name, { recursive: true });

import { readdir, readFile, writeFile } from "node:fs/promises";
const escape = (s) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const inline = (s) =>
  escape(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_m, t, u) =>
        `<a href="${u.endsWith(".md") ? u.slice(0, -3) + ".html" : u}">${t}</a>`,
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
function markdown(source) {
  let code = false,
    table = false,
    output = "";
  for (const line of source.split("\n")) {
    if (line.startsWith("```")) {
      if (table) {
        output += "</tbody></table>";
        table = false;
      }
      output += code ? "</code></pre>" : "<pre><code>";
      code = !code;
      continue;
    }
    if (code) {
      output += escape(line) + "\n";
      continue;
    }
    if (line.startsWith("|")) {
      if (/^\|[ :|-]+\|$/.test(line)) continue;
      if (!table) {
        output += "<table><tbody>";
        table = true;
      }
      output +=
        "<tr>" +
        line
          .split("|")
          .slice(1, -1)
          .map((v) => "<td>" + inline(v.trim()) + "</td>")
          .join("") +
        "</tr>";
      continue;
    }
    if (table) {
      output += "</tbody></table>";
      table = false;
    }
    if (!line.trim()) continue;
    const heading = /^(#{1,6}) (.*)/.exec(line);
    output += heading
      ? `<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`
      : `<p>${inline(line)}</p>`;
  }
  if (table) output += "</tbody></table>";
  return output;
}
const files = (await readdir("reference/specification")).filter((n) =>
  /^\d/.test(n),
);
const rows = [];
const home = await readFile("index.html", "utf8");
for (const file of files) {
  const source = await readFile("reference/specification/" + file, "utf8");
  const title = source.split("\n")[0].replace(/^# /, "");
  rows.push({ title, url: file.replace(".md", ".html"), text: source });
  const nav =
    '<input data-search aria-label="Search specification" placeholder="Search the specification"><div class="results" data-results></div>' +
    files
      .map(
        (f) =>
          `<a href="${f.replace(".md", ".html")}">${f.replace(/^\d+-/, "").replace(".md", "").replaceAll("-", " ")}</a>`,
      )
      .join("");
  const body = `<main id="main" class="docs wrap"><aside aria-label="Specification navigation">${nav}</aside><article>${markdown(source)}</article></main>`;
  const page = home
    .replace(/<main id="main">[\s\S]*?<\/main>/, body)
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${escape(title)} · SADDLE</title>`,
    )
    .replace(
      'href="https://jocki-app.github.io/saddle-website/"',
      'href="https://jocki-app.github.io/saddle-website/' +
        file.replace(".md", ".html") +
        '"',
    );
  await writeFile("dist/" + file.replace(".md", ".html"), page);
}
await cp("reference/schemas", "dist/schemas", { recursive: true });
await writeFile("dist/search.json", JSON.stringify(rows));
const implementations =
  '<main id="main" class="wrap section"><p class="eyebrow">One wire format, multiple tools</p><h1>Choose your starting point.</h1><div class="cards">' +
  [
    [
      "TypeScript SDK",
      "saddle-typescript-sdk",
      "Portable archive, history and sharing APIs for Node and browser adapters.",
    ],
    [
      "Python SDK",
      "saddle-python-sdk",
      "Native binary records and metadata; canonical runtime bindings for Automerge and sharing.",
    ],
    [
      "CLI",
      "saddle-cli",
      "Inspect archives, manage metadata, configure history and approve sharing from the terminal.",
    ],
  ]
    .map(
      ([name, repo, description]) =>
        `<article class="card"><h3>${name}</h3><p>${description}</p><a href="https://github.com/jocki-app/${repo}">Open repository →</a></article>`,
    )
    .join("") +
  "</div><h2>Start with an ordinary file</h2><pre><code>saddle inspect notes.md\nsaddle history enable notes.md\nsaddle history list notes.md</code></pre></main>";
await writeFile(
  "dist/implementations.html",
  home.replace(/<main id="main">[\s\S]*?<\/main>/, implementations),
);
