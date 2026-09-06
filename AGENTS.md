# AGENTS.md

## Purpose

This file defines the permanent rules for coding agents working on the Property Fifth project.

Before making any code change, read:
1. `PROJECT.md` — product requirements, pages, features, UI direction, and current scope.
2. `DATABASE.md` — database schema and data contract, when the task involves data/database work.
3. Relevant files inside `requirements/` — exact visual UI references for the area being changed.

These documents are the source of truth. Do not rely on assumptions when the required behavior is already documented there.

---

## 1. Project Rules

- Build and maintain a single full-stack Next.js application.
- Use Next.js App Router + TypeScript + Tailwind CSS.
- Use shadcn/ui only when it genuinely simplifies a UI component.
- Keep the project simple, clean, and production-oriented.
- Prefer the smallest implementation that correctly satisfies the requirements.
- Do not introduce unnecessary libraries, abstractions, folders, or configuration.
- Do not create files for functionality that does not currently exist.
- Do not add speculative features.
- Do not rebuild working features unnecessarily.
- Preserve existing functionality when making changes.
- Do not use Framer Motion unless explicitly requested.
- Prefer CSS transitions/animations for simple visual effects.
- Avoid over-engineering.

---

## 2. Source of Truth

Priority order:

1. Explicit user instruction in the current task.
2. `PROJECT.md`
3. `DATABASE.md`
4. `requirements/` UI references
5. Existing working implementation

If two sources conflict, follow the higher-priority source and update the affected documentation if appropriate.

The `requirements/` images are visual references, not production assets. Do not use screenshots themselves as website assets unless explicitly instructed.

---

## 3. UI / Design Rules

Property Fifth is a premium real-estate advisory brand.

Maintain:
- premium navy + gold visual language
- editorial/luxury serif typography for major headings where specified
- clean modern sans-serif body/UI typography
- strong property photography
- generous whitespace
- clear hierarchy
- restrained animation
- polished responsive layouts

Do not:
- add excessive gradients
- add unnecessary glassmorphism
- add excessive shadows
- add flashy animations
- add decorative elements that are not supported by the references
- make the interface look like a generic SaaS dashboard
- replace the supplied design direction with a personal design preference

For exact spacing, sizing, layout, typography, colors, card structure, forms, and responsive behavior, inspect the relevant reference image before implementing.

---

## 4. Responsive Behavior

The website must work properly on:
- desktop
- tablet
- mobile

Do not simply shrink the desktop layout.

For mobile:
- preserve content hierarchy
- stack sections logically
- keep buttons usable
- prevent horizontal overflow
- make forms comfortable to use
- preserve important imagery without breaking the layout

---

## 5. Code Quality

Write readable TypeScript.

Prefer:
- simple components
- clear naming
- local state where sufficient
- server components by default
- client components only when interaction requires them
- reusable components only when repetition actually exists

Avoid:
- giant components when a natural separation exists
- premature component abstraction
- unnecessary global state
- duplicate business logic
- magic values when a named constant is clearer
- dead code
- unused imports
- unused dependencies
- commented-out old implementations

After changes:
- remove unused code
- check TypeScript errors
- check lint errors
- run a production build when practical

---

## 6. Dependencies

Before adding a package, ask:

- Is it actually required?
- Can the same result be achieved with existing Next.js/browser/CSS functionality?
- Will it materially simplify maintenance?

Do not add a dependency just because it is convenient.

Do not add:
- Express/NestJS for the backend
- Redis
- Docker
- large state-management libraries
- animation libraries
- CMS/page-builder systems

unless the user explicitly changes the architecture requirements.

---

## 7. Backend / API

Backend functionality belongs inside the same Next.js project.

Use appropriate Next.js mechanisms such as:
- Route Handlers
- Server Actions
- Server Components
- server-side utilities

Do not create a separate Express/Nest backend.

Keep authentication, validation, database access, file handling, and business logic server-side where appropriate.

Never expose:
- password hashes
- private credentials
- database connection strings
- server secrets
- private filesystem paths

to the browser.

Validate all user-controlled input on the server.

---

## 8. Database

When database work is required, `DATABASE.md` is the schema source of truth.

Current database scope is exactly eight logical tables:

1. Admin
2. Customer
3. Property
4. PropertyImage
5. SavedProperty
6. ConsultationRequest
7. CallbackRequest
8. ContactInquiry

Do not create extra tables for:
- highlights
- amenities
- specifications
- banks
- brochures/documents
- developers
- locations

unless the user explicitly approves a schema change.

Property structured content should follow `DATABASE.md`.

Before changing the schema:
1. verify that the existing schema cannot support the requirement
2. explain why the change is necessary
3. update `DATABASE.md`
4. then implement the schema change

Do not silently invent database fields or tables.

---

## 9. Authentication

Admin authentication is separate from the public customer experience.

Rules:
- Never store plaintext passwords.
- Store password hashes only.
- Validate admin credentials server-side.
- Protect every admin-only route/action.
- Do not rely only on hiding UI elements for authorization.
- Never return sensitive authentication data to the client.

The public site must not expose admin functionality.

---

## 10. Property Management

Only authenticated admins can:
- create properties
- edit properties
- delete properties
- publish/unpublish properties
- mark properties featured/unfeatured
- manage property images
- manage property details/content
- manage brochure/media information

Public users cannot upload or modify properties.

Property images:
- support a cover image and gallery
- support ordering
- support deletion
- do not implement 360° tours or floor-plan management
- do not create a separate image-library system unless explicitly requested

---

## 11. Forms and Lead Collection

