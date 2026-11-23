# Implementation and conformance guide

Implement only the profile you need, and state it. A binary archive reader is useful without a CRDT, and a metadata tool need not enable sharing.

| Profile | Required behavior | Reference implementation |
| --- | --- | --- |
| Container | Strict names/extents/checksums, unknown records, durable commits and compaction | TypeScript `RecordFiles`; Python `Archive` |
| Resource core | Locator/type validation, finite JSON, YAML conversion and all-or-nothing conflicts | TypeScript `parseResource`/`importMetadata`; Python `resource`/`import_metadata` |
| Unit history/exchange | Stable IDs, opened-boundary policies, real Automerge changes, grants and peer-agreed pruning | TypeScript unit engine; Python `Runtime` through the CLI |

## Minimal reader

1. Read exactly the 144-byte header. Reject the wrong magic and truncated headers.
2. Validate each slot’s hash and safe-integer fields. Read candidate index ranges only; reject out-of-file extents and oversized indexes. Choose the newest intact commit.
3. Parse its UTF-8 index and validate every entry before trusting an offset.
4. Read only requested record chunks, in order, verifying each complete SHA-256 hash. Distinguish a missing record from an empty byte sequence.

A metadata-only client can then validate `descriptor.json` and `resource.json`. Reading does not create an archive, enable a feature or grant another capability.

## Minimal writer

Hold the application’s agreed writer lease. Preserve unmodified records, append the new payload/index, flush, publish the alternate slot, then flush again. Return success only afterward. Do not update the currently published slot in place. Compact by durable atomic replacement when bytes must actually disappear. The reference Python lock coordinates Python writers; mixed applications must coordinate their root leases or use the canonical runtime API. A checksum does not serialize writers.

Never directly delete `.automerge` records from a shared unit. Call a history operation so the retained epoch, drafts, scope references and peer barrier remain consistent. Stopping broadcast is not deleting history, and removing future access cannot erase already saved remote copies.

## Shared fixtures

The [conformance directory](https://github.com/jocki-app/saddle-specification/tree/main/conformance) supplies exact container bytes and accepted/rejected metadata cases. Both SDKs vendor a revision/hash-pinned snapshot, run the same cases offline and add language-specific tests. Container vectors include alternate-slot recovery, corruption, unsafe bounds, unknown data and prototype-like record names. Metadata vectors include scalar conversion, CRLF/BOM and duplicate sources.

A release must also pass its profile-specific tests: durable filesystem writes, single-file/nested-root boundaries, feature cleanup, two-peer grants, read-only refusal, offline retention barriers and convergence. A container pass alone does not claim exchange conformance. The Python integration suite verifies native archives in both directions with TypeScript and runs real history/metadata operations through the installed CLI.

## Compatibility and evolution

The current binary and document wire major is 1. No other magic or document version is accepted as v1. SDK package versions and specification document revisions are independent of this wire major. Unknown named records and resource properties are the extension points; silently changing an existing record’s meaning is not an extension. Incompatible changes need a new wire major and explicit negotiation.

Refer to [record models](07-records.md) for fields and [releasing](https://github.com/jocki-app/saddle-specification/blob/main/RELEASING.md) for updating normative documents and both SDK fixture snapshots.
