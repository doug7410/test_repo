#!/bin/bash -ex

mkdir -p reports
confd -backend env -onetime
