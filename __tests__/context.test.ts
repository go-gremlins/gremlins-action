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
  const testCases: Array<{
    name: string
    platform: string
    wantPlatform: string
    arch: string
    wantArch: string
  }> = [
    {
      name: 'returns amd64/windows if win32/x64',
      platform: 'win32',
      wantPlatform: 'windows',
      arch: 'x64',
      wantArch: 'amd64',
    },
    {
      name: 'returns amd64/linux if linux/x64',
      platform: 'linux',
      wantPlatform: 'linux',
      arch: 'x64',
      wantArch: 'amd64',
    },

    {
      name: 'returns 386/linux if linux/x32',
      platform: 'linux',
      wantPlatform: 'linux',
      arch: 'x32',
      wantArch: '386',
    },

    {
      name: 'returns 386/linux if linux/ia322',
      platform: 'linux',
      wantPlatform: 'linux',
      arch: 'ia32',
      wantArch: '386',
    },
    {
      name: 'returns arm64/darwin if darwin/arm',
      platform: 'darwin',
      wantPlatform: 'darwin',
      arch: 'arm',
      wantArch: 'arm',
    },
  ]
  for (const tc of testCases) {
    it(tc.name, () => {
      const env = new Context(tc.arch, tc.platform)

      expect(env.platform()).toEqual(tc.wantPlatform)
      expect(env.arch()).toEqual(tc.wantArch)
    })
  }

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
