// Test different show_details parameter values
const fs = require('fs');

const sessionId = '857a8eb3c95eb4dbfe07918c82c96ef4';
const baseUrl = 'https://altaqyeer.q8votes.com/search_request.php';

// Test different show_details values
const testsToRun = [
  { name: 'show_details = 0', show_details: '0' },
  { name: 'show_details = 1', show_details: '1' },
  { name: 'show_details = 2', show_details: '2' },
  { name: 'show_details = 3', show_details: '3' },
  { name: 'show_details = 4', show_details: '4' },
  { name: 'show_details = 5', show_details: '5' },
  { name: 'show_details = 10', show_details: '10' },
  { name: 'show_details = empty string', show_details: '' },
  { name: 'without show_details param', show_details: null }
];

async function testShowDetailsValue(test) {
  console.log('\n' + '='.repeat(70));
  console.log(`Testing: ${test.name}`);
  console.log('='.repeat(70));
  
  const payload = {
    row_id: '2',
    search_id: '30'
  };
  
  // Only add show_details if not null
  if (test.show_details !== null) {
    payload.show_details = test.show_details;
  }
  
  console.log('Payload:', JSON.stringify(payload, null, 2));
  
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
        console.log('\n✅ SUCCESS - JSON Response');
        console.log('Keys:', Object.keys(data));
        
        // Show structure
        if (data.mydata) {
          console.log('\nmydata fields:');
          data.mydata.forEach((item, i) => {
            const key = data.keys ? data.keys[i] : i;
            const tag = data.the_tags ? data.the_tags[i] : '';
            console.log(`  [${i}] ${key}: ${item} (${tag})`);
          });
        }
        
        if (data.data) {
          console.log('\ndata array length:', data.data.length);
          console.log('First item preview:', data.data[0]?.substring(0, 100));
        }
        
        if (data.status) {
          console.log('Status:', data.status);
        }
        
        if (data.show_related_btn) {
          console.log('Show related button:', data.show_related_btn);
        }
        
        // Check for any unique fields
        const uniqueKeys = Object.keys(data).filter(k => 
          !['mydata', 'keys', 'the_tags', 'status', 'show_related_btn'].includes(k)
        );
        if (uniqueKeys.length > 0) {
          console.log('\n🔍 Additional fields:', uniqueKeys);
          uniqueKeys.forEach(key => {
            console.log(`  ${key}:`, JSON.stringify(data[key]).substring(0, 100));
          });
        }
        
      } catch (e) {
        console.log('\n✅ SUCCESS - Text/HTML Response');
        console.log('Length:', text.length, 'characters');
        console.log('Preview:', text.substring(0, 200));
        data = text;
      }
      
      return {
        test: test.name,
        success: true,
        responseType: typeof data === 'object' ? 'json' : 'text',
        data: data,
        dataStructure: typeof data === 'object' ? Object.keys(data) : null
      };
      
    } else {
      console.log('❌ FAILED');
      return {
        test: test.name,
        success: false,
        status: response.status
      };
    }
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return {
      test: test.name,
      success: false,
      error: error.message
    };
  }
}

async function runAllTests() {
  console.log('🔍 TESTING DIFFERENT show_details VALUES');
  console.log('Row ID: 2');
  console.log('Search ID: 30');
  console.log('');
  
  const results = [];
  
  for (const test of testsToRun) {
    const result = await testShowDetailsValue(test);
    results.push(result);
    await new Promise(r => setTimeout(r, 500)); // Small delay
  }
  
  // Summary
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 SUMMARY');
  console.log('='.repeat(70));
  
  const successful = results.filter(r => r.success);
  
  console.log(`\n✅ Successful: ${successful.length}/${results.length}\n`);
  
  // Group by response type
  const jsonResponses = successful.filter(r => r.responseType === 'json');
  const textResponses = successful.filter(r => r.responseType === 'text');
  
  if (jsonResponses.length > 0) {
    console.log('\n📦 JSON Responses:');
    jsonResponses.forEach(r => {
      console.log(`\n  ${r.test}`);
      console.log(`    Keys: ${r.dataStructure?.join(', ')}`);
    });
  }
  
  if (textResponses.length > 0) {
    console.log('\n📄 Text/HTML Responses:');
    textResponses.forEach(r => {
      console.log(`  - ${r.test}`);
    });
  }
  
  // Check for differences
  console.log('\n\n🔍 DIFFERENCES DETECTED:');
  const uniqueStructures = new Map();
  
  jsonResponses.forEach(r => {
    const key = r.dataStructure?.join(',');
    if (!uniqueStructures.has(key)) {
      uniqueStructures.set(key, []);
    }
    uniqueStructures.get(key).push(r.test);
  });
  
  uniqueStructures.forEach((tests, structure) => {
    console.log(`\nStructure: [${structure}]`);
    console.log(`  Used by: ${tests.join(', ')}`);
  });
  
  // Save results
  fs.writeFileSync('show-details-variations-results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\n💾 Full results saved to: show-details-variations-results.json');
  
  return results;
}

// Run tests
runAllTests()
  .then(() => console.log('\n✅ All tests complete!'))
  .catch(error => console.error('\n❌ Tests failed:', error));

