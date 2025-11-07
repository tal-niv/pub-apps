# Hello World Lambda Function

A simple AWS Lambda function with a public Function URL that responds with "Hello World!!" to GET requests.

## Architecture

- **Runtime**: Python 3.11
- **Infrastructure**: AWS SAM (Serverless Application Model)
- **Access**: Public Function URL (no authentication)
- **Method**: GET

## Project Structure

```
.
├── lambda_function.py    # Lambda function handler
├── template.yaml         # SAM Infrastructure as Code template
├── requirements.txt      # Python dependencies (currently empty)
└── README.md            # This file
```

## Prerequisites

1. **AWS CLI** - [Install AWS CLI](https://aws.amazon.com/cli/)
2. **AWS SAM CLI** - [Install SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
3. **AWS Account** with appropriate permissions
4. **AWS Credentials** configured (`aws configure`)

## Deployment Instructions

### 1. Build the application

```bash
sam build
```

### 2. Deploy the application

For first-time deployment (guided):

```bash
sam deploy --guided
```

You'll be prompted for:
- **Stack Name**: Choose a name (e.g., `hello-world-lambda`)
- **AWS Region**: Select your preferred region (e.g., `us-east-1`)
- **Confirm changes**: Y
- **Allow SAM CLI IAM role creation**: Y
- **Disable rollback**: N
- **HelloWorldFunction has no authentication**: Y (confirm public access)
- **Save arguments to configuration file**: Y

For subsequent deployments:

```bash
sam deploy
```

### 3. Get the Function URL

After deployment completes, the Function URL will be displayed in the outputs:

```
Outputs
------------------------------------------------------------------------
Key                 HelloWorldFunctionUrl
Description         Function URL for Hello World Lambda
Value               https://xxxxxxxxxx.lambda-url.us-east-1.on.aws/
------------------------------------------------------------------------
```

### 4. Test the Function

Use curl or your browser:

```bash
curl https://xxxxxxxxxx.lambda-url.us-east-1.on.aws/
```

Expected response:
```
Hello World!!
```

## Local Testing (Optional)

Test locally before deploying:

```bash
sam local invoke HelloWorldFunction
```

Or start a local API:

```bash
sam local start-lambda
```

## Updating the Function

1. Modify `lambda_function.py`
2. Run `sam build`
3. Run `sam deploy`

## Cleanup

To delete all resources:

```bash
sam delete
```

Or delete via AWS CloudFormation console by deleting the stack.

## Security Note

This function has **no authentication** and is publicly accessible. For production use, consider:
- Adding IAM authentication
- Implementing API Gateway with API keys
- Adding AWS WAF rules
- Restricting CORS origins

## Costs

This setup uses AWS Free Tier eligible services:
- Lambda: 1M requests/month free
- Lambda: 400,000 GB-seconds of compute time/month free

After free tier, costs are minimal for low traffic.
