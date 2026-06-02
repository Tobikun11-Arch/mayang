interface HeroProps {
  videoSrc?: string
}

export default function Hero({ videoSrc }: HeroProps) {
  return (
    <section className="bg-canvas-white w-full overflow-hidden relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--gradient-phoenix-orange)', opacity: 0.15 }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-glow/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative mx-auto max-w-[1200px] px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-whisper-gray text-midnight-ink text-xs font-medium px-3 py-1 rounded-xl mb-6">
            <span className="text-phoenix-orange font-bold">NEW</span>
            Community Safety Alerts
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-0.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>

          <h1 className="text-[56px] leading-[1] tracking-[-2.24px] text-midnight-ink font-medium max-w-4xl">
            Disaster preparedness starts with{' '}
            <span className="text-phoenix-orange">connection</span>
          </h1>

          <p className="mt-4 text-lg text-muted-ash max-w-xl leading-relaxed">
            Mayang is a disaster-support initiative that helps communities find practical solutions to common disaster problems, improving preparedness, response, and recovery.
          </p>

        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <div className="aspect-video rounded-xl bg-whisper-gray flex items-center justify-center border border-midnight-ink/10 shadow-[rgba(17,17,17,0.02)_0px_-6px_6px_0px,rgba(17,17,17,0.01)_0px_-23px_9px_0px] overflow-hidden">
            {videoSrc ? (
              <video src={videoSrc} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-muted-ash/20 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-midnight-ink/40">
                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <span className="text-sm text-muted-ash">How Mayang works</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
