# Sharing and exchange

Sharing grants access to a unit's retained Automerge state, including its available history. There is no private-history/current-content split. A folder share covers descendants through scoped references; child bytes remain in each child's archive. Additional child shares may coexist with inherited parent shares.

A disabled sharing declaration blocks sharing for that unit; unset inherits; enabled permits locally defined scopes while retaining applicable inherited scopes. Broadcast controls actual exchange per scope and may be toggled independently. Adding a disabled share does not grant access or execute application commands.

The reference exchange profile uses Automerge Repository with Keyhive grants and Subduction transport. Device identities, approved contact cards and signed scope contracts establish authorization. Read and edit grants are distinct. The scope kind is explicitly carried by the invitation: `file`, `folder`, `vault` (a selected root folder), or `workspace`. The root-folder token does not introduce an external metadata authority.

Invitations use the `saddle://share/` scheme and URL-safe base64 JSON containing `format: saddle-share-invitation/1`, an Automerge URL, name and kind. The invitation does not replace an authenticated grant; the signed contract must agree with its advertised scope. Invitations and private identity material MUST NOT be committed to source control.

`saddle-share/1` scope manifests reference stable unit IDs, file/folder document URLs, retention controls, paths and deletion flags. A receiver materializes only authorized paths within its explicit capability. Location hints never authorize traversal. Removing future access stops subsequent synchronization but cannot erase copies already saved on another device.

Transport endpoints and broadcast are explicit local settings. Without an active transport, local editing and history still work. Receiving a record never authorizes shell commands, SQL, plugins or filesystem access outside the selected capability. Identities and routing caches may live in a private application directory; the archive's unit identity and portable declarations remain authoritative.
