export type IconMapping = {
  [key: string]: string;
};

export const iconMap: IconMapping = {
  google: "logos:google-icon",
  gmail: "logos:google-gmail",
  "google drive": "logos:google-drive",
  "google calendar": "logos:google-calendar",
  "google task": "gg:google-tasks",
  github: "logos:github-icon",
  atlassian: "logos:atlassian",
  trello: "logos:trello",
  slack: "logos:slack-icon",
  discord: "logos:discord-icon",
  dropbox: "logos:dropbox",
  twitter: "logos:twitter",
  facebook: "logos:facebook",
  instagram: "logos:instagram-icon",
  linkedin: "logos:linkedin-icon",
  youtube: "logos:youtube-icon",
  spotify: "logos:spotify-icon",
  twitch: "logos:twitch",
  reddit: "logos:reddit-icon",
  pinterest: "logos:pinterest",
  asana: "logos:asana",
  notion: "logos:notion-icon",
  evernote: "logos:evernote",
  "microsoft teams": "logos:microsoft-teams",
  zoom: "logos:zoom-icon",
  salesforce: "logos:salesforce",
  hubspot: "logos:hubspot",
  mailchimp: "logos:mailchimp",
  zapier: "logos:zapier-icon",
  ifttt: "logos:ifttt",
  mail: "material-symbols:mail",
};

export function getIconForApp(appName: string): string {
  const normalizedAppName = appName.toLowerCase();
  return iconMap[normalizedAppName] || "mdi:application";
}
