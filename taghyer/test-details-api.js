// Test the details API endpoint
const fs = require('fs');

const sessionId = '857a8eb3c95eb4dbfe07918c82c96ef4';
const baseUrl = 'https://altaqyeer.q8votes.com/search_request.php';

async function testDetailsAPI() {
  console.log('🔍 Testing Details API\n');
  
  // Test with the user's payload
  const payload = {
    row_id: '2',
    search_id: '30',
    show_details: '1'
  };
  
  console.log('Payload:', JSON.stringify(payload, null, 2));
  console.log('');
  
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': `PHPSESSID=${sessionId}`,
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: new URLSearchParams(payload).toString()
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 200) {
      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = text;
      }
      
      console.log('\n✅ SUCCESS - Response:');
      console.log(JSON.stringify(data, null, 2));
      
      // Save response
      fs.writeFileSync('details-response.json', JSON.stringify(data, null, 2), 'utf8');
      console.log('\n💾 Saved to: details-response.json');
      
      return data;
    } else {
      console.log('❌ Failed');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

// Run test
testDetailsAPI()
  .then(() => console.log('\n✅ Test complete!'))
  .catch(error => console.error('\n❌ Test failed:', error));

