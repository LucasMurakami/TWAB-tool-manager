import { siteConfig } from "@/config/site";
import { MainNav } from "@/components/main-nav";
import { SmallNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="relative w-full">
          {/* MainNav component */}
          <div className="hidden sm:block">
            <MainNav items={siteConfig.mainNav} />
          </div>
          <div className="block sm:hidden">
            <SmallNav items={siteConfig.mainNav} />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
