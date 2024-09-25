import { SendEmailDTO } from '@shared/dtos/reactions/send_email.dto'

function isSendEmailDTO(obj: any): obj is SendEmailDTO {
    return (
        typeof obj === 'object' &&
            typeof obj.to === 'string' &&
            typeof obj.subject === 'string' &&
            typeof obj.body === 'string'
    )
}

export { isSendEmailDTO };
