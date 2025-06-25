#!/bin/bash
cd /home/kavia/workspace/code-generation/itemvault-70180-1cc6c556/frontend_app_workspace/frontend_app
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

