# Property Fifth — Project Specification

> **Product requirements, features, UI references, and current project decisions**
>
> This document describes what Property Fifth is supposed to be and how the application
> should behave. `AGENTS.md` defines how the coding agent should work. `DATABASE.md`
> defines the exact database structure.

---

# 1. Project Overview

**Property Fifth** is a premium real-estate advisory website focused on high-value properties.

The website should feel:

- Premium
- Trustworthy
- Sophisticated
- Clean
- Modern
- Professional
- Easy to use

The product is not intended to be a generic real-estate marketplace.

Only the site admin manages properties. Public users cannot upload or list properties.

---

# 2. Target Customer Categories

The website has two primary customer categories:

1. **NRI / UHNI**
2. **Defence Personnel**

Do not introduce additional visible customer categories unless explicitly requested.

---

# 3. Technology Architecture

Use a **single Next.js full-stack application**.

The same project contains:

- Public website
- Admin interface
- Server-side logic
- API/Route Handlers where required
- Server Actions where useful
- Authentication
- Database access

Do not create a separate Express/NestJS backend.

### Planned stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui where genuinely useful
- Node.js runtime
- PostgreSQL
- Prisma
- Git/GitHub

Database and media storage are intentionally separate setup steps and should not be added during the initial project setup unless explicitly requested.

---

# 4. UI Reference — IMPORTANT

The **`requirements/` folder contains the exact UI reference images for the project.**

These images are the primary visual reference for implementation.

The website should closely reproduce the provided references in:

- Layout
- Section structure
- Spacing
- Typography
- Colors
- Borders
- Cards
- Buttons
- Forms
- Dialogs
- Navigation
- Alignment
- Visual hierarchy
- Overall premium appearance

Do not redesign the UI unnecessarily.

If the reference image shows a specific layout, reproduce that layout rather than replacing it with a generic alternative.

## Image References

The reference images may include placeholder/example property imagery.

**Do not use the reference screenshots themselves as website assets.**

During development, use suitable placeholder images wherever actual property images/assets are not available.

The final property images will be provided/managed separately.

---

# 5. Brand / Visual Direction

The visual identity is based primarily on:

- Deep navy
- Gold
- White
- Subtle neutral tones

The design should feel like a premium property advisory brand rather than a typical property portal.

### Typography

Use an elegant editorial/serif style for major headings where shown in the references, combined with a clean readable sans-serif style for body/UI text.

### Animation

Keep animation restrained.

Do not use Framer Motion.

Avoid:

- Excessive transitions
- Complex scroll animations
- Large motion effects
- Distracting parallax
- Animation that affects usability or causes visual glitches

Simple CSS transitions are preferred where useful.

---

# 6. Public Website

The public website contains these main pages:

1. Home
2. Properties
3. Property Detail
4. Saved Properties
5. Services
6. About Us
7. Contact

---

# 7. Public Header

The public website header should contain:

- Property Fifth logo/brand
- Home
- Properties
- Services
- About Us
- Contact
- Book Consultation

Do not add:

- Defence Community
- Insights
- Unrequested navigation items

The header should follow the provided UI reference.

---

# 8. Home Page

The Home page is a premium landing page.

## Main sections

The Home page should contain the sections represented in the reference:

1. Premium hero section
2. Featured properties
3. Why Choose Property Fifth
4. Services
5. NRI / UHNI section
6. Defence Personnel section
7. Featured locations / location section
8. Statistics / credibility section
9. Final CTA
10. Footer

## Hero

The hero should follow the supplied reference.

Do not add the removed property search/filter card below the hero.

The hero should remain visually strong and premium.

## Featured Properties

Use a one-property-at-a-time carousel.

Each featured property should show:

- Property image
- Property name
- Location
- Configuration/details
- Price
- Relevant status
- View Details action

Property data must eventually come from the Property database records.

## Why Choose Property Fifth

Show the trust/value propositions represented in the reference.

Avoid generic excessive icon cards.

## Services

