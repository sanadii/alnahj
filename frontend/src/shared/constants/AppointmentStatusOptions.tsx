// StatusOptions.tsx

export const AppointmentStatusOptions = [
  {
    id: 1,
    name: 'Pencilled In',
    value: 'pencilled-in',
    badgeClass: 'badge bg-info',
    className: 'fc-booking fc-pending',
    color: '#1bbc9d' // Example color
  },

  // fc-event-start fc-event-end  fc-booking fc-booking-id-386033336 fc-group-307451886 fc-new ui-draggable ui-resizable
  {
    id: 2,
    name: 'Not started',
    value: 'not-started',
    badgeClass: 'badge bg-primary',
    className: 'fc-booking',
    color: '#1bbc9d' // Example color
  },

  {
    id: 3,
    name: 'Arrived',
    value: 'arrived',
    badgeClass: 'badge bg-success',
    className: 'fc-booking fc-arrived',
    color: '#2ecc71' // Example color
  },
  {
    id: 4,
    name: 'Started',
    value: 'started',
    badgeClass: 'badge bg-warning',
    className: 'fc-booking fc-event-end fc-light-green',
    color: '#f1c40f'
  },

  // fc-booking-id-384534513
  // fc-group-306316406
  {
    id: 5,
    name: 'Completed',
    value: 'completed',
    badgeClass: 'badge bg-secondary',
    className: 'fc-booking fc-completed fc-paid',
    color: '#1BBC9D' // Example color
  },
  {
    id: 6,
    name: 'Did not show',
    value: 'did-not-show',
    badgeClass: 'badge bg-danger',
    className: 'fc-booking fc-pending fc-group-highlight',
    color: '#e74c3c' // Example color
  }
];

// fc-event
// fc-event-skin
// fc-event-vert
// fc-event-draggable
// fc-booking-id-386395277
// fc-group-307718949

// To be removed
// ui-draggable
// ui-resizable"

// Status
// fc-event-start
// fc-event-end
// fc-booking
// fc-pending                   pencilled-in
// fc-completed
// fc-paid
// fc-comment
