import json
import os
import boto3
from datetime import datetime
from prompts import SYSTEM_PROMPT

# Initialize Bedrock client (or any other LLM client)
bedrock = boto3.client('bedrock-runtime')

def call_llm(prompt):
    """
    Calls the LLM (AWS Bedrock - Claude 3 Sonnet example) to parse the deal.
    """
    # Configuration for Bedrock (Claude 3)
    model_id = "anthropic.claude-3-sonnet-20240229-v1:0"
    
    payload = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1000,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "system": SYSTEM_PROMPT
    }

    try:
        response = bedrock.invoke_model(
            modelId=model_id,
            body=json.dumps(payload)
        )
        
        result = json.loads(response['body'].read())
        response_text = result['content'][0]['text']
        
        # Attempt to parse JSON from the response
        # Sometimes LLMs might add extra text, so we try to find the JSON block
        start_index = response_text.find('{')
        end_index = response_text.rfind('}') + 1
        
        if start_index != -1 and end_index != -1:
            json_str = response_text[start_index:end_index]
            return json.loads(json_str)
        else:
            return json.loads(response_text)
            
    except Exception as e:
        print(f"Error calling LLM: {e}")
        # Fallback or re-raise depending on requirements
        return None

def handler(event, context):
    """
    Lambda handler to process email content and extract deals.
    Expected event format:
    {
        "subject": "50% Off All Jeans!",
        "body": "...",
        "userId": "..."
    }
    """
    print("Received event:", json.dumps(event))
    
    subject = event.get('subject', '')
    body = event.get('body', '')
    user_id = event.get('userId', 'anonymous')
    current_date = datetime.now().strftime("%Y-%m-%d")
    
    if not body and not subject:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'No email content provided'})
        }

    # Construct the prompt
    full_prompt = f"""
    Current Date: {current_date}
    Subject: {subject}
    Body: {body}
    """
    
    # Call the LLM
    deal_data = call_llm(full_prompt)
    
    if not deal_data:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to parse deal data'})
        }
    
    # Add metadata
    deal_data['userId'] = user_id
    deal_data['parsedAt'] = datetime.now().isoformat()
    
    # Save to DynamoDB
    try:
        table_name = os.environ.get('DEALS_TABLE_NAME')
        if table_name:
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table(table_name)
            table.put_item(Item=deal_data)
            print(f"Saved deal to {table_name}")
        else:
            print("DEALS_TABLE_NAME environment variable not set, skipping save.")
    except Exception as e:
        print(f"Error saving to DynamoDB: {e}")
        # We might not want to fail the whole request if save fails, but good to log
    
    return {
        'statusCode': 200,
        'body': json.dumps(deal_data)
    }
