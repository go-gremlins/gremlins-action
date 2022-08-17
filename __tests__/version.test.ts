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
import * as httpm from '@actions/http-client'
import { TypedResponse } from '@actions/http-client/lib/interfaces'
import { describe } from '@jest/globals'
import { anyString, instance, mock, reset, when } from 'ts-mockito'

import { Version } from '../src/version'

const FULL_RELEASE_RESPONSE = require('./fixtures/full_releases.json')
const SINGLE_RELEASE_RESPONSE = require('./fixtures/single_release.json')

describe('version', () => {
  let httpClientMock = mock(httpm.HttpClient)

  afterEach(() => {
    reset(httpClientMock)
  })

  function response(status: number, result: Object): TypedResponse<any> {
    return {
      statusCode: status,
      result: result,
      headers: {
        'content-type': 'application/json',
      },
    }
  }

  it('returns latest release', async () => {
    const mockedResponse = response(200, FULL_RELEASE_RESPONSE)
    when(
      httpClientMock.getJson(
        'https://api.github.com/repos/go-gremlins/gremlins/releases'
      )
    ).thenResolve(mockedResponse)

    const version = new Version('latest', instance(httpClientMock))
    const release = await version.get()

    expect(release).not.toBeNull()
    expect(release).toEqual('v2.3.4')
  })

  it('returns specific release', async () => {
    const mockedResponse = response(200, SINGLE_RELEASE_RESPONSE)
    when(
      httpClientMock.getJson(
        'https://api.github.com/repos/go-gremlins/gremlins/releases/tags/v2.3.4'
      )
    ).thenResolve(mockedResponse)

    const version = new Version('v2.3.4', instance(httpClientMock))
    const release = await version.get()

    expect(release).not.toBeNull()
    expect(release).toEqual('v2.3.4')
  })

  it('returns max satisfying release, when range is specified', async () => {
    const mockedResponse = response(200, FULL_RELEASE_RESPONSE)
    when(
      httpClientMock.getJson(
        'https://api.github.com/repos/go-gremlins/gremlins/releases'
      )
    ).thenResolve(mockedResponse)

    const version = new Version('~2.3', instance(httpClientMock))
    const release = await version.get()

    expect(release).not.toBeNull()
    expect(release).toEqual('v2.3.4')
  })

  it('returns the raw release', async () => {
    const mockedResponse = response(200, SINGLE_RELEASE_RESPONSE)
    when(
      httpClientMock.getJson(
        'https://api.github.com/repos/go-gremlins/gremlins/releases/tags/v2.3.4'
      )
    ).thenResolve(mockedResponse)

    const version = new Version('v2.3.4', instance(httpClientMock))
    const release = await version.getRaw()

    expect(release).not.toBeNull()
    expect(release).toEqual('2.3.4')
  })

  it('throws when range cannot be satisfied', async () => {
    const mockedResponse = response(200, FULL_RELEASE_RESPONSE)
    when(
      httpClientMock.getJson(
        'https://api.github.com/repos/go-gremlins/gremlins/releases'
      )
    ).thenResolve(mockedResponse)

    const version = new Version('~100', instance(httpClientMock))

    await expect(version.get()).rejects.toThrow()
  })

  it('throws when latest cannot be matched', async () => {
    const mockedResponse = response(200, [{ tag_name: 'not valid' }])
    when(
      httpClientMock.getJson(
        'https://api.github.com/repos/go-gremlins/gremlins/releases'
      )
    ).thenResolve(mockedResponse)

    const version = new Version('latest', instance(httpClientMock))

    await expect(version.get()).rejects.toThrow()
  })

  it('throws when specific release is not found', async () => {
    const mockedResponse = response(404, [])
    when(httpClientMock.getJson(anyString())).thenResolve(mockedResponse)

    const version = new Version('v1.2.3', instance(httpClientMock))

    await expect(version.get()).rejects.toThrow()
  })

  it('throws when specific release is not found', async () => {
    const mockedResponse = response(404, [])
    when(httpClientMock.getJson(anyString())).thenResolve(mockedResponse)

    const version = new Version('v1.2.3', instance(httpClientMock))

    await expect(version.getRaw()).rejects.toThrow()
  })

  it('throws when there are no releases (NOT FOUND)', async () => {
    const mockedResponse = response(404, [])
    when(httpClientMock.getJson(anyString())).thenResolve(mockedResponse)

    const version = new Version('latest', instance(httpClientMock))

    await expect(version.get()).rejects.toThrow()
  })

  it('throws when there are no releases (empty list)', async () => {
    const mockedResponse = response(200, [])
    when(httpClientMock.getJson(anyString())).thenResolve(mockedResponse)

    const version = new Version('latest', instance(httpClientMock))

    await expect(version.get()).rejects.toThrow()
  })
})
