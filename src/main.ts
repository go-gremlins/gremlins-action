import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    const version: string = core.getInput('version')
    const flags: string = core.getInput('flags')
    core.debug(`Received version ${version}.`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
    core.debug(`Received flags ${flags}.`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
