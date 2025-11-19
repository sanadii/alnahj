// Various API usage examples for altaqyeer.q8votes.com

const fs = require('fs');

const sessionId = '857a8eb3c95eb4dbfe07918c82c96ef4';
const baseUrl = 'https://altaqyeer.q8votes.com/search_request.php';

// Different search scenarios
const searchExamples = {
  
  // 1. Search by first name
  searchByFirstName: {
    name: 'Search by First Name (محمد)',
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
      recordPerTime: '20',
      start_from: '0',
      search_public_elections: '30'
    }
  },

  // 2. Search by family name
  searchByFamilyName: {
    name: 'Search by Family Name (احمد)',
    payload: {
      sorting: '1',
      firstname: '',
      secondname: '',
      thirdname: '',
      forthname: '',
      familyname: 'احمد',
      fullname: '',
      internal_reference_from: '',
      internal_reference_to: '',
      employer: '',
      team_icon: '',
      recordPerTime: '20',
      start_from: '0',
      search_public_elections: '30'
    }
  },

  // 3. Search by full name
  searchByFullName: {
    name: 'Search by Full Name',
    payload: {
      sorting: '1',
      firstname: '',
      secondname: '',
      thirdname: '',
      forthname: '',
      familyname: '',
      fullname: 'علي محمد',
      internal_reference_from: '',
      internal_reference_to: '',
      employer: '',
      team_icon: '',
      recordPerTime: '20',
      start_from: '0',
      search_public_elections: '30'
    }
  },

  // 4. Search by internal reference range
  searchByReferenceRange: {
    name: 'Search by Internal Reference Range',
    payload: {
      sorting: '1',
      firstname: '',
      secondname: '',
      thirdname: '',
      forthname: '',
      familyname: '',
      fullname: '',
      internal_reference_from: '80000',
      internal_reference_to: '80100',
      employer: '',
      team_icon: '',
      recordPerTime: '50',
      start_from: '0',
      search_public_elections: '30'
    }
  },

  // 5. Get all records (paginated)
  getAllRecords: {
    name: 'Get All Records (Page 1)',
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
      recordPerTime: '100',
      start_from: '0',
      search_public_elections: '30'
    }
  },

  // 6. Get page 2
  getPage2: {
    name: 'Get All Records (Page 2)',
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
      recordPerTime: '100',
      start_from: '100',
      search_public_elections: '30'
    }
  }
};

async function runSearch(example) {
  try {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📋 ${example.name}`);
    console.log('='.repeat(70));
    
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': `PHPSESSID=${sessionId}`,
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: new URLSearchParams(example.payload).toString()
    });

    if (response.status === 200) {
      const text = await response.text();
      const data = JSON.parse(text);
      
      const recordCount = Array.isArray(data.data) ? data.data.length : 0;
      
      console.log(`✅ Status: ${response.status} OK`);
      console.log(`📊 Total matches: ${data.count || 'N/A'}`);
      console.log(`📄 Records returned: ${recordCount}`);
      console.log(`💡 Points cost: ${data.notify?.match(/\d+/) ? data.notify.match(/\d+/)[0] : 'N/A'} points`);
      
      // Show first 3 records
      if (recordCount > 0) {
        console.log(`\n📝 Sample records (showing 3 of ${recordCount}):`);
        for (let i = 0; i < Math.min(3, recordCount); i++) {
          const html = data.data[i];
          const nameMatch = html.match(/class='lead text-center public_elections'>(.*?)<\/p>/);
          const refMatch = html.match(/id='(\d+)'/);
          if (nameMatch && refMatch) {
            const name = nameMatch[1].replace(/<[^>]*>/g, '').trim();
            const ref = refMatch[1];
            console.log(`   ${i + 1}. ${name} (Ref: ${ref})`);
          }
        }
      }
      
      return { success: true, count: data.count, records: recordCount };
    } else {
      console.log(`❌ Failed: ${response.status} ${response.statusText}`);
      return { success: false };
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runAllExamples() {
  console.log('🔍 API Usage Examples - altaqyeer.q8votes.com');
  console.log('Session ID:', sessionId);
  console.log('');
  
  const results = [];
  
  // Run each example
  for (const [key, example] of Object.entries(searchExamples)) {
    const result = await runSearch(example);
    results.push({ key, ...example, result });
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
  }
  
  // Summary
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 SUMMARY OF ALL SEARCHES');
  console.log('='.repeat(70));
  
  results.forEach(r => {
    if (r.result.success) {
      console.log(`✅ ${r.name}`);
      console.log(`   Total: ${r.result.count} | Returned: ${r.result.records}`);
    } else {
      console.log(`❌ ${r.name} - FAILED`);
    }
  });
  
  // Save detailed results
  fs.writeFileSync('api-examples-results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\n💾 Detailed results saved to: api-examples-results.json');
}

// Run all examples
runAllExamples()
  .then(() => console.log('\n✅ All examples completed!'))
  .catch(error => console.error('\n❌ Error:', error));

