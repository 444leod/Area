import { ReactionFunction } from "../reaction-function";
import {
  AreaPacket,
  SendArtistsReportByEmailInfos,
  sendMail,
  getWeeklyArtists,
} from "@area/shared";
import { Liquid } from "liquidjs";
import * as fs from "fs/promises";
import * as path from "path";

const engine = new Liquid();

export const handleSendArtistsReportByMailReaction: ReactionFunction = async (
  packet: AreaPacket,
) => {
  const reaction = packet.area.reaction
    .informations as SendArtistsReportByEmailInfos;
  const nb_artists =
    typeof reaction.nb_artists === "number"
      ? reaction.nb_artists
      : parseInt(reaction.nb_artists);

  if (Number.isNaN(nb_artists)) {
    console.error(
      "Invalid number of tracks to display, fix the dynamic variable",
    );
    return;
  }

  const data = await getWeeklyArtists(
    reaction.username,
    process.env.LASTFM_API_KEY || "",
  );

  if (!data) {
    console.error("No data found for the given username");
    return;
  }

  const tracks = data.weeklyartistchart.artist || [];
  const totalArtistsAvailable = tracks.length;
  const artistsToDisplay = Math.min(nb_artists, totalArtistsAvailable);
  const firstXArtists = tracks.slice(0, artistsToDisplay);

  const templatePath = path.join(
    __dirname,
    "../../templates/weekly-music-report.liquid",
  );
  const weeklyMusicTemplate = await fs.readFile(templatePath, "utf8");

  const emailBody = await engine.parseAndRender(weeklyMusicTemplate, {
    type: "Artists",
    items: firstXArtists,
    itemsToDisplay: artistsToDisplay,
    requestedItems: nb_artists,
    totalItems: totalArtistsAvailable,
  });

  await sendMail(reaction.to, reaction.subject, emailBody, "html");
};