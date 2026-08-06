import React from 'react'

export type PreviewDeviceMode = 'mobile' | 'tablet' | 'desktop' | 'off'

export interface EditorPreviewShellProps {
  children: React.ReactNode
  deviceMode?: PreviewDeviceMode
  onDeviceChange?: (mode: PreviewDeviceMode) => void
  className?: string
}

export const EditorPreviewShell: React.FC<EditorPreviewShellProps> = ({
  children,
  deviceMode = 'mobile',
  onDeviceChange,
  className = ''
}) => {
  if (deviceMode === 'off') {
    return <div className={`w-full min-h-screen ${className}`}>{children}</div>
  }

  const frameClasses =
    deviceMode === 'mobile'
      ? 'w-[390px] h-[820px] rounded-[48px] border-[10px] border-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]'
      : deviceMode === 'tablet'
      ? 'w-[768px] h-[900px] rounded-[36px] border-[10px] border-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]'
      : 'w-full max-w-[1100px] h-[850px] rounded-2xl border border-slate-800 shadow-2xl'

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-950/90 text-slate-100 relative">
      {/* Device Toolbar */}
      {onDeviceChange && (
        <div className="mb-4 flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-full shadow-lg z-20 backdrop-blur-md">
          <button
            onClick={() => onDeviceChange('mobile')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${deviceMode === 'mobile' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Mobile
          </button>
          <button
            onClick={() => onDeviceChange('tablet')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${deviceMode === 'tablet' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Tablet
          </button>
          <button
            onClick={() => onDeviceChange('desktop')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${deviceMode === 'desktop' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Desktop
          </button>
          <button
            onClick={() => onDeviceChange('off')}
            className="px-3 py-1.5 text-xs font-semibold rounded-full transition-all text-slate-400 hover:text-white"
          >
            Frame Off
          </button>
        </div>
      )}

      {/* Device Viewport Frame */}
      <div className={`relative overflow-hidden flex flex-col transition-all duration-300 ${frameClasses} ${className}`}>
        {deviceMode === 'mobile' && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-50 pointer-events-none" />
        )}
        <div className="w-full h-full overflow-y-auto no-scrollbar relative">
          {children}
        </div>
      </div>
    </div>
  )
}

export default EditorPreviewShell
