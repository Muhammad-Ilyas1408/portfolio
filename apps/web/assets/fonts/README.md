# Fonts for generated images

Static TTF instances of the site's three typefaces, used only by `ImageResponse`
(`app/opengraph-image.tsx`, `app/projects/[slug]/opengraph-image.tsx`,
`app/icon.tsx`, `app/apple-icon.tsx`). `ImageResponse` reads TTF, OTF or WOFF,
not the WOFF2 files `next/font` serves to pages.

| File | Family, weight | Source |
| --- | --- | --- |
| `BricolageGrotesque-Bold.ttf` | Bricolage Grotesque 700 | Google Fonts |
| `Inter-Regular.ttf` | Inter 400 | Google Fonts |
| `JetBrainsMono-Medium.ttf` | JetBrains Mono 500 | Google Fonts |

All three are licensed under the SIL Open Font License 1.1
(<https://openfontlicense.org>), which allows bundling them with this site.
