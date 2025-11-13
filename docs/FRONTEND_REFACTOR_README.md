# Frontend Refactor and De-duplication Plan

This document outlines the refactor plan for `chapel-stack/src/` to remove duplication, standardize patterns, and improve maintainability.

## Goals
- Reduce duplicate/legacy components and files.
- Standardize icon library, modal patterns, and inputs.
- Consolidate feature logic (especially family relationships and member management).
- Move developer docs out of app routes.

## Key Findings

- **[Mixed icon libraries]**
  - Heroicons and Lucide are mixed. Example files:
    - `app/dashboard/members/components/MemberDetailSections/FamilyRelationshipsSection.tsx` (Heroicons)
    - `app/dashboard/members/components/FamilyRelationshipModal.tsx` (Lucide)
  - Recommendation: Standardize on `lucide-react`. Replace Heroicons (`UsersIcon`, `UserGroupIcon`, `HeartIcon`, `UserIcon`) with Lucide equivalents (`Users`, `Heart`, `User`).
  - Likely targets:
    - `config/navigation.config.ts`
    - `components/navigation/DynamicNavigation.tsx`
    - Many `app/dashboard/*/page.tsx`

- **[Family relationships duplication]**
  - Overlapping components/hooks:
    - `app/dashboard/members/components/FamilyRelationshipDisplay.tsx`
    - `app/dashboard/members/components/FamilyRelationshipModal.tsx`
    - `app/dashboard/members/components/MemberDetailSections/FamilyRelationshipsSection.tsx`
    - `components/members/FamilyRelationshipManager.tsx`
    - GraphQL: `graphql/hooks/useFamilyRelationships.ts`, `graphql/queries/familyQueries.ts`, `graphql/mutations/familyRelationshipMutations.ts`
  - Recommendation:
    - Create a unified `components/members/FamilyRelationshipsPanel.tsx` that handles list + add/remove.
    - Centralize relationship badge colors, labels, icons in `graphql/hooks/useFamilyRelationships.ts` or `utils/family.ts`.
    - Deprecate/remove `FamilyRelationshipDisplay.tsx` and `FamilyRelationshipManager.tsx` once replaced.

- **[Modal patterns not unified]**
  - Multiple implementations: `components/ui/delete-confirm-modal.tsx`, `components/ui/alert-dialog.tsx`, feature-specific modals.
  - Recommendation: Provide standardized primitives:
    - `components/ui/Modal.tsx` (HeadlessUI wrapper)
    - `components/ui/ConfirmDialog.tsx`
    - Optional `components/ui/Drawer.tsx`
  - Migrate feature modals to use these primitives.

- **[Searchable input duplication]**
  - `components/ui/SearchableMemberOrTextInput.tsx` and `components/ui/SearchableMemberInput.tsx` overlap.
  - Recommendation: Merge into a single `SearchableMemberInput` with `allowTextInput` prop and consistent value/onChange typing.
  - Update call-sites: `BirthRegisterForm.tsx`, `FamilyRelationshipModal.tsx`, `sacraments/components/UniversalSacramentModal.tsx`.

- **[Legacy/backup files]**
  - Found backups/old variants:
    - `components/navigation/DynamicNavigation.backup.tsx`
    - `app/dashboard/branch/page-old.tsx`
    - `app/dashboard/report-builder/page-old.tsx`
    - `app/dashboard/branch-finances/page.tsx.backup`
    - `app/dashboard/branch-finances/page.tsx.old`
    - `app/dashboard/branch/page-previous.tsx`
  - Recommendation: Verify no imports, then delete. Add lint rule to block committing `.backup`, `.old`, or `-old` suffixed files.

- **[Enhanced vs base components]**
  - Examples: `sacraments/components/SacramentTabContentEnhanced.tsx` vs `SacramentTabContent.tsx`, `graphql/queries/enhancedMemberQueries.ts`, `contexts/AuthContextEnhanced.tsx`.
  - Recommendation: Choose one path (prefer “Enhanced” if it supersedes), fold differences into the canonical component, and remove the other.

- **[Overlapping hooks]**
  - `app/dashboard/members/hooks/useMemberOperations.ts`, `hooks/useMemberManagement.ts`, `graphql/hooks/useMember.ts` cover similar concerns.
  - Recommendation: Consolidate under `graphql/hooks/` with clear separation of queries vs mutations; share types via `types/`.

- **[Docs inside route directories]**
  - Examples: `app/dashboard/sacraments/README.md`, `app/dashboard/attendance/README.md`, `app/dashboard/branch/README.md`, `app/dashboard/branch-finances/REFACTORING_GUIDE.md`.
  - Recommendation: Move to `chapel-stack/docs/` and link from UI or developer docs as needed.

## Phased Plan

- **Phase 1 (Low risk)**
  - Standardize icons to Lucide across `src/`.
  - Move READMEs from route directories to `chapel-stack/docs/`.
  - Delete `.backup`/`.old`/`*-old*` files after verifying no imports.

- **Phase 2 (Medium risk)**
  - Introduce `Modal` and `ConfirmDialog` primitives; migrate members, worship, and attendance modals.
  - Merge `SearchableMember*` inputs into one component and update call-sites.

- **Phase 3 (Higher impact)**
  - Create `FamilyRelationshipsPanel.tsx` and migrate consumers; remove redundant family relationship components.
  - Consolidate member-related hooks and remove unused ones.
  - Resolve Enhanced vs Base splits by folding into a single canonical component.

## Implementation Checklist

- **[Icons]**
  - Replace all `@heroicons/*` imports with `lucide-react` equivalents.
  - Add ESLint rule to forbid `@heroicons/*` imports.

- **[Modals]**
  - Add `components/ui/Modal.tsx`, `ConfirmDialog.tsx`, `Drawer.tsx`.
  - Migrate feature modals progressively.

- **[Searchable Input]**
  - Merge into `components/ui/SearchableMemberInput.tsx` with `allowTextInput`.
  - Update `BirthRegisterForm.tsx`, `FamilyRelationshipModal.tsx`, `UniversalSacramentModal.tsx`.

- **[Family Relationships]**
  - Create `components/members/FamilyRelationshipsPanel.tsx`.
  - Replace usage in `FamilyRelationshipsSection.tsx` and `FamilyRelationshipModal.tsx`.
  - Remove `FamilyRelationshipDisplay.tsx` and `FamilyRelationshipManager.tsx` when no longer referenced.

- **[Legacy Cleanup]**
  - Confirm unused and delete:
    - `components/navigation/DynamicNavigation.backup.tsx`
    - `app/dashboard/branch/page-old.tsx`
    - `app/dashboard/report-builder/page-old.tsx`
    - `app/dashboard/branch-finances/page.tsx.backup`
    - `app/dashboard/branch-finances/page.tsx.old`
    - `app/dashboard/branch/page-previous.tsx`

- **[Docs]**
  - Move route READMEs to `chapel-stack/docs/`.

## Conventions (Proposed)

- **Icons**: Only `lucide-react`.
- **Modals**: HeadlessUI-based primitives with consistent props.
- **Folders**: `components/`, `features/<domain>/`, `graphql/`, `hooks/`, `utils/`, `types/`.
- **Naming**: No `.backup`, `.old`, or `-old`. Avoid “Enhanced” once unified.

## Notes
- Execute deletions only after confirming no imports via grep.
- For large migrations (icons/modals), consider codemods and incremental PRs.
