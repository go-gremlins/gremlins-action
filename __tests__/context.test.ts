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
import { getInput } from '@actions/core'
import { describe } from '@jest/globals'

import { Context } from '../src/context'

jest.mock('@actions/core')

const mockGetInput = getInput as jest.MockedFunction<typeof getInput>

describe('platform', () => {
  it('returns windows if platform is win32', () => {
    const env = new Context('', 'win32')

    expect(env.platform()).toEqual('windows')
  })

  it('returns darwin if platform is darwin', () => {
    const env = new Context('', 'darwin')

    expect(env.platform()).toEqual('darwin')
  })

  it('returns 386 if arch is x32', () => {
    const env = new Context('x32', '')

    expect(env.arch()).toEqual('386')
  })

  it('returns 386 if arch is ia32', () => {
    const env = new Context('ia32', '')

    expect(env.arch()).toEqual('386')
  })

  it('returns amd64 if arch is x64', () => {
    const env = new Context('x64', '')

    expect(env.arch()).toEqual('amd64')
  })

  it('returns arm if arch is arm', () => {
    const env = new Context('arm', '')

    expect(env.arch()).toEqual('arm')
  })

  it('returns the correct inputs', () => {
    mockGetInput.mockReturnValue('test')

    const env = new Context()

    expect(env.getInputs()).toEqual({
      version: 'test',
      args: 'test',
      workdir: 'test',
    })
  })
})
