# Makefile — The Commitment Chain build
#
# Assumes Pandoc, a XeLaTeX-capable TeX distribution, img2pdf, and
# poppler-utils (pdfunite) are already installed. GitHub Actions installs
# all of these automatically (see .github/workflows/build-book.yml) — this
# file exists for that workflow and for any contributor who has Pandoc
# installed locally. Nothing here needs to run on a Chromebook.

BOOK      := book.md
METADATA  := metadata.yaml
TEMPLATE  := templates/commitment-chain.tex
FILTER    := filters/cover-page.lua
STYLE     := templates/style.css
COVER     := cover.png
DIST      := dist
NAME      := the-commitment-chain
COVER_DPI := 300

PANDOC_COMMON := --metadata-file=$(METADATA) --resource-path=.

.PHONY: all pdf epub docx html cover-pdf clean

all: pdf epub docx html

$(DIST):
	mkdir -p $(DIST)

cover-pdf: $(DIST)
	img2pdf --imgsize $(COVER_DPI)dpi -o $(DIST)/cover.pdf $(COVER)

pdf: $(DIST) cover-pdf
	pandoc $(BOOK) $(PANDOC_COMMON) \
		-f markdown+raw_tex \
		--template=$(TEMPLATE) \
		--lua-filter=$(FILTER) \
		--top-level-division=chapter \
		--pdf-engine=xelatex \
		-o $(DIST)/interior.pdf
	qpdf --empty --pages $(DIST)/cover.pdf $(DIST)/interior.pdf -- $(DIST)/$(NAME).pdf
	exiftool -overwrite_original -q \
		-Title="The Commitment Chain" \
		-Subject="A Framework for Seeing Structural Change Before Markets Price It" \
		-Author="Chip Mahoney" \
		-Creator="Chip Mahoney" \
		-Producer="pandoc + xelatex" \
		-Keywords="Commitment Chain, crypto, digital assets, technological change, financial infrastructure, value capture, stablecoins, Bitcoin, investment frameworks, emerging technology" \
		$(DIST)/$(NAME).pdf
	rm -f $(DIST)/interior.pdf $(DIST)/cover.pdf

epub: $(DIST)
	pandoc $(BOOK) $(PANDOC_COMMON) \
		--toc --toc-depth=2 \
		-o $(DIST)/$(NAME).epub

docx: $(DIST)
	pandoc $(BOOK) $(PANDOC_COMMON) \
		--toc \
		-o $(DIST)/$(NAME).docx

html: $(DIST)
	pandoc $(BOOK) $(PANDOC_COMMON) \
		--standalone --embed-resources --toc --toc-depth=2 \
		--css=$(STYLE) \
		-o $(DIST)/$(NAME).html

clean:
	rm -f $(DIST)/*.pdf $(DIST)/*.epub $(DIST)/*.docx $(DIST)/*.html
