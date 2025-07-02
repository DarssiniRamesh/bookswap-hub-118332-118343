#!/bin/bash
cd /home/kavia/workspace/code-generation/bookswap-hub-118332-118343/book_marketplace_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

