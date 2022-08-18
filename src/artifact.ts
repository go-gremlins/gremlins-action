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
import { cacheDir, downloadTool, extractTar, find } from '@actions/tool-cache'
import * as path from 'path'

import { Context } from './context'
import { Version } from './version'

const TOOL_NAME = 'gremlins'
const DOWNLOAD_URL = 'https://github.com/go-gremlins/gremlins/releases/download'

export class Artifact {
  private version: Version

  constructor(private context: Context, private v?: Version) {
    if (!v) {
      this.version = new Version(context.getInputs().version)
    } else {
      this.version = v
    }
  }

  async getExePath(): Promise<string> {
    const release = await this.version.getRaw()
    const platform = this.context.platform()
    const arch = this.context.arch()
    const url = this.generateUrl(release, arch, platform)
    const cached = find(TOOL_NAME, release, arch)
    if (cached && cached !== '') {
      core.info(`Found in cache @ ${cached}`)
      core.addPath(cached)
      core.info('Added gremlins to the path')

      return path.join(cached, this.getToolName(platform))
    }
    const gremlinsExtractedFolder = await this.extractToFolder(url)
    const cachedPath = await cacheDir(
      gremlinsExtractedFolder,
      TOOL_NAME,
      release,
      arch
    )
    core.info('Added gremlins to the cache')

    const exePath = path.join(cachedPath, this.getToolName(platform))
    core.addPath(cachedPath)
    core.info('Added gremlins to the path')

    core.info(`Successfully setup Gremlins version ${release}`)

    return exePath
  }

  private generateUrl(release: string, arch: string, platform: string): string {
    const filename = `gremlins_${release}_${platform}_${arch}.tar.gz`

    return `${DOWNLOAD_URL}/v${release}/${filename}`
  }

  private async extractToFolder(url: string): Promise<string> {
    const gremlinsPath = await downloadTool(url)
    core.info(`Downloaded from ${url}`)
    const gremlinsExtractedFolder = await extractTar(gremlinsPath)
    core.debug(`Extracted to ${gremlinsExtractedFolder}`)

    return gremlinsExtractedFolder
  }

  private getToolName(platform: string): string {
    return platform === 'windows' ? `${TOOL_NAME}.exe` : TOOL_NAME
  }
}
