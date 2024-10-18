import axios from 'axios';

type JiraSite = {
    id: string,
    name: string,
    url: string
}
//TODO: update with AuthDTO

function buildJiraUrl(domainId: string, route: string): string {
    return `https://api.atlassian.com/ex/jira/${domainId}/rest/api/${route}`;
}

export async function getJiraDomainProjects(domainId: string, auth: { token: string, refresh_token: string}): Promise<any> {
    try {
        const response = await axios.get(buildJiraUrl(domainId, '3/project/search'), {
            headers: {
                Authorization: `Bearer ${auth.token}`
            },
            params: {
                status: ['live']
            }
        });

        return response.data.values;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error on Atlassian Request:', error.response?.statusText);
            return [];
        } else {
            console.error('Error on Atlassian Request:', error);
            return [];
        }
    }
}

export async function getDomainTickets(domainId: string, auth: { token: string, refresh_token: string}, date: Date): Promise<any[]> {
    try {
        const response = await axios.get(buildJiraUrl(domainId, '3/search'), {
            headers: {
                Authorization: `Bearer ${auth.token}`
            },
            params: {
                maxResults: 10,
                fields: 'summary,created,priority,status,issuetype,assignee',
                jql: `created >= "${date.toISOString().split('.')[0].replace('T', ' ').split(':').splice(0, 2).join(':')}" ORDER BY created DESC`
            }
        });

        return response.data.issues;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error on Atlassian Request:', error.response?.statusText);
            return [];
        } else {
            console.error('Error on Atlassian Request:', error);
            return [];
        }
    }
}

export async function getDomainsTicketsAfterDate(domains: JiraSite[], auth: { token: string, refresh_token: string }, date: Date): Promise<any> {
    let tickets = [];
    for (const domain of domains) {
        const domainTickets = await getDomainTickets(domain.id, auth, date);
        if (domainTickets) {
            tickets = tickets.concat(domainTickets);
        }
    }
    return tickets;
}


export async function getNewAtlassianToken(auth: { token: string, refresh_token: string }): Promise<{ token: string, refresh_token: string } | null> {
    try {
        const response = await axios.post('https://auth.atlassian.com/oauth/token', {
            grant_type: 'refresh_token',
            client_id: process.env.ATLASSIAN_CLIENT_ID,
            client_secret: process.env.ATLASSIAN_CLIENT_SECRET,
            refresh_token: auth.refresh_token
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const { access_token, refresh_token } = response.data;

        return { token: access_token, refresh_token };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error on Atlassian Request:', error.response?.statusText);
            console.error(error)
            return null;
        } else {
            console.error('Error on Atlassian Request:', error);
            return null;
        }
    }
}

export async function getJiraDomains(auth: { token: string, refresh_token: string }): Promise<JiraSite[]> {
    try {
        const response = await axios.get('https://api.atlassian.com/oauth/token/accessible-resources', {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        });

        return response.data.map((resource: any) => {
            return {
                id: resource.id,
                name: resource.name,
                url: resource.url
            }
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error on Atlassian Request:', error.response?.statusText);
            return [];
        } else {
            console.error('Error on Atlassian Request:', error);
            return [];
        }
    }
}