Show the real-estate services provided by Property Fifth.

Do not fill this section with generic agency jargon.

## NRI / UHNI

Dedicated section explaining the advisory approach for NRI/UHNI customers.

## Defence Personnel

Keep the dedicated section:

**"A Dedicated Approach for Defence Officers & Their Families"**

The section should retain its checklist/value-proposition approach shown in the reference.

## Locations / Statistics

Keep location and credibility/statistics sections separate enough to maintain the premium visual rhythm.

Do not unnecessarily compress multiple major sections into one.

## Final CTA

Keep the final CTA:

**"Let's Find the Right Property for You."**

The CTA should follow the reference design.

---

# 9. Properties Page

The Properties page is the main property discovery page.

## Layout

Use:

- Left filter sidebar
- Property listing/grid area

Do not add a second duplicate filter/search card above the listing.

## Filters

Support the filters represented in the UI:

- Location
- Property Type
- Budget
- BHK / Configuration
- Status
- Area
- Purpose
- Amenities

Filters should work against actual property data.

## Property Card

Property cards should show the information represented in the reference, such as:

- Property image
- Status badge
- Save/heart action
- Property name
- Location
- Configuration
- Price
- View Details

The card should link to the property's detail page.

---

# 10. Property Detail Page

The Property Detail page is the main property information page.

## Top section

Show:

- Large selected property image
- Previous/next image controls
- View All Photos
- Property name
- Status
- Location
- Price
- Key property details
- Request Callback
- Chat on WhatsApp

## Key Details

The page should support the information shown in the reference, including where applicable:

- Property type
- Configuration
- Area range
- Total towers
- Total units
- Total area
- Possession
- RERA number

Only display optional information when it exists.

## Property Content

The detail page supports:

- Overview
- Highlights
- Amenities
- Specifications
- Location
- Gallery
- Brochure

These should follow the reference design.

## Gallery

The gallery should use:

- One large selected image
- Multiple thumbnails
- Previous/next controls
- Selected thumbnail state

Do not implement a 360-degree tour.

## Floor Plans

Do not implement a floor-plan section.

## Amenities

Show the amenities supplied for the property.

## Specifications

Show simple property specification label/value information.

Do not make the admin manage an unnecessarily complex specification system.

## RERA

Show RERA information only when the admin has provided it.

Do not display a fake/placeholder RERA number in production.

## Banks

Show approved/associated banks when provided.

## Brochure

Support a property brochure.

Show brochure information according to the UI reference.

## Video

A property video can be supported when a valid video URL is available.

Do not build a heavy video/media management system.

---

# 11. Saved Properties

The Saved Properties page allows a visitor to see properties they have saved.

A saved property should be associated with the visitor/customer through the application's anonymous `visitorId` mechanism.

Do not require a full customer account/login solely to save a property unless explicitly requested later.

The page should follow the supplied reference.

The **Share Your List** UI may be shown as designed, but a persistent shareable-list system should not be implemented unless explicitly requested.

---

# 12. Customer Lead Collection Dialog

Meaningful customer actions may open the premium lead/detail collection dialog.

Examples include:

- Request Callback
- Book Consultation
- Site Visit / similar meaningful action

Do not show this dialog unnecessarily on normal homepage browsing.

## Dialog design

The dialog should contain:

- Close button at top-right
- Luxury/property image on the left
- Form on the right
- Smooth visual blend/transition between image and form
- Premium styling matching the reference

## Form data

Collect:

- Name
- Email
- Phone

Category:

- NRI / UHNI
- Defence Personnel

Do not ask the user to manually enter location in this form.

If location permission is requested, explain that location will be used for the user's convenience.

Do not use wording that implies location is collected automatically without permission.

---

# 13. Consultation Flow

The site supports general consultation requests and property-related consultation/site-visit requests.

Possible request types:

- Consultation
- Site Visit

The request should collect the required customer details and preferred scheduling information.

The request is stored in `ConsultationRequest`.

Admin can manage the request status.

---

