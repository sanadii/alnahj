// API Request Script for altaqyeer.q8votes.com
// Run with: node api-request.js

async function searchRequest() {
  const url = 'https://altaqyeer.q8votes.com/search_request.php';
  
  // Payload
  const payload = {
    sorting: '1',
    firstname: '',
    secondname: '',
    thirdname: '',
    forthname: '',
    familyname: '',
    fullname: '',
    internal_reference_from: '',
    internal_reference_to: '',
    employer: '',
    team_icon: '',
    recordPerTime: '100',
    start_from: '0',
    search_public_elections: '30'
  };

  // Session ID
  const sessionId = '857a8eb3c95eb4dbfe07918c82c96ef4';

  try {
    console.log('Making request to:', url);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': `PHPSESSID=${sessionId}`,
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: new URLSearchParams(payload).toString()
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);

    let data;
    if (contentType?.includes('application/json')) {
      data = await response.json();
      console.log('\nResponse (JSON):');
      console.log(JSON.stringify(data, null, 2));
    } else {
      data = await response.text();
      console.log('\nResponse (Text):');
      console.log(data);
    }

    return data;
  } catch (error) {
    console.error('Error making request:', error);
    throw error;
  }
}

// Execute the request
searchRequest()
  .then(() => console.log('\n✓ Request completed'))
  .catch((error) => console.error('\n✗ Request failed:', error));

