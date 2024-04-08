#!/bin/sh

# Define a method to set environment variables
function set_env() {
    local env_file=$1
    local name=$2
    local new_value=$3

    if [ -z "$env_file" ] || [ -z "$name" ] || [ -z "$new_value" ]; then
      echo "Usage: set_env <env_file> <name> <new_value>"
      return 1
    fi

    if grep -q "^$name=" $env_file; then
      sed -i '' "s/^$name=.*/$name=$new_value/" $env_file
    else
      echo "$name=$new_value" >> $env_file
    fi

    echo "$name written to $env_file, values are:\n$name=$new_value"
}
