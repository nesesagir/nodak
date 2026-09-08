# Play Store checklist

## In the app (shipped in 1.0.2 / versionCode 6)

- [x] First launch opens **How to play** once
- [x] Settings → **Rate the app** (Play Store listing)
- [x] Rewarded ads via Google Mobile Ads (`AD_ID` declared)
- [x] Store listing copy: `ASO_TR.md`, `ASO_EN.md`
- [x] Production questionnaire draft: `PRODUCTION_FORM.md`
- [x] Screenshots + feature graphic: `assets/screenshots/`

## Play Console

1. Closed testing → release **1.0.2 (6)** with production AAB
2. Default store listing → Turkish + English descriptions from ASO files
3. Graphics from `assets/screenshots/` (do not replace with captioned drafts unless intended)
4. Advertising ID / “Contains ads” = Yes (matches the build)
5. After enough closed-test evidence → production access form (`PRODUCTION_FORM.md`)

## Local build artifact

```text
play-store/builds/nodak-1.0.2-vc6.aab
```

(Ignored by git — large binary.)
