# Shared conformance vectors

`v1/containers.json` carries independent binary fixtures as base64 and exact expected named payloads. A valid case must list and read every expected record; an invalid case must fail during index validation or payload verification. Missing and empty values differ. The vectors cover both slots, interruption recovery, damage, bounds, portable names, Unicode and prototype-like names.

`v1/resources.json` defines accepted/rejected SADDLE Resource core shapes. `v1/frontmatter.json` defines YAML core scalar conversion, newline handling and conflicts. Metadata properties must match exactly; invalid combined metadata must not be partially imported.

Both SDK repositories carry this directory plus a pinned `source.json` revision and run it without network access. Fixture bytes are normative examples, not an exhaustive security audit. Add a regression vector when correcting interoperability, then update and test both SDK snapshots. History/exchange additionally requires authenticated multi-peer and retention tests; a container pass alone does not claim those profiles.