# 14. Callback Flow

A user can request a callback for a specific property.

The callback request must be associated with the selected property.

The request is stored in `CallbackRequest`.

Admin can view and update callback status.

---

# 15. Contact Page

The Contact page should follow the supplied reference.

It should provide:

- Contact information
- Contact form
- Name
- Phone
- Email
- Interest
- Message

Contact submissions are stored as `ContactInquiry`.

Do not add unnecessary fields.

---

# 16. Services Page

The Services page should present actual Property Fifth real-estate advisory services.

The design should:

- Follow the supplied reference
- Use a premium white/light layout where shown
- Keep the header/footer treatment consistent
- Avoid generic filler service cards
- Avoid unnecessary animations

Do not invent unrelated services.

---

# 17. About Us Page

The About Us page should be relatively simple and premium.

It should communicate:

- Who Property Fifth is
- Its advisory approach
- Its customer focus
- Why customers can trust the service

Do not overfill the page with unnecessary sections.

The supplied reference is the visual source of truth.

---

# 18. Admin Area

The admin area is separate from the public website experience.

Do not use the public site's navigation as the admin navigation.

## Admin sidebar

The admin sidebar has exactly three main functional tabs:

1. Property Management
2. Consultation Requests
3. Call Back Requests (For a Property)

Each tab may display a count badge.

Do not add a general Dashboard tab unless explicitly requested.

---

# 19. Admin Login

The admin login is a separate page.

The login UI should follow the supplied reference:

- Split-screen layout
- Luxury visual on the left
- Property Fifth branding/logo
- Login form on the right
- Email
- Password
- Remember Me
- Login to Dashboard

## Important

Do NOT show:

- Forgot Password on the login page
- Separate Secure Admin Access button/option

Password change will be available inside the authenticated admin area.

---

# 20. Admin — Property Management

Property Management allows the admin to:

- Add property
- Edit property
- Delete property
- Save as draft
- Publish property
- Mark as featured
- Remove featured status
- Search properties
- Filter properties
- Preview property

Only admins can manage properties.

There is no public property submission system.

---

# 21. Admin — Add Property

The Add Property interface should be extremely easy to fill.

Use a simple step-based wizard.

## Step 1 — Basic Info

Basic property/project information.

## Step 2 — Details

Pricing, configuration, area, possession, RERA and project facts.

## Step 3 — Property Content

Allow simple entry of:

- Highlights
- Amenities
- Specifications
- Approved/associated banks
- Brochure

The interface should make repeatable fields easy to add/remove.

## Step 4 — Media

Allow:

- Cover image
- Gallery images

Support gallery ordering.

Do not implement:

- 360-degree tour
- Floor-plan manager

## Step 5 — Description

Allow:

- Short description
- Full description

## Step 6 — Review & Publish

Show a preview and allow:

- Save Draft
- Publish

If the final UI reference uses a five-step presentation, combine the above logically to preserve the reference while still covering all required data.

The exact UI should follow the supplied reference.

---

# 22. Admin — Consultation Requests

Show consultation request management.

The admin screen should support:

### Summary

- Total Requests
- New Requests
- Scheduled
- Completed

### Search / Filters

- Name
- Phone
- Email
- Category
- Status
- Date range

### Table

Show relevant fields including:

- Name
- Contact
- Category
- Request Date
- Preferred Time
- Status
- Action

### Status

Support:

- New
- Contacted
- Scheduled
- Completed
- Cancelled

---

# 23. Admin — Callback Requests

Show property-specific callback request management.

### Summary

- Total Requests
- Pending
- Contacted
- Closed

### Search / Filters

- Name
- Phone
- Property
- Status
- Date

### Table

Show:

- Name & Contact
- Property
- Category
- Requested On
- Preferred Time
- Status
- Action

The property column should be able to show property thumbnail/name/location.

### Status

Support:

- New
- Contacted
- Callback Scheduled
- Completed
- Cancelled

---

# 24. Property Data Principles

The admin should enter property data once.

