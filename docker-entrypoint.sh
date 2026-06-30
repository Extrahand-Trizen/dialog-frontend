#!/bin/sh
set -eu

API_URL="${VITE_API_URL:-${API_URL:-http://localhost:4010/api/v1}}"

escape_js() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

API_URL_ESCAPED="$(escape_js "$API_URL")"

cat > /usr/share/nginx/html/runtime-config.js <<EOF
window.__RUNTIME_CONFIG__ = Object.freeze({
  "VITE_API_URL": "${API_URL_ESCAPED}"
});
EOF

exec nginx -g 'daemon off;'
