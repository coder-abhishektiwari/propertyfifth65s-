#!/bin/sh
chown -R nextjs:nodejs /app/storage /app/.next/cache 2>/dev/null || true
su -s /bin/sh -c "npx prisma db push && node server.js" nextjs
