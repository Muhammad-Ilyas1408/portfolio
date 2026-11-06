import { Fragment } from "react";

import { accentText, type Accent } from "./Eyebrow";

/**
 * Renders `text` with its first occurrence of `phrase` in an accent color
 * (violet for signal, lime for ember); the rest keeps the normal text color.
 * The phrase must already be part of the text, so no new words appear.
 */
export function AccentText({
  text,
  phrase,
  accent = "signal",
}: {
  text: string;
  phrase?: string;
  accent?: Accent;
}) {
  const index = phrase ? text.indexOf(phrase) : -1;
  if (!phrase || index === -1) return <>{text}</>;

  return (
    <Fragment>
      {text.slice(0, index)}
      <span className={accentText[accent]}>{phrase}</span>
      {text.slice(index + phrase.length)}
    </Fragment>
  );
}
