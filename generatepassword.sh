#!/bin/bash

# SALT REQUIRED TO BE SET BY USER
if [ -z "$SALT_FOR_PASSWORD" ]
then
  echo "You must set an environment variable called 'SALT_FOR_PASSWORD'"
  exit 0
fi

# UNIQUE KEYWORD OR URL TO BE USED TO GENERATE PASSWORD
if [ -z "$1" ]
then
  echo "You must specify a keyword (like a URL) for the password"
  exit 0
fi

# IF SYSTEM USES MD5 COMMAND
if type "md5" > /dev/null 2>&1; then
  NEW_PASSWORD=$(echo -n "$1$SALT_FOR_PASSWORD" | md5)
fi

# IF SYSTEM USES MD5SUM
if type "md5sum" > /dev/null 2>&1; then
  NEW_PASSWORD=$(echo -n "$1$SALT_FOR_PASSWORD" | md5sum | awk '{ print $1 }')
fi

# COPY TO CLIPBOARD IF USER HAS PBCOPY (MAC)
if type "pbcopy" > /dev/null 2>&1; then
  echo "Copied to your default clipboard with pbcopy!"
  echo -n "$NEW_PASSWORD" | pbcopy
  echo "$NEW_PASSWORD"
  exit 1
fi

# COPY TO CLIPBOARD IF XCLIP IS INSTALLED (LINUX)
if type "xclip" > /dev/null 2>&1; then
  echo "Copied to your default clipboard with xclip!"
  echo -n "$NEW_PASSWORD" | xclip
  echo "$NEW_PASSWORD"
  exit 1
fi

echo "$NEW_PASSWORD"