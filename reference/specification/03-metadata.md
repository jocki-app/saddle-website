# Descriptors and resource metadata

`descriptor.json` identifies the unit:

```json
{"format":"saddle-companion/1","id":"stable-id","kind":"file","features":{}}
```

`kind` is `file` or `folder`. `features` may contain only boolean `history` and `sync` overrides. Optional fields include `materialized` (a local-name checkpoint), `shares` (scope references), `deleted`, `deletedPath`, `namedKeys`, and `retention` (`document` and `control` Automerge references). Materialized paths MUST be file-local; they cannot grant access elsewhere. Retention references keep an archive alive until its peer barrier completes.

`resource.json` is a Frictionless Data Resource 2.0 JSON object. It requires a nonempty `name` and exactly one of `path` or `data`. The default self-reference uses the ordinary file's relative name. Paths may be relative or fully qualified HTTP(S) URLs. A path array cannot mix local and remote resources. Other URI schemes and traversal outside the granted root are rejected. Inline string data declares its format or media type.

Custom metadata belongs in the `metadata` object. `saddle` is the protocol/application extension object; `saddle.contentType` is an optional nonempty content-type identifier. MIME type remains independent of this application-level content type. Unknown JSON properties are preserved. JSON values must be finite and cannot contain prototype-pollution keys.

For Markdown, YAML frontmatter is converted to JSON before entering the same metadata pipeline. A top-level property repeated across the descriptor, its metadata object, inline frontmatter or its metadata object is an error, even if the values happen to agree. A resource path and inline path cannot overlap. Implementations MUST reject the entire combined metadata result rather than partially importing conflicting values. Diagnostic caches are local, never synchronized, and are cleared only after a fresh validation succeeds.

Resource paths provide explicit graph links. Other properties provide searchable metadata terms. Markdown links and tags may be added by a document adapter; they do not change the container format. Applications decide which graph dimensions to display.
