# Property Fifth — Database Specification

> **Source of truth for application data structure**
>
> This document defines the final database contract for the Property Fifth project.
> Do not add, remove, rename, or change fields, relationships, enums, or constraints
> without updating this document first.

## Design Principles

- Keep the schema minimal and practical.
- Avoid unnecessary tables and duplication.
- Property content that is repeatable but does not need independent lifecycle management
  is stored as structured JSON on `Property`.
- User-facing customer identity is based on a random first-party `visitorId`,
  not a device fingerprint.
- `PropertyImage` is the single source of truth for property images and the cover image.
- Admin operations are protected server-side.
- Database credentials and secrets never belong in client-side code.

---

# 1. Admin

Stores the administrator account used to access the admin panel.

| Field | Type | Required | Unique | Description |
|---|---|---:|---:|---|
| `id` | UUID | Yes | Yes | Unique admin ID |
| `email` | String | Yes | Yes | Admin login email |
| `passwordHash` | String | Yes | No | Securely hashed password |
| `createdAt` | DateTime | Yes | No | Account creation time |
| `updatedAt` | DateTime | Yes | No | Last account update time |

### Notes

- Do not store a plain-text password.
- `remember me` is handled by the authentication/session layer, not by a database boolean.

---

# 2. Customer

Stores the visitor/customer profile used across lead capture and saved properties.

| Field | Type | Required | Unique | Description |
|---|---|---:|---:|---|
| `id` | UUID | Yes | Yes | Unique customer ID |
| `visitorId` | String | Yes | Yes | Random opaque first-party browser identifier |
| `name` | String | No | No | Customer name |
| `email` | String | No | No | Customer email |
| `phone` | String | No | No | Customer phone number |
| `category` | Enum | No | No | `NRI_UHNI` or `DEFENCE_PERSONNEL` |
| `city` | String | No | No | Detected/provided city |
| `state` | String | No | No | Detected/provided state |
| `country` | String | No | No | Detected/provided country |
| `latitude` | Decimal | No | No | Location latitude, when permission is granted |
| `longitude` | Decimal | No | No | Location longitude, when permission is granted |
| `locationCapturedAt` | DateTime | No | No | Time location was captured |
| `createdAt` | DateTime | Yes | No | First record creation |
| `updatedAt` | DateTime | Yes | No | Last profile update |

### Category values

```text
NRI_UHNI
DEFENCE_PERSONNEL
```

### Notes

- `visitorId` is generated randomly and stored in a first-party cookie.
- Do not use a device fingerprint as the primary customer identifier.
- Location fields are nullable because permission may be denied.
- Customer data may exist before the user has supplied their full name/email/phone.

---

# 3. Property

Stores the main property/project information used by the Home page, Properties page,
Property Detail page, Saved Properties page, and Admin Property Management.

## Identity

| Field | Type | Required | Unique | Description |
|---|---|---:|---:|---|
| `id` | UUID | Yes | Yes | Unique property ID |
| `name` | String | Yes | No | Property display name |
| `slug` | String | Yes | Yes | Unique URL-friendly identifier |
| `developerName` | String | No | No | Developer / builder name |

## Classification

| Field | Type | Required | Description |
|---|---|---:|---|
| `propertyType` | Enum | Yes | Property category |
| `purpose` | Enum | No | Primary purpose |
| `status` | Enum | No | Current property status |
| `featured` | Boolean | Yes | Whether shown in featured sections |
| `published` | Boolean | Yes | Whether publicly visible |

### `propertyType` values

```text
APARTMENT
VILLA
PENTHOUSE
PLOT
COMMERCIAL
INDEPENDENT_FLOOR
OTHER
```

### `purpose` values

```text
END_USE
INVESTMENT
BOTH
```

### `status` values

```text
NEW_LAUNCH
UNDER_CONSTRUCTION
READY_TO_MOVE
RESALE
SOLD_OUT
OTHER
```

## Location

| Field | Type | Required | Description |
|---|---|---:|---|
| `address` | Text | Yes | Full property address |
| `locality` | String | Yes | Sector/locality/area |
| `city` | String | Yes | City |
| `state` | String | No | State |
| `pincode` | String | No | Postal code |
| `latitude` | Decimal | No | Property latitude |
| `longitude` | Decimal | No | Property longitude |
| `mapUrl` | String | No | Google Maps / map link |

## Pricing

| Field | Type | Required | Description |
|---|---|---:|---|
| `priceMin` | Decimal | Yes | Minimum/starting price |
| `priceMax` | Decimal | No | Maximum price |
| `priceLabel` | String | No | Display text such as `Onwards` or custom price wording |

### Notes

- `priceMin` supports listing cards such as `Starting ₹3.50 Cr*`.
- `priceMax` supports detail-page ranges such as `₹2.60 Cr – ₹6.75 Cr`.
- `priceLabel` is presentation text and may be optional.

## Property Details

