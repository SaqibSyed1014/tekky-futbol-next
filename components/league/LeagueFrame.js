import { CoordinateTag } from '@/components/venue/VenueArt';
import './league.css';

/**
 * League environment frame (roadmap §1) — wraps the <header> + <main> of every
 * league page / league hub. The artwork itself (chain-link perimeter, light-pole
 * silhouettes with downward #FFFFFF beams) is pure CSS in league.css; this
 * component adds the two tactical stamps. Exactly two unique coordinates per
 * page: pitch coordinates in the header, headquarters tag in the footer band.
 */

export const HQ_TAG = '[SYS_HQ // FULTON_MARKET]';

export default function LeagueFrame({ children }) {
  return (
    <div className="league-frame">
      <CoordinateTag className="league-stamp league-stamp--top" />
      {children}
      <div className="league-stamp-bar">
        <span className="league-stamp" aria-label="Headquarters: Fulton Market">{HQ_TAG}</span>
      </div>
    </div>
  );
}
