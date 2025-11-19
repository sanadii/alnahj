// Import Images - COMMENTED OUT (Template code, images don't exist)
// import slack from "assets/images/brands/slack.png";
// import dribbble from "assets/images/brands/dribbble.png";
// import mailChimp from "assets/images/brands/mail_chimp.png";
// import dropbox from "assets/images/brands/dropbox.png";
// import avatar2 from "assets/images/users/avatar-2.jpg";
// import avatar3 from "assets/images/users/avatar-3.jpg";
// import avatar4 from "assets/images/users/avatar-4.jpg";
// import avatar5 from "assets/images/users/avatar-5.jpg";
// import avatar6 from "assets/images/users/avatar-6.jpg";
// import avatar7 from "assets/images/users/avatar-7.jpg";
// import avatar8 from "assets/images/users/avatar-8.jpg";
// import avatar9 from "assets/images/users/avatar-9.jpg";
// import avatar10 from "assets/images/users/avatar-10.jpg";

// Placeholder images (using empty strings for now)
const slack = '';
const dribbble = '';
const mailChimp = '';
const dropbox = '';
const avatar2 = '';
const avatar3 = '';
const avatar4 = '';
const avatar5 = '';
const avatar6 = '';
const avatar7 = '';
const avatar8 = '';
const avatar9 = '';
const avatar10 = '';

