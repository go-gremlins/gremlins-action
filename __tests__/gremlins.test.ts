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
import { exec } from '@actions/exec'
import { instance, mock, reset, when } from 'ts-mockito'

import { Artifact } from '../src/artifact'
import { Context } from '../src/context'
import { Gremlins } from '../src/gremlins'

jest.mock('@actions/exec')

describe('gremlins', () => {
  const context = mock(Context)
  const artifact = mock(Artifact)

  afterEach(() => {
    reset(context)
    reset(artifact)
  })

  beforeEach(() => {
    when(artifact.getExePath()).thenResolve('path/to/go')
  })

  it('runs gremlins unleash', async () => {
    const gremlins = new Gremlins(instance(context), instance(artifact))

    await gremlins.run()

    expect(exec).toHaveBeenCalledWith('path/to/go', ['unleash'], {})
  })

  it('runs gremlins unleash with args', async () => {
    when(context.getInputs()).thenReturn({
      workdir: undefined,
      args: '--tags="tag1,tag2" --silent',
      version: '1.2.3',
    })

    const gremlins = new Gremlins(instance(context), instance(artifact))

    await gremlins.run()

    expect(exec).toHaveBeenCalledWith(
      'path/to/go',
      ['unleash', '--tags="tag1,tag2"', '--silent'],
      {}
    )
  })

  it('runs gremlins unleash in workdir', async () => {
    when(context.getInputs()).thenReturn({
      workdir: 'test/dir',
      args: undefined,
      version: '1.2.3',
    })

    const gremlins = new Gremlins(instance(context), instance(artifact))

    await gremlins.run()

    expect(exec).toHaveBeenCalledWith('path/to/go', ['unleash'], {
      cwd: 'test/dir',
    })
  })
})
