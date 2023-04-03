import { Entity, Schema } from 'redis-om'

interface Playlist {
  id: string
}

export type { Playlist }

class Playlist extends Entity {}
export const playlistSchema = new Schema(
  Playlist,
  {
    id: { type: 'string' }
  },
  { dataStructure: 'JSON' }
)
