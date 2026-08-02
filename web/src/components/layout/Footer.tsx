export function Footer() {
  return (
    <footer className="w-full border-t border-studio-200 bg-white py-8 dark:border-studio-800 dark:bg-studio-950 text-xs text-studio-500">
      <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          <p className="font-semibold text-studio-700 dark:text-studio-300">
            AIML Studio — Rev. 2023 NEP Curriculum
          </p>
          <p className="mt-0.5">MIT Academy of Engineering · Third Year B.Tech (AY 2025-26)</p>
        </div>
        <p className="text-center sm:text-right">
          Privacy-First · Zero Backend · Zero Cookies · $0 Client-Only Architecture
        </p>
      </div>
    </footer>
  );
}
