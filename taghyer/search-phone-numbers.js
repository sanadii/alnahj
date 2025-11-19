// Search for phone numbers (8 digits) in API responses
const fs = require('fs');

const sessionId = '857a8eb3c95eb4dbfe07918c82c96ef4';
const baseUrl = 'https://altaqyeer.q8votes.com/search_request.php';

// Helper function to find 8-digit numbers
function find8DigitNumbers(obj, path = '') {
  const results = [];
  
  if (typeof obj === 'string') {
    // Match exactly 8 consecutive digits
    const matches = obj.match(/\b\d{8}\b/g);
    if (matches) {
      matches.forEach(match => {
        results.push({
          path: path,
          value: match,
          context: obj.substring(Math.max(0, obj.indexOf(match) - 20), obj.indexOf(match) + 28)
        });
      });
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      results.push(...find8DigitNumbers(item, `${path}[${index}]`));
    });
  } else if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(key => {
      results.push(...find8DigitNumbers(obj[key], path ? `${path}.${key}` : key));
    });
  }
  
  return results;
}

async function checkRecordForPhone(rowId) {
  console.log(`\nChecking row_id: ${rowId}`);
  
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': `PHPSESSID=${sessionId}`,
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: new URLSearchParams({
        row_id: String(rowId),
        search_id: '30',
        show_details: '1'
      })
    });

    if (response.status === 200) {
      const text = await response.text();
      const data = JSON.parse(text);
      
      // Show all fields
      console.log('  Fields:', data.mydata?.length || 0);
      if (data.mydata) {
        data.mydata.forEach((item, i) => {
          const key = data.keys ? data.keys[i] : i;
          const tag = data.the_tags ? data.the_tags[i] : '';
          console.log(`    [${i}] ${key}: "${item}" (${tag})`);
        });
      }
      
      // Search for 8-digit numbers
      const phoneNumbers = find8DigitNumbers(data);
      
      if (phoneNumbers.length > 0) {
        console.log(`  🎯 FOUND ${phoneNumbers.length} 8-DIGIT NUMBER(S):`);
        phoneNumbers.forEach(phone => {
          console.log(`    📞 ${phone.value}`);
          console.log(`       Path: ${phone.path}`);
          console.log(`       Context: ...${phone.context}...`);
        });
        return { rowId, hasPhone: true, phones: phoneNumbers, data };
      } else {
        console.log('  ❌ No 8-digit numbers found');
        return { rowId, hasPhone: false, data };
      }
      
    } else {
      console.log(`  ❌ Failed: ${response.status}`);
      return { rowId, error: response.status };
    }
    
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return { rowId, error: error.message };
  }
}

async function searchMultipleRecords() {
  console.log('🔍 SEARCHING FOR PHONE NUMBERS (8 digits)');
  console.log('Testing multiple row_ids...\n');
  console.log('='.repeat(70));
  
  const results = [];
  
  // Test first 20 records
  const testIds = [1, 2, 3, 4, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 8000, 8719];
  
  for (const rowId of testIds) {
    const result = await checkRecordForPhone(rowId);
    results.push(result);
    await new Promise(r => setTimeout(r, 300)); // Small delay
  }
  
  // Summary
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 SUMMARY');
  console.log('='.repeat(70));
  
  const withPhones = results.filter(r => r.hasPhone);
  const withoutPhones = results.filter(r => r.hasPhone === false);
  const errors = results.filter(r => r.error);
  
  console.log(`\nTested: ${results.length} records`);
  console.log(`✅ With phone numbers: ${withPhones.length}`);
  console.log(`❌ Without phone numbers: ${withoutPhones.length}`);
  console.log(`⚠️  Errors: ${errors.length}`);
  
  if (withPhones.length > 0) {
    console.log('\n📞 RECORDS WITH PHONE NUMBERS:');
    withPhones.forEach(r => {
      console.log(`\n  Row ID: ${r.rowId}`);
      r.phones.forEach(phone => {
        console.log(`    📞 ${phone.value} (at ${phone.path})`);
      });
    });
  } else {
    console.log('\n❌ NO PHONE NUMBERS FOUND in tested records');
    console.log('\nPossible reasons:');
    console.log('  1. Phone numbers are not included in the API response');
    console.log('  2. Phone numbers require a different API endpoint');
    console.log('  3. Phone numbers may be in the Search API (HTML) response');
    console.log('  4. Access to phone numbers may be restricted');
  }
  
  // Check field counts
  console.log('\n📋 FIELD ANALYSIS:');
  const fieldCounts = {};
  results.forEach(r => {
    if (r.data && r.data.mydata) {
      const count = r.data.mydata.length;
      fieldCounts[count] = (fieldCounts[count] || 0) + 1;
    }
  });
  
  console.log('Field count distribution:');
  Object.keys(fieldCounts).sort().forEach(count => {
    console.log(`  ${count} fields: ${fieldCounts[count]} records`);
  });
  
  // Show unique keys
  const allKeys = new Set();
  results.forEach(r => {
    if (r.data && r.data.keys) {
      r.data.keys.forEach(key => allKeys.add(key));
    }
  });
  
  console.log('\nAll unique keys found:');
  Array.from(allKeys).forEach(key => {
    console.log(`  - ${key}`);
  });
  
  // Save results
  fs.writeFileSync('phone-search-results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\n💾 Full results saved to: phone-search-results.json');
  
  return results;
}

// Run search
searchMultipleRecords()
  .then(() => console.log('\n✅ Search complete!'))
  .catch(error => console.error('\n❌ Search failed:', error));

