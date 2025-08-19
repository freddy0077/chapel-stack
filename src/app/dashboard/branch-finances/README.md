# Branch Finances: Improvements Plan

This document outlines critical gaps, recommended priorities, and implementation notes for the Branch Finances feature set.

## ❌ Critical Missing Features

### 1) Frontend Transaction Management Gaps
- No transaction editing capability (backend supports `updateTransaction`, frontend needs to use it)
- No transaction deletion UI (backend supports `removeTransaction`)
- Incomplete form submission logic for creation (handleModalSubmit must be complete)
- Missing transaction detail view (view full transaction information)
- No transaction approval workflow

### 2) Financial Analytics & Reporting
- No budget vs actual reporting
- No cash flow analysis or forecasting
- No detailed financial statements
- No donor statements generation
- No comparative period analysis

### 3) Advanced Features
- No pledge management system
- No recurring transactions
- No transaction approval levels
- No audit trail for changes
- No bank reconciliation
- No payment gateway integration

## 🚀 Recommended Priorities

### Immediate (Priority 1)
1. Complete transaction form submission (finish `handleModalSubmit`)
2. Add transaction edit/delete UI (wire to existing backend mutations)
3. Add transaction detail modal (full transaction information)
4. Implement member giving history (individual member contributions)

### Short-term (Priority 2)
- Enhanced financial dashboard (charts, trends, analytics)
- Budget management (create and track budgets vs actual)
- Pledge management (creation, tracking)
- Advanced reporting (PDF exports, custom reports)

### Long-term (Priority 3)
- Bank reconciliation features
- Recurring transactions automation
- Multi-currency support
- Accounting software integrations

## 🔧 Technical Issues to Address
- Frontend form logic incomplete (creation modal submit)
- Missing CRUD UI components (edit/delete on frontend)
- Limited error handling (add validations and user feedback)
- No transaction status management (approval workflows)

## ✅ Current Progress (tracking)
- Transaction creation: `handleModalSubmit` implemented with validation, calls `createTransaction`
- Edit UI: Edit modal present; wiring to `updateTransaction` added
- Delete: Delete handler wired to `removeTransaction`
- Detail view: Detail modal present and opens via `handleViewTransaction`
- Member Giving History: Implemented (`/src/components/finance/MemberGivingHistory.tsx`) and integrated

## 🧭 Implementation Notes
- GraphQL hooks: `useTransactionMutations` now exposes `createTransaction`, `updateTransaction`, `removeTransaction`
- Refetch strategy: After create/update/delete, refetch transactions and funds, await refetch
- Validation: Transactions require Amount, Date, Fund
- UX: Confirm before delete; show toasts or alerts for success/error; disable submit while loading

## 📌 Next Actions Checklist
- [ ] Add inline error presentation for form validation
- [ ] Add optimistic updates or fine-grained cache updates for better UX
- [ ] Centralize toast notifications for success/error
- [ ] Extend detail modal with full metadata (fund, event, payment method, contribution subtype)
- [ ] Add approval status UI scaffolding (pending, approved, rejected)
- [ ] Design analytics widgets (income vs expense, trends)
- [ ] Draft Budget entities and UI scaffolding (Priority 2)
- [ ] Draft Pledge entities and UI scaffolding (Priority 2)
- [ ] Add PDF exports to reporting (Priority 2)

## 🗂 Related Files
- Page: `src/app/dashboard/branch-finances/page.tsx`
- Member History: `src/components/finance/MemberGivingHistory.tsx`
- GraphQL hooks: `src/graphql/hooks/useTransactionMutations.ts`

---

Keep this README updated as tasks complete or scope changes.
