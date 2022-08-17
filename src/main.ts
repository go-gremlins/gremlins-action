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

import { Artifact } from './artifact'
import { Env } from './env'
import { Version } from './version'

async function run(): Promise<void> {
  try {
    const version: string = core.getInput('version')
    const flags: string = core.getInput('flags')
    core.debug(`Received version ${version}.`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
    core.debug(`Received flags ${flags}.`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    const artifact = new Artifact(new Version(version), new Env())
    const path = await artifact.getPath()
    core.debug(`Downloaded ${path}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
