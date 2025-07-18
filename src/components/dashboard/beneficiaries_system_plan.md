# Beneficiaries (Families) System Plan

## 1. Why Have a Beneficiaries System?

- Improve accuracy of "أسرة مستفيدة" (Beneficiary Families) stats.
- Enable tracking of family needs, history, and support over time.
- Allow linking donations, expenses, and campaigns directly to families.
- Support reporting, transparency, and targeted aid.

## 2. What Data to Store for Each Beneficiary/Family?

- Family ID (auto-generated)
- Family name (or head of household)
- Contact info (phone, address, email)
- Number of members
- Location (village, city, region)
- Registration date
- Notes/needs/priority
- Linked documents (ID, proof, etc.)
- Status (active, inactive, etc.)

## 3. How to Link Donations/Expenses to Beneficiaries?

- Add a `familyId` or `beneficiaryId` field to donations and expenses.
- When adding a donation/expense, select the beneficiary from a searchable dropdown.
- Allow filtering and reporting by beneficiary.

## 4. UI/UX Considerations for Dashboard/Admins

- Beneficiaries management page: list, add, edit, delete families.
- Search and filter by name, location, status, etc.
- View family profile: history of donations, expenses, notes.
- Easy linking when adding new donations/expenses.
- Bulk import/export (optional).

## 5. Migration/Transition from Current Approach

- Migrate unique donorId/createdBy values to new beneficiaries collection.
- Optionally, auto-create beneficiaries from existing donations.
- Update forms to require/select beneficiary for new records.
- Update stats logic to count from beneficiaries collection.

## 6. Open Questions and Next Steps

- What fields are required for each family?
- Who can add/edit beneficiaries (roles/permissions)?
- Should families be linked to users (for login/self-service)?
- How to handle privacy and sensitive data?
- Plan UI wireframes and get feedback from admins.
- Start with a minimal MVP, then iterate.

---

**Next Steps:**

1. Confirm required fields and permissions.
2. Design beneficiaries collection schema.
3. Update dashboard UI for beneficiaries management.
4. Update donation/expense forms to link to beneficiaries.
5. Migrate existing data if needed.
