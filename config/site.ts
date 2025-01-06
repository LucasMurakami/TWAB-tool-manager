export const siteConfig = {
  name: "TWAB",
  description:
    "TWAB is a web application that helps you to calculate the skill modifiers and player level-up in the RPG of TWAB (The World After The Beginning).",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Skills",
      subItems: [        
        { title: "Skill Ranks", href: "/skills/skill-ranks" },
        { title: "Skill Modifiers", href: "/skills/skill-modifiers" },
        { title: "Skill Creator", href: "/skills/skill-creator" },
      ],
    },
    {
      title: "Player",
      subItems: [        
        { title: "Player Ranks", href: "/player/player-ranks" },
        { title: "Player Modifiers", href: "/player/player-modifiers" },
      ],
    },
    {
      title: "Settings",
      href: "/setting",
    },
    {
      title: "More",
      subItems: [
        { title: "TAB 1", href: "/" },
        { title: "TBA 2", href: "/" },
        { title: "TBA 3", href: "/" },
      ],
    },
  ],
};
