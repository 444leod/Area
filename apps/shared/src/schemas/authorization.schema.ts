import { ObjectId } from 'mongodb'

export class Authorization {
    service: ObjectId
    type: string
    data: Object
}