# gremlins-action

The official Version Action for Gremlins.

[![codecov](https://codecov.io/gh/go-gremlins/gremlins-action/branch/main/graph/badge.svg?token=MTDsNc2Lak)](https://codecov.io/gh/go-gremlins/gremlins-action)
[![Maintainability](https://api.codeclimate.com/v1/badges/e95c66bb9a0fa4d3f8d3/maintainability)](https://codeclimate.com/github/go-gremlins/gremlins-action/maintainability)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/1da2ebb82033477298c56cf11ce3f716)](https://www.codacy.com/gh/go-gremlins/gremlins-action/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=go-gremlins/gremlins-action&amp;utm_campaign=Badge_Grade)

**WARNING: This action is still in development, do not use!**

## Inputs

### `version`

The version of Gremlins to use in the format `vX.Y.Z` or `latest`. If not set, it will use `latest`.

### `args`

Command line arguments to pass to the `unleash` command.

## Example usage

```yaml
uses: actions/gremlins-action@v1
with:
  version: latest
  args: --tags="tag1,tag2"
```