| Field | Type | Required | Description |
|---|---|---:|---|
| `configuration` | String | No | Examples: `3 BHK`, `3, 4 & 5 BHK` |
| `areaMin` | Decimal | No | Minimum area |
| `areaMax` | Decimal | No | Maximum area |
| `areaUnit` | String | No | Examples: `sq.ft.`, `sq.yd.` |
| `possession` | String | No | Possession/completion information |
| `totalTowers` | Integer | No | Total project towers |
| `totalUnits` | Integer | No | Total project units |
| `totalArea` | String | No | Total project/land area as display value |

## Legal

| Field | Type | Required | Description |
|---|---|---:|---|
| `reraNumber` | String | No | RERA registration number |
| `legalNote` | Text | No | Optional legal/compliance note |

## Descriptions

| Field | Type | Required | Description |
|---|---|---:|---|
| `shortDescription` | Text | No | Short listing/detail summary |
| `description` | Text | No | Full property overview |

## Structured Content

| Field | Type | Required | Description |
|---|---|---:|---|
| `highlights` | JSON | No | Repeatable highlight items shown on detail page |
| `amenities` | JSON | No | Repeatable amenity items |
| `specifications` | JSON | No | Repeatable specification label/value items |
| `bankApproved` | JSON | No | Approved/associated bank names and optional logo references |

### `highlights` example

```json
[
  "75% Open Green Space",
  "20,000+ Sq.Ft. Clubhouse",
  "Double Height Grand Entrance Lobby",
  "3-Tier Security System",
  "EV Charging Stations"
]
```

### `amenities` example

```json
[
  "Clubhouse",
  "Swimming Pool",
  "Gymnasium",
  "Yoga Deck",
  "Kids Play Area",
  "Indoor Games",
  "Jogging Track",
  "Tennis Court",
  "Basketball Court",
  "Co-working Space",
  "24x7 Security",
  "Power Backup"
]
```

### `specifications` example

```json
[
  {
    "label": "Flooring",
    "value": "Premium Vitrified Tiles"
  },
  {
    "label": "Kitchen",
    "value": "Modular Kitchen"
  },
  {
    "label": "Bathrooms",
    "value": "Premium Sanitary Fittings"
  }
]
```

### `bankApproved` example

```json
[
  {
    "name": "HDFC Bank",
    "logo": "/..."
  },
  {
    "name": "ICICI Bank",
    "logo": "/..."
  },
  {
    "name": "SBI",
    "logo": "/..."
  }
]
```

## Media / Documents

| Field | Type | Required | Description |
|---|---|---:|---|
| `videoUrl` | String | No | Property/project video URL |
| `brochureUrl` | String | No | Brochure URL/path |
| `brochureName` | String | No | Display filename |
| `brochureSize` | String | No | Display size such as `8.4 MB` |

## Timestamps

| Field | Type | Required | Description |
|---|---|---:|---|
| `createdAt` | DateTime | Yes | Property creation time |
| `updatedAt` | DateTime | Yes | Last property update time |

### Important Property rules

- Do **not** add a `coverImage` field here.
- The cover image is determined by `PropertyImage.isCover`.
- Do **not** duplicate configuration into separate `bedrooms` / `bathrooms` fields unless a future requirement explicitly needs them.
- No 360° tour data.
- No floor-plan data.
- No separate `Developer` or `Location` table in the current architecture.

---

# 4. PropertyImage

Stores the cover image and gallery images belonging to a property.

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | UUID | Yes | Unique image ID |
| `propertyId` | UUID | Yes | Related property |
| `imageUrl` | String | Yes | Image path/URL |
| `sortOrder` | Integer | Yes | Gallery display order |
| `isCover` | Boolean | Yes | Whether this image is the property's cover image |
| `createdAt` | DateTime | Yes | Image record creation time |

### Constraints

- A property must have at most one `isCover = true` image.
- `sortOrder` controls thumbnail/gallery order.
- The gallery UI uses these records for the large selected image, thumbnails, and previous/next navigation.

---

# 5. SavedProperty

Stores the relationship between a customer and a saved property.

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | UUID | Yes | Unique saved-record ID |
| `customerId` | UUID | Yes | Customer who saved the property |
| `propertyId` | UUID | Yes | Saved property |
| `createdAt` | DateTime | Yes | Time it was saved |

### Constraint

```text
UNIQUE(customerId, propertyId)
```

A customer cannot save the same property more than once.

---

# 6. ConsultationRequest

Stores general consultation requests and property-related consultation/site-visit requests.

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | UUID | Yes | Unique request ID |
| `customerId` | UUID | No | Related customer, when available |
| `propertyId` | UUID | No | Related property, when applicable |
| `name` | String | Yes | Requester's name |
| `email` | String | Yes | Requester's email |
| `phone` | String | Yes | Requester's phone |
| `category` | Enum | Yes | `NRI_UHNI` or `DEFENCE_PERSONNEL` |
| `requestType` | Enum | Yes | `CONSULTATION` or `SITE_VISIT` |
| `preferredDate` | Date | No | Preferred date |
| `preferredTime` | String | No | Preferred time |
| `message` | Text | No | Optional requirement/message |
| `status` | Enum | Yes | Current request status |
| `createdAt` | DateTime | Yes | Request creation time |
| `updatedAt` | DateTime | Yes | Last update time |

