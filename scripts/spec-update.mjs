import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
const source = process.argv[2];
if (!source) throw Error("Usage: npm run spec:update -- /path/to/saddle-specification");
const root = resolve(source);
const revision = execFileSync("git", ["-C", root, "rev-parse", "HEAD"], {encoding:"utf8"}).trim();
if (execFileSync("git", ["-C", root, "status", "--porcelain"], {encoding:"utf8"}).trim())
  throw Error("Commit specification changes before pinning a website snapshot");
const version = (await readFile(resolve(root, "VERSION"), "utf8")).trim();
await mkdir("reference", {recursive:true});
for (const directory of ["specification", "schemas", "conformance"]) {
  await rm(`reference/${directory}`, {recursive:true, force:true});
  await cp(resolve(root, directory), `reference/${directory}`, {recursive:true});
}
await writeFile("reference/source.json", JSON.stringify({repository:"https://github.com/jocki-app/saddle-specification", revision, version}, null, 2)+"\n");
console.log(`Pinned specification ${version} at ${revision}`);
