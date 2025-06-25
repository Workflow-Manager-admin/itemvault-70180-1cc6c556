#!/bin/bash
cd /home/kavia/workspace/code-generation/itemvault-70180-1cc6c556/backend_api_workspace/backend_api
source venv/bin/activate
flake8 .
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

