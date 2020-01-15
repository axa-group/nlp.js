# Normalizer

A normalizer is a plugin that normalize the text for a language. The normalization is a process of transform a text into some standard.
By default the normalization does this:
- replace special characters into normalized one, example: "á", "ä" or "à" will be replaced by "a".
- convert to lower case.

## Why normalization is important?

Imagine the texts "The red house" and "The Red House". Both texts are not equal, but the meaning is the same, so one process to transform both into lower case is helpful.
About special characters, usually a chatbot is deployed in a channel where the people write. People is not perfect at writing, one example in spanish is that some persons does not use acutes, so if we train the NLP with a sentence like "qué sabes hacer?" and a person writes "que sabes hacer?" both "qué" and "que" are not equal.

## Default normalization

Default normalization of a text is done this way:

```javascript
  normalize(text) {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
```

## Example of use without container

```javascript
const { Normalizer } = require('@nlpjs/core');

const normalizer = new Normalizer();
const actual = normalizer.normalize('Ñam aquí, Lérn');
console.log(actual); // nam aqui, lern
```

## Example of use with container

Within a container the normalizer can be used in a multilanguage way: you can register normalizers for each language, so if a normalizer exists for the language provided it will use this, otherwise it will use the normalizer for english and if the normalizer of english does not exists then will fallback to the default normalization.
You can visit the section of Languages to know hot to register the plugin of a language.

```javascript
const { containerBootstrap } = require('@nlpjs/core');
const { LangEs } = require('@nlpjs/lang-es')

const container = containerBootstrap();
container.use(LangEs);
const normalizer = container.get('normalize');
const output = normalizer.run({ text: 'Ñam aquí, Lérn', locale: 'es' });
console.log(output); // { text: 'nam aqui, lern', locale: 'es' }
```

## How to register your own normalization for a language

Supose that you want a normalizer that replaces all the occurences of the character "b" with a "v" when the language is spanish. Then you can build a normalizer class for this and register it into your container.
To build this new Normalizer then extends from Normalizer class, create a constructor that calls super with the container, and put as property "name" the value "normalizer-{your locale}".

```javascript
const { containerBootstrap, Normalizer } = require('@nlpjs/core');

class OddNormalizer extends Normalizer {
  constructor(container) {
    super(container);
    this.name = 'normalizer-es';
  }

  normalize(text) {
    console.log('dafuk')
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/b/g, 'v');
  }
}

const container = containerBootstrap();
container.use(OddNormalizer);
const normalizer = container.get('normalize');
const output = normalizer.run({ text: 'Barba bilbaina', locale: 'es' });
console.log(output); // { text: 'varva vilvaina', locale: 'es' }
```

