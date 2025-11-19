/**
 * Data Generators for Demo Feature
 * Generates realistic demo data for parties, candidates, committees, users, etc.
 */

// Party name templates
const PARTY_NAME_PREFIXES = [
  'Democratic', 'Progressive', 'National', 'United', 'People\'s', 'Liberal', 
  'Conservative', 'Reform', 'Alliance', 'Coalition', 'Independent', 'Freedom'
];

const PARTY_NAME_SUFFIXES = [
  'Party', 'Alliance', 'Coalition', 'Movement', 'Front', 'Union', 
  'League', 'Association', 'Council', 'Group', 'Organization'
];

// Candidate name pools
const FIRST_NAMES = [
  'Ahmed', 'Mohammed', 'Ali', 'Hassan', 'Omar', 'Khalid', 'Saeed', 'Youssef',
  'Fatima', 'Aisha', 'Mariam', 'Noor', 'Layla', 'Zainab', 'Sarah', 'Hala',
  'Abdullah', 'Ibrahim', 'Yusuf', 'Hamza', 'Tariq', 'Nasser', 'Faisal', 'Salem'
];

const LAST_NAMES = [
  'Al-Ahmad', 'Al-Mohammed', 'Al-Hassan', 'Al-Omar', 'Al-Khalid', 'Al-Saeed',
  'Al-Youssef', 'Al-Abdullah', 'Al-Ibrahim', 'Al-Yusuf', 'Al-Hamza', 'Al-Tariq',
  'Al-Nasser', 'Al-Faisal', 'Al-Salem', 'Al-Mansour', 'Al-Rashid', 'Al-Mahmoud'
];

// Committee location names
const COMMITTEE_LOCATIONS = [
  'Main Hall', 'North Wing', 'South Wing', 'East Building', 'West Building',
  'Conference Center', 'Auditorium A', 'Auditorium B', 'Training Room 1', 
  'Training Room 2', 'Exhibition Hall', 'Multi-Purpose Hall'
];

// User name pools (for guarantee collectors)
const USER_FIRST_NAMES = [
  'Khalid', 'Fahad', 'Nasser', 'Saud', 'Turki', 'Bandar', 'Mishal', 'Faisal',
  'Noura', 'Hessa', 'Lulwa', 'Shaikha', 'Amal', 'Reem', 'Dana', 'Rana'
];

const USER_LAST_NAMES = [
  'Al-Rashid', 'Al-Mansour', 'Al-Saud', 'Al-Khalifa', 'Al-Thani', 'Al-Nahyan',
  'Al-Maktoum', 'Al-Sabah', 'Al-Hashimi', 'Al-Zahrani', 'Al-Ghamdi', 'Al-Mutairi'
];

/**
 * Generate a random party name
 */
export const generatePartyName = (index: number): string => {
  const prefix = PARTY_NAME_PREFIXES[index % PARTY_NAME_PREFIXES.length];
  const suffix = PARTY_NAME_SUFFIXES[Math.floor(Math.random() * PARTY_NAME_SUFFIXES.length)];
  return `${prefix} ${suffix}`;
};

/**
 * Generate a random candidate name
 */
export const generateCandidateName = (): string => {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${firstName} ${lastName}`;
};

/**
 * Generate committee code (e.g., "M-001", "F-002")
 */
export const generateCommitteeCode = (index: number, gender: 'MALE' | 'FEMALE'): string => {
  const prefix = gender === 'MALE' ? 'M' : 'F';
  const number = String(index + 1).padStart(3, '0');
  return `${prefix}-${number}`;
};

/**
 * Generate committee name
 */
export const generateCommitteeName = (index: number, gender: 'MALE' | 'FEMALE'): string => {
  const location = COMMITTEE_LOCATIONS[index % COMMITTEE_LOCATIONS.length];
  const genderLabel = gender === 'MALE' ? 'Male' : 'Female';
  return `${genderLabel} Committee - ${location}`;
};

/**
 * Generate user data
 */
export const generateUserData = (index: number) => {
  const firstName = USER_FIRST_NAMES[index % USER_FIRST_NAMES.length];
  const lastName = USER_LAST_NAMES[Math.floor(Math.random() * USER_LAST_NAMES.length)];
  // Add timestamp and random number to ensure unique emails
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/-/g, '')}.${timestamp}.${random}@demo.election.kw`;
  const phone = `5${Math.floor(10000000 + Math.random() * 90000000)}`; // Kuwait phone format
  
  return {
    firstName,
    lastName,
    email,
    phone,
    fullName: `${firstName} ${lastName}`
  };
};

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Select random item from array
 */
export const selectRandom = <T>(array: T[]): T | undefined => {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Select random items from array (without replacement)
 */
export const selectRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, array.length));
};

/**
 * Round-robin selection from array
 */
export const selectRoundRobin = <T>(array: T[], index: number): T => {
  return array[index % array.length];
};

/**
 * Distribute items evenly across groups
 */
export const distributeEvenly = <T>(items: T[], groups: any[]): Map<number, T[]> => {
  const distribution = new Map<number, T[]>();
  groups.forEach((group) => {
    distribution.set(group.id, []);
  });

  items.forEach((item, index) => {
    const groupIndex = index % groups.length;
    const group = groups[groupIndex];
    distribution.get(group.id)?.push(item);
  });

  return distribution;
};

