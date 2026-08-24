export function Footer() {
  return (
    <footer className="relative w-full py-10 font-sans text-xs text-neutral-500 dark:text-neutral-400 before:absolute before:top-0 before:left-1/2 before:h-px before:w-full before:max-w-[1440px] before:-translate-x-1/2 before:bg-amber-600 before:opacity-10 before:[mask-image:linear-gradient(90deg,transparent_0%,black_40%,black_60%,transparent_100%)] dark:before:bg-orange-300">
      <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-12">
        <div>
          <p className="font-semibold text-neutral-800 dark:text-neutral-200">
            AIML Studio: Rev. 2023 NEP Curriculum
          </p>
          <p className="mt-0.5">MIT Academy of Engineering · Third Year B.Tech (AY 2025-26)</p>
        </div>
        <p className="font-semibold text-neutral-800 dark:text-neutral-200">By Tushar Kaldate</p>
      </div>
    </footer>
  );
}
