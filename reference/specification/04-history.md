# History and coordinated retention

`content.automerge` holds the unit's content document. `folder.automerge` holds a folder's declarations and direct membership. Resource metadata and content share the same unit history; a child folder does not duplicate all descendant content in its own archive. Documents use the `saddle-file/1`, `saddle-folder/1` and `saddle-workspace/1` identifiers. Automerge binary changes are stored as ordinary named-record payloads; appending incremental changes preserves the entry's heads and change count atomically.

Version descriptions use Automerge change messages. An event and optional description are separated by two newlines. Version times are Automerge change timestamps. Applications may present text/line/byte differences without embedding presentation in the archive.

Reset retains the current saved content and creates one fresh creation version. Deleting a version removes that version's edits and replays later deltas on the preceding baseline; it is not merely hiding the row. Text replay uses Automerge character identities. Current content changes accordingly, and private drafts are rebased without silently becoming saved edits. Rewrites MUST refuse unresolved distinct conflicts that cannot be replayed safely.

Disabling effective history removes retained versions once safe. Without shares or protected peers, cleanup is immediate. With peers, the signed retention coordinator uses an epoch/generation barrier: prepare freezes the agreed heads; each known participant acknowledges the same token and epoch; commit publishes the replacement checkpoint; only then may old document bytes be discarded. Dirty or incompatible peers can refuse. An expired or rejected proposal aborts rather than silently deleting data. An offline participant can delay cleanup.

The retention control document uses `saddle-retention/1`; signed acknowledgements use `saddle-retention-ack/1`. A proposal records token, epoch, heads, participants, phase, deadline, signed acknowledgements, replacement document reference and previous reference. `saddle-history-request/1` carries authorized rewrite requests. A new epoch prevents an old synchronized document from resurrecting pruned history.

Retained deletion, manifest and baseline records may keep an otherwise empty archive temporarily. Once the coordinated barrier finishes and no settings, metadata, shares or named declarations require it, the archive can be removed. Unset does not by itself leave a permanent sidecar.
