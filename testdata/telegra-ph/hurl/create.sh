#!/bin/sh

# Include the set_env.sh script directly
. set_env.sh

# load .env.create
export $(grep -v '^#' .env.create | xargs)

resp=$(hurl create.hurl --cookie cookie.txt)
page_id=$(echo $resp | jq -r '.page_id')
path=$(echo $resp | jq -r '.path')

# save cookie for update
cp cookie.txt cookie.update.txt

# save data for update
set_env .env.update HURL_save_hash $HURL_save_hash
set_env .env.update HURL_page_id $page_id
set_env .env.update HURL_path $path