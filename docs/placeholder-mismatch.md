# A translated placeholder can be valid JSON and still break interpolation

Source: `{"welcome":"Hello, {{name}}"}`

Broken target: `{"welcome":"Hola, {{nombre}}"}`

Candidate: `{"welcome":"Hola, {{name}}"}`

Translate the surrounding sentence, preserving the variable your code provides. Keep the brace format appropriate to your framework. A successful JSON parse says nothing about whether the variable identifiers match.

Use the complete source and target from the same release, compare, review the context, change the target, recheck, and inspect the rendered interface. Do not search-and-replace identifiers blindly across different messages.

The local command in README checks simple braces only. ICU and markup need a dedicated parser. Reference: [i18next interpolation](https://www.i18next.com/translation-function/interpolation).

[Compare your files in the browser](https://launchyard-free-tools.pink-map-7606.chatgpt.site/guides/json-placeholder-mismatch/?utm_source=github). Files stay on your device. Optional usage sharing is off by default.
