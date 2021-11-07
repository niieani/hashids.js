#!/usr/bin/env bash

declare file="esm/hashids.js"

declare file_contents
file_contents=$(<$file)

declare replacement="from './util.js'"

echo "${file_contents//from \'.\/util\'/${replacement}}" >"$file"
