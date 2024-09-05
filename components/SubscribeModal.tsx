'use client'

import useSubscribeModal from '@/hooks/useSubscribeModal'
import { useUser } from '@/hooks/useUser'
import { postData } from '@/libs/helpers'
import { getStripe } from '@/libs/stripeClient'
import type { Price, ProductWithPrice } from '@/types'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Button from './Button'
import Modal from './Modal'

interface SubscribeModalProps {
  products: ProductWithPrice[]
}

const formatPrice = (price: Price) => {
  const priceString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100)

  return priceString
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
  const subscribeModal = useSubscribeModal()
  const { user, isLoading, subscription } = useUser()
  const [priceIdLoading, setPriceIdLoading] = useState<string>()

  const onChange = (open: boolean) => {
    if (!open) {
      subscribeModal.onClose()
    }
  }

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id)

    if (!user) {
      setPriceIdLoading(undefined)
      return toast.error('Must be logged in.')
    }

    if (subscription) {
      setPriceIdLoading(undefined)
      return toast.error('Already subscribed')
    }

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price },
      })

      const stripe = await getStripe()
      stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      toast.error((error as Error)?.message)
    } finally {
      setPriceIdLoading(undefined)
    }
  }

  let content = <div className="text-center">No products available.</div>

  if (products.length) {
    content = (
      <div>
        {products.map((p) => {
          if (!p.prices?.length) {
            return <div key={p.id}>No pries available.</div>
          }

          return p.prices.map((pp) => (
            <Button
              key={pp.id}
              onClick={() => handleCheckout(pp)}
              disabled={isLoading || pp.id === priceIdLoading}
            >{`Subscribe for ${formatPrice(pp)} a ${pp.interval}`}</Button>
          ))
        })}
      </div>
    )
  }

  if (subscription) {
    content = <div className="text-center">Already subscribed.</div>
  }

  return (
    <Modal
      title="only for premium user"
      description="Listen to music with Spotify Premium"
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      {content}
    </Modal>
  )
}

export default SubscribeModal
