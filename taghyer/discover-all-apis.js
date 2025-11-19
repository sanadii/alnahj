// Comprehensive API Discovery for altaqyeer.q8votes.com
const fs = require('fs');

const sessionId = '857a8eb3c95eb4dbfe07918c82c96ef4';
const baseUrl = 'https://altaqyeer.q8votes.com';

// All possible API endpoints and parameter combinations
const apiTests = [
  
  // ===== SEARCH REQUEST API =====
  {
    name: 'Search API - Get All Records',
    url: `${baseUrl}/search_request.php`,
    method: 'POST',
    payload: {
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
      recordPerTime: '10',
      start_from: '0',
      search_public_elections: '30'
    }
  },
  
  // ===== DETAILS API =====
  {
    name: 'Details API - Single Record Details',
    url: `${baseUrl}/search_request.php`,
    method: 'POST',
    payload: {
      row_id: '1',
      search_id: '30',
      show_details: '1'
    }
  },
  
  {
    name: 'Details API - Another Record',
    url: `${baseUrl}/search_request.php`,
    method: 'POST',
    payload: {
      row_id: '100',
      search_id: '30',
      show_details: '1'
    }
  },
  
  // ===== POTENTIAL VARIATIONS =====
  {
    name: 'Get Related Records',
    url: `${baseUrl}/search_request.php`,
    method: 'POST',
    payload: {
      row_id: '1',
      search_id: '30',
      show_related: '1'
    }
  },
  
  {
    name: 'Export Data',
    url: `${baseUrl}/search_request.php`,
    method: 'POST',
    payload: {
      export: '1',
      search_public_elections: '30'
    }
  },
  
  // ===== OTHER POTENTIAL ENDPOINTS =====
  {
    name: 'Get User Account Info',
    url: `${baseUrl}/account.php`,
    method: 'GET',
    payload: null
  },
  
  {
    name: 'Get User Balance',
    url: `${baseUrl}/balance.php`,
    method: 'GET',
    payload: null
  },
  
  {
    name: 'Get Points',
    url: `${baseUrl}/points.php`,
    method: 'GET',
    payload: null
  },
  
  {
    name: 'Dashboard',
    url: `${baseUrl}/dashboard.php`,
    method: 'GET',
    payload: null
  },
  
  {
    name: 'Index/Home',
    url: `${baseUrl}/index.php`,
    method: 'GET',
    payload: null
  },
  
  {
    name: 'Get Elections',
    url: `${baseUrl}/elections.php`,
    method: 'GET',
    payload: null
  },
  
  {
    name: 'Get Election 30 Info',
    url: `${baseUrl}/election_info.php`,
    method: 'POST',
    payload: {
      election_id: '30'
    }
  },
  
  {
    name: 'Search Details (Separate Endpoint)',
    url: `${baseUrl}/search_details.php`,
    method: 'POST',
    payload: {
      row_id: '1',
      search_id: '30'
    }
  },
  
  {
    name: 'Get Record Info',
    url: `${baseUrl}/record_info.php`,
    method: 'POST',
    payload: {
      internal_reference: '80575',
      search_id: '30'
    }
  },
  
  {
    name: 'Bulk Export',
    url: `${baseUrl}/export.php`,
    method: 'POST',
    payload: {
      search_id: '30',
      format: 'json'
    }
  },
  
  {
    name: 'API Info/Documentation',
    url: `${baseUrl}/api.php`,
    method: 'GET',
    payload: null
  },
  
  {
    name: 'Get Teams List',
    url: `${baseUrl}/teams.php`,
    method: 'GET',
    payload: null
  },
  
  {
    name: 'Get Groups List',
    url: `${baseUrl}/groups.php`,
    method: 'GET',
    payload: null
  },
  
  {
    name: 'Statistics',
    url: `${baseUrl}/stats.php`,
    method: 'GET',
    payload: null
  }
];

async function testAPI(test) {
  try {
    const options = {
      method: test.method,
      headers: {
        'Cookie': `PHPSESSID=${sessionId}`,
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    if (test.method === 'POST' && test.payload) {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      options.body = new URLSearchParams(test.payload).toString();
    }

    const response = await fetch(test.url, options);
    
    const result = {
      name: test.name,
      url: test.url,
      method: test.method,
      status: response.status,
      statusText: response.statusText,
      success: response.status === 200
    };
    
    if (response.status === 200) {
      const contentType = response.headers.get('content-type');
      const text = await response.text();
      
      let data;
      try {
        data = JSON.parse(text);
        result.responseType = 'json';
        result.preview = JSON.stringify(data).substring(0, 200);
        result.fullResponse = data;
      } catch (e) {
        result.responseType = 'text/html';
        result.preview = text.substring(0, 200);
        result.fullResponse = text;
      }
    }
    
    return result;
    
  } catch (error) {
    return {
      name: test.name,
      url: test.url,
      method: test.method,
      error: error.message,
      success: false
    };
  }
}

async function discoverAll() {
  console.log('🔍 COMPREHENSIVE API DISCOVERY');
  console.log('Website: altaqyeer.q8votes.com');
  console.log('Session ID:', sessionId);
  console.log('Testing', apiTests.length, 'endpoints...\n');
  console.log('='.repeat(80));
  
  const results = [];
  
  for (const test of apiTests) {
    console.log(`\nTesting: ${test.name}`);
    console.log(`URL: ${test.url}`);
    console.log(`Method: ${test.method}`);
    
    const result = await testAPI(test);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ SUCCESS (${result.status})`);
      console.log(`Type: ${result.responseType}`);
      console.log(`Preview: ${result.preview}`);
    } else if (result.error) {
      console.log(`❌ ERROR: ${result.error}`);
    } else {
      console.log(`❌ FAILED (${result.status} ${result.statusText})`);
    }
    
    await new Promise(r => setTimeout(r, 300)); // Small delay
  }
  
  // Summary
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 DISCOVERY SUMMARY');
  console.log('='.repeat(80));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\n✅ Working APIs: ${successful.length}/${results.length}`);
  successful.forEach(r => {
    console.log(`\n   📍 ${r.name}`);
    console.log(`      URL: ${r.url}`);
    console.log(`      Method: ${r.method}`);
    console.log(`      Type: ${r.responseType}`);
  });
  
  console.log(`\n\n❌ Failed: ${failed.length}`);
  if (failed.length < 10) {
    failed.forEach(r => {
      console.log(`   - ${r.name} (${r.status || 'Error'})`);
    });
  } else {
    console.log(`   (${failed.length} endpoints returned 404 or errors)`);
  }
  
  // Save detailed results
  fs.writeFileSync('complete-api-discovery.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\n💾 Full results saved to: complete-api-discovery.json');
  
  // Save working APIs only
  const workingAPIs = successful.map(r => ({
    name: r.name,
    url: r.url,
    method: r.method,
    responseType: r.responseType,
    example: r.fullResponse
  }));
  
  fs.writeFileSync('working-apis.json', JSON.stringify(workingAPIs, null, 2), 'utf8');
  console.log('💾 Working APIs saved to: working-apis.json');
  
  return results;
}

// Run discovery
discoverAll()
  .then(() => console.log('\n✅ Discovery complete!'))
  .catch(error => console.error('\n❌ Discovery failed:', error));

