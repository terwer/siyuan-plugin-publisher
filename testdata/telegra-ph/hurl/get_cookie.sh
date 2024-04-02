#!/bin/sh

# Include the set_env.sh script directly
. set_env.sh

resp=$(hurl get_cookie.hurl --cookie-jar cookie.txt)
save_hash=$(echo $resp | jq -r '.save_hash')
set_env .env.create HURL_save_hash $save_hash