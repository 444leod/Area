import { ReactionFunction } from "../reaction-function";
import {
  AreaPacket,
  SendScrobbleReportByEmailInfos,
  sendMail,
  GetWeeklyScobblesResponse,
  getWeeklyScobbles,
  Track,
  mailStyle,
  mailFooter,
} from "@area/shared";

export const handleSendScrobbleReportByMailReaction: ReactionFunction = async (
  packet: AreaPacket
) => {
  const reaction = packet.area.reaction.informations as SendScrobbleReportByEmailInfos;
  const nb_tracks: number =
    typeof reaction.nb_tracks === "number"
      ? reaction.nb_tracks
      : parseInt(reaction.nb_tracks);
  if (Number.isNaN(nb_tracks)) {
    console.error("Invalid number of tracks to tracks, fix the dynamic variable");
    return;
  }
  const data: GetWeeklyScobblesResponse | null = await getWeeklyScobbles(
    reaction.username,
    process.env.LASTFM_API_KEY || ""
  );

  if (data === null) {
    console.error("No data found for the given username");
    return;
  }

  if (
    !data.weeklytrackchart.track ||
    data.weeklytrackchart.track.length === 0
  ) {
    const noTracksEmailBody = `
          <!DOCTYPE html>
          <html>
          ${mailStyle}
          <body>
            <h2>Weekly Music Recap</h2>
            <p>No tracks were played this week.</p>
            ${mailFooter}
          </body>
          </html>
        `;
    await sendMail(reaction.to, reaction.subject, noTracksEmailBody, "html");
    return;
  }

  const totalTracksAvailable = data.weeklytrackchart.track.length;
  const tracksToDisplay = Math.min(nb_tracks, totalTracksAvailable);
  const firstXTracks: Track[] = data.weeklytrackchart.track.slice(
    0,
    tracksToDisplay
  );

  const emailBody = `
        <!DOCTYPE html>
        <html>
        ${mailStyle}
        <body>
          <h2>Your Weekly Music Recap</h2>
          
          ${
            firstXTracks.length > 0
              ? `
            <p>Your most played track this week is: 
              <span class="highlight">${firstXTracks[0].name}</span> by 
              <span class="highlight">${firstXTracks[0].artist["#text"]}</span>!
            </p>
          `
              : ""
          }
    
          <h3>Your Top ${tracksToDisplay} Tracks This Week:</h3>
          ${
            nb_tracks > totalTracksAvailable
              ? `<p class="note">Note: You requested ${nb_tracks} tracks, but you only played ${totalTracksAvailable} different tracks this week.</p>`
              : ""
          }
          
          <ul class="track-list">
            ${firstXTracks
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
