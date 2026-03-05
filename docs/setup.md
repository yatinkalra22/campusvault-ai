# CampusVault AI - Setup Guide

## Prerequisites

- Node.js >= 20.x
- npm >= 10.x
- AWS CLI v2 configured (`aws configure`)
- AWS account with Bedrock access (Nova models enabled in us-east-1)
- Git

## Quick Start

```bash
# Clone & install
git clone <repo-url>
cd campusvault-ai
npm install

# Backend
cp apps/backend/.env.example apps/backend/.env
# Edit .env with your AWS credentials and Cognito config
npm run backend:dev

# Mobile/Web (new terminal)
cp apps/mobile/.env.example apps/mobile/.env
# Edit .env with API URL
npm run mobile:web     # browser
npm run mobile:start   # expo go
```

## AWS Setup

### 1. Enable Nova on Bedrock
AWS Console > Bedrock > Model access > Request:
- `amazon.nova-pro-v1:0`, `amazon.nova-lite-v1:0`
- `amazon.nova-sonic-v1:0`, `amazon.nova-embed-v1:0`

### 2. Create DynamoDB Tables
See `docs/data-model.md` for table schemas. Create with PAY_PER_REQUEST billing in us-east-1.

### 3. Create S3 Bucket
```bash
aws s3api create-bucket --bucket campusvault-images-dev --region us-east-1
```
Enable CORS, block public access (presigned URLs only).

### 4. Create Cognito User Pool
```bash
aws cognito-idp create-user-pool \
  --pool-name campusvault-users \
  --auto-verified-attributes email \
  --schema '[{"Name":"email","Required":true,"Mutable":true},{"Name":"custom:role","AttributeDataType":"String","Mutable":true}]' \
  --region us-east-1
```
Create app client with `ALLOW_USER_PASSWORD_AUTH`, `ALLOW_REFRESH_TOKEN_AUTH`, `ALLOW_USER_SRP_AUTH`.

### 5. IAM Role
Policies needed: DynamoDB, S3, Bedrock (InvokeModel), SES. For local dev, use AWS credentials in `.env`.

## Development

```bash
# Terminal 1: Backend (http://localhost:3001, Swagger at /api)
npm run backend:dev

# Terminal 2: Expo
npm run mobile:web
```
