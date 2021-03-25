# Normalizer

A normalizer is a plugin that normalize the text of a language. Normalization is the process to transform a text into some standard.
By default normalization does this:
- replace special characters with normalized one, example: "á", "ä" or "à" will be replaced by "a".
- convert to lower case.

## Why normalization is important?

Imagine two texts "The red house" and "The Red House". 
Both texts are not equal, but the meaning is the same, so one process to transform both into lower case is helpful.

## About special characters 

Usually a chatbot is deployed in a channel where people can type words. People are not perfect at writing, typing or spelling.  A good example in Spanish is that some peopke do not use letters with accents, so if we train the NLP with a sentence like "qué sabes hacer?" and a person writes "que sabes hacer?" both "qué" and "que" will not be equal.

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

Within a container the normalizer can be used in a multilanguage way: you can register normalizers for each language, so if a normalizer exists for the language provided it will use this, otherwise it will use the normalizer for English and if the English normalizer does not exists then it will fallback to the default normalization.
You can visit the section on Languages to find out how to register language plugins.

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

Suppose that you want a normalizer that replaces all the occurences of the character "b" with a "v" when the language is Spanish. In this case you can build a normalizer class for this and register it into your container.
To build this new Normalizer you will need to extend the Normalizer class, create a constructor that calls super with the container, and add a property "name" with the value "normalizer-{your locale}".

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

