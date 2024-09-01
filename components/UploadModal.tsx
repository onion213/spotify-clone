import useUploadModal from '@/hooks/useUploadModal'
import Modal from './Modal'

const UploadModal = () => {
  const uploadModal = useUploadModal()

  const onChange = (open: boolean) => {
    if (!open) {
      uploadModal.onClose()
    }
  }

  return (
    <Modal
      title="Add a Song"
      description="Upload an MP3 File."
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      Upload Modal Content
    </Modal>
  )
}

export default UploadModal
