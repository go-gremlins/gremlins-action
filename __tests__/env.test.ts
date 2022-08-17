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
import { describe } from '@jest/globals'

import { Env } from '../src/env'

describe('platform', () => {
  it('returns windows if platform is win32', () => {
    const env = new Env('', 'win32')

    expect(env.platform()).toEqual('windows')
  })

  it('returns darwin if platform is darwin', () => {
    const env = new Env('', 'darwin')

    expect(env.platform()).toEqual('darwin')
  })

  it('returns 386 if arch is x32', () => {
    const env = new Env('x32', '')

    expect(env.arch()).toEqual('386')
  })

  it('returns 386 if arch is ia32', () => {
    const env = new Env('ia32', '')

    expect(env.arch()).toEqual('386')
  })

  it('returns amd64 if arch is x64', () => {
    const env = new Env('x64', '')

    expect(env.arch()).toEqual('amd64')
  })

  it('returns arm if arch is arm', () => {
    const env = new Env('arm', '')

    expect(env.arch()).toEqual('arm')
  })
})
