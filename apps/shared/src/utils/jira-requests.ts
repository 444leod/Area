import axios from "axios";

type JiraSite = {
  id: string;
  name: string;
  url: string;
};
//TODO: update with AuthDTO

function buildJiraUrl(domainId: string, route: string): string {
  return `https://api.atlassian.com/ex/jira/${domainId}/rest/api/${route}`;
}

export async function getDomainsProjects(
  domains: JiraSite[],
  token: string,
): Promise<any[]> {
  let projects = [];
  for (const domain of domains) {
    const domainProjects = await getJiraDomainProjects(domain.id, token);
    if (domainProjects) {
      projects = projects.concat(domainProjects);
    }
  }
  return projects;
}

export async function getJiraDomainProjects(
  domainId: string,
  token: string,
): Promise<any> {
  try {
    const response = await axios.get(
      buildJiraUrl(domainId, "3/project/search"),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          status: ["live"],
          expand: "description,lead,url",
        },
      },
    );

    return response.data.values;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error on Atlassian Request:", error.response?.statusText);
      return [];
    } else {
      console.error("Error on Atlassian Request:", error);
      return [];
    }
  }
}

export async function getDomainTickets(
  domainId: string,
  token: string,
  date: Date,
): Promise<any[]> {
  try {
    const response = await axios.get(buildJiraUrl(domainId, "3/search"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        maxResults: 10,
        fields:
          "summary,created,priority,status,issuetype,assignee,reporter,project,labels",
        jql: `created >= "${date.toISOString().split(".")[0].replace("T", " ").split(":").splice(0, 2).join(":")}" ORDER BY created DESC`,
      },
    });

    return response.data.issues;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error on Atlassian Request:", error.response?.statusText);
      return [];
    } else {
      console.error("Error on Atlassian Request:", error);
      return [];
    }
  }
}

export async function getDomainsTicketsAfterDate(
  domains: JiraSite[],
  token: string,
  date: Date,
): Promise<any> {
  let tickets = [];
  for (const domain of domains) {
    const domainTickets = await getDomainTickets(domain.id, token, date);
    if (domainTickets) {
      tickets = tickets.concat(domainTickets);
    }
  }
  return tickets;
}

export async function getJiraDomains(token: string): Promise<JiraSite[]> {
  try {
    const response = await axios.get(
      "https://api.atlassian.com/oauth/token/accessible-resources",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.map((resource: any) => {
      return {
        id: resource.id,
        name: resource.name,
        url: resource.url,
      };
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error on Atlassian Request:", error.response?.statusText);
      return [];
    } else {
      console.error("Error on Atlassian Request:", error);
      return [];
    }
  }
}
