import { PollSource, Source, WebsocketSource } from 'patch-db-client'
import { ConfigService } from 'src/app/services/config.service'
import { DataModel } from './data-model'
import { LocalStorageBootstrap } from './local-storage-bootstrap'
import { PatchDbModel } from './patch-db.service'
import { ApiService } from 'src/app/services/api/api.service'

export function PatchDbModelFactory (
  config: ConfigService,
  bootstrapper: LocalStorageBootstrap,
  apiService: ApiService,
): PatchDbModel {

  const { mocks, patchDb: { poll }, isConsulate } = config

  let source: Source<DataModel>

  if (mocks.enabled) {
    if (mocks.connection === 'poll') {
      source = new PollSource({ ...poll }, apiService)
    } else {
      source = new WebsocketSource(`ws://localhost:${config.mocks.wsPort}/db`)
    }
  } else {
    if (isConsulate) {
      source = new PollSource({ ...poll }, apiService)
    } else {
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss'
      const host = window.location.host
      source = new WebsocketSource(`${protocol}://${host}/ws/db`)
    }
  }

  return new PatchDbModel(source, apiService, bootstrapper)
}