# Capabilities, security and conformance

A container implementation validates magic, slot/index hashes, all extents, record names and requested payload hashes; preserves unknown records; and acknowledges only durable writes. A metadata implementation validates Data Resources and rejects all combined metadata on conflict. A history/exchange implementation additionally enforces epochs, signed authority and peer retention barriers.

TypeScript exposes a portable filesystem capability; Node, browser and native adapters provide explicit access. No portable core may import a browser UI or assume a host filesystem. A selected-file capability cannot read parent descriptors. An opened nested root does not consult an unopened ancestor. All synchronized writes must remain inside the granted root, with symlink/traversal checks in the adapter.

The Python SDK reads and writes binary archives natively. For Automerge history and approved sharing it invokes the canonical TypeScript runtime through the CLI's JSON protocol. It does not simulate Automerge with incompatible Python history. An implementation may support only the container or metadata profile, but must state that boundary. Unknown Automerge records are still preserved losslessly.

Conformance includes bidirectional TypeScript/Python fixtures, interrupted-slot recovery, damaged-payload rejection, unknown-record preservation, optional feature cleanup, history replay, scope-boundary tests and authenticated multi-peer synchronization. Schema files in `schemas/` describe JSON shapes; binary extent relationships and permission checks also require semantic validation.
