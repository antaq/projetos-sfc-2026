"use client";

export default function Header() {
  return (
    <header
      className="px-4 py-3 sm:px-10 sm:py-5 text-white"
      style={{ background: "linear-gradient(135deg, #1351b4, #071d41)" }}
    >
      {/* Mobile: logo row + title row stacked; Desktop: side by side */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://prd-apex.antaq.gov.br/ords/r/sfc/files/static/v76/img/app-105-logo.png"
          alt="ANTAQ"
          className="h-10 sm:h-[60px] w-auto self-start"
        />
        <div>
          <h1 className="text-lg sm:text-2xl font-semibold leading-tight">
            Projetos SFC 2026
          </h1>
          <p className="text-xs sm:text-sm opacity-90">
            Gerência de Planejamento e Inteligência da Fiscalização - SFC
          </p>
        </div>
      </div>
    </header>
  );
}
