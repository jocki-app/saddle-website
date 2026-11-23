# Units, identity and scope

A unit is an ordinary file or folder. Its sibling archive is `.<full-name>.saddle`: `notes.md` uses `.notes.md.saddle`, and `projects` uses `.projects.saddle`. The rule is identical for files and folders. The underlying file format never changes.

An archive MUST be created only when a feature needs persisted state: metadata, explicit feature overrides, retained history, sharing, named declarations, or a protected pending retention operation. Unset alone requires no archive. Metadata-only units do not require an Automerge document. When both history and sharing are effectively off, ordinary files remain sufficient.

The descriptor assigns a stable portable ID to its unit. IDs are 1–128 ASCII letters, digits, underscores or hyphens. Renaming or moving a unit and its archive preserves that ID. Location hints are advisory, never authority or filesystem grants. Content-based rename matching MAY use a retained baseline and libgit2's diff/find-similar mechanism. Filesystem inode identities are not a required portability mechanism.

Each selected root is a capability boundary. Inheritance never reads above it. Opening a nested folder uses that folder's archive and descendants; it does not require the former top-level root. Opening a file alone grants that file and its sibling archive, not its parent or siblings.

History and sharing each have three local states: unset (the key is absent), disabled (`false`), enabled (`true`). The nearest explicit value in the opened hierarchy wins independently for each feature. With no applicable declaration, both are false. Workspace defaults may provide the initial policy only when that workspace is actually open. Folder records describe direct membership; children retain their content in their own archives.

Named keys, such as a templates directory, belong to the unit declaring them. Multiple visible units may declare the same key. Choosing a destination among them is an application decision.
