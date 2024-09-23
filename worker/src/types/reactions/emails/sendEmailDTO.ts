interface sendEmailDTO {
    to: string;
    subject: string;
    body: string;
}

function isSendEmailDTO(obj: any): obj is sendEmailDTO {
    return (
        typeof obj === 'object' &&
            typeof obj.body === 'string' &&
            typeof obj.subject === 'string' &&
            typeof obj.body === 'string'
    )
}

export { sendEmailDTO, isSendEmailDTO };