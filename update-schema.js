const fs = require('fs');

const dbMd = `
---

# 9. CommunityPost

Stores posts/questions created by defence personnel in the community discussion section.

| Field | Type | Required | Description |
|---|---|---:|---|
| \`id\` | UUID | Yes | Unique post ID |
| \`customerId\` | UUID | Yes | Author (must be DEFENCE_PERSONNEL) |
| \`title\` | String | Yes | Post title/question |
| \`content\` | Text | Yes | Detailed description |
| \`createdAt\` | DateTime | Yes | Post creation time |
| \`updatedAt\` | DateTime | Yes | Last update time |

# 10. CommunityComment

Stores comments/replies to community posts.

| Field | Type | Required | Description |
|---|---|---:|---|
| \`id\` | UUID | Yes | Unique comment ID |
| \`postId\` | UUID | Yes | The post being commented on |
| \`customerId\` | UUID | Yes | Author |
| \`content\` | Text | Yes | Comment body |
| \`createdAt\` | DateTime | Yes | Comment creation time |
| \`updatedAt\` | DateTime | Yes | Last update time |

# 11. CommunityLike

Stores likes on community posts.

| Field | Type | Required | Description |
|---|---|---:|---|
| \`id\` | UUID | Yes | Unique like ID |
| \`postId\` | UUID | Yes | The post being liked |
| \`customerId\` | UUID | Yes | The user who liked the post |
| \`createdAt\` | DateTime | Yes | Like timestamp |

### Constraint
A customer can like a post only once. UNIQUE(postId, customerId)
`;

fs.appendFileSync('DATABASE.md', dbMd);

const prismaCode = `
model CommunityPost {
  id         String             @id @default(uuid()) @db.Uuid
  customerId String             @db.Uuid
  title      String
  content    String
  createdAt  DateTime           @default(now())
  updatedAt  DateTime           @updatedAt
  customer   Customer           @relation(fields: [customerId], references: [id])
  comments   CommunityComment[]
  likes      CommunityLike[]

  @@index([customerId])
}

model CommunityComment {
  id         String        @id @default(uuid()) @db.Uuid
  postId     String        @db.Uuid
  customerId String        @db.Uuid
  content    String
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt
  post       CommunityPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  customer   Customer      @relation(fields: [customerId], references: [id])

  @@index([postId])
  @@index([customerId])
}

model CommunityLike {
  id         String        @id @default(uuid()) @db.Uuid
  postId     String        @db.Uuid
  customerId String        @db.Uuid
  createdAt  DateTime      @default(now())
  post       CommunityPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  customer   Customer      @relation(fields: [customerId], references: [id])

  @@unique([postId, customerId])
  @@index([postId])
  @@index([customerId])
}
`;

fs.appendFileSync('prisma/schema.prisma', prismaCode);
const customerModel = fs.readFileSync('prisma/schema.prisma', 'utf8');
const updatedCustomer = customerModel.replace('  savedProperties      SavedProperty[]\n}', '  savedProperties      SavedProperty[]\n  communityPosts       CommunityPost[]\n  communityComments    CommunityComment[]\n  communityLikes       CommunityLike[]\n}');
fs.writeFileSync('prisma/schema.prisma', updatedCustomer);
console.log('Appended successfully');
