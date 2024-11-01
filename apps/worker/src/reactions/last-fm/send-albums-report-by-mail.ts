import { ReactionFunction } from "../reaction-function";
import {
  AreaPacket,
  SendAlbumsReportByEmailInfos,
  sendMail,
  getWeeklyAlbums,
  ValidationError,
} from "@area/shared";
import { Liquid } from "liquidjs";
import * as fs from "fs/promises";
import * as path from "path";

const engine = new Liquid();

export const handleSendAlbumsReportByMailReaction: ReactionFunction = async (
  packet: AreaPacket,
) => {
  const reaction = packet.area.reaction
    .informations as SendAlbumsReportByEmailInfos;
  const nb_albums =
    typeof reaction.nb_albums === "number"
      ? reaction.nb_albums
      : parseInt(reaction.nb_albums);

  if (Number.isNaN(nb_albums))
    throw new ValidationError(
      "Invalid number of albums to display, fix the dynamic variable",
    );

  const data = await getWeeklyAlbums(
    reaction.username,
    process.env.LASTFM_API_KEY || "",
  );

  if (!data) {
    throw new ValidationError("No data found for the given username");
  }

  const albums = data.weeklyalbumchart.album || [];
  const totalAlbumsAvailable = albums.length;
  const albumsToDisplay = Math.min(nb_albums, totalAlbumsAvailable);
  const firstXAlbums = albums.slice(0, albumsToDisplay);

  const templatePath = path.join(
    __dirname,
    "../../templates/weekly-music-report.liquid",
  );
  const weeklyMusicTemplate = await fs.readFile(templatePath, "utf8");

  const emailBody = await engine.parseAndRender(weeklyMusicTemplate, {
    type: "Albums",
    items: firstXAlbums,
    itemsToDisplay: albumsToDisplay,
    requestedItems: nb_albums,
    totalItems: totalAlbumsAvailable,
  });

  await sendMail(reaction.to, reaction.subject, emailBody, "html");
};
