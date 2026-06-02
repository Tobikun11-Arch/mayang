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
            Automate next steps with Workflows
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-0.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>

          <h1 className="text-[56px] leading-[1] tracking-[-2.24px] text-midnight-ink font-medium max-w-4xl">
            Step into the future of sales:{' '}
            <span className="text-phoenix-orange">Human + AI</span>
          </h1>

          <p className="mt-4 text-lg text-muted-ash max-w-xl leading-relaxed">
            Empower reps, uncover opportunities, and grow revenue with an all-in-one AI platform.
          </p>

          <div className="mt-8 flex w-full max-w-md items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="email"
                placeholder="Enter your work email"
                className="w-full h-12 px-4 text-sm text-midnight-ink bg-canvas-white border border-[rgba(17,17,17,0.08)] rounded-xl outline-none focus:border-midnight-ink/30 transition-colors placeholder:text-muted-ash/60"
              />
            </div>
            <a
              href="#"
              className="inline-flex items-center px-5 py-3 text-sm font-medium text-canvas-white bg-midnight-ink rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Get free trial
            </a>
          </div>

          <div className="mt-6 flex items-center gap-5 text-xs text-muted-ash">
            <div className="flex items-center gap-2">
              <svg width="60" height="12" viewBox="0 0 60 12" fill="none">
                <path d="M6 0l1.85 3.73L12 4.27l-3 2.92.71 4.12L6 8.9l-3.71 2.41.71-4.12L0 4.27l4.15-.54L6 0z" fill="#f6b83e"/>
                <path d="M18 0l1.85 3.73L24 4.27l-3 2.92.71 4.12L18 8.9l-3.71 2.41.71-4.12L12 4.27l4.15-.54L18 0z" fill="#f6b83e"/>
                <path d="M30 0l1.85 3.73L36 4.27l-3 2.92.71 4.12L30 8.9l-3.71 2.41.71-4.12L24 4.27l4.15-.54L30 0z" fill="#f6b83e"/>
                <path d="M42 0l1.85 3.73L48 4.27l-3 2.92.71 4.12L42 8.9l-3.71 2.41.71-4.12L36 4.27l4.15-.54L42 0z" fill="#f6b83e"/>
                <path d="M54 0l1.85 3.73L60 4.27l-3 2.92.71 4.12L54 8.9l-3.71 2.41.71-4.12L48 4.27l4.15-.54L54 0z" fill="#d1d5db"/>
              </svg>
              <span>4.7 stars</span>
            </div>
            <span className="text-stone/50">|</span>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-midnight-ink">G2</span>
              <span>2024 Leader</span>
            </div>
            <span className="text-stone/50">|</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs">Gartner</span>
              <span>Cool Vendor</span>
            </div>
          </div>
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
                <span className="text-sm text-muted-ash">Duo Copilot demo video</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
