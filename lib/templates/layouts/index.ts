/**
 * The fourteen layouts every template is built from.
 *
 * Templates are configurations of these, not bespoke components — which is what
 * keeps a hundred and fifty artboards recognisably one system, and what makes a
 * change to the type scale or the margin land everywhere at once.
 */
export { HeadlineLayout, headlineSizeFor, type HeadlineProps } from "./headline";
export { StatLayout, type StatProps } from "./stat";
export { QuoteLayout, type QuoteProps } from "./quote";
export { SplitLayout, type SplitProps } from "./split";
export { ListLayout, type ListProps } from "./list";
export { HookLayout, type HookProps } from "./hook";
export { ComparisonLayout, type ComparisonProps } from "./comparison";
export { CtaLayout, type CtaProps } from "./cta";
export { SpotlightLayout, type SpotlightProps } from "./spotlight";
export { BannerLayout, type BannerProps } from "./banner";
export { AvatarLayout, type AvatarProps } from "./avatar";
export { QuestionLayout, type QuestionProps } from "./question";
export { StepsLayout, type StepsProps } from "./steps";
export { EventLayout, type EventProps } from "./event";
export { Caption, FootLine, LitLine, splitEmphasis } from "./common";
