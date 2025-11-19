// Search for phone numbers in the HTML response from Search API
const fs = require('fs');

const sessionId = '857a8eb3c95eb4dbfe07918c82c96ef4';
const baseUrl = 'https://altaqyeer.q8votes.com/search_request.php';

// Helper to extract text from HTML and find phone numbers
function extractPhonesFromHTML(html) {
  const phones = [];
  
  // Match 8-digit numbers (Kuwait phone numbers)
  const matches = html.match(/\b\d{8}\b/g);
  if (matches) {
    matches.forEach(match => {
      const index = html.indexOf(match);
      const context = html.substring(Math.max(0, index - 100), index + 100);
      phones.push({
        number: match,
        context: context.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      });
    });
  }
  
  return phones;
}

async function searchHTMLForPhones() {
  console.log('🔍 SEARCHING HTML RESPONSE FOR PHONE NUMBERS');
  console.log('Testing Search API (returns HTML)...\n');
  
  try {
    // Get first page of results
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': `PHPSESSID=${sessionId}`,
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: new URLSearchParams({
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
        recordPerTime: '20',  // Get 20 records
        start_from: '0',
        search_public_elections: '30'
      })
    });

    if (response.status === 200) {
      const text = await response.text();
      const data = JSON.parse(text);
      
      console.log(`Status: 200 OK`);
      console.log(`Records returned: ${data.data?.length || 0}`);
      console.log(`Total count: ${data.count}`);
      console.log('');
      
      if (data.data && data.data.length > 0) {
        console.log('='.repeat(70));
        console.log('ANALYZING HTML RECORDS...');
        console.log('='.repeat(70));
        
        let allPhones = [];
        
        data.data.forEach((html, index) => {
          console.log(`\nRecord ${index + 1}:`);
          
          // Extract name
          const nameMatch = html.match(/class='lead text-center public_elections'>(.*?)<\/p>/);
          const name = nameMatch ? nameMatch[1].replace(/<[^>]*>/g, '').trim() : 'Unknown';
          console.log(`  Name: ${name}`);
          
          // Extract internal reference
          const refMatch = html.match(/internal_reference d-none' id='(\d+)'/);
          const internalRef = refMatch ? refMatch[1] : 'Unknown';
          console.log(`  Internal Ref: ${internalRef}`);
          
          // Search for phone numbers
          const phones = extractPhonesFromHTML(html);
          
          if (phones.length > 0) {
            console.log(`  📞 FOUND ${phones.length} PHONE NUMBER(S):`);
            phones.forEach(phone => {
              console.log(`     ${phone.number}`);
              console.log(`     Context: ...${phone.context.substring(0, 80)}...`);
              allPhones.push({
                name,
                internalRef,
                phone: phone.number,
                context: phone.context
              });
            });
          } else {
            console.log(`  ❌ No phone numbers`);
          }
          
          // Show a sample of the HTML
          console.log(`  HTML length: ${html.length} characters`);
        });
        
        // Summary
        console.log('\n\n' + '='.repeat(70));
        console.log('📊 SUMMARY');
        console.log('='.repeat(70));
        console.log(`\nRecords checked: ${data.data.length}`);
        console.log(`Phone numbers found: ${allPhones.length}`);
        
        if (allPhones.length > 0) {
          console.log('\n📞 ALL PHONE NUMBERS:');
          allPhones.forEach(item => {
            console.log(`\n  ${item.name}`);
            console.log(`    Ref: ${item.internalRef}`);
            console.log(`    Phone: ${item.phone}`);
          });
          
          // Save phones
          fs.writeFileSync('phones-found.json', JSON.stringify(allPhones, null, 2), 'utf8');
          console.log('\n💾 Phone numbers saved to: phones-found.json');
        } else {
          console.log('\n❌ NO PHONE NUMBERS FOUND');
          console.log('\nConclusion:');
          console.log('  - Phone numbers are NOT included in the HTML response');
          console.log('  - Phone numbers may be private/restricted data');
          console.log('  - May need special permissions or different API');
        }
        
        // Save full response for inspection
        fs.writeFileSync('html-search-response.json', JSON.stringify(data, null, 2), 'utf8');
        console.log('\n💾 Full response saved to: html-search-response.json');
        
        // Show sample HTML
        console.log('\n📄 SAMPLE HTML STRUCTURE:');
        console.log(data.data[0].substring(0, 500));
        console.log('...(truncated)');
        
      } else {
        console.log('❌ No data returned');
      }
      
    } else {
      console.log(`❌ Failed: ${response.status}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run search
searchHTMLForPhones()
  .then(() => console.log('\n✅ Search complete!'))
  .catch(error => console.error('\n❌ Search failed:', error));

