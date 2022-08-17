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
import { ExecOptions, exec } from '@actions/exec'

import { Artifact } from './artifact'
import { Context } from './context'

export class Gremlins {
  constructor(private ctx: Context, private artifact: Artifact) {}

  async run(): Promise<number> {
    const bin = await this.artifact.getExePath()
    const inputs = this.ctx.getInputs()

    const execOptions: ExecOptions = {}
    const args: string[] = ['unleash']
    if (inputs != null && inputs.args && inputs.args !== '') {
      const a = inputs.args.split(' ')
      let i: number
      for (i = 0; i < a.length; i++) {
        args.push(a[i])
      }
    }
    if (inputs != null && inputs.workdir && inputs.workdir !== '.') {
      core.info(`Using ${inputs.workdir} as working directory`)
      execOptions.cwd = inputs.workdir
    }

    return await exec(bin, args, execOptions)
  }
}
