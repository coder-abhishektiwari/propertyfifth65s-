#!/bin/sh
chown -R nextjs:nodejs /app/storage /app/.next/cache 2>/dev/null || true
su -s /bin/sh -c '
i=0
until npx prisma db push; do
  i=$((i+1))
  if [ "$i" -ge 30 ]; then
    echo "Database not reachable after $i attempts, giving up"
    exit 1
  fi
  echo "Database not reachable yet, retrying in 5s (attempt $i/30)..."
  sleep 5
done
exec node server.js
' nextjs
