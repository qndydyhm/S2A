#!/bin/zsh
find . -iregex ".*\.\(js\|ts\|html\)" -exec md5sum {} \;
