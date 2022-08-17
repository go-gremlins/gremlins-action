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
import { addPath } from '@actions/core'
import { cacheDir, downloadTool, extractTar, find } from '@actions/tool-cache'
import { describe } from '@jest/globals'
import * as path from 'path'
import { instance, mock, reset, when } from 'ts-mockito'

import { Artifact } from '../src/artifact'
import { Env } from '../src/env'
import { Version } from '../src/version'

jest.mock('@actions/tool-cache')
jest.mock('@actions/core')

const WANT_TOOL_NAME = 'gremlins'
const WANT_VERSION = '1.2.3'
const WANT_ARCH = 'amd64'
const WANT_ARTIFACT_BASE_URL = `https://github.com/go-gremlins/gremlins/releases/download/v${WANT_VERSION}`
const WANT_ARCHIVE_PATH = 'artifact'
const WANT_EXTRATED_PATH = 'extracted'
const WANT_CACHED_PATH = 'cached'

describe('artifact', () => {
  const versionMock = mock(Version)
  const envMock = mock(Env)
  const mockDownTool = downloadTool as jest.MockedFunction<typeof downloadTool>
  const mockExtractTar = extractTar as jest.MockedFunction<typeof extractTar>
  const mockCacheDir = cacheDir as jest.MockedFunction<typeof cacheDir>
  const mockFind = find as jest.MockedFunction<typeof find>
  const mockAddPath = addPath as jest.MockedFunction<typeof addPath>

  beforeEach(() => {
    when(versionMock.getRaw()).thenResolve(WANT_VERSION)
    when(envMock.arch()).thenReturn(WANT_ARCH)
    mockDownTool.mockResolvedValue(WANT_ARCHIVE_PATH)
    mockCacheDir.mockResolvedValue(WANT_CACHED_PATH)
    mockFind.mockReturnValue('')
    mockExtractTar.mockResolvedValue(WANT_EXTRATED_PATH)
  })

  afterEach(() => {
    reset(versionMock)
    reset(envMock)
  })

  it('downloads and caches the correct linux artifact', async () => {
    when(envMock.platform()).thenReturn('linux')

    const art = new Artifact(instance(versionMock), instance(envMock))

    const wantFilename = `gremlins_${WANT_VERSION}_linux_${WANT_ARCH}.tar.gz`
    const wantUrl = `${WANT_ARTIFACT_BASE_URL}/${wantFilename}`
    const wantExePath = path.join(WANT_CACHED_PATH, WANT_TOOL_NAME)

    expect(await art.getPath()).toEqual(wantExePath)
    expect(mockDownTool).toHaveBeenCalledTimes(1)
    expect(mockDownTool).toHaveBeenCalledWith(wantUrl)
    expect(mockExtractTar).toHaveBeenCalledTimes(1)
    expect(mockExtractTar).toHaveBeenCalledWith(WANT_ARCHIVE_PATH)
    expect(mockCacheDir).toHaveBeenCalledTimes(1)
    expect(mockCacheDir).toHaveBeenCalledWith(
      WANT_EXTRATED_PATH,
      WANT_TOOL_NAME,
      WANT_VERSION,
      WANT_ARCH
    )
    expect(mockAddPath).toHaveBeenCalledWith(WANT_CACHED_PATH)
  })

  it('downloads and caches the correct windows artifact', async () => {
    when(envMock.platform()).thenReturn('windows')

    const art = new Artifact(instance(versionMock), instance(envMock))

    const wantFilename = `gremlins_${WANT_VERSION}_windows_${WANT_ARCH}.tar.gz`
    const wantUrl = `${WANT_ARTIFACT_BASE_URL}/${wantFilename}`
    const wantExePath = path.join(WANT_CACHED_PATH, WANT_TOOL_NAME + '.exe')

    expect(await art.getPath()).toEqual(wantExePath)
    expect(mockDownTool).toHaveBeenCalledTimes(1)
    expect(mockDownTool).toHaveBeenCalledWith(wantUrl)
    expect(mockExtractTar).toHaveBeenCalledTimes(1)
    expect(mockExtractTar).toHaveBeenCalledWith(WANT_ARCHIVE_PATH)
    expect(mockCacheDir).toHaveBeenCalledTimes(1)
    expect(mockCacheDir).toHaveBeenCalledWith(
      WANT_EXTRATED_PATH,
      WANT_TOOL_NAME,
      WANT_VERSION,
      WANT_ARCH
    )
    expect(mockAddPath).toHaveBeenCalledWith(WANT_CACHED_PATH)
  })

  it('returns cached if windows artifact is cached', async () => {
    when(envMock.platform()).thenReturn('windows')
    mockFind.mockReturnValue(WANT_CACHED_PATH)

    const art = new Artifact(instance(versionMock), instance(envMock))

    const wantExePath = path.join(WANT_CACHED_PATH, WANT_TOOL_NAME + '.exe')

    expect(await art.getPath()).toEqual(wantExePath)
    expect(mockDownTool).toHaveBeenCalledTimes(0)
    expect(mockExtractTar).toHaveBeenCalledTimes(0)
    expect(mockCacheDir).toHaveBeenCalledTimes(0)
    expect(mockAddPath).toHaveBeenCalledWith(WANT_CACHED_PATH)
  })

  it('returns cached if linux artifact is cached', async () => {
    when(envMock.platform()).thenReturn('linux')
    mockFind.mockReturnValue(WANT_CACHED_PATH)

    const art = new Artifact(instance(versionMock), instance(envMock))

    const wantExePath = path.join(WANT_CACHED_PATH, WANT_TOOL_NAME)

    expect(await art.getPath()).toEqual(wantExePath)
    expect(mockDownTool).toHaveBeenCalledTimes(0)
    expect(mockExtractTar).toHaveBeenCalledTimes(0)
    expect(mockCacheDir).toHaveBeenCalledTimes(0)
    expect(mockAddPath).toHaveBeenCalledWith(WANT_CACHED_PATH)
  })
})
