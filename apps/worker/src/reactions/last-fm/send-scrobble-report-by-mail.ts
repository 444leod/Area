import { ReactionFunction } from "../reaction-function";
import {
  AreaPacket,
  SendScrobbleReportByEmailInfos,
  sendMail,
  getWeeklyScrobbles,
  ValidationError,
} from "@area/shared";
import { Liquid } from "liquidjs";
import * as fs from "fs/promises";
import * as path from "path";

const engine = new Liquid();

export const handleSendScrobbleReportByMailReaction: ReactionFunction = async (
  packet: AreaPacket,
) => {
  const reaction = packet.area.reaction
    .informations as SendScrobbleReportByEmailInfos;
  const nb_tracks =
    typeof reaction.nb_tracks === "number"
      ? reaction.nb_tracks
      : parseInt(reaction.nb_tracks);

  if (Number.isNaN(nb_tracks))
    throw new ValidationError(
      "Invalid number of tracks to display, fix the dynamic variable",
    );

  const data = await getWeeklyScrobbles(
    reaction.username,
    process.env.LASTFM_API_KEY || "",
  );

  if (!data) {
    throw new ValidationError("No data found for the given username");
  }

  const tracks = data.weeklytrackchart.track || [];
  const totalTracksAvailable = tracks.length;
  const tracksToDisplay = Math.min(nb_tracks, totalTracksAvailable);
  const firstXTracks = tracks.slice(0, tracksToDisplay);

  const templatePath = path.join(
    __dirname,
    "../../templates/weekly-music-report.liquid",
  );
  const weeklyMusicTemplate = await fs.readFile(templatePath, "utf8");

  const emailBody = await engine.parseAndRender(weeklyMusicTemplate, {
    type: "Tracks",
    items: firstXTracks,
    itemsToDisplay: tracksToDisplay,
    requestedItems: nb_tracks,
    totalItems: totalTracksAvailable,
  });

  await sendMail(reaction.to, reaction.subject, emailBody, "html");
};
