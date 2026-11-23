import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync,readdirSync} from "node:fs";
import {resolve,dirname} from "node:path";
test("every generated local link resolves, including all specification chapters",()=>{
  const files=readdirSync("dist").filter(name=>name.endsWith(".html"));
  assert.equal(files.length,10);
  for(const file of files) {
    const html=readFileSync(`dist/${file}`,"utf8");
    assert.match(html,/<html lang="en"/);
    assert.match(html,/id="main"/);
    for(const [,url] of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
      if (/^[a-z][a-z\d+.-]*:/i.test(url)) continue;
      assert(existsSync(resolve(dirname(`dist/${file}`),url)), `${file}: ${url}`);
    }
  }
  assert.match(readFileSync("dist/03-metadata.html","utf8"),/schemas\/resource.schema.json/);
  const search=JSON.parse(readFileSync("dist/search.json","utf8"));
  assert.equal(search.length,8);
  assert(search.some(row=>row.url.startsWith("08-")));
  assert(existsSync("dist/conformance/v1/containers.json"));
});
