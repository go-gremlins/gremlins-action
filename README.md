# Gremlins Action

The official [GitHub Action](https://github.com/features/actions) for Gremlins.

[![codecov](https://codecov.io/gh/go-gremlins/gremlins-action/branch/main/graph/badge.svg?token=MTDsNc2Lak)](https://codecov.io/gh/go-gremlins/gremlins-action)
[![Maintainability](https://api.codeclimate.com/v1/badges/e95c66bb9a0fa4d3f8d3/maintainability)](https://codeclimate.com/github/go-gremlins/gremlins-action/maintainability)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/1da2ebb82033477298c56cf11ce3f716)](https://www.codacy.com/gh/go-gremlins/gremlins-action/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=go-gremlins/gremlins-action&amp;utm_campaign=Badge_Grade)

## Example usage

```yaml
name: gremlins

on:
  pull_request:
  push:

jobs:
  gremlins:
    - uses: actions/checkout@v3
    - uses: actions/setup-go@v3
    - uses: actions/gremlins-action@v1
      with:
        version: latest
        args: --tags="tag1,tag2"
        workdir: test/dir
```

## Customization

| Name           | Type     | Default  | Description                                              |
|----------------|----------|----------|----------------------------------------------------------|
| `version`**¹** | `string` | `latest` | Te version of Gremlins to use                            | 
| `args`         | `string` |          | The command line arguments to pass to `gremlins unleash` |
| `workdir`      | `string` | `.`      | Working directory relative to repository root            |  

> **¹** Can be `latest`, a fixed version like `v0.1.2` or a semver range like `~0.2`. In this case this
> will return `v0.2.2`.