#!/bin/bash
# AWS Deploy Script for Lambda Function

# Before running script, sign in to AWS CLI
# using `aws configure` and provide your credentials.
# Ensure you are at backend folder of project.

npm ci && \
git archive HEAD --format=zip -o code.zip . && \
zip -r code.zip node_modules/ && \
aws lambda update-function-code \
    --function-name backend \
    --zip-file fileb://code.zip