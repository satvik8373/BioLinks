import React from 'react'

export interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const FilledButton: React.FC<BaseButtonProps> = ({ children, className = '', style, ...props }) => (
  <button
    className={`px-5 py-3 rounded-2xl font-semibold bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-all ${className}`}
    style={style}
    {...props}
  >
    {children}
  </button>
)

export const GlassButton: React.FC<BaseButtonProps> = ({ children, className = '', style, ...props }) => (
  <button
    className={`px-5 py-3 rounded-2xl font-semibold bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg hover:bg-white/30 transition-all ${className}`}
    style={style}
    {...props}
  >
    {children}
  </button>
)

export const ClayButton: React.FC<BaseButtonProps> = ({ children, className = '', style, ...props }) => (
  <button
    className={`clay-link-pill ${className}`}
    style={style}
    {...props}
  >
    {children}
  </button>
)

export const OutlineButton: React.FC<BaseButtonProps> = ({ children, className = '', style, ...props }) => (
  <button
    className={`px-5 py-3 rounded-2xl font-semibold border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${className}`}
    style={style}
    {...props}
  >
    {children}
  </button>
)

export const GradientButton: React.FC<BaseButtonProps> = ({ children, className = '', style, ...props }) => (
  <button
    className={`px-5 py-3 rounded-2xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:opacity-95 transition-all ${className}`}
    style={style}
    {...props}
  >
    {children}
  </button>
)
