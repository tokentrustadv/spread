# The Commitment Chain

*A Framework for Seeing Structural Change Before Markets Price It*
By Chip Mahoney — Published by Token Trust

This folder contains the manuscript for **The Commitment Chain** and a fully
automated GitHub Actions pipeline that turns it into a finished PDF, EPUB,
DOCX, and HTML edition. Everything runs on GitHub's servers — there is
nothing to install on your Chromebook, and no terminal commands are needed
at any point in this process.

## How this works, in one sentence

You edit `book.md` on the GitHub website, GitHub Actions builds the book
automatically, and you download the finished files from the **Actions**
tab.

---

## Editing the book

1. Open this repository on [github.com](https://github.com) and navigate
   into the `the-commitment-chain` folder.
2. Click on `book.md`.
3. Click the pencil icon (**Edit this file**) in the top-right corner of
   the file view.
4. Make your changes directly in the browser.
5. Scroll to the bottom and click **Commit changes...**, then **Commit
   changes** again to confirm.

That commit automatically starts a new build. You don't need to do
anything else to trigger it.

## Downloading a build

1. Open the repository's **Actions** tab (top navigation bar).
2. Click **Build Book** in the left sidebar.
3. Click the most recent run at the top of the list (look for a green
   checkmark — that means it succeeded).
4. Scroll down to the **Artifacts** section at the bottom of that run's
   page.
5. Click **the-commitment-chain-build** to download a `.zip` file.
6. Unzip it (on a Chromebook, click the downloaded file in the Files app
   and choose **Extract**). Inside you'll find:
   - `the-commitment-chain.pdf`
   - `the-commitment-chain.epub`
   - `the-commitment-chain.docx`
   - `the-commitment-chain.html`

A build normally takes a few minutes. If the run shows a red X instead of
a green checkmark, click into it to see which step failed — the workflow
is written to stop and report an error clearly rather than silently
producing a broken file.

## Rebuilding manually

You don't need to change the manuscript to trigger a new build:

1. Open the **Actions** tab.
2. Click **Build Book** in the left sidebar.
3. Click the **Run workflow** button (top-right of the run list).
4. Leave the branch as-is and click the green **Run workflow** button in
   the small popup.
5. A new run will appear within a few seconds. Follow the same steps as
   above to download it once it finishes.

## Creating a release (v1.0, v1.1, ...)

A "release" packages the PDF, EPUB, DOCX, HTML, the manuscript, and the
cover image together on a permanent page, using the notes from
`CHANGELOG.md`. This only happens when you deliberately create a
**tag** — an ordinary commit will never publish a release.

The easiest way to do this entirely from the GitHub website:

1. Open the repository's main page.
2. Click **Releases** in the right-hand sidebar (or go to the
   repository's **Tags** page if you don't see it there).
3. Click **Draft a new release** (or **Create a new release**).
4. In the **Choose a tag** field, type a new tag name such as `v1.0` and
   select **Create new tag: v1.0 on publish**.
5. Add a release title if you'd like (optional — the workflow will fill
   in the notes automatically from `CHANGELOG.md`).
6. Click **Publish release**.

Publishing the tag automatically triggers the **Release Book** workflow,
which builds the book fresh and attaches all the files to that release
page within a few minutes. You can watch its progress from the **Actions**
tab the same way as a normal build.

To publish a later version (`v1.1`, `v2.0`, ...), first update
`CHANGELOG.md` with a new `## <version> — <year>` section, commit that
change, and then repeat the steps above with the new tag name.

## Replacing the cover image

The cover currently in this repository (`cover.png`) is a placeholder
built to match the approved design's colors, title, subtitle, and
five-stage chain graphic, so the pipeline can be tested end-to-end.
To swap in the final approved artwork:

1. Open the `the-commitment-chain` folder on GitHub.
2. Click **Add file → Upload files**.
3. Drag in the real cover image, named exactly `cover.png` (or, if your
   file is a `.jpg`, upload it as `cover.jpg` and update the `COVER`
   line near the top of `Makefile` and the `cover-image` /
   `epub-cover-image` lines in `metadata.yaml` to match).
4. Commit the change directly to the branch you're working on.
5. The build will pick up the new cover automatically on the next run.

No image editing software is required — GitHub's uploader accepts the
file as-is, and the workflow converts it to a properly sized, full-bleed
PDF page during the build.

## What gets produced

Every successful build creates, inside `dist/`:

| File | Format | Notes |
|---|---|---|
| `the-commitment-chain.pdf` | PDF | Cover-first, laid out for sale (e.g. on Gumroad) |
| `the-commitment-chain.epub` | EPUB | Uses the cover image as its e-reader cover |
| `the-commitment-chain.docx` | Word | Clean, structurally correct, not styled to match the PDF |
| `the-commitment-chain.html` | HTML | Single self-contained file, viewable in any browser |

## Repository structure

```text
the-commitment-chain/
├── book.md                        # the manuscript (edit this)
├── cover.png                      # front cover artwork
├── metadata.yaml                  # title/author/keywords/PDF & EPUB settings
├── README.md                      # this file
├── CHANGELOG.md                   # version history / release notes source
├── Makefile                       # build commands (used by GitHub Actions)
├── templates/
│   ├── commitment-chain.tex       # custom PDF layout (XeLaTeX)
│   └── style.css                  # minimal styling for the HTML edition
├── filters/
│   └── cover-page.lua             # heading structure for the PDF build
└── dist/                          # build output (ignored until a build runs)

.github/workflows/
├── build-book.yml                 # builds on every relevant commit + manual runs
└── release-book.yml                # builds and publishes a GitHub Release on a tag
```

## If something goes wrong

- **A build fails (red X):** open the run in the Actions tab and read the
  step that failed — the workflow is written to stop immediately and
  print a clear error rather than continuing with a broken file.
- **The PDF looks different than expected after an edit:** double-check
  that heading levels in `book.md` weren't changed accidentally
  (`#` for major sections, `##` for numbered chapters, `###` for
  chapter subsections) — the layout depends on that structure.
- **You need to change the title, author, or keywords:** edit
  `metadata.yaml`, not `book.md` or the template.

Nothing in this workflow requires Pandoc, LaTeX, or any command-line tool
to be installed on your own computer. All of it runs inside GitHub
Actions.
