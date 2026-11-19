import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="relative w-full py-10 font-sans text-xs text-muted-foreground border-t border-border/60 bg-background/50">
      <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-6 px-6 sm:px-12 text-center sm:text-left">
        <div>
          <p className="font-semibold text-foreground text-sm font-manrope">
            AIML Studio: Rev. 2023 NEP Curriculum
          </p>
          <p className="mt-1 text-muted-foreground">
            MIT Academy of Engineering · Third Year B.Tech (AY 2025-26)
          </p>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-2">
          <p className="font-medium text-foreground">Developed by Tushar Kaldate</p>

          {/* Social media links */}
          <div className="flex items-center justify-center gap-4 pt-1">
            <a
              href="https://www.linkedin.com/in/tushar-kaldate-2b5276262/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-[#0A66C2] hover:bg-muted transition-colors"
            >
              <FaLinkedin className="size-4" />
            </a>

            <a
              href="https://github.com/tusharkkp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <FaGithub className="size-4" />
            </a>

            <a
              href="https://www.instagram.com/3412kkp/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-[#E4405F] hover:bg-muted transition-colors"
            >
              <FaInstagram className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