The same property data should power:

```text
Admin
   ↓
Property database
   ↓
Home featured section
Properties listing
Property detail
Saved properties
```

Do not duplicate the same property information in multiple unrelated places.

---

# 25. Image Principles

During development, use placeholders.

Actual property images will be added through the final media system.

The property detail page must support:

- Cover image
- Multiple gallery images
- Gallery order
- Selected image
- Previous/next navigation

Do not add a separate image library.

Do not implement Cloudinary unless explicitly requested.

---

# 26. Features Explicitly Removed

Do not reintroduce these:

- 360° property tours
- Floor plans
- Public seller uploads
- Public agent uploads
- Defence Community navigation
- Insights navigation
- Homepage search/filter card below hero
- Forgot Password on admin login
- Framer Motion
- Unnecessary animations
- Complex CMS/page builder
- Blog/Insights manager
- Marketing automation
- Payment management
- Multiple admin roles
- Property comparison system
- Separate image library
- Unnecessary CRM functionality

---

# 27. Current Admin Scope

The admin intentionally contains only:

```text
Property Management
Consultation Requests
Call Back Requests (For a Property)
```

Do not create additional admin modules unless explicitly requested.

---

# 28. Current Customer Scope

There is currently no full customer account system.

Customer/visitor identification is based on:

```text
Random visitorId
      ↓
First-party cookie
      ↓
Customer record
```

This supports saved properties and associating requests with the same browser/visitor.

Do not implement device fingerprinting.

---

# 29. Current Database Source of Truth

The exact database structure is defined in:

`DATABASE.md`

When implementing the database:

```text
DATABASE.md
    ↓
Prisma schema
    ↓
PostgreSQL
```

Do not invent database fields simply because a field seems convenient.

---

# 30. Current Project Status

## Completed / Decided

- Product concept
- Target customer categories
- Public page structure
- Public navigation
- Property listing concept
- Property detail concept
- Saved Properties concept
- Lead collection dialog
- Consultation flow
- Callback flow
- Admin navigation
- Admin login design
- Property Management scope
- Consultation Requests scope
- Callback Requests scope
- Database table structure
- Database field specification
- Visual/UI references

## To Build

- Initial Next.js project
- Public UI
- Property listing
- Property detail
- Saved properties
- Lead dialogs
- Services
- About Us
- Contact
- Admin UI
- Authentication
- Database integration
- Property CRUD
- Image upload/storage
- Consultation request handling
- Callback request handling
- Production deployment

---

# 31. Development Principle

Build the project in small, controlled stages.

Do not attempt to build everything at once.

Recommended order:

1. Initial Next.js setup
2. Public layout/header/footer
3. Home
4. Properties
5. Property Detail
6. Saved Properties
7. Services
8. About Us
9. Contact
10. Lead dialogs and forms
11. Admin login
12. Admin Property Management
13. Admin Consultation Requests
14. Admin Callback Requests
15. Database integration
16. Authentication/security hardening
17. Media storage
18. Production deployment

The exact order can change when implementation dependencies require it.

---

# 32. Change Management

Before changing an existing feature:

1. Read `AGENTS.md`.
2. Read the relevant parts of `PROJECT.md`.
3. Read `DATABASE.md` if the change involves data.
4. Inspect the existing implementation.
5. Make the smallest change required.
6. Do not modify unrelated features.
7. Verify existing functionality after the change.
8. Update this document if a permanent product requirement or decision changes.

Never silently remove an existing feature to make a new feature easier.

If a new requirement conflicts with an existing requirement, stop and identify the conflict instead of guessing.

---

# 33. Definition of Done

A feature is considered complete only when:

- It matches the approved UI reference.
- It works on desktop and mobile.
- Existing functionality still works.
- No unnecessary dependencies were introduced.
- No unnecessary files were created.
- No temporary/debug code remains.
- TypeScript has no relevant errors.
- The implementation follows `AGENTS.md`.
- Database changes, when applicable, match `DATABASE.md`.
