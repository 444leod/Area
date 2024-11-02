# How to implement a new Action/Reaction ?

## Introduction

The goal of the Area is to have an action -> reaction system. For our project, we decided to decouple the action from the reaction meaning that any action can trigger any reaction. This means that we had to abstract a lot of the logic in order to make it work. Luckily, the abtractions are already in place and you just have to implement the logic for your specific action or reaction.


## How to implement a new Action

### Context

For the sake of this example, we'll implement a Spotify action called OnArtistNewContent. This action will trigger when a new song/album is released by an artist.

### Steps

#### 1. Shared DTOs

Go to `apps/shared/dtos/actions/action-types.enum.ts` to add a new action type. In our case, we'll add `OnArtistNewContent`.

```typescript
export enum ActionTypes {
    ... // Other actions
    ON_NEW_ARTIST_CONTENT = "ON_NEW_ARTIST_CONTENT",
}
```

Create a `on-new-artist-content.class.ts` file in `apps/shared/dtos/actions/spotify` and add the input of the action:

```typescript
import { ActionTypes } from "../action-types.enum";
import { BaseActionInfos } from "../action-infos.class";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { RegisterAction } from "../action.decorator";

export enum NewArtistContentType {
  ALBUM = "album",
  SINGLE = "single",
  ANY = "any",
}

// Don't forget to register the action with the action type that we defined in the ActionTypes enum,
// this custom decorator saves you from a lot a manual setup!
@RegisterAction(ActionTypes.ON_NEW_ARTIST_CONTENT)
export class OnNewArtistContentInfos extends BaseActionInfos { // This class extends the BaseActionInfos class which contains the common fields for all actions
  type: ActionTypes.ON_NEW_ARTIST_CONTENT; // This is used to identify the action type

  @ApiProperty() // Use this to generate the swagger documentation
  @IsString()
  @IsNotEmpty()
  artist_name: string;

  @ApiProperty()
  @IsEnum(NewArtistContentType) // Don't hesitate to use the class-validator decorators to validate the input
  @IsNotEmpty()
  content_type: NewArtistContentType;
}
```

Add `export * from "./spotify/on-new-artist-content.class";` to the `apps/shared/dtos/actions/index.ts` file.

Go to `apps/shared/dtos/actions/action-infos.class.ts` and add the following code:

```typescript
export type ActionInfos =
    ... // Other actions
    | OnNewArtistContentInfos;
```

Now we will define the history of the action, this part is useful to keep track of data to trigger the action at the right time.
Create a `on-new-artist-content-history.class.ts` file in `apps/shared/dtos/history/spotify` and add the history of the action:

```typescript
import { ActionTypes } from "../../actions";
import { History } from "../history.decorator";

@History(ActionTypes.ON_NEW_ARTIST_CONTENT) // Register the history with the action type
export class OnNewArtistContentHistory {
  type: ActionTypes.ON_NEW_ARTIST_CONTENT; // This is used to identify the history type based on the action type
  contentIds: string[] | null = null;
}
```

add `export * from "./spotify/on-new-artist-content-history.class";` to the `apps/shared/dtos/history/index.ts` file.

#### 2. Implement the action logic

Now this is the interesting part, you have to implement the logic of the action!
Create file `on-new-artist-content.action.ts` in `apps/worker/actions/spotify` and add the following code:

The function we define here is the function that verifies if the action should be triggered a reaction. If it should, it will return the packet with the data that will be used by the reaction. If not, it will return null. If it throws an error, the action will be considered as crashed. Appropriate logs will be written in the database depending on the error or the success of the action.

```typescript
import { ActionFunction } from "../action-function";
import {
  AreaPacket,
  AuthorizationsTypes,
  getAuthorizationToken,
  MongoDBService,
  OnNewArtistContentInfos,
  OnNewArtistContentHistory,
  SpotifyAPI,
  NewArtistContentType,
} from "@area/shared";

export const handleOnNewArtistContentAction: ActionFunction = async (
  packet: AreaPacket,
  database: MongoDBService,
) => {
  const { token } = await getAuthorizationToken(
    packet.user_id,
    AuthorizationsTypes.SPOTIFY,
    database,
  ); // Get the user's token

  const area = packet.area;
  const action = area.action.informations as OnNewArtistContentInfos; // Uses the action informations we defined earlier
  const history = area.action.history as OnNewArtistContentHistory; // Uses the history we defined earlier

  // Verification logic
  const spotify = new SpotifyAPI(token);

  const artist = await spotify.getArtistByName(action.artist_name);
  const releases =
    action.content_type === NewArtistContentType.ANY
      ? await spotify.getArtistReleases(artist.id)
      : (await spotify.getArtistReleasesSortedByDateReducedByType(artist.id))[
          action.content_type
        ] || [];

  // Use the history to keep track of the content that has already been processed
  if (!history.contentIds) {
    history.contentIds = releases.map((release) => release.id);
    area.action.history = history;
    await database.updateAreaHistory(packet.user_id, area);
    return null;
  }

  const newContent = releases.filter(
    (release) => !history.contentIds?.includes(release.id),
  );

  if (newContent.length === 0) {
    return null;
  }

  const content = newContent[0];

  history.contentIds.push(content.id);
  area.action.history = history;
  // Update the history to keep track of the new content
  await database.updateAreaHistory(packet.user_id, area);

  // Return the packet with extra data that can be used by the reaction
  packet.data = {
    name: content.name,
    url: content.external_urls.spotify,
    tracks_number: content.total_tracks,
    type: content.album_type,
    cover_url: content.images?.length > 0 ? content.images[0].url : null,
    artists: content.artists.map((artist) => artist.name),
    released_at: new Date(content.release_date).toString(),
    release_date: new Date(content.release_date).toLocaleDateString(),
    release_time: new Date(content.release_date).toLocaleTimeString(),
  };

  return packet;
};
```

