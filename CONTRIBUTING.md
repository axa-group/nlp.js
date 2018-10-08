# How to Contribute

## Reporting Issues

Should you run into issues with the project, please don't hesitate to let us know by
[filing an issue](https://github.com/axa-group/nlp.js/issues/new).

Pull requests containing only failing tests demonstrating an issue are also welcomed. Having these tests will help avoiding future regressions of this specific issue once it's fixed.

## Pull Requests

We accept [pull requests](https://github.com/axa-group/nlp.js/pull/new/master)!

Generally we like to see pull requests that:

- Maintain the existing code style
- Are focused on a single change (i.e. avoid large refactoring or style adjustments in untouched code if not the primary goal of the pull request)
- Have [conventional commits](https://conventionalcommits.org/)
- Have tests
- Don't decrease the current code coverage

## Running tests

To run tests locally, first install all dependencies.

```shell
npm install
```

From the root directory, run the tests.

```shell
npm test
```
