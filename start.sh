#!/bin/bash
until npm run dev; do
    echo "'npm run dev' crashed with exit code $?.  Respawning.." >&2
    sleep 1
done
