import { SiteHeader } from "@/components/site-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      <footer className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6">
        <p className="label-mono text-center text-fog">
          KR Cozinheiro · seu caderno de receitas
        </p>
      </footer>
    </>
  );
}
