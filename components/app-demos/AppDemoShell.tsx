'use client'

import { useState, useCallback, type ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { Monitor, Tablet, Smartphone, Maximize2, RotateCw } from 'lucide-react'
import type { Device } from './types'

const deviceWidths: Record<Device, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
}

interface AppDemoShellProps {
  title: string
  status: 'live' | 'development'
  children: (device: Device) => ReactNode
  onReset?: () => void
}

export function AppDemoShell({ title, status, children, onReset }: AppDemoShellProps) {
  const [device, setDevice] = useState<Device>('mobile')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleReset = useCallback(() => {
    onReset?.()
  }, [onReset])

  const statusCfg = status === 'live'
    ? { label: 'Live', className: 'bg-emerald-500/20 text-emerald-400' }
    : { label: 'En développement', className: 'bg-amber-500/20 text-amber-400' }

  const renderContent = (height: string, inDialog = false) => (
    <div className={cn('relative w-full flex items-start justify-center bg-zinc-950/50', inDialog ? 'h-full' : '')} style={!inDialog ? { height } : undefined}>
      <div
        className="h-full transition-all duration-300 mx-auto overflow-hidden"
        style={{ width: deviceWidths[device], maxWidth: '100%' }}
      >
        {children(device)}
      </div>
    </div>
  )

  return (
    <>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <Badge variant="secondary" className={cn('text-xs', statusCfg.className)}>
            {statusCfg.label}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <div className="hidden md:flex items-center gap-0.5 mr-2 border rounded-md p-0.5">
            {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(
              ([d, Icon]) => (
                <Button
                  key={d}
                  variant="ghost"
                  size="icon"
                  className={cn('h-7 w-7', device === d && 'bg-accent')}
                  onClick={() => setDevice(d)}
                  aria-label={`Vue ${d}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </Button>
              )
            )}
          </div>
          {onReset && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleReset} aria-label="Réinitialiser">
              <RotateCw className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsFullscreen(true)} aria-label="Plein écran">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Inline preview */}
      <div className="h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        {renderContent('100%')}
      </div>

      {/* Fullscreen dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] p-0 gap-0">
          <DialogTitle className="sr-only">{title} — Plein écran</DialogTitle>
          <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{title}</span>
              <Badge variant="secondary" className={cn('text-xs', statusCfg.className)}>
                {statusCfg.label}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <div className="hidden md:flex items-center gap-0.5 mr-2 border rounded-md p-0.5">
                {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(
                  ([d, Icon]) => (
                    <Button
                      key={d}
                      variant="ghost"
                      size="icon"
                      className={cn('h-7 w-7', device === d && 'bg-accent')}
                      onClick={() => setDevice(d)}
                      aria-label={`Vue ${d}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </Button>
                  )
                )}
              </div>
              {onReset && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleReset} aria-label="Réinitialiser">
                  <RotateCw className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {renderContent('calc(90vh - 52px)', true)}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
