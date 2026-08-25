/**
 * Document starters — an ordered set of pages, ready to be written into.
 *
 * Four, all of them things this brand actually makes. A notebook is its word
 * for a series of letters; the annual report is a letter to patrons, because
 * that is how a company with no shareholders and one price would write one.
 *
 * The generic business documents — proposals with pricing tables, whitepapers
 * with executive summaries, CVs — are absent on purpose. They would need a
 * vocabulary the brand explicitly rejects, and a starter nobody can write in
 * the brand's voice is worse than no starter at all.
 *
 * Text does not flow between pages. Each page holds its own copy, exactly as
 * every other template does: Satori cannot measure and re-break a paragraph
 * across a page boundary, and a DOM-side auto-split would drift from the
 * exported page — the precise failure the visual-regression suite exists to
 * catch.
 */
import type { FieldValues, Variant } from "./types";

export type StarterPage = {
  templateId: string;
  values?: FieldValues;
  variant?: Partial<Variant>;
};

export type DocumentStarter = {
  id: string;
  name: string;
  blurb: string;
  /** What the pages are, for the card. */
  outline: string;
  pages: StarterPage[];
};

const cover = (values: FieldValues): StarterPage => ({ templateId: "document/cover", values });
const opener = (values: FieldValues): StarterPage => ({ templateId: "document/opener", values });
const text = (values: FieldValues): StarterPage => ({ templateId: "document/text", values });
const colophon = (values: FieldValues): StarterPage => ({ templateId: "document/colophon", values });

export const DOCUMENT_STARTERS: DocumentStarter[] = [
  {
    id: "notebook",
    name: "A notebook",
    blurb:
      "A series of letters, gathered in the order they were written. The brand's own long-form shape.",
    outline: "Cover · opener · two letter pages · colophon",
    pages: [
      cover({
        runningHead: "A notebook",
        title: "Letters from a leaving city",
        standfirst: "Eight letters about departure, gathered in the order they were written.",
        byline: "Ines Marlowe",
      }),
      opener({
        runningHead: "Letters from a leaving city",
        title: "One · On the small grief of leaving",
        standfirst: "A small inventory of what was left behind.",
        folio: "1",
        byline: "",
      }),
      text({ runningHead: "Letters from a leaving city", folio: "2" }),
      text({ runningHead: "Letters from a leaving city", folio: "3", body: "" }),
      colophon({ runningHead: "Letters from a leaving city", folio: "❦" }),
    ],
  },
  {
    id: "letter",
    name: "A letter, printed",
    blurb: "One essay, set for paper. For a reader who would rather hold it than scroll it.",
    outline: "Title · body · colophon",
    pages: [
      opener({
        runningHead: "harystyles",
        title: "On the small grief of leaving a city",
        standfirst: "A small inventory of what was left behind, and what came along by mistake.",
        byline: "Ines Marlowe",
        folio: "",
      }),
      text({ runningHead: "On the small grief of leaving a city", folio: "2" }),
      colophon({
        runningHead: "On the small grief of leaving a city",
        title: "A note on this letter",
        body:
          "First published at harystyles.com, where the lamp is lit at sunset.\n\n" +
          "Ninety per cent of what patrons pay goes to the writer.",
        folio: "❦",
      }),
    ],
  },
  {
    id: "press-kit",
    name: "A press kit",
    blurb: "What we are, what is true about us, and where the logos live. For someone writing about us.",
    outline: "Cover · the story · the facts · the assets",
    pages: [
      cover({
        runningHead: "Press kit",
        title: "harystyles",
        standfirst: "Letters, not posts.",
        byline: "press@harystyles.com",
      }),
      opener({
        runningHead: "Press kit",
        title: "The story",
        standfirst: "",
        body:
          "harystyles is a place for emotional long-form writing. Five letters a night, hand-picked for the mood a reader arrived in, and then the lamp goes out.\n\n" +
          "There is no feed, no follower count and no like button. Readers become patrons of one writer at a time, for four pounds a month, and ninety per cent of that goes to the writer.",
        folio: "2",
      }),
      text({
        runningHead: "Press kit",
        title: "The facts",
        body:
          "Founded 2023. Two people.\n\n" +
          "412 patrons of the most-read writer; 10,000 letters published; 1,204 lines kept by readers.\n\n" +
          "No outside investment. One price, unchanged since launch.",
        folio: "3",
      }),
      colophon({
        runningHead: "Press kit",
        title: "The assets",
        body:
          "Logos, wordmarks and the full palette are on the brand page at harystyles.com/playbook/brand, and download as a single kit.\n\n" +
          "Please use the mark as supplied. It has a minimum size and a clear-space rule, both documented there.",
        folio: "❦",
      }),
    ],
  },
  {
    id: "annual-letter",
    name: "The annual letter",
    blurb:
      "A year, addressed to the people who paid for it. What a company with no shareholders writes instead of a report.",
    outline: "Cover · the letter · the figures · close",
    pages: [
      cover({
        runningHead: "The year",
        title: "A letter to our patrons",
        standfirst: "What happened here in 2026, and what it cost.",
        byline: "harystyles",
      }),
      opener({
        runningHead: "A letter to our patrons",
        title: "Dear reader,",
        standfirst: "",
        body:
          "This is the part of the year where most companies write a report. We do not have shareholders to write one for, so this is a letter instead, and it is addressed to you because you are the only person it concerns.\n\n" +
          "Ten thousand letters were written here this year. We did not expect that and we are not taking it for granted.",
        folio: "2",
      }),
      text({
        runningHead: "A letter to our patrons",
        title: "The figures",
        body:
          "412 patrons of the most-read writer, and 3,180 across everyone.\n\n" +
          "Ninety per cent of every four pounds went to a writer. The remaining ten paid for the servers and for two salaries.\n\n" +
          "The price did not change. It will not change next year either.",
        folio: "3",
      }),
      colophon({
        runningHead: "A letter to our patrons",
        title: "Until next year",
        body: "The lamp will be lit again at sunset. Thank you for reading slowly.",
        folio: "❦",
      }),
    ],
  },
];
