# Descriptors and resource metadata

`descriptor.json` identifies the unit:

```json
{"format":"saddle-companion/1","id":"stable-id","kind":"file","features":{}}
```

`kind` is `file` or `folder`. `features` may contain only boolean `history` and `sync` overrides. Optional fields include `materialized` (a local-name checkpoint), `shares` (scope references), `deleted`, `deletedPath`, `namedKeys`, and `retention` (`document` and `control` Automerge references). Materialized paths MUST be file-local; they cannot grant access elsewhere. Retention references keep an archive alive until its peer barrier completes.

`resource.json` follows the [Frictionless Data Resource 2.0 profile](https://datapackage.org/profiles/2.0/dataresource.json), with the SADDLE core rules below. Validation does not download a schema or fetch referenced data. Properties outside this core are preserved as JSON; applications may apply additional external schemas. It requires a nonempty `name` and exactly one of `path` or `data`. The default self-reference uses the ordinary file's relative name. Paths may be relative or fully qualified HTTP(S) URLs. A path array cannot mix local and remote resources. Other URI schemes and traversal outside the granted root are rejected. Inline string data declares its format or media type.

Custom metadata belongs in the `metadata` object. `saddle` is the protocol/application extension object; `saddle.contentType` is an optional nonempty content-type identifier. MIME type remains independent of this application-level content type. Unknown JSON properties are preserved. JSON numbers must be finite; `__proto__` properties are rejected. Use strings for integers that must round-trip beyond JavaScript’s safe-integer range. Optional `title`, `description`, `format`, `mediatype`, `encoding` and `$schema` values must be strings.

For Markdown, an initial `---` line opens YAML frontmatter and a subsequent `---` line closes it. LF, CRLF and an initial UTF-8 BOM are supported. YAML 1.2 core scalar rules apply: `012` is decimal 12, `0o12` is 10, `1e3` is 1000; `yes`, date-like text, `0b11`, `1:20` and `1_000` remain strings. Duplicate mapping keys are errors. Values are converted to finite JSON before entering the same metadata pipeline; implementations may bound alias expansion. A top-level property repeated across the descriptor, its metadata object, inline frontmatter or its metadata object is an error, even if the values happen to agree. A resource path and inline path cannot overlap. Implementations MUST reject the entire combined metadata result rather than partially importing conflicting values. Diagnostic caches are local, never synchronized, and are cleared only after a fresh validation succeeds.

Resource paths provide explicit graph links. Other properties provide searchable metadata terms. Markdown links and tags may be added by a document adapter; they do not change the container format. Applications decide which graph dimensions to display.


## Core validation order

1. Decode UTF-8 JSON, require an object and validate finite JSON values.
2. Require `name` and exactly one locator (`path` or `data`). Validate each relative/HTTP(S) path; do not dereference it.
3. Validate core property types and the optional `saddle.contentType` string. A JSON Schema shape is provided in [`resource.schema.json`](../schemas/resource.schema.json); path safety and cross-source conflicts still need semantic checks.
4. Parse Markdown frontmatter only for a Markdown adapter, then merge top-level properties and nested `metadata` properties with duplicate detection. Exclude `path`/`data` from searchable property flattening; resource/inline paths form explicit links.
5. Publish the complete metadata result or one error. Do not publish a partial result while a conflicting property is ignored.

Resource metadata never grants filesystem/network access and never executes a command. Missing resource metadata is valid and does not require an archive. A metadata-only container does not require an Automerge payload. A complete unit uses its stable descriptor; the low-level container profile can also carry opaque named records without interpreting a unit.
