# Launchyard — print size check

A free browser tool for patterns, templates and artwork that print too small or too large.

**[Open Print size check](https://launchyard-free-tools.pink-map-7606.chatgpt.site/print-scale/?utm_source=github)** · **[Printing guide and local source](tools/print-scale/)**

![Print size check: A4/Letter test-sheet download beside width and height measurements](docs/print-size-check.png)

*Screenshot of the hosted v8 interface in a local browser, 21 October 2026. It is not a photograph of a physical print or evidence of customer use. The standalone source now uses the same print workflow and calculation/PDF core, without the hosted site's research controls.*

## Print one test before the whole job

1. Choose A4 or US Letter and download the one-page test PDF.
2. Print at **Actual size / 100%**, with Fit, Shrink and borderless enlargement off.
3. Measure the printed 100 × 100 mm square horizontally and vertically with a physical ruler.
4. Enter both measurements. The tool suggests a trial correction for a uniform size error, or explains why one percentage cannot correct unequal axes.
5. Print and measure another test before printing the full pattern or batch.

For example, **95 × 95 mm at 100%** gives a trial setting of **105.263%**. **95 × 100 mm** requires remeasurement and a settings check, rather than a single correction. These are synthetic examples.

No account, file upload or model API is required. Measurements are processed in your browser. The hosted site counts aggregate page requests, has optional action sharing and accepts optional anonymous feedback; those are not unique-person counts. [Privacy details](https://launchyard-free-tools.pink-map-7606.chatgpt.site/privacy/).

## What has and has not been checked

- PDF geometry, page sizes, arithmetic and byte structure were checked, including with a separate PDF parser.
- The hosted v8 interface was tested locally in a browser at desktop/mobile sizes for downloads, input/result states and feedback/consent behavior.
- A physical printer test has **not** been performed. Local browser checks do not verify production delivery or every printer driver.
- The 0.5 mm axis-difference threshold is a diagnostic assumption, not a manufacturer's tolerance. For sewing patterns, verify the designer's test square before cutting fabric.

No advertising scripts, checkout or subscriptions are currently active. AI-assisted development; MIT licensed under [LICENSE](LICENSE). No guaranteed support response time.

## Other retained tool

<details>
<summary>JSON translation checker — browser and local CLI</summary>

## JSON translation checker

Compare two JSON locale files for missing keys, empty strings and changed `{name}` or `{{name}}` variables. Run locally with no dependencies, account, model API or telemetry.

**[Try the browser checker](https://launchyard-free-tools.pink-map-7606.chatgpt.site/locale/?utm_source=github)** · **[Fix variable mismatches](https://launchyard-free-tools.pink-map-7606.chatgpt.site/guides/json-placeholder-mismatch/?utm_source=github)** · **[Find missing translation keys](https://launchyard-free-tools.pink-map-7606.chatgpt.site/guides/missing-json-translation-keys/?utm_source=github)**

## Reproduce an error and recheck a candidate

With Node.js 20 or later, clone or download this repository and run from its root:

```sh
node tools/locale-check/check.cjs examples/en.json examples/es-broken.json
```

Expected: exit code 1 and three findings: the variable `{{nombre}}` differs from `{{name}}`, `menu.cancel` is missing, and `menu.save` is empty.

```sh
node tools/locale-check/check.cjs examples/en.json examples/es-candidate.json
node --test tools/locale-check/check.test.cjs
```

The candidate returns exit code 0 for supported structural checks. It still needs language and interface review. To use your own files:

```sh
node tools/locale-check/check.cjs path/to/en.json path/to/es.json > report.json
```

Exit codes: **0** supported structure passes; **1** supported findings; **2** unsupported syntax or input error. An ICU message returns 2, even if both input files match.

## Exact scope

- Nested JSON objects and string leaves; missing/extra keys, empty translations, type changes, simple named variables, duplicate JSON keys.
- Maximum 1 MB per file, 10,000 keys and nesting depth 40.
- ICU plurals/select, markup, arrays, literal braces and custom interpolation syntax are outside this small checker's scope.
- Variable occurrence counts and semantic correctness are not assessed. A structural pass cannot catch a sentence whose meaning is reversed.
- Extra keys may be intentional. Do not delete them without checking the application.

Mature free alternatives exist, including [Lingual i18n-check](https://github.com/lingualdev/i18n-check). Use your framework's compiler for its full syntax. This checker is useful when its narrow, explicit scope matches your files; it does not claim to replace translation review or a full localization platform.

## Privacy and feedback

The CLI never uploads files or sends analytics. The separate browser site processes JSON locally and offers optional anonymous usage sharing and an optional feedback form. Its form does not provide replies. No account, paid repair service or subscription is required or currently offered. No paid repair or subscription is planned under the current advertising-only experiment; no ads are currently active.

[Privacy details](https://launchyard-free-tools.pink-map-7606.chatgpt.site/privacy/). Please do not post confidential translation files, credentials, personal data or customer records in public issues. There is no promised support response time.

Code and documentation were developed with generative AI assistance and checked with the supplied structural examples. Example Spanish has not received independent native-speaker review. The checker itself calls no AI model.

MIT licensed; see LICENSE.


</details>
