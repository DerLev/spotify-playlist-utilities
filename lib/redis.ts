import { lightGray, lightGreen } from 'kolorist'
import { Client, Entity, Schema } from 'redis-om'

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

/**
 * Create all search indices for all Repositories
 * @param client Redis client object with active server connection
 * @returns True if operation successful
 */
export const createAllIndices = async (client: Client) => {
  if(client.isOpen() !== true) return false
  console.log(lightGreen(`  ➜ `), lightGray(`Creating search indices...`))

  // fetch all repos
  const playlistRepositry = client.fetchRepository(playlistSchema)

  try {
    // create all search indices
    await playlistRepositry.createIndex()
  } catch(err) {
    return err
  }

  return true
}
