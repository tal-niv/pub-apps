def lambda_handler(event, context):
    """
    Lambda function that responds with Hello World!
    Triggered via Function URL with GET request
    """
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*'
        },
        'body': 'Hello World!!'
    }
