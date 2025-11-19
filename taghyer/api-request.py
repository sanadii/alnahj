#!/usr/bin/env python3
"""
API Request Script for altaqyeer.q8votes.com
Run with: python api-request.py
"""

import requests
import json

def search_request():
    url = 'https://altaqyeer.q8votes.com/search_request.php'
    
    # Payload
    payload = {
        'sorting': '1',
        'firstname': '',
        'secondname': '',
        'thirdname': '',
        'forthname': '',
        'familyname': '',
        'fullname': '',
        'internal_reference_from': '',
        'internal_reference_to': '',
        'employer': '',
        'team_icon': '',
        'recordPerTime': '100',
        'start_from': '0',
        'search_public_elections': '30'
    }
    
    # Session ID
    session_id = '857a8eb3c95eb4dbfe07918c82c96ef4'
    
    # Headers
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': f'PHPSESSID={session_id}',
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        print(f'Making request to: {url}')
        print(f'Payload: {json.dumps(payload, indent=2, ensure_ascii=False)}')
        print()
        
        response = requests.post(url, data=payload, headers=headers)
        
        print(f'Status: {response.status_code}')
        print(f'Status Text: {response.reason}')
        print(f'Content-Type: {response.headers.get("content-type")}')
        print()
        
        # Try to parse as JSON
        try:
            data = response.json()
            print('Response (JSON):')
            print(json.dumps(data, indent=2, ensure_ascii=False))
            
            # Extract useful info
            if isinstance(data, dict):
                if 'count' in data:
                    print(f'\n📊 Total matches: {data["count"]}')
                if 'message' in data:
                    print(f'📝 Message: {data["message"]}')
        except ValueError:
            print('Response (Text):')
            print(response.text[:2000])  # First 2000 chars
            if len(response.text) > 2000:
                print(f'\n... (truncated, total length: {len(response.text)} chars)')
        
        return response
        
    except requests.exceptions.RequestException as error:
        print(f'Error making request: {error}')
        raise

if __name__ == '__main__':
    try:
        search_request()
        print('\n✓ Request completed')
    except Exception as error:
        print(f'\n✗ Request failed: {error}')