Update `apps/worker/actions/action-map.ts` to export the new action's function:

```typescript
import { handleOnNewArtistContentAction } from "./spotify/on-artiste-new-content";

export const actionsMap: ActionMap = {
  ... // Other actions
  ON_NEW_ARTIST_CONTENT: handleOnNewArtistContentAction,
};
```

#### 3. Update the service.json file

In order for the users to know if an action exists, we have to update the `service.json` file in the `apps/api` folder. Add the following code:

```json
{
  "name": "Spotify",
  "description": "Spotify interactions",
  "actions": [
    ... // Other actions
      {
        "name": "On new artist release",
        "description": "When an artist drops new content (album or single).",
        "type": "ON_NEW_ARTIST_CONTENT",
        "authorizations": ["SPOTIFY"],
        "params": [
          {
            "name": "artist_name",
            "details": "Name of the artist",
            "type": "string",
            "required": true
          },
          {
            "name": "content_type",
            "details": "Type of content",
            "type": "enum",
            "items": ["album", "single", "any"],
            "required": true
          }
        ],
        "variables": [ // the variables are the ones we define in the packet.data in the action logic
          {
            "name": "area_name",
            "description": "Name of the area",
            "type": "string",
            "template": "My AREA #1"
          },
          {
            "name": "full_execution_date",
            "description": "Full date of the trigger",
            "type": "date",
            "template": "Sat Oct 27 2024 12:00:00 GMT+0200 (Central European Summer Time)"
          },
          {
            "name": "execution_date",
            "description": "Date of the trigger",
            "type": "string",
            "template": "27/10/2024"
          },
          {
            "name": "execution_time",
            "description": "Time of the trigger",
            "type": "string",
            "template": "12:00:00"
          },
          {
            "name": "name",
            "description": "Name of the content (album/single)",
            "type": "string",
            "template": "My New Album"
          },
          {
            "name": "artists",
            "description": "List of artists",
            "type": "string",
            "template": "Artist 1, Artist 2"
          },
          {
            "name": "url",
            "description": "URL of the content",
            "type": "string",
            "template": "https://open.spotify.com/album/albumID123"
          },
          {
            "name": "tracks_number",
            "description": "Total number of tracks in the content",
            "type": "number",
            "template": "10"
          },
          {
            "name": "type",
            "description": "Type of the content (album/single)",
            "type": "string",
            "template": "album"
          },
          {
            "name": "cover_url",
            "description": "Cover URL of the content (temporary url)",
            "type": "string",
            "template": "https://image.url/cover.jpg"
          },
          {
            "name": "released_at",
            "description": "Release date of the content",
            "type": "string",
            "template": "Mon Oct 01 2024 00:00:00 GMT+0200 (Central European Summer Time)"
          },
          {
            "name": "release_date",
            "description": "Formatted release date",
            "type": "string",
            "template": "01/10/2024"
          },
          {
            "name": "release_time",
            "description": "Formatted release time",
            "type": "string",
            "template": "00:00:00"
          }
        ]
      }
    ],
  ]
}
```

Each time the api is started, the actions will be loaded from the `service.json` file into the database. This way, the users will be able to see the available actions in the frontend.


## How to implement a new Reaction

Great news! Implementing a new reaction is very similar to implementing a new action. The only differences are in the logic of the function and the fact that it has no history nor dynimical variables. So just follow the steps for the action and replace any 'action' by 'reaction' and you should be good to go!

The function logic is used to execute any piece of code, let your imagination run wild! Just keep in mind to throw a `ValidationError` if you verify the input and it's not correct. This will be logged appropriately in the database and the user will be notified of the error.