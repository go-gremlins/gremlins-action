/*
 * Copyright 2022 The Gremlins Authors
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import * as core from '@actions/core'
import * as os from 'os'

interface Inputs {
  version: string
  args: string | undefined
  workdir: string | undefined
}

export class Context {
  constructor(private readonly ar?: string, private readonly pl?: string) {
    if (!this.ar) {
      this.ar = os.arch().toString()
    }
    if (!this.pl) {
      this.pl = os.platform().toString()
    }
  }

  platform(): string {
    if (this.pl === 'win32') {
      return 'windows'
    }

    const p = this.pl
    if (!p) {
      throw Error('Impossible to determine the current platform.')
    }

    return p
  }

  arch(): string {
    switch (this.ar) {
      case 'x64':
        return 'amd64'
      case 'x32':
      case 'ia32':
        return '386'
    }

    const a = this.ar
    if (!a) {
      throw Error('Impossible to determine the current arch.')
    }

    return a
  }

  getInputs(): Inputs {
    const version: string = core.getInput('version')
    const args: string = core.getInput('args')
    const workdir: string = core.getInput('workdir')
    core.debug(`Received version ${version}.`)
    core.debug(`Received flags ${args}.`)
    core.debug(`Received workdir ${workdir}`)

    return { version, args, workdir }
  }
}
