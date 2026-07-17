import type {FractionalRect} from '../../lib/videoRect';

type Base = {
  id: string;
  start: number;
  end: number;
  sourceNote?: string;
};

export type TitleOverlay = Base & {
  type: 'title';
  kicker?: string;
  title: string;
  subtitle?: string;
};

export type CardGroup = {
  label: string;
  items: string[];
  highlight?: string;
};

export type CardStep = {
  index: string;
  text: string;
  hint?: string;
  /** Absolute time on the edited timeline; the step stays hidden until then. */
  revealAt?: number;
};

/**
 * One named product inside a compare box. Plain strings stay valid for chips
 * that are never called out by name.
 */
export type CompareItem = {
  text: string;
  /**
   * Absolute time on the edited timeline. When the narration names this one,
   * its border flares and then settles into a lit state, so by the end of the
   * box you can see which ones were actually discussed.
   */
  namedAt?: number;
};

export type CompareBox = {
  id: string;
  label: string;
  title: string;
  sublabel: string;
  items: (string | CompareItem)[];
  note?: string;
  /** Absolute time on the edited timeline; the box springs in here. */
  revealAt: number;
  /** Absolute time; from here the box gets an animated accent pulse. */
  highlightAt?: number;
  /**
   * Absolute time; the box fades out here while keeping its slot, so the box
   * beside it holds still instead of sliding across to take the space.
   */
  hideAt?: number;
};

export type CompareOverlay = Base & {
  type: 'compare';
  anchor: FractionalRect;
  boxes: CompareBox[];
};

export type CardOverlay = Base & {
  type: 'card';
  anchor: FractionalRect;
  /** Visual magnification. `anchor.width` stays the on-screen footprint. */
  scale?: number;
  kicker?: string;
  title: string;
  lines?: string[];
  groups?: CardGroup[];
  steps?: CardStep[];
  footnote?: string;
};

export type NoteOverlay = Base & {
  type: 'note';
  anchor: FractionalRect;
  scale?: number;
  label: string;
  text: string;
};

export type BlurOverlay = Base & {
  type: 'blur';
  blurPx?: number;
  rects: Required<FractionalRect>[];
};

/**
 * Marks a stretch the edit plays back faster than life. Unlike every other
 * overlay this one is meant to span a sped range, so the shift scripts remap
 * its timings through the speed map instead of refusing them.
 *
 * The bar fills across the overlay's own Sequence, so it tops out exactly when
 * normal speed resumes — no separate timing to keep in sync.
 */
export type SpeedOverlay = Base & {
  type: 'speed';
  /** Only `width` is read when `place` is `'center'`; `x`/`y` are ignored. */
  anchor: FractionalRect;
  /**
   * Centres the badge in the displayed video rect on both axes. Vertical
   * centring can't be expressed as an anchor `y`, because that is the badge's
   * top edge and the badge's height depends on its content — so a hardcoded `y`
   * drifts off centre as soon as the label changes.
   */
  place?: 'center';
  scale?: number;
  label: string;
};

export type Overlay =
  | TitleOverlay
  | CardOverlay
  | CompareOverlay
  | NoteOverlay
  | BlurOverlay
  | SpeedOverlay;

export type OverlayFile = {
  version: number;
  timeline: string;
  video: {width: number; height: number};
  overlays: Overlay[];
};