const projectList = [
  {
    id: 1,
    isDesign2: true,
    label: 'Multipurpose landing template',
    description: 'something',
    status: 'Inprogress', // draft, started, inProgress, completed, delayed, cancelled
    subItem: [
      { id: 1, imgNumber: 'D', bgColor: 'danger' },
      { id: 2, imgTeam: avatar5 },
      { id: 3, imgTeam: avatar6 },
      { id: 4, imgNumber: '+' }
    ],
    number: '20/34', // number of tasks
    progressBar: '50%', // number of completed tasks / total number of tasks
    ratingClass: 'active', // add to favourite
    cardHeaderClass: 'danger', // dynamic
    date: '03 Aug, 2021', // created_at, updated_at, deleted_at, created_by, updated_by
    thumbNail: '', // thumbnail

    priority: '', // statusClass
    statusClass: 'warning',
    endDate: '18 Sep, 2021',
    startDate: '18 Sep, 2021',
    dueDate: '18 Sep, 2021',

    // Privacy
    privacyStatus: '', // private, team, public
    tags: '',
    skills: '',
    members: '',
    attachedFiles: ''
  },
  {
    id: 2,
    isDesign1: false,
    time: 'Updated 3hrs ago',
    img: slack,
    imgbgColor: 'warning',
    label: 'Slack brand logo design',
    caption: 'Create a Brand logo design for a velzon admin.',
    number: '18/42',
    progressBar: '34%',
    subItem: [
      { id: 1, imgFooter: avatar2 },
      { id: 2, imgNumber: '+' }
    ],
    date: '10 Jul, 2021',
    ratingClass: ''
  },
  {
    id: 3,
    isDesign1: true,
    time: 'Last update : 08 May',
    img: dribbble,
    imgbgColor: 'danger',
    label: 'Redesign - Landing page',
    caption: 'Resign a landing page design. as per abc minimal design.',
    number: '22/56',
    progressBar: '54%',
    subItem: [
      { id: 1, imgFooter: avatar3 },
      { id: 2, imgNumber: 'S', bgColor: 'secondary' },
      { id: 3, imgFooter: avatar4 },
      { id: 4, imgNumber: '+' }
    ],
    date: '18 May, 2021',
    ratingClass: 'active',
    cardHeaderClass: 'danger'
  },

  {
    id: 4,
    isDesign1: true,
    time: 'Last update : 21 Jun',
    img: dropbox,
    imgbgColor: 'success',
    label: 'Project App',
    caption: 'Create a project application for a project management and task management.',
    number: '20/34',
    progressBar: '78%',
    subItem: [
      { id: 1, imgNumber: 'K', bgColor: 'info' },
      { id: 2, imgNumber: 'M', bgColor: 'danger' },
      { id: 3, imgNumber: '+' }
    ],
    date: '03 Aug, 2021',
    ratingClass: ''
  },
  //design 2
  {
    id: 5,
    isDesign2: true,
    label: 'Multipurpose landing template',
    status: 'Inprogress',
    statusClass: 'warning',
    deadline: '18 Sep, 2021',
    subItem: [
      { id: 1, imgNumber: 'D', bgColor: 'danger' },
      { id: 2, imgTeam: avatar5 },
      { id: 3, imgTeam: avatar6 },
      { id: 4, imgNumber: '+' }
    ],
    progressBar: '50%',
    ratingClass: 'active',
    cardHeaderClass: 'danger'
  },
  {
    id: 6,
    isDesign2: true,
    label: 'Dashboard UI',
    status: 'Completed',
    statusClass: 'success',
    deadline: '10 Jun, 2021',
    subItem: [
      { id: 1, imgTeam: avatar7 },
      { id: 2, imgTeam: avatar8 },
      { id: 3, imgNumber: '+' }
    ],
    progressBar: '95%',
    ratingClass: 'active',
    cardHeaderClass: 'warning'
  },
  {
    id: 7,
    isDesign2: true,
    label: 'Vector Images',
    status: 'Inprogress',
    statusClass: 'warning',
    deadline: '08 Apr, 2021',
    subItem: [
      { id: 1, imgNumber: 'C', bgColor: 'info' },
      { id: 2, imgNumber: '+' }
    ],
    progressBar: '41%',
    ratingClass: '',
    cardHeaderClass: 'info'
  },
  {
    id: 8,
    isDesign2: true,
    label: 'Authentication',
    status: 'Inprogress',
    statusClass: 'warning',
    deadline: '22 Nov, 2021',
    subItem: [
      { id: 1, imgTeam: avatar8 },
      { id: 2, imgNumber: '+' }
    ],
    progressBar: '35%',
    ratingClass: 'active',
    cardHeaderClass: 'success'
  },
  //design 3
  {
    id: 9,
    isDesign3: true,
    img: dribbble,
    label: 'Kanban Board',
    status: 'Inprogress',
    statusClass: 'warning',
    deadline: '08 Dec, 2021',
    number: '17/20',
    progressBar: '71%',
    subItem: [
      { id: 1, imgNumber: 'D', bgColor: 'danger' },
      { id: 2, imgTeam: avatar5 },
      { id: 3, imgNumber: '+' }
    ],
    ratingClass: 'active',
    cardHeaderClass: 'secondary'
  },
  {
    id: 10,
    isDesign3: true,
    img: slack,
    label: 'Ecommerce app',
    status: 'Inprogress',
    statusClass: 'warning',
    deadline: '20 Nov, 2021',
    number: '11/45',
    progressBar: '20%',
    subItem: [
      { id: 1, imgTeam: avatar9 },
      { id: 2, imgTeam: avatar10 },
      { id: 3, imgNumber: '+' }
    ],
    ratingClass: '',
    cardHeaderClass: 'light'
  },
  {
    id: 11,
    isDesign3: true,
    img: dropbox,
    label: 'Redesign - Landing page',
    status: 'Inprogress',
    statusClass: 'warning',
    deadline: '10 Jul, 2021',
    number: '13/26',
    progressBar: '54%',
    subItem: [
      { id: 1, imgTeam: avatar3 },
      { id: 2, imgNumber: 'S', bgColor: 'secondary' },
      { id: 3, imgTeam: avatar4 },
      { id: 4, imgNumber: '+' }
    ],
    ratingClass: '',
    cardHeaderClass: 'primary'
  },
  {
    id: 12,
    isDesign3: true,
    img: mailChimp,
    label: 'Multipurpose landing template',
    status: 'Completed',
    statusClass: 'success',
    deadline: '18 Sep, 2021',
    number: '25/32',
    progressBar: '75%',
    subItem: [
      { id: 1, imgNumber: 'D', bgColor: 'danger' },
      { id: 2, imgTeam: avatar5 },
      { id: 3, imgTeam: avatar6 },
      { id: 4, imgNumber: '+' }
    ],
    ratingClass: 'active',
    cardHeaderClass: 'danger'
  }
];
export { projectList };
