import {ObjectId} from 'mongodb'

export class Action {
    _id: ObjectId;
    service: ObjectId;
    infos: any; // TODO change any to actual schema
    history: any; // TODO change any to actual schema
    isWebhook: boolean;
}

export class Reaction {
    _id: ObjectId;
    service: ObjectId;
    infos: any; // TODO change any to actual schema
}

export class Area {
    _id: ObjectId;
    action: Action;
    reaction : Reaction;
    active: boolean;
}