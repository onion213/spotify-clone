import useUploadModal from '@/hooks/useUploadModal'
import { useUser } from '@/hooks/useUser'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { type FieldValues, type SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import uniqid from 'uniqid'
import Button from './Button'
import Input from './Input'
import Modal from './Modal'

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUser()
  const supabaseCient = useSupabaseClient()
  const uploadModal = useUploadModal()
  const router = useRouter()

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null,
    },
  })

  const onChange = (open: boolean) => {
    if (!open) {
      reset()
      uploadModal.onClose()
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true)

      const imageFile = values.image?.[0]
      const songFile = values.song?.[0]

      if (!imageFile || !songFile || !user) {
        return toast.error('Missing Fields')
      }

      const uniqueId = uniqid()

      // Upload song
      const { data: songData, error: songError } = await supabaseCient.storage
        .from('songs')
        .upload(`song-${values.title}-${uniqueId}`, songFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (songError) {
        setIsLoading(false)
        return toast.error(`Faild Song Upload. message: ${songError.message}`)
      }
      // Upload image
      const { data: imageData, error: imageError } = await supabaseCient.storage
        .from('images')
        .upload(`image-${values.title}-${uniqueId}`, imageFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (imageError) {
        setIsLoading(false)
        return toast.error(`Faild Image Upload. message: ${imageError.message}`)
      }

      // Create a record
      const { error: supabaseError } = await supabaseCient.from('songs').insert({
        user_id: user.id,
        title: values.title,
        author: values.author,
        image_path: imageData.path,
        song_path: songData.path,
      })

      if (supabaseError) {
        setIsLoading(false)
        return toast.error(supabaseError.message)
      }

      router.refresh()
      setIsLoading(false)
      toast.success('Song created!')
      reset()
      uploadModal.onClose()
    } catch (error) {
      toast.error(`Something went wrong. ${error}`)
    }
  }

  return (
    <Modal
      title="Add a Song"
      description="Upload an MP3 File."
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="titile"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Song Titile"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register('author', { required: true })}
          placeholder="Song Author"
        />
        <div>
          <div className="pb-1">Select a Song File</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            {...register('song', { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">Select an Image</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register('image', { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  )
}

export default UploadModal
