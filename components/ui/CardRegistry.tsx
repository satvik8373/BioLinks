import React from 'react'

export interface BaseCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const ClayCard: React.FC<BaseCardProps> = ({ children, className = '', style }) => (
  <div className={`clay-card ${className}`} style={style}>
    {children}
  </div>
)

export const GlassCard: React.FC<BaseCardProps> = ({ children, className = '', style }) => (
  <div className={`relative bg-white/20 backdrop-blur-xl border border-white/30 rounded-[44px] p-7 shadow-2xl overflow-hidden z-10 ${className}`} style={style}>
    {children}
  </div>
)

export const MinimalCard: React.FC<BaseCardProps> = ({ children, className = '', style }) => (
  <div className={`relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] p-6 shadow-sm ${className}`} style={style}>
    {children}
  </div>
)

export const HeroCard: React.FC<BaseCardProps> = ({ children, className = '', style }) => (
  <div className={`relative bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white rounded-[44px] p-8 shadow-2xl border border-gray-700/50 overflow-hidden ${className}`} style={style}>
    {children}
  </div>
)
