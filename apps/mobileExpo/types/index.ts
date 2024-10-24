export interface Area {
  _id: string;
  action: {
    service_id: string;
    informations: {
      type: string;
      [key: string]: any;
    };
  };
  reaction: {
    service_id: string;
    informations: {
      type: string;
      [key: string]: any;
    };
  };
  active: boolean;
}
