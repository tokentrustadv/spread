-- cover-page.lua — heading structure for the PDF/LaTeX build only.
--
-- The cover image itself is handled outside Pandoc entirely: the
-- Makefile / GitHub Actions workflow converts it to a one-page PDF and
-- merges it in front of this document's output, so it needs no
-- involvement here. This filter's job is the other half of "cover-first,
-- structurally correct" PDF: turning the manuscript's flat H1/H2/H3
-- hierarchy into the distinct Part-divider / chapter-opener / subsection
-- treatment defined in templates/commitment-chain.tex, for LaTeX output
-- only. EPUB, DOCX, and HTML builds never load this filter and get
-- Pandoc's normal Header handling and --toc.
--
-- H1 -> \bookpart{...}{...}        if the text matches "Part <roman>: Title"
--       \frontmatterchapter{L}{T}  otherwise (L is the text before the
--                                  first colon, or empty if there is none)
-- H2 -> \numberedchapter{N}{Title} for the manuscript's "N. Title" chapters
-- H3 -> left untouched (mapped to \subsection by --top-level-division=chapter)

local function escape_latex(s)
  local map = {
    ['\\'] = '\\textbackslash{}',
    ['{'] = '\\{', ['}'] = '\\}',
    ['$'] = '\\$', ['&'] = '\\&', ['#'] = '\\#',
    ['^'] = '\\^{}', ['_'] = '\\_', ['%'] = '\\%', ['~'] = '\\~{}',
  }
  return (s:gsub('[\\{}$&#^_%%~]', map))
end

local function Header(el)
  if not FORMAT:match('latex') then
    return nil
  end

  local text = pandoc.utils.stringify(el.content)

  if el.level == 1 then
    local roman, title = text:match('^Part%s+([IVXLCDM]+):%s*(.+)$')
    if roman then
      return pandoc.RawBlock('latex', string.format(
        '\\bookpart{%s}{%s}', escape_latex('Part ' .. roman), escape_latex(title)))
    end

    local label, rest = text:match('^([^:]+):%s*(.+)$')
    if label and rest then
      return pandoc.RawBlock('latex', string.format(
        '\\frontmatterchapter{%s}{%s}', escape_latex(label), escape_latex(rest)))
    end

    return pandoc.RawBlock('latex', string.format(
      '\\frontmatterchapter{}{%s}', escape_latex(text)))
  end

  if el.level == 2 then
    local num, rest = text:match('^(%d+)%.%s*(.+)$')
    if num then
      return pandoc.RawBlock('latex', string.format(
        '\\numberedchapter{%s}{%s}', num, escape_latex(rest)))
    end
    -- Defensive fallback for any future H2 that isn't "N. Title".
    return pandoc.RawBlock('latex', string.format(
      '\\frontmatterchapter{}{%s}', escape_latex(text)))
  end

  return nil
end

return { { Header = Header } }
