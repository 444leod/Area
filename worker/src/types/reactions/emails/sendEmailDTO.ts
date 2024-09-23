interface sendEmailDTO {
    to: string;
    subject: string;
    content: string;
}

function isSendEmailDTO(obj: any): obj is sendEmailDTO {
    return (
        typeof obj === 'object' &&
            typeof obj.to === 'string' &&
            typeof obj.subject === 'string' &&
            typeof obj.content === 'string'
    )
}

export { sendEmailDTO, isSendEmailDTO };
