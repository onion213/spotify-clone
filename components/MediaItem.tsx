import useLoadImage from '@/hooks/useLoadImage'
import type { Song } from '@/types'
import Image from 'next/image'

interface MediaItemProps {
  onClick?: (id: string) => void
  data: Song
}

const MediaItem: React.FC<MediaItemProps> = ({ data, onClick }) => {
  const imageUrl = useLoadImage(data)

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id)
    }
  }

  //TODO: Defalut turn on player

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents:
    <div
      onClick={handleClick}
      className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/5 w-full p-2 fdounded-md"
    >
      <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
        <Image
          fill={true}
          src={imageUrl || '/images/liked.png'}
          alt="Media Item"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden">
        <p className="text-white truncate">{data.title}</p>
        <p className="text-neutral-400 text-sm truncate">{data.author}</p>
      </div>
    </div>
  )
}

export default MediaItem
