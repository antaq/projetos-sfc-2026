"use client";

export default function Header() {
  return (
    <header
      className="px-10 py-5 text-white"
      style={{ background: "linear-gradient(135deg, #1351b4, #071d41)" }}
    >
      <div className="flex items-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://prd-apex.antaq.gov.br/ords/r/sfc/files/static/v76/img/app-105-logo.png"
          alt="ANTAQ"
          className="h-[60px]"
        />
        <div>
          <h1 className="text-2xl font-semibold">
            Projetos SFC 2026
          </h1>
          <p className="text-sm opacity-90">
            Gerência de Planejamento e Inteligência da Fiscalização - SFC
          </p>
        </div>
      </div>
    </header>
  );
}
