import React from 'react';

const SectionHeader = ({ title, subtitle, badge }) => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16 px-4">
      {badge && (
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#C9A84C] bg-[#C9A84C]/10 px-3 py-1 rounded-full mb-3 border border-[#C9A84C]/20">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-bold font-serif text-white tracking-tight mb-4 leading-tight">
        {title}
      </h2>
      <div className="w-24 h-[3px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mb-6"></div>
      {subtitle && (
        <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
