'use client'

import type { Song } from '@/types'
import MediaItem from './MediaItem'

interface SearchContentProps {
  songs: Song[]
}

const SearchContent: React.FC<SearchContentProps> = ({ songs }) => {
  if (songs.length === 0) {
    return <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">No songs found.</div>
  }
  return (
    <div className="flex flex-col gap-y-2 w-full px-6">
      {songs.map((song) => {
        return (
          <div key={song.id} className="flex items-center gap-x-4 w-full">
            <div className="flex-1">
              <MediaItem
                onClick={() => {
                  console.error('To be implemented')
                }}
                data={song}
              />
            </div>
            {/* TODO: Add like button here */}
          </div>
        )
      })}
    </div>
  )
}

export default SearchContent
