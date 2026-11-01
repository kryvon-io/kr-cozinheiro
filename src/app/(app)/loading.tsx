export default function Loading() {
  return (
    <main aria-busy className="pt-4 sm:pt-10">
      <div className="mx-auto h-9 w-72 max-w-full animate-pulse rounded-lg bg-ink/[0.06]" />
      <div className="mx-auto mt-6 h-14 max-w-[640px] animate-pulse rounded-lg bg-ink/[0.05]" />
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-xl bg-ink/[0.04]" />
        ))}
      </div>
    </main>
  );
}
