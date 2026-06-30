import React, { useState, useEffect } from 'react';
import { Percent, Clock, Copy, Check, Sparkles } from 'lucide-react';

const OfferBanner = () => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 45,
    seconds: 0,
  });

  // Simple countdown logic: tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset timer back to 12 hours once reached zero for demo purposes
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => String(time).padStart(2, '0');

  const copyCode = () => {
    navigator.clipboard.writeText('SOVEREIGN20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="offer" className="py-16 bg-[#060608] relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#C9A84C]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900/60 to-zinc-950 p-8 md:p-12 shadow-2xl flex flex-col lg:flex-row gap-8 items-center justify-between">
          
          {/* Promo Details */}
          <div className="text-left space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#E8C97E]">
              <Percent className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Limited Time Sale</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-white leading-tight">
              Unlock Your Premium Style: <br />
              <span className="text-[#E8C97E]">Get 20% Off Storewide</span>
            </h2>
            
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Use our exclusive promotional code at checkout to claim 20% discount on all premium products, including special edition kits. Free premium shipping included.
            </p>

            {/* Copy Promo Code Box */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Promo Code:</span>
              <div className="flex items-center gap-2 rounded-xl bg-zinc-950 border border-white/10 p-2.5 pl-4 pr-3">
                <span className="text-sm font-bold tracking-wider text-white">SOVEREIGN20</span>
                <button
                  onClick={copyCode}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-gray-400 hover:text-white transition-colors duration-300 border border-white/5"
                  title="Copy discount code"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Countdown timer & CTA block */}
          <div className="flex flex-col items-center gap-6 shrink-0 w-full lg:w-auto">
            
            {/* Live Timer Grid */}
            <div className="text-center">
              <span className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-3 block">
                Offer Expires In:
              </span>
              
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-950 border border-white/5 text-2xl font-bold text-white shadow-lg">
                    {formatTime(timeLeft.hours)}
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase mt-2">Hours</span>
                </div>
                
                <span className="text-3xl text-zinc-600 font-bold self-center -mt-6">:</span>

                <div className="flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-950 border border-white/5 text-2xl font-bold text-white shadow-lg">
                    {formatTime(timeLeft.minutes)}
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase mt-2">Mins</span>
                </div>

                <span className="text-3xl text-zinc-600 font-bold self-center -mt-6">:</span>

                <div className="flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-950 border border-white/5 text-2xl font-bold text-[#C9A84C] shadow-lg animate-pulse">
                    {formatTime(timeLeft.seconds)}
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase mt-2">Secs</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-10 py-4 text-sm font-bold uppercase tracking-wider text-black transition-all duration-300 hover:shadow-[0_0_25px_rgba(201,168,76,0.35)] hover:scale-105">
              <Sparkles className="h-4 w-4" />
              Claim My Discount
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OfferBanner;
