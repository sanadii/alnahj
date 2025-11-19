// Explore other available APIs on altaqyeer.q8votes.com

const fs = require('fs');

const sessionId = '857a8eb3c95eb4dbfe07918c82c96ef4';
const baseUrl = 'https://altaqyeer.q8votes.com';

// Potential endpoints based on the response structure
const endpoints = [
  // Details endpoint (mentioned in the HTML response)
  {
    name: 'Get Details',
    url: `${baseUrl}/search_details.php`,
    method: 'POST',
    payload: {
      id: '1', // First record ID from previous response
      search_public_elections: '30'
    }
  },
  // Other potential endpoints
  {
    name: 'Get Record by Internal Reference',
    url: `${baseUrl}/get_record.php`,
    method: 'POST',
    payload: {
      internal_reference: '80575',
      search_public_elections: '30'
    }
  },
  {
    name: 'Search by Name',
    url: `${baseUrl}/search_request.php`,
    method: 'POST',
    payload: {
      sorting: '1',
      firstname: 'محمد',
      secondname: '',
      thirdname: '',
      forthname: '',
      familyname: '',
      fullname: '',
      internal_reference_from: '',
      internal_reference_to: '',
      employer: '',
      team_icon: '',
      recordPerTime: '10',
      start_from: '0',
      search_public_elections: '30'
    }
  },
  {
    name: 'Get Statistics',
    url: `${baseUrl}/statistics.php`,
    method: 'GET',
    payload: null
  },
  {
    name: 'Get Elections List',
    url: `${baseUrl}/elections_list.php`,
    method: 'GET',
    payload: null
  },
  {
    name: 'User Info',
    url: `${baseUrl}/user_info.php`,
    method: 'GET',
    payload: null
  }
];

async function testEndpoint(endpoint) {
  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${endpoint.name}`);
    console.log(`URL: ${endpoint.url}`);
    console.log(`Method: ${endpoint.method}`);
    
    const options = {
      method: endpoint.method,
      headers: {
        'Cookie': `PHPSESSID=${sessionId}`,
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    if (endpoint.method === 'POST' && endpoint.payload) {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      options.body = new URLSearchParams(endpoint.payload).toString();
      console.log('Payload:', JSON.stringify(endpoint.payload, null, 2));
    }

    const response = await fetch(endpoint.url, options);
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 200) {
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = text.substring(0, 500); // First 500 chars
        }
      }
      
      console.log('✅ SUCCESS - Response:');
      if (typeof data === 'string') {
        console.log(data);
      } else {
        console.log(JSON.stringify(data, null, 2).substring(0, 1000));
      }
      
      return { endpoint: endpoint.name, status: 'success', data };
    } else {
      console.log('❌ FAILED');
      return { endpoint: endpoint.name, status: 'failed', code: response.status };
    }
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return { endpoint: endpoint.name, status: 'error', error: error.message };
  }
}

async function exploreAllEndpoints() {
  console.log('🔍 Exploring Available APIs on altaqyeer.q8votes.com');
  console.log('Session ID:', sessionId);
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
  }
  
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status !== 'success');
  
  console.log(`\n✅ Successful: ${successful.length}`);
  successful.forEach(r => console.log(`   - ${r.endpoint}`));
  
  console.log(`\n❌ Failed: ${failed.length}`);
  failed.forEach(r => console.log(`   - ${r.endpoint}`));
  
  // Save results
  fs.writeFileSync('api-exploration-results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\n💾 Results saved to: api-exploration-results.json');
}

// Run exploration
exploreAllEndpoints()
  .then(() => console.log('\n✅ Exploration complete!'))
  .catch(error => console.error('\n❌ Exploration failed:', error));

