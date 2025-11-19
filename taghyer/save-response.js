// API Request Script - Saves response to file
const fs = require('fs');

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
    console.log('🚀 Making request to:', url);
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));
    console.log('');
    
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

    console.log('✅ Status:', response.status, response.statusText);
    
    const contentType = response.headers.get('content-type');
    console.log('📄 Content-Type:', contentType);
    console.log('');

    let data;
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = text;
      }
    }

    // Save full response
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `response-${timestamp}.json`;
    
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
    console.log('💾 Full response saved to:', filename);
    
    // Save summary
    if (typeof data === 'object' && data !== null) {
      const summary = {
        timestamp: new Date().toISOString(),
        status: response.status,
        count: data.count || 'N/A',
        message: data.message || 'N/A',
        recordsReturned: Array.isArray(data.data) ? data.data.length : 0,
        notify: data.notify || 'N/A',
        query: data.query2 || 'N/A'
      };
      
      fs.writeFileSync('response-summary.json', JSON.stringify(summary, null, 2), 'utf8');
      console.log('📊 Summary saved to: response-summary.json');
      console.log('');
      console.log('Summary:');
      console.log('  Total matches:', summary.count);
      console.log('  Records returned:', summary.recordsReturned);
      console.log('  Message:', summary.message.replace(/<[^>]*>/g, '').trim());
    }

    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

// Execute
searchRequest()
  .then(() => console.log('\n✅ Request completed successfully!'))
  .catch((error) => console.error('\n❌ Request failed:', error));