Meaningful customer actions may open the premium lead/detail collection dialog described in `PROJECT.md`.

The form collects:
- Name
- Email
- Phone
- Category

Category:
- NRI / UHNI
- Defence Personnel

Location:
- do not add a manual location field unless explicitly required
- request browser location permission only where needed
- never imply location was collected automatically if permission was denied

All submitted data must be validated server-side.

Do not silently collect unnecessary personal data.

---

## 12. Customer Identity / Saved Properties

For anonymous saved-property functionality, use the first-party random `visitorId` approach described in `DATABASE.md`.

Do not implement browser/device fingerprinting.

Keep customer identity simple and privacy-conscious.

---

## 13. Public Pages

Current public scope:

- Home
- Properties
- Property Info / Detail
- Saved Properties
- Services
- About Us
- Contact

Header:
- Home
- Properties
- Services
- About Us
- Contact
- Book Consultation

Do not reintroduce removed sections/features unless explicitly requested.

Removed:
- Defence Community
- Insights
- 360° tours
- Floor plans
- homepage search/filter card
- public seller/agent property uploads
- unnecessary comparison systems

---

## 14. Admin Scope

Admin has exactly three functional main tabs:

1. Property Management
2. Consultation Requests
3. Call Back Requests (For a Property)

Do not add a generic Dashboard tab unless explicitly requested.

Admin login:
- separate split-screen layout
- no Forgot Password on login page
- password change belongs inside the dashboard/admin area

---

## 15. Consultation / Callback Status

Use the enums and meanings in `DATABASE.md`.

Do not invent new statuses casually.

Consultation requests support:
- general consultation
- property-related site visit

These are represented through `requestType`; do not create a separate appointment table unless explicitly approved.

Callback requests are property-specific.

---

## 16. Media / File Storage

For the initial implementation, keep media architecture simple.

Property image records belong in `PropertyImage`; the database stores image paths/URLs rather than image binaries.

Do not build a complex media-management platform.

If local VPS storage is used:
- keep uploads outside Git
- use safe filenames/paths
- validate file type and size
- process images server-side where appropriate
- never trust a user-provided filename/path

External object storage/CDN can be introduced later if scale requires it.

---

## 17. Deployment Assumptions

Target deployment is a VPS-friendly production setup.

Expected architecture:

Internet
→ Nginx
→ Next.js application
→ PostgreSQL

PM2 may be used to keep the Next.js process running.

Do not add deployment-specific complexity to application code unless required.

Nginx configuration belongs to deployment/server setup, not to the application's business logic.

---

## 18. Changes / Feature Requests

When the user requests a change:

1. Read the relevant documentation.
2. Inspect the existing implementation.
3. Identify the smallest set of files that need modification.
4. Make the change without breaking unrelated functionality.
5. Reuse existing components/data structures where sensible.
6. Test the affected flow.
7. Check for TypeScript/lint/build issues.
8. Report what changed and any important limitation.

Do not rewrite the project from scratch for a small change.

---

## 19. Documentation Maintenance

Keep documentation synchronized with the implementation.

If a user-approved feature materially changes:
- `PROJECT.md` → update product/feature requirements.
- `DATABASE.md` → update schema/data contract when applicable.
- `AGENTS.md` → update only when a permanent development rule changes.

Do not create additional documentation files unless there is a real need.

---

## 20. Requirements Images

The `requirements/` folder contains UI reference images.

Before implementing a screen:
- identify the corresponding reference
- inspect it carefully
- reproduce the intended structure and visual hierarchy
- use placeholders for unavailable real assets
- do not copy screenshot text/data blindly when it is clearly sample content

When the user provides a new reference image, treat it as the latest visual direction for that specific screen unless the user says otherwise.

---

## 21. Minimalism Rule

This is a deliberately simple project.

Every new:
- dependency
- file
- component
- abstraction
- database table
- API endpoint
- configuration option

must have a concrete reason.

If it is not needed for the current requirements, do not add it.

When two implementations are equally valid, choose the simpler one.

---

## 22. Definition of Done

A task is complete only when:

- requested behavior works
- existing relevant behavior still works
- UI follows the documented/reference design
- responsive behavior is acceptable
- no obvious TypeScript errors remain
- no obvious lint errors remain
- no unnecessary files/dependencies were introduced
- security-sensitive operations remain server-side
- documentation is updated if the change affects project requirements or schema

When uncertain, stop and ask rather than inventing product behavior.

---

## 23. Feature-by-Feature Development

Every feature must be implemented end-to-end as one complete unit before moving to the next feature.

### Required implementation order per feature

1. **Database / data layer** — schema, models, migrations, seed data — when the feature requires data.
2. **Backend / server-side logic** — route handlers, server actions, server-side utilities, business logic, authentication checks.
3. **Frontend / UI** — pages, components, layouts, styling, responsive behavior.
4. **Frontend ↔ backend integration** — connect the UI to the server layer. Forms must submit, data must load, actions must work.
5. **Validation, error, loading, and empty states** — handle edge cases, failures, and absent data gracefully.
6. **Test the complete feature flow** — verify the feature works from end to end as a user would experience it.

### Rules

- Do NOT build the entire frontend first and backend later.
- Do NOT build the entire backend first and frontend later.
- Do NOT create a separate final "frontend-backend integration" phase for integration that should have been completed as part of each feature.
- A feature is considered complete only after its required database, backend, frontend, integration, and testing work together as a single unit.
- For features that do not require database changes, skip only the database step.
- After completing each feature, verify that existing features still work before moving to the next feature.
