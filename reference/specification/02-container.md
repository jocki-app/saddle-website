# Binary named-record container

All integer fields use little-endian encoding. Values MUST be nonnegative safe integers (at most 2^53−1). The format has an eight-byte magic and two independent commit slots. Header size is 144 bytes.

| Offset | Length | Meaning |
| --- | --- | --- |
| 0 | 8 | ASCII `SADDLE01` |
| 8 | 68 | Commit slot 0 |
| 76 | 68 | Commit slot 1 |
| 144 | remaining | Immutable payload chunks and UTF-8 JSON indexes |

Each slot contains the following fields relative to its start:

| Offset | Length | Meaning |
| --- | --- | --- |
| 0 | 8 | Generation, positive uint64 |
| 8 | 8 | Absolute index offset, uint64 |
| 16 | 4 | Index byte length, uint32, at most 16 MiB |
| 20 | 8 | Committed end offset, uint64 |
| 28 | 8 | First 8 bytes of SHA-256 of the index bytes |
| 36 | 32 | SHA-256 of the preceding 36 slot bytes |

Index offset MUST be at least 144. Index offset plus length MUST equal committed end. Readers validate slot checksums, integer bounds and index extents, then choose the highest generation whose index checksum is intact. If the newest slot is torn, they try the older valid slot. A file with no intact slot is invalid; it is not an empty archive.

The index is an object mapping portable record names to entries:

```json
{"resource.json":{"chunks":[{"offset":144,"length":32,"hash":"64-lowercase-hexadecimal-characters"}]}}
```

Record names are relative POSIX paths. Empty components, `.`, `..`, backslashes, absolute paths, control characters, colons and the reserved `.saddle` component are forbidden. Each chunk offset is at least 144, length is nonnegative, its end precedes or equals the selected index offset, and `hash` is the full lowercase hexadecimal SHA-256 of its bytes. Reading a record concatenates its chunks in listed order and verifies every chunk. An empty payload is distinct from a missing record.

An entry MAY include `heads` (an array of Automerge head strings) and `numChanges` (a safe nonnegative integer). These statistics are committed atomically with the payload, allowing version-count displays without decoding an entire document. Readers MUST preserve unknown records when modifying another record.

A writer serializes updates under its explicit writer lease, appends payload and index bytes, flushes them durably, then publishes the alternate slot and flushes it durably. Acknowledgement occurs only after the second flush. Initial creation and compaction use an atomic replacement followed by directory synchronization where supported. Interrupted writes cannot acknowledge a partial commit.

Deleting a record or replacing an Automerge epoch MUST compact away its discarded payload bytes after retention permission is established. Other edits SHOULD compact when dead space grows substantially; the reference implementation uses an 8 MiB threshold and less than 50% live payload. Compaction preserves record contents and metadata while increasing the generation. Large-file implementations SHOULD use bounded reads and streamed copies.

Checksums detect damage and torn writes. They do not authenticate an author or authorize a change.
