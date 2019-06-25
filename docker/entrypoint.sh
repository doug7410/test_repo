#!/bin/bash
set -e

/docker/configure.sh
/usr/bin/supervisord -n
