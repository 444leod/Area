import { ReactionFunction } from "../reaction-function";
import {
  AreaPacket,
  SendArtistsReportByEmailInfos,
  sendMail,
  GetWeeklyArtistsResponse,
  getWeeklyArtists,
  Artist,
  mailStyle,
  mailFooter,
} from "@area/shared";

export const handleSendArtistsReportByMailReaction: ReactionFunction = async (
  packet: AreaPacket
) => {
  const reaction = packet.area.reaction.informations as SendArtistsReportByEmailInfos;
  const data: GetWeeklyArtistsResponse | null = await getWeeklyArtists(
    reaction.username,
    process.env.LASTFM_API_KEY || ""
  );

  if (data === null) {
    console.error("No data found for the given username");
    return;
  }

  if (
    !data.weeklyartistchart.artist ||
    data.weeklyartistchart.artist.length === 0
  ) {
    const noArtistsEmailBody = `
          <!DOCTYPE html>
          <html>
          ${mailStyle}
          <body>
            <h2>Weekly Music Recap</h2>
            <p>No artists were played this week.</p>
          ${mailFooter}
          </body>
          </html>
        `;
    await sendMail(reaction.to, reaction.subject, noArtistsEmailBody, "html");
    return;
  }

  const totalArtistsAvailable = data.weeklyartistchart.artist.length;
  const artistsToDisplay = Math.min(reaction.nb_artists, totalArtistsAvailable);
  const firstXArtists: Artist[] = data.weeklyartistchart.artist.slice(
    0,
    artistsToDisplay
  );

  const emailBody = `
        <!DOCTYPE html>
        <html>
        ${mailStyle}
        <body>
          <h2>Your Weekly Artists Recap</h2>
          
          ${
            firstXArtists.length > 0
              ? `
            <p>Your most played artist this week is: 
              <span class="highlight">${firstXArtists[0].name}</span>!
            </p>
          `
              : ""
          }
    
          <h3>Your Top ${artistsToDisplay} artists This Week:</h3>
          ${
            reaction.nb_artists > totalArtistsAvailable
              ? `<p class="note">Note: You requested ${reaction.nb_artists} artists, but you only played ${totalArtistsAvailable} different artists this week.</p>`
              : ""
          }
          
          <ul class="track-list">
            ${firstXArtists
              .map(
                (track, index) => `
              <li class="track-item">
                ${index + 1}. <span class="highlight">${track.name}</span>
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
