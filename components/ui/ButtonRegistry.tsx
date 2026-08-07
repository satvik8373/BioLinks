import React from 'react'

export interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const FilledButton: React.FC<BaseButtonProps> = ({ children, className = '', style, ...props }) => (
  <button
    className={`px-5 py-3 rounded-2xl font-semibold bg-brand-600 text-white shadow-clay-btn hover:bg-brand-700 transition-all ${className}`}
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
    className={`px-5 py-3 rounded-2xl font-semibold border-2 border-slate-300 text-slate-800 hover:bg-slate-100 transition-all ${className}`}
    style={style}
    {...props}
  >
    {children}
  </button>
)

export const GradientButton: React.FC<BaseButtonProps> = ({ children, className = '', style, ...props }) => (
  <button
    className={`px-5 py-3 rounded-2xl font-semibold bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-clay-btn hover:opacity-95 transition-all ${className}`}
    style={style}
    {...props}
  >
    {children}
  </button>
)
