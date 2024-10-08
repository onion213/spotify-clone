import { forwardRef } from 'react'
interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean
  type?: string
}
import { twMerge } from 'tailwind-merge'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled = false, type = 'button', ...props }, ref) => {
    return (
      <button
        type={type}
        className={twMerge(
          'w-full rounded-full bg-green-500 border border-transparent px-3 py-3 disabled:cursor-not-allowed disabled"opacity-50 text-black font-bold hover:opacity-75 transition',

          className,
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
export default Button
