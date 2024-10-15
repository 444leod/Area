import { AreaDto } from "@area/shared";
import { ApiResponseOptions } from "@nestjs/swagger";

export const AreasUnauthorizedOptions: ApiResponseOptions = {
  description: "No token provided, or token isn't valid.",
};

export const AreasNotFoundOptions: ApiResponseOptions = {
  description: "Area not found.",
};

export const AreasUserNotFoundOptions: ApiResponseOptions = {
  description: "User not found.",
};

export const AreasNoContentOptions: ApiResponseOptions = {
  description: "Operation sucessful, no content.",
};

export const CreateAreaOkOptions: ApiResponseOptions = {
  description: "The element was sucessfully created.",
  example: {
    active: true,
    action: {
      service_id: "deadbeefdeadbeefdeadbeef",
      informations: {
        type: "EXAMPLE_TYPE",
        field: "exampleFieldData",
      },
    },
    reaction: {
      service_id: "deadbeefdeadbeefdeadbeef",
      informations: {
        type: "EXAMPLE_TYPE",
        field: "exampleFieldData",
      },
    },
  },
};

export const GetAreasOkOptions: ApiResponseOptions = {
  description: "The data was successfully fetched.",
  example: [
    {
      _id: "deadbeefdeadbeefdeadbeef",
      active: true,
      action: {
        service_id: "deadbeefdeadbeefdeadbeef",
        informations: {
          type: "EXAMPLE_TYPE",
          field: "exampleFieldData",
        },
      },
      reaction: {
        service_id: "deadbeefdeadbeefdeadbeef",
        informations: {
          type: "EXAMPLE_TYPE",
          field: "exampleFieldData",
        },
      },
    },
    {
      _id: "beefdeadbeefdeadbeefdead",
      active: false,
      action: {
        service_id: "beefdeadbeefdeadbeefdead",
        informations: {
          type: "EXAMPLE_TYPE",
          field: "anotherExample",
        },
      },
      reaction: {
        service_id: "beefdeadbeefdeadbeefdead",
        informations: {
          type: "EXAMPLE_TYPE",
          field: "anotherExample",
        },
      },
    },
  ],
};

export const GetAreaOkOptions: ApiResponseOptions = {
  description: "The data was successfully fetched.",
  example: {
    _id: "deadbeefdeadbeefdeadbeef",
    active: true,
    action: {
      isWebhook: false,
      service_id: "deadbeefdeadbeefdeadbeef",
      informations: {
        type: "EXAMPLE_TYPE",
        field: "exampleFieldData",
      },
      history: {
        type: "EXAMPLE_TYPE",
        exampleHistory: [],
      },
    },
    reaction: {
      service_id: "deadbeefdeadbeefdeadbeef",
      informations: {
        type: "EXAMPLE_TYPE",
        field: "exampleFieldData",
      },
    },
  },
};

export const AreasToggleOkOptions: ApiResponseOptions = {
  description: "Document was sucessfully patched.",
  example: {
    _id: "deadbeefdeadbeefdeadbeef",
    active: true,
    action: {},
    reaction: {},
  },
};
