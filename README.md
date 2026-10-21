# Launchyard: free browser and local tools

| Task | Browser tool | Source |
| --- | --- | --- |
| Print comes out too small or too large | [Print scale calculator and A4/Letter PDF proof](https://launchyard-free-tools.pink-map-7606.chatgpt.site/print-scale/?utm_source=github) | [Print diagnostic guide and PDF generator](tools/print-scale/) |
| Missing translation keys or changed variables | [JSON translation checker](https://launchyard-free-tools.pink-map-7606.chatgpt.site/locale/?utm_source=github) | [Local checker](tools/locale-check/) |

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
