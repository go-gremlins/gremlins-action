# gremlins-action
The official GitHub Action for Gremlins.

**WARNING: This action is still in development, do not use!**

## Inputs

### `version`

The version of Gremlins to use in the format `vX.Y.Z` or `latest`. If not set, it will use `latest`.

### `args`

Command line arguments to pass to the `unleash` command.

## Example usage

uses: actions/gremlins-action@v1
with:
  version: latest
  args: --tags="tag1,tag2"