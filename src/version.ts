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
import * as httpm from '@actions/http-client'
import * as semver from 'semver'

const RELEASES_URL = `https://api.github.com/repos/go-gremlins/gremlins/releases`
const USER_AGENT = 'gremlins-action'

interface GitHubRelease {
  tag_name: string
}

export class Version {
  private readonly version: Promise<string>
  private readonly httpClient: httpm.HttpClient

  // Takes a wantVer that can be 'latest', empty string, or it can be a specific
  // wantVer or a parametrized wantVer. Please, refer to semver documentation
  // for the range syntax:
  // https://github.com/npm/node-semver#advanced-range-syntax
  constructor(private wantVer: string, private client?: httpm.HttpClient) {
    if (!client) {
      this.httpClient = new httpm.HttpClient(USER_AGENT)
    } else {
      this.httpClient = client
    }
    this.version = this.getRelease(wantVer)
    core.info(`Found release: ${this.version}`)
  }

  // Returns the found version in the format 'vX.Y.Z'.
  async get(): Promise<string> {
    return this.version
  }

  async getRaw(): Promise<string> {
    const v = semver.clean(await this.version)
    if (!v) {
      throw Error('Panic: this should never happen.')
    }

    return v
  }

  private async getRelease(version: string): Promise<string> {
    if (!semver.valid(version)) {
      return await this.resolveVersion(version)
    }

    const url = `${RELEASES_URL}/tags/${version}`
    const res = await this.httpClient.getJson<GitHubRelease>(url)
    if (!res?.result || res?.statusCode < 200 || res?.statusCode >= 300) {
      throw Error(`Cannot find Gremlins release ${version}`)
    }

    return res?.result?.tag_name
  }

  private async resolveVersion(version: string): Promise<string> {
    const allTags = await this.getAllTags()
    if (version === 'latest' || version === '') {
      const v = semver.maxSatisfying(allTags, '')
      if (!v) {
        throw Error('Impossible to find latest release.')
      }

      return v
    }

    const v = semver.maxSatisfying(allTags, version)
    if (!v) {
      throw Error(`Impossible to find version ${version}`)
    }

    return v
  }

  private async getAllTags(): Promise<string[]> {
    const res = await this.httpClient.getJson<GitHubRelease[]>(RELEASES_URL)
    if (!res?.result || res?.statusCode < 200 || res?.statusCode >= 300) {
      throw Error('Cannot find Gremlins releases.')
    }

    return res.result.map((value) => value.tag_name)
  }
}