### `requestType` values

```text
CONSULTATION
SITE_VISIT
```

### `status` values

```text
NEW
CONTACTED
SCHEDULED
COMPLETED
CANCELLED
```

### Notes

- `propertyId` is optional because a consultation can be general.
- This table covers the Admin `Consultation Requests` section.
- Site visits are not given a separate table.

---

# 7. CallbackRequest

Stores callback requests made for a specific property.

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | UUID | Yes | Unique callback request ID |
| `customerId` | UUID | No | Related customer, when available |
| `propertyId` | UUID | Yes | Property the user wants a callback about |
| `name` | String | Yes | Requester's name |
| `email` | String | Yes | Requester's email |
| `phone` | String | Yes | Requester's phone |
| `category` | Enum | Yes | `NRI_UHNI` or `DEFENCE_PERSONNEL` |
| `preferredDate` | Date | No | Preferred callback date |
| `preferredTime` | String | Yes | Preferred callback time |
| `message` | Text | No | Optional requirement/message |
| `status` | Enum | Yes | Current callback status |
| `createdAt` | DateTime | Yes | Request creation time |
| `updatedAt` | DateTime | Yes | Last update time |

### `status` values

```text
NEW
CONTACTED
CALLBACK_SCHEDULED
COMPLETED
CANCELLED
```

### Notes

- `propertyId` is required.
- This table powers the Admin `Call Back Requests (For a Property)` section.

---

# 8. ContactInquiry

Stores submissions from the public Contact Us page.

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | UUID | Yes | Unique inquiry ID |
| `customerId` | UUID | No | Related customer, when available |
| `name` | String | Yes | Visitor name |
| `email` | String | Yes | Visitor email |
| `phone` | String | No | Visitor phone |
| `query` | Text | No | Visitor query |
| `createdAt` | DateTime | Yes | Submission time |

### Note

There is currently no Admin UI for Contact Inquiries. This table is retained so Contact Us submissions can be persisted without changing the public form architecture later.

---

# Relationships

```text
Admin
  └── standalone admin account

Customer
  ├── SavedProperty
  ├── ConsultationRequest
  ├── CallbackRequest
  └── ContactInquiry

Property
  ├── PropertyImage
  ├── SavedProperty
  ├── ConsultationRequest (optional)
  └── CallbackRequest

PropertyImage
  └── belongs to one Property
```

## Relationship rules

```text
Customer 1 ──── * SavedProperty
Property  1 ──── * SavedProperty

Property  1 ──── * PropertyImage

Customer 1 ──── * ConsultationRequest
Property  0 ──── * ConsultationRequest

Customer 1 ──── * CallbackRequest
Property  1 ──── * CallbackRequest

Customer 1 ──── * ContactInquiry
```

---

# Current UI → Database Mapping

## Home

```text
Featured Property
→ Property.featured

Property image
→ PropertyImage

Property name
→ Property.name

Location
→ Property.locality / city

Price
→ Property.priceMin / priceLabel
```

## Properties Listing

```text
Property cards
→ Property

Search/filter
→ propertyType
→ purpose
→ status
→ city/locality
→ priceMin/priceMax
→ configuration
→ areaMin/areaMax
```

## Property Detail

```text
Main image/gallery
→ PropertyImage

Overview
→ Property.description

Project facts
→ totalTowers
→ totalUnits
→ totalArea

Highlights
→ Property.highlights

Amenities
→ Property.amenities

Specifications
→ Property.specifications

Location
→ address/locality/city/state/mapUrl

RERA
→ reraNumber

Bank approvals
→ bankApproved

Brochure
→ brochureUrl/brochureName/brochureSize
```

## Saved Properties

```text
Customer + Property
→ SavedProperty
```

## Lead Collection Dialog

```text
Name
→ Customer.name

Email
→ Customer.email

Phone
→ Customer.phone

NRI / UHNI
or
Defence Personnel
→ Customer.category

Location
→ Customer.city/state/country/latitude/longitude
```

## Consultation

```text
General consultation
→ ConsultationRequest.requestType = CONSULTATION

Site visit
→ ConsultationRequest.requestType = SITE_VISIT
```

## Callback

```text
Property-specific callback
→ CallbackRequest.propertyId
```

## Contact Us

```text
Name
Email
Phone
Interest
Message
→ ContactInquiry
```

---

# Explicitly Out of Scope

The current database does not contain tables/entities for:

```text
Developer
Location
Service
AboutPage
Testimonial
FAQ
WebsiteSettings
360Tour
FloorPlan
Payment
CRM
MarketingCampaign
```

They are intentionally excluded from the current scope.

---

# Schema Change Rule

Before changing the database:

1. Update this document.
2. Confirm the change is actually required.
3. Only then update the ORM schema/migration.
4. Do not introduce duplicate fields that represent the same UI data.
