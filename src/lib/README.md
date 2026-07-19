# src/lib/

Reusable modules with real logic: data-fetching helpers, integrations with external services, non-trivial business logic.

Rule of thumb: if it composes multiple `src/utils/` functions or owns some state/behavior, it belongs here. If it's a single pure function, prefer `src/utils/`.
