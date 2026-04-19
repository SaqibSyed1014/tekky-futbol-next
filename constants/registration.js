/**
 * Registration / application form constants.
 * All option values and limits live here — nothing is hardcoded in the form.
 */

/** Application type sent to /applications */
export const APPLICATION_TYPE = {
  FREE_AGENT: 'free_agent',
  FULL_TEAM:  'full_team',
};

export const GENDER_OPTIONS = [
  { value: 'male',   label: 'Men'   },
  { value: 'female', label: 'Women' },
];

export const DIVISION_OPTIONS = [
  { value: 'north', label: 'North' },
  { value: 'south', label: 'South' },
];

export const REGISTRATION_TYPE_OPTIONS = [
  { value: APPLICATION_TYPE.FREE_AGENT, label: 'Free Agent'              },
  { value: APPLICATION_TYPE.FULL_TEAM,  label: 'Full Team Registration'  },
];

/** Max logo upload size in kilobytes */
export const MAX_LOGO_SIZE_KB = 5_000;

/** Total number of wizard steps (including confirmation screen) */
export const TOTAL_STEPS = 5;
