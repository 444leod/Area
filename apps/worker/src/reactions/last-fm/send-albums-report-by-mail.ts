import { ReactionFunction } from "../reaction-function";
import {
  AreaPacket,
  SendAlbumsReportByEmailInfos,
  sendMail,
  GetWeeklyAlbumsResponse,
  getWeeklyAlbums,
  Album,
  mailStyle,
  mailFooter,
} from "@area/shared";

export const handleSendAlbumsReportByMailReaction: ReactionFunction = async (
  packet: AreaPacket
) => {
  const reaction = packet.area.reaction.informations as SendAlbumsReportByEmailInfos;
  const nb_albums: number =
    typeof reaction.nb_albums === "number"
      ? reaction.nb_albums
      : parseInt(reaction.nb_albums);
  if (Number.isNaN(nb_albums)) {
    console.error("Invalid number of albums to display, fix the dynamic variable");
    return;
  }
  const data: GetWeeklyAlbumsResponse | null = await getWeeklyAlbums(
    reaction.username,
    process.env.LASTFM_API_KEY || ""
  );

  if (data === null) {
    console.error("No data found for the given username");
    return;
  }

  if (
    !data.weeklyalbumchart.album ||
    data.weeklyalbumchart.album.length === 0
  ) {
    const noAlbumsEmailBody = `
          <!DOCTYPE html>
          <html>
          ${mailStyle}
          <body>
            <h2>Weekly Music Recap</h2>
            <p>No albums were played this week.</p>
          ${mailFooter}
          </body>
          </html>
        `;
    await sendMail(reaction.to, reaction.subject, noAlbumsEmailBody, "html");
    return;
  }

  const totalAlbumsAvailable = data.weeklyalbumchart.album.length;
  const albumsToDisplay = Math.min(nb_albums, totalAlbumsAvailable);
  const firstXAlbums: Album[] = data.weeklyalbumchart.album.slice(
    0,
    albumsToDisplay
  );

  const emailBody = `
        <!DOCTYPE html>
        <html>
        ${mailStyle}
        <body>
          <h2>Your Weekly Albums Recap</h2>
          
          ${
            firstXAlbums.length > 0
              ? `
            <p>Your most played album this week is: 
              <span class="highlight">${firstXAlbums[0].name}</span> by 
              <span class="highlight">${firstXAlbums[0].artist["#text"]}</span>!
            </p>
          `
              : ""
          }
    
          <h3>Your Top ${albumsToDisplay} albums This Week:</h3>
          ${
            nb_albums > totalAlbumsAvailable
              ? `<p class="note">Note: You requested ${nb_albums} albums, but you only played ${totalAlbumsAvailable} different albums this week.</p>`
              : ""
          }
          
          <ul class="track-list">
            ${firstXAlbums
              .map(
                (track, index) => `
              <li class="track-item">
                ${index + 1}. <span class="highlight">${track.name}</span>
                by <span class="highlight">${track.artist["#text"]}</span>
                <span class="playcount">(${track.playcount} plays)</span>
              </li>
            `
              )
              .join("")}
          </ul>
          ${mailFooter}
        </body>
        </html>
      `;

  await sendMail(reaction.to, reaction.subject, emailBody, "html");
};
