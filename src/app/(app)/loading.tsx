export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 pt-20 sm:px-6">
      <div className="mx-auto h-8 w-40 animate-pulse rounded-full bg-white/[0.06]" />
      <div className="mx-auto mt-8 h-20 max-w-[700px] animate-pulse rounded-[16px] bg-white/[0.06]" />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] animate-pulse rounded-[30px] bg-white/[0.05]" />
        ))}
      </div>
    </main>
  );
}
