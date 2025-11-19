import moment from 'moment-timezone';

// Convert a UTC time to a specific timezone
function convertUTCToTimeZone(utcDate: string, timeZone: string) {
  return moment(utcDate).tz(timeZone).format();
}

// Convert a specific timezone time to UTC
function convertTimeZoneToUTC(date: string, timeZone: string) {
  return moment.tz(date, timeZone).utc().format();
}

const formatTime = (momentDate: any) => {
  // Ensure momentDate is a moment object
  const momentObj = moment.isMoment(momentDate) ? momentDate : moment(momentDate);
  return momentObj.format('h:mma'); // Formats time in 12-hour format with AM/PM
};

const displayLocalTime = (isoString: string) => {
  return new Date(isoString).toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZoneName: 'short'
  });
};

const convertAppointmentTimes = (appointments: any[], timeZone: string) => {
  return appointments.map((appointment) => {
    const convertedStart = convertUTCToTimeZone(appointment.start, timeZone);
    const convertedEnd = convertUTCToTimeZone(appointment.end, timeZone);
    return {
      ...appointment,
      start: convertedStart,
      end: convertedEnd
    };
  });
};

// Staff
// Function to find staff name by ID
const findStaffNameById = (staffId: number, staff: any[]) => {
  const staffMember = staff.find((member) => member.id === staffId);
  return staffMember ? staffMember.name : 'Unknown';
};

const formatServiceDate = (service: any) => {
  // Convert the date to the desired timezone, e.g., 'Asia/Kuwait'
  const localDate = moment(service.date).tz('Asia/Kuwait');

  // Format the date. Example: '4 Mar at 12:45pm'
  const formattedDate = localDate.format('D MMM [at] h:mma');

  // Assuming the price is part of the service object
  const price = service.price;

  return `on ${formattedDate} for K.D.${price}`;
};

export {
  formatServiceDate,
  convertAppointmentTimes,
  convertUTCToTimeZone,
  convertTimeZoneToUTC,
  formatTime,
  displayLocalTime,
  findStaffNameById
};
