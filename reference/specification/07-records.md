# Record registry and reference document models

This chapter separates the portable container/metadata profiles from the optional Automerge exchange profile. JSON records are UTF-8. `.automerge` records are Automerge binary documents, not JSON text. A container-only implementation MUST preserve opaque documents; it need not execute or decode them.

## Reserved named records

| Record | Owner and interpretation |
| --- | --- |
| `descriptor.json` | Stable unit identity, explicit policies and portable save checkpoint |
| `resource.json` | SADDLE Resource core metadata |
| `content.automerge` | One file’s content plus its resource metadata |
| `folder.automerge` | One folder’s declarations, resource metadata and direct children |
| `shares/<id>.automerge` | One authorized scope manifest |
| `membership.json` | Advisory direct-child ID/name hints for relocation; never child bytes or permission |
| `baseline.bin` | Last observed ordinary bytes used for explicit content-based rename recovery |

Other record names are extension-owned. Preserving them means preserving payload bytes, not translating their internal representation. Unknown resource properties are also preserved. Private identity keys, transport/cache state, unresolved editor drafts and diagnostic caches are not portable unit records.

## Descriptor fields

Required: `format: "saddle-companion/1"`, `id`, `kind`, `features`.

| Field | Type and meaning |
| --- | --- |
| `id` | 1–128 ASCII letters, digits, `_` or `-`; stable across recognized relocation |
| `kind` | `file` or `folder` |
| `features` | Object with optional boolean `history` and `sync` only; absent key means unset |
| `materialized` | Optional saved checkpoint: `path`, `heads`, `epoch`, `hash`, `deleted`; optional `sidecar` and observed `stamp` |
| `shares` | Optional map of scope IDs to portable references |
| `deleted`, `deletedPath` | Retained deletion and an advisory safe relative path |
| `namedKeys` | Optional unique names matching `[a-z][a-z0-9.-]*` declared on this unit |
| `retention` | Optional `{document, control}` references protecting pending peer agreement |

A checkpoint path is one local filename, not a path into another folder. Its sidecar checkpoint path is `resource.json`. `heads` are the saved Automerge heads; the observed filesystem stamp is advisory. Checkpoint hashes identify saved materialization, not authorization. For a removed parent folder, retained child archives can become sibling `.deleted-<id>.saddle` files with `deletedPath`; they do not require a central tombstone registry.

## File document

The reference `saddle-file/1` object contains:

| Field | Value |
| --- | --- |
| `format`, `id` | Document identifier and the unit’s stable ID |
| `epoch`, `generation` | Nonnegative checkpoint epoch and generation string |
| `mime`, `kind` | MIME string; kind is `text` or `binary` |
| `text`, `bytes` | Collaborative text and a binary `Uint8Array`; adapter chooses the meaningful representation |
| `resource`, `invalidResource` | Valid resource or null; retained invalid source text or null |
| `csdb` | Optional structured CSDB adapter state, otherwise null |
| `template` | Optional `{file, hint, baseline}` source reference, otherwise null |
| `retainHistory` | Optional effective retention state recorded by the reference engine |

`template.file` is the stable source unit ID; `hint` is an advisory location and `baseline` supports three-way updates. Neither a MIME string, a template hint nor CSDB text grants permission to run code. CSDB is an optional content adapter; other clients can preserve its document without supporting its structured projection.

## Folder document

`saddle-folder/1` contains `id`, `features`, `namedKeys`, `resource`, and `children`. Children are keyed by stable child ID and have `{name, kind, deleted}`. Names describe direct members, not recursive paths. Optional `retainHistory` and `checkpoint: {epoch, generation}` participate in retention. Before a checkpoint, epoch is 0 and generation is the folder ID. This document contains no descendant file contents.

## Share manifest and retention

`saddle-share/1` contains `id`, `name`, `kind`, `unit`, `rootFile`, `contract`, `group`, `files`, `folders`, `workspace` and `vaults`; `workspaceRetention` is optional. A non-workspace scope has `unit: {id, kind}`. Files carry `{id, path, url, deleted, epoch, retention}`; folders carry `{id, path, url, retention}`. Workspace references are the optional workspace profile, not an authority above an opened filesystem capability.

The signed scope contract binds `{format: "saddle-share-contract/1", url, id, kind, unit, rootFile, group, workspace}` using the canonical runtime’s signature envelope. Receivers verify the contract and Keyhive grant before admitting documents. A manifest path is always checked against the receiver’s selected filesystem capability.

`saddle-retention/1` contains `file`, `owner`, and a nullable `proposal`. A proposal carries `token`, `epoch`, `heads`, `participants`, `phase`, `deadline`, signed `acknowledgements`, `next`, `previous`, and an optional rewrite. Phases are `prepare`, `commit`, `abort`. An acknowledgement binds the document URL, token, epoch, heads and one of `frozen`, `committed`, `refuse` under `saddle-retention-ack/1`. The matching token/epoch/heads and admitted signer matter; an unsigned JSON acknowledgement is insufficient.

Use the canonical runtime for this reference exchange profile. Reimplementing only the tables above does not constitute compatible cryptography or a safe history rewrite. The TypeScript contracts and authenticated multi-peer tests are published with the SDK; the Python binding runs that same engine. Implementations using another exchange profile must name it and must not claim compatibility with these protected records.

## Optional workspace profile

`saddle-workspace/1` is a portable settings document with folder references, defaults and per-computer overrides. It is optional. Ordinary files/folders and their SADDLE archives work without a workspace. Device-local mount tokens and UI configuration are application capabilities; importing a workspace cannot grant them automatically. No unit depends on a workspace ID to retain its own identity.
