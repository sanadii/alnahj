// Test OTHER parameter variations (not just show_details)
const fs = require('fs');

const sessionId = '857a8eb3c95eb4dbfe07918c82c96ef4';
const baseUrl = 'https://altaqyeer.q8votes.com/search_request.php';

// Test different parameter combinations
const testsToRun = [
  {
    name: 'show_related = 1',
    payload: { row_id: '2', search_id: '30', show_related: '1' }
  },
  {
    name: 'show_history = 1',
    payload: { row_id: '2', search_id: '30', show_history: '1' }
  },
  {
    name: 'show_votes = 1',
    payload: { row_id: '2', search_id: '30', show_votes: '1' }
  },
  {
    name: 'show_family = 1',
    payload: { row_id: '2', search_id: '30', show_family: '1' }
  },
  {
    name: 'show_team = 1',
    payload: { row_id: '2', search_id: '30', show_team: '1' }
  },
  {
    name: 'show_all = 1',
    payload: { row_id: '2', search_id: '30', show_all: '1' }
  },
  {
    name: 'get_details = 1',
    payload: { row_id: '2', search_id: '30', get_details: '1' }
  },
  {
    name: 'details = 1',
    payload: { row_id: '2', search_id: '30', details: '1' }
  },
  {
    name: 'full_details = 1',
    payload: { row_id: '2', search_id: '30', full_details: '1' }
  },
  {
    name: 'export = 1',
    payload: { row_id: '2', search_id: '30', export: '1' }
  },
  {
    name: 'format = json',
    payload: { row_id: '2', search_id: '30', format: 'json' }
  },
  {
    name: 'with_metadata = 1',
    payload: { row_id: '2', search_id: '30', with_metadata: '1' }
  },
  {
    name: 'internal_reference (by internal ID)',
    payload: { internal_reference: '83520', search_id: '30' }
  },
  {
    name: 'id instead of row_id',
    payload: { id: '2', search_id: '30', show_details: '1' }
  },
  {
    name: 'record_id instead of row_id',
    payload: { record_id: '2', search_id: '30', show_details: '1' }
  },
  {
    name: 'Multiple flags combined',
    payload: { row_id: '2', search_id: '30', show_details: '1', show_related: '1', show_history: '1' }
  }
];

async function testParameter(test) {
  console.log('\n' + '='.repeat(70));
  console.log(`Testing: ${test.name}`);
  console.log('='.repeat(70));
  console.log('Payload:', JSON.stringify(test.payload, null, 2));
  
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': `PHPSESSID=${sessionId}`,
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: new URLSearchParams(test.payload).toString()
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 200) {
      const text = await response.text();
      let data;
      let isJson = false;
      
      try {
        data = JSON.parse(text);
        isJson = true;
        console.log('\n✅ SUCCESS - JSON Response');
        console.log('Keys:', Object.keys(data));
        console.log('Preview:', JSON.stringify(data).substring(0, 300));
      } catch (e) {
        data = text;
        console.log('\n✅ SUCCESS - Text/HTML Response');
        console.log('Length:', text.length, 'characters');
        console.log('Preview:', text.substring(0, 200).replace(/\s+/g, ' '));
      }
      
      return {
        test: test.name,
        payload: test.payload,
        success: true,
        responseType: isJson ? 'json' : 'text',
        keys: isJson ? Object.keys(data) : null,
        length: isJson ? null : text.length,
        data: data
      };
      
    } else {
      console.log('❌ FAILED');
      return {
        test: test.name,
        payload: test.payload,
        success: false,
        status: response.status
      };
    }
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return {
      test: test.name,
      payload: test.payload,
      success: false,
      error: error.message
    };
  }
}

async function runAllTests() {
  console.log('🔍 TESTING DIFFERENT PARAMETER COMBINATIONS');
  console.log('');
  
  const results = [];
  
  for (const test of testsToRun) {
    const result = await testParameter(test);
    results.push(result);
    await new Promise(r => setTimeout(r, 400)); // Small delay
  }
  
  // Summary
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 SUMMARY');
  console.log('='.repeat(70));
  
  const successful = results.filter(r => r.success);
  const jsonResponses = successful.filter(r => r.responseType === 'json');
  const textResponses = successful.filter(r => r.responseType === 'text' && r.length > 0);
  const emptyResponses = successful.filter(r => r.responseType === 'text' && r.length === 0);
  
  console.log(`\n✅ Successful: ${successful.length}/${results.length}`);
  console.log(`   - JSON responses: ${jsonResponses.length}`);
  console.log(`   - Text/HTML responses: ${textResponses.length}`);
  console.log(`   - Empty responses: ${emptyResponses.length}`);
  
  if (jsonResponses.length > 0) {
    console.log('\n📦 JSON Responses:');
    
    // Group by structure
    const structureMap = new Map();
    jsonResponses.forEach(r => {
      const key = r.keys.join(',');
      if (!structureMap.has(key)) {
        structureMap.set(key, []);
      }
      structureMap.get(key).push(r);
    });
    
    structureMap.forEach((responses, structure) => {
      console.log(`\n  Structure: [${structure}]`);
      responses.forEach(r => {
        console.log(`    - ${r.test}`);
      });
    });
  }
  
  if (textResponses.length > 0) {
    console.log('\n📄 Non-Empty Text/HTML Responses:');
    textResponses.forEach(r => {
      console.log(`  - ${r.test} (${r.length} chars)`);
    });
  }
  
  if (emptyResponses.length > 0) {
    console.log('\n⚪ Empty Responses:');
    emptyResponses.forEach(r => {
      console.log(`  - ${r.test}`);
    });
  }
  
  // Identify unique/interesting responses
  console.log('\n\n🎯 INTERESTING FINDINGS:');
  
  // Find responses different from standard details API
  const standardKeys = 'show_related_btn,status,mydata,keys,the_tags';
  const uniqueResponses = jsonResponses.filter(r => r.keys.join(',') !== standardKeys);
  
  if (uniqueResponses.length > 0) {
    console.log('\n  🆕 Different JSON structures found:');
    uniqueResponses.forEach(r => {
      console.log(`    - ${r.test}`);
      console.log(`      Keys: ${r.keys.join(', ')}`);
    });
  } else {
    console.log('\n  ℹ️  All JSON responses have the same structure as show_details');
  }
  
  if (textResponses.length > 0) {
    console.log('\n  📝 Non-empty HTML responses (potentially useful):');
    textResponses.forEach(r => {
      console.log(`    - ${r.test} (${r.length} characters)`);
    });
  }
  
  // Save results
  fs.writeFileSync('other-parameters-results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\n💾 Full results saved to: other-parameters-results.json');
  
  return results;
}

// Run tests
runAllTests()
  .then(() => console.log('\n✅ All parameter tests complete!'))
  .catch(error => console.error('\n❌ Tests failed:', error));

