#!/bin/sh

# load .env
export $(grep -v '^#' .env.update | xargs)

resp=$(hurl update.hurl --cookie cookie.txt)
echo $resp