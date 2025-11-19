// Get ALL 8,719 records with details and save to CSV
const fs = require('fs');

const sessionId = '857a8eb3c95eb4dbfe07918c82c96ef4';
const baseUrl = 'https://altaqyeer.q8votes.com/search_request.php';

// Helper to extract data from HTML
function extractFromHTML(html) {
  const nameMatch = html.match(/class='lead text-center public_elections'>(.*?)<\/p>/);
  const refMatch = html.match(/internal_reference d-none' id='(\d+)'/);
  const idMatch = html.match(/id='(\d+)' class='student/);
  
  return {
    row_id: idMatch ? idMatch[1] : '',
    internal_reference: refMatch ? refMatch[1] : '',
    fullname: nameMatch ? nameMatch[1].replace(/<[^>]*>/g, '').trim() : ''
  };
}

// Helper to escape CSV fields
function escapeCSV(field) {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Get all search results (names and IDs)
async function getAllSearchResults() {
  console.log('📊 STEP 1: Getting all records from Search API...\n');
  
  const allRecords = [];
  const totalRecords = 8719;
  const recordsPerPage = 100;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  
  for (let page = 0; page < totalPages; page++) {
    const startFrom = page * recordsPerPage;
    
    console.log(`  Page ${page + 1}/${totalPages} (records ${startFrom + 1}-${Math.min(startFrom + recordsPerPage, totalRecords)})...`);
    
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
          start_from: String(startFrom),
          search_public_elections: '30'
        })
      });

      if (response.status === 200) {
        const text = await response.text();
        const data = JSON.parse(text);
        
        if (data.data && data.data.length > 0) {
          data.data.forEach(html => {
            const record = extractFromHTML(html);
            if (record.row_id) {
              allRecords.push(record);
            }
          });
          console.log(`    ✅ Got ${data.data.length} records (Total: ${allRecords.length})`);
        }
      } else {
        console.log(`    ❌ Failed: ${response.status}`);
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(r => setTimeout(r, 500));
      
    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
    }
  }
  
  console.log(`\n✅ Search complete! Total records: ${allRecords.length}\n`);
  return allRecords;
}

// Get details for a single record
async function getRecordDetails(rowId) {
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
      
      return {
        gender: data.mydata?.[0] || '',
        registeration_status: data.mydata?.[1] || '',
        team_icon: data.mydata?.[2] || '',
        team_name: data.mydata?.[3] || '',
        group_name: data.mydata?.[4] || ''
      };
    }
    
    return null;
    
  } catch (error) {
    return null;
  }
}

// Get details for all records
async function getAllDetails(records) {
  console.log('📊 STEP 2: Getting details for each record...\n');
  
  const completeData = [];
  const total = records.length;
  const batchSize = 100;
  
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    
    if (i % batchSize === 0) {
      console.log(`  Progress: ${i}/${total} (${Math.round(i/total*100)}%)`);
    }
    
    const details = await getRecordDetails(record.row_id);
    
    const completeRecord = {
      row_id: record.row_id,
      internal_reference: record.internal_reference,
      fullname: record.fullname,
      gender: details?.gender || '',
      registeration_status: details?.registeration_status || '',
      team_icon: details?.team_icon || '',
      team_name: details?.team_name || '',
      group_name: details?.group_name || ''
    };
    
    completeData.push(completeRecord);
    
    // Delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 100));
  }
  
  console.log(`  Progress: ${total}/${total} (100%)`);
  console.log(`\n✅ Details complete! Total records: ${completeData.length}\n`);
  
  return completeData;
}

// Save to CSV
function saveToCSV(data, filename) {
  console.log('📊 STEP 3: Saving to CSV...\n');
  
  // CSV Header
  const headers = [
    'row_id',
    'internal_reference',
    'fullname',
    'gender',
    'registeration_status',
    'team_icon',
    'team_name',
    'group_name'
  ];
  
  let csv = headers.join(',') + '\n';
  
  // CSV Rows
  data.forEach(record => {
    const row = headers.map(header => escapeCSV(record[header]));
    csv += row.join(',') + '\n';
  });
  
  fs.writeFileSync(filename, csv, 'utf8');
  console.log(`✅ Saved to: ${filename}`);
  console.log(`   Records: ${data.length}`);
  console.log(`   Size: ${(csv.length / 1024 / 1024).toFixed(2)} MB\n`);
}

// Main execution
async function main() {
  console.log('='.repeat(70));
  console.log('🚀 FETCHING ALL ELECTION DATA');
  console.log('='.repeat(70));
  console.log('');
  console.log('This will:');
  console.log('  1. Get all 8,719 records (87 pages × 100 records)');
  console.log('  2. Fetch details for each record (8,719 API calls)');
  console.log('  3. Save everything to CSV');
  console.log('');
  console.log('⏱️  Estimated time: 15-20 minutes');
  console.log('');
  console.log('='.repeat(70));
  console.log('');
  
  const startTime = Date.now();
  
  try {
    // Step 1: Get all search results
    const searchResults = await getAllSearchResults();
    
    if (searchResults.length === 0) {
      console.log('❌ No records found!');
      return;
    }
    
    // Save checkpoint
    fs.writeFileSync('checkpoint-search-results.json', JSON.stringify(searchResults, null, 2));
    console.log('💾 Checkpoint saved: checkpoint-search-results.json\n');
    
    // Step 2: Get details for all records
    const completeData = await getAllDetails(searchResults);
    
    // Save checkpoint
    fs.writeFileSync('checkpoint-complete-data.json', JSON.stringify(completeData, null, 2));
    console.log('💾 Checkpoint saved: checkpoint-complete-data.json\n');
    
    // Step 3: Save to CSV
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const csvFilename = `election-data-complete-${timestamp}.csv`;
    saveToCSV(completeData, csvFilename);
    
    // Summary
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    
    console.log('='.repeat(70));
    console.log('✅ COMPLETE!');
    console.log('='.repeat(70));
    console.log('');
    console.log(`📊 Total Records: ${completeData.length}`);
    console.log(`⏱️  Time Taken: ${minutes}m ${seconds}s`);
    console.log(`📁 CSV File: ${csvFilename}`);
    console.log('');
    console.log('Files created:');
    console.log(`  - ${csvFilename} (main output)`);
    console.log(`  - checkpoint-search-results.json (backup)`);
    console.log(`  - checkpoint-complete-data.json (backup)`);
    console.log('');
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
  }
}

// Run
main()
  .then(() => console.log('Done!'))
  .catch(error => console.error('Fatal error:', error));

