import { SendEmailDTO } from '@shared/dto/send_mail.dto'

function isSendEmailDTO(obj: any): obj is SendEmailDTO {
    return (
        typeof obj === 'object' &&
            typeof obj.to === 'string' &&
            typeof obj.subject === 'string' &&
            typeof obj.body === 'string'
    )
}

export { isSendEmailDTO };
