export type ProjectMedia =
  { kind: 'video'; src: string; poster: string } | { kind: 'image'; src: string; alt: string }

export interface Project {
  id: string
  title: string
  tag: string
  summary: string
  link: { label: string; href: string }
  media: ProjectMedia
  desktopOnly: boolean
}

const base = import.meta.env.BASE_URL

export const PROJECTS: readonly Project[] = [
  {
    id: 'canine',
    title: 'Impacted canine assessment',
    tag: 'GitHub',
    summary:
      'Web application that detects maxillary impacted canines in panoramic radiographs and assesses their eruption potential.',
    link: {
      label: 'View on GitHub',
      href: 'https://github.com/Yummamuang/prediction-of-maxillary-impacted-canine',
    },
    media: {
      kind: 'video',
      src: `${base}video/canine.mp4`,
      poster: `${base}img/posters/canine.jpg`,
    },
    desktopOnly: false,
  },
  {
    id: 'manga',
    title: 'Manga recommendation',
    tag: 'Live',
    summary: 'Manga recommendation website.',
    link: { label: 'Open live site', href: 'https://manga-system.vercel.app/' },
    media: {
      kind: 'image',
      src: `${base}img/manga-direct.png`,
      alt: 'Screenshot of the manga recommendation website',
    },
    desktopOnly: true,
  },
  {
    id: 'catspace',
    title: 'Cat Space shop',
    tag: 'Design',
    summary: 'Cat Space shop website design.',
    link: { label: 'Open the site', href: `${base}pages/project/WebDesign-SpaceCat/index.html` },
    media: {
      kind: 'video',
      src: `${base}video/catspace.mp4`,
      poster: `${base}img/posters/catspace.jpg`,
    },
    desktopOnly: false,
  },
  {
    id: 'gym',
    title: 'Gym management system',
    tag: 'Laravel',
    summary: 'Gym management system built with the Laravel framework.',
    link: { label: 'View on GitHub', href: 'https://github.com/Yummamuang/Gym-Management-System' },
    media: {
      kind: 'image',
      src: `${base}img/gymmanagementsystem.png`,
      alt: 'Gym management system home page with trainer and member sign-up options',
    },
    desktopOnly: false,
  },
  {
    id: 'data',
    title: 'Game view counts mini project',
    tag: 'Data',
    summary:
      'Mini data engineering project comparing view counts for the top 15 popular games on YouTube, Twitch and Facebook.',
    link: {
      label: 'View on GitHub',
      href: 'https://github.com/Yummamuang/Data-Engineering-Mini-Project',
    },
    media: {
      kind: 'image',
      src: `${base}img/dataengineering.jpg`,
      alt: 'Title slide comparing view counts of 15 popular games on YouTube, Twitch and Facebook',
    },
    desktopOnly: false,
  },
  {
    id: 'snake',
    title: 'Snake game',
    tag: 'Python',
    summary: 'Snake game written in Python.',
    link: {
      label: 'View on GitHub',
      href: 'https://github.com/Yummamuang/Snake-Game-Development',
    },
    media: {
      kind: 'image',
      src: `${base}img/snakegame.jpg`,
      alt: 'Screenshot of the snake game',
    },
    desktopOnly: false,
  },
]
