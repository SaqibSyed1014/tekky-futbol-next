/**
 * Admin panel constants.
 */

/** Application lifecycle statuses returned by the backend */
export const APPLICATION_STATUS = {
  PENDING:   'pending',
  APPROVED:  'approved',
  REJECTED:  'rejected',
  WAITLIST:  'waitlist',
  INTERVIEW: 'interview',
};

/** Human-readable labels for each status */
export const STATUS_LABEL = {
  [APPLICATION_STATUS.PENDING]:   'Pending',
  [APPLICATION_STATUS.APPROVED]:  'Approved',
  [APPLICATION_STATUS.REJECTED]:  'Rejected',
  [APPLICATION_STATUS.WAITLIST]:  'Waitlist',
  [APPLICATION_STATUS.INTERVIEW]: 'Interview',
};

/** Badge colours per status (CSS colour values) */
export const STATUS_COLOR = {
  [APPLICATION_STATUS.PENDING]:   { bg: 'rgba(255,180,0,0.15)',   border: 'rgba(255,180,0,0.5)',   text: '#ffb400' },
  [APPLICATION_STATUS.APPROVED]:  { bg: 'rgba(0,200,100,0.15)',   border: 'rgba(0,200,100,0.5)',   text: '#00c864' },
  [APPLICATION_STATUS.REJECTED]:  { bg: 'rgba(255,60,60,0.15)',   border: 'rgba(255,60,60,0.5)',   text: '#ff3c3c' },
  [APPLICATION_STATUS.WAITLIST]:  { bg: 'rgba(160,100,255,0.15)', border: 'rgba(160,100,255,0.5)', text: '#a064ff' },
  [APPLICATION_STATUS.INTERVIEW]: { bg: 'rgba(0,200,255,0.15)',   border: 'rgba(0,200,255,0.5)',   text: '#00c8ff' },
};

/** Number of applications per page */
export const ITEMS_PER_PAGE = 20;

/** Tab filter options shown in the UI */
export const STATUS_FILTERS = [
  { value: '',                              label: 'All'       },
  { value: APPLICATION_STATUS.PENDING,     label: 'Pending'   },
  { value: APPLICATION_STATUS.INTERVIEW,   label: 'Interview' },
  { value: APPLICATION_STATUS.WAITLIST,    label: 'Waitlist'  },
  { value: APPLICATION_STATUS.APPROVED,    label: 'Approved'  },
  { value: APPLICATION_STATUS.REJECTED,    label: 'Rejected'  },
];
