'use client'

import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

interface SubNavItem {
  title: string
  href: string
}

interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  subItems?: SubNavItem[]
}

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  const [expanded, setExpanded] = React.useState<string | null>(null)

  const handleExpand = (itemTitle: string) => {
    setExpanded(expanded === itemTitle ? null : itemTitle)
  }

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.expandable-item')) {
      setExpanded(null)
    }
  }

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>
      {items?.length ? (
        <nav className="flex items-center gap-6">
          {items?.map((item, index) =>
            item.href ? (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center text-sm font-medium text-muted-foreground",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                {item.title}
              </Link>
            ) : (
              <div key={index} className="expandable-item relative">
                <button
                  onClick={() => handleExpand(item.title)}
                  className="flex items-center text-sm font-medium text-muted-foreground"
                >
                  {item.title}
                </button>
                {expanded === item.title && item.subItems && (
                  <div className="absolute left-0 mt-2 w-48 rounded border bg-white shadow-lg dark:bg-gray-800">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-900 dark:text-white"
                        onClick={() => setExpanded(null)}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </nav>
      ) : null}
    </div>
  )
}

export function SmallNav({ items }: MainNavProps) {
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [isMobileExpanded, setIsMobileExpanded] = React.useState(false);

  const handleExpand = (itemTitle: string) => {
    setExpanded(expanded === itemTitle ? null : itemTitle);
  };

  const toggleMobileMenu = () => {
    setIsMobileExpanded((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setIsMobileExpanded(false);
    setExpanded(null);
  };

  return (
    <div className="relative">
      {/* Large screen navbar */}
      <div className="hidden gap-6 lg:flex">
        <Link href="/" className="flex items-center space-x-2">
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </Link>
        {items?.length ? (
          <nav className="flex items-center gap-6">
            {items.map((item, index) =>
              item.href ? (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium text-muted-foreground",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                  onClick={handleCloseMenu}
                >
                  {item.title}
                </Link>
              ) : (
                <div key={index} className="group relative">
                  <button className="text-sm font-medium text-muted-foreground">
                    {item.title}
                  </button>
                  <div className="absolute left-0 mt-2 hidden w-48 rounded border bg-white shadow-lg group-hover:block dark:bg-gray-800">
                    {item.subItems?.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-900 dark:text-white"
                        onClick={handleCloseMenu}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )}
          </nav>
        ) : null}
      </div>

      {/* Mobile screen navbar */}
      <div className="lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="text-sm font-bold text-muted-foreground"
        >
          {siteConfig.name}
        </button>
        {isMobileExpanded && (
          <div className="absolute left-0 top-full mt-2 w-64 rounded border bg-white shadow-lg dark:bg-gray-800">
            {items?.map((item, index) => (
              <div key={index} className="border-b last:border-none">
                {!!item.subItems ? (
                  <button
                    onClick={() => handleExpand(item.title)}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {item.title}
                  </button>
                ) : (
                  <Link
                    href={item.href || ""}
                    className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white"
                    onClick={handleCloseMenu}
                  >
                    {item.title}
                  </Link>
                )}
                {expanded === item.title && item.subItems && (
                  <div className="pl-4">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-900 dark:text-white"
                        onClick={handleCloseMenu}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
