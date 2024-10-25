import axios from "axios";

class JiraImage {
    "16x16": string;
    "24x24": string;
    "32x32": string;
    "48x48": string;
}

class JiraShortUser {
    accountId: string;
    displayName: string;
    avatarUrls: JiraImage;
}

class JiraIssueType {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    subtask: boolean;
}

class JiraSite {
  id: string;
  name: string;
  url: string;
}

class JiraShortProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  simplified: boolean;
  description?: string;
  lead: JiraShortUser;
  projectCategory?: {
    id: string;
    name: string;
    description: string;
  };
  avatarUrls: JiraImage;
  url?: string;
  domain?: JiraSite;
}

class JiraProject extends JiraShortProject {
  issueTypes: JiraIssueType[];
  roles: { [key: string]: string };
}

class JiraTicket {
  id: string;
  key: string;
  fields: {
    summary: string;
    description?: string;
    created: string;
    updated: string;
    priority: {
      id: string;
      name: string;
    };
    status: {
      name: string;
    };
    issuetype: {
      id: string;
      name: string;
    };
    assignee: JiraShortUser | null;
    reporter: JiraShortUser;
    creator: JiraShortUser;
    project: JiraShortProject;
    timespent?: number;
    timeestimate?: number;
    labels: string[];
    parent?: JiraTicket;
  };
}

export class JiraTicketCreate {
  fields: {
    summary: string;
    description?: string;
    issuetype: {
      id: string;
    };
    assignee?: {
      accountId: string;
    };
  };
}

class ProjectSearchResponse {
  values: JiraShortProject[];
}

class JiraTicketsResponse {
    issues: JiraTicket[];
    startAt: number;
    total: number;
}

function generateDescriptionByString(description: string): { type: string, version: number, content: { type: string, content: { type: string, text: string }[] }[] } {
    return {
        type: "doc",
        version: 1,
        content: description.split('\n').map((line: string) => {
            return {
                type: "paragraph",
                content: [
                    {
                        type: "text",
                        text: line,
                    },
                ]
            }
        })
    }
}

export class JiraAPI {
  private readonly token: string;
  domains: JiraSite[] = [];
  projects: JiraShortProject[] = [];

  constructor(token: string) {
    this.token = token;
  }

  /**
   * Builds the Jira API URL for a given domain and route.
   * @param domainId - Jira domain ID
   * @param route - API route
   * @returns The constructed Jira API URL
   */
  private buildJiraUrl(domainId: string, route: string): string {
    return `https://api.atlassian.com/ex/jira/${domainId}/rest/api/${route}`;
  }

  /**
   * Initializes the JiraAPI instance by fetching Jira domains.
   */
  async init(): Promise<void> {
    this.domains = await this.getJiraDomains();
  }

  /**
   * Retrieves Jira domains accessible by the current token.
   * @returns An array of JiraSite objects
   */
  async getJiraDomains(): Promise<JiraSite[]> {
    if (this.domains.length != 0) {
      return this.domains;
    }
    try {
      const response = await axios.get<JiraSite[]>(
          "https://api.atlassian.com/oauth/token/accessible-resources",
          {
            headers: { Authorization: `Bearer ${this.token}` },
          },
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Something went wrong while retrieving user's Atlassian domains: ${error.response?.data?.errorMessages.join(', ')}`)
      } else {
        throw new Error(`Something went wrong while retrieving user's Atlassian domains: ${error.message}`)
      }
    }
  }

  /**
   * Retrieves all projects from multiple Jira domains.
   * @returns An array of JiraShortProject objects
   */
  async getProjects(): Promise<JiraShortProject[]> {
    if (this.projects.length != 0) {
      return this.projects;
    }
    let projects: JiraShortProject[] = [];
    for (const domain of this.domains) {
      const domainProjects = await this.getProjectsByDomain(domain.id);
      if (domainProjects) {
        projects = projects.concat(domainProjects.map((p) => ({ ...p, domain: domain })));
      }
    }
    this.projects = projects;
    return projects;
  }

  /**
   * Retrieves all projects for a given Jira domain.
   * @param domainId - Jira domain ID
   * @returns An array of JiraShortProject objects or null if failed
   */
  async getProjectsByDomain(domainId: string): Promise<JiraShortProject[]> {
    try {
      const response = await axios.get<ProjectSearchResponse>(
          this.buildJiraUrl(domainId, "3/project/search"),
          {
            headers: { Authorization: `Bearer ${this.token}` },
            params: { status: ["live"], expand: "description,lead,url" },
          },
      );
      return response.data.values;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Something went wrong while retrieving projects for domain ${domainId}: ${error.response?.data?.errorMessages.join(', ')}`)
      } else {
        throw new Error(`Something went wrong while retrieving projects for domain ${domainId}: ${error.message}`)
      }
    }
  }

  /**
   * Retrieves all projects from multiple Jira domains.
   * @returns An array of JiraShortProject objects
   * @param params - Object with maxResults, fields and jql properties
   * @returns An array of JiraTicket objects
   */
  async getTickets(params: { maxResults?: number, fields?: string, jql?: string }): Promise<JiraTicket[]> {
    let tickets: JiraTicket[] = [];
    for (const domain of this.domains) {
      const domainTickets = await this.getDomainTickets(domain.id, params);
      if (domainTickets) {
          tickets = tickets.concat(domainTickets);
      }
    }
    return tickets;
  }

  /**
   * Retrieves tickets from a Jira domain created after a certain date.
   * @param domainId - Jira domain ID
   * @param params - Object with maxResults, fields and jql properties
   * @returns An array of JiraTicket objects
   */
  async getDomainTickets(domainId: string, params: { maxResults?: number, fields?: string, jql?: string }): Promise<JiraTicket[]> {
    let tickets: JiraTicket[] = [];
    let total = 0;
    try {
      do {
        const response = await axios.get<JiraTicketsResponse>(
            this.buildJiraUrl(domainId, "3/search"),
            {
              headers: { Authorization: `Bearer ${this.token}` },
              params: { ...params, startAt: tickets.length },
            },
        );
        tickets = tickets.concat(response.data.issues);
        total = response.data.total;
      } while ((!params.maxResults && tickets.length < total) || (params.maxResults && tickets.length < params.maxResults && tickets.length < total));
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Something went wrong while retrieving tickets for domain ${domainId}: ${error.response?.data?.errorMessages.join(', ')}`)
      } else {
        throw new Error(`Something went wrong while retrieving tickets for domain ${domainId}: ${error.message}`)
      }
    }
    return tickets;
  }

  /**
   * Retrieves tickets from all Jira domains created after a certain date.
   * @param date - Date object
   * @param maxResults - Maximum number of results to return
   * @returns An array of JiraTicket objects
   */
  async getTicketsAfter(date: Date, maxResults: number = 10): Promise<JiraTicket[]> {
    return this.getTickets({
        maxResults: maxResults,
        jql: `created >= "${date.toISOString().split(".")[0].replace("T", " ").split(":").splice(0, 2).join(":")}" ORDER BY created DESC`,
    });
  }

    /**
     * Retrieves tickets from a Jira project
     * @param projectKey - Jira project key
     * @param params - Object with maxResults, fields and jql properties
     * @returns An array of JiraTicket objects
     */
  async getTicketsByProject(projectKey: string, params: { maxResults?: number, fields?: string, jql?: string }): Promise<JiraTicket[]> {
    return this.getTickets({
        ...params,
        jql: `${params.jql} project = ${projectKey}`,
    });
  }

  /**
   * Create a ticket in a Jira project.
   * @param project - Jira project object
   * @param ticket - Jira ticket object
   * @returns A JiraTicket object or null if failed
   */
  async createTicket(project: JiraProject, ticket: JiraTicketCreate): Promise<JiraTicket> {
    try {
      const response = await axios.post<JiraTicket>(
            this.buildJiraUrl(project.domain.id, '3/issue'),
          { ...ticket, fields: { ...ticket.fields, project: { id: project.id }, description: generateDescriptionByString(ticket.fields.description || "") }, } ,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          },
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Something went wrong while creating a ticket in project ${project.key}: ${error.response?.data?.errorMessages.join(', ')}`)
      } else {
        throw new Error(`Something went wrong while creating a ticket in project ${project.key}: ${error.message}`)
      }
    }
  }

  /**
   * Retrieves a Jira project by its key.
   * @param projectKey - Jira project key
   * @returns A JiraProject object or null if failed
   */
  async getProjectByKey(projectKey: string): Promise<JiraProject> {
    const projects = this.projects.length != 0 ? this.projects : await this.getProjects();
    const project = projects.find((p) => p.key === projectKey);
    if (!project) {
      throw new Error(`Project ${projectKey} not found`);
    }
    return this.getFullProject(project.domain, project.id);
  }

    /**
     * Retrieves a full Jira project by its short representation.
     * @returns A JiraProject object or null if failed
     * @param domain - Jira domain
     * @param id - Jira project ID
     * @returns A JiraProject object or null if failed
     */
    async getFullProject(domain: JiraSite, id: string): Promise<JiraProject> {
      try {
        const response = await axios.get<JiraProject>(
            this.buildJiraUrl(domain.id, `3/project/${id}`),
            {
              headers: { Authorization: `Bearer ${this.token}` },
              params: { expand: "issueTypes,roles" },
            },
        );
        return {
          ...response.data,
          domain: domain,
        }
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          throw new Error(`Something went wrong while retrieving project ${id} in domain ${domain.id}: ${error.response?.data?.errorMessages.join(', ')}`)
        } else {
          throw new Error(`Something went wrong while retrieving project ${id} in domain ${domain.id}: ${error.message}`)
        }
      }
    }

    /**
     * Retrieves a Jira project by its ID.
     * @param projectId - Jira project ID
     * @returns A JiraProject object or null if failed
     */
    async getProjectById(projectId: string): Promise<JiraProject | null> {
      const projects = this.projects.length != 0 ? this.projects : await this.getProjects();
      const project = projects.find((p) => p.id == projectId);
      if (!project) {
        throw new Error(`Project ${projectId} not found`);
      }
      return this.getFullProject(project.domain, project.id);
    }

    /**
     * Retrieves a Jira project by its name.
     * @param projectName - Jira project name
     * @returns A JiraProject object or null if failed
     */
    async getProjectByName(projectName: string): Promise<JiraProject | null> {
      const projects = await this.getProjects();
      const project = projects.find((p) => p.name === projectName);
      if (!project) {
        throw new Error(`Project ${projectName} not found`);
      }
      return this.getFullProject(project.domain, project.id);
    }

    /**
     * Retrieves project members for a given Jira project.
     * @param project - Jira project object
     * @returns An array of JiraShortUser objects
     */
    async getProjectMembers(project: JiraProject): Promise<{ accountId: string, displayName: string }[]> {
        const members: { accountId: string, displayName: string }[] = [];

        const allowedRoles = ["Member", "Administrator", "Developer"];

        for (const role of Object.values(project.roles)) {
            try {
                const response = await axios.get<{
                    name: string,
                    description: string,
                    actors: { displayName: string, actorUser: { accountId: string } }[],
                }>(
                    role,
                    {
                        headers: {Authorization: `Bearer ${this.token}`},
                    },
                );
                if (!allowedRoles.includes(response.data.name)) {
                    continue;
                }
                for (const actor of response.data.actors) {
                    members.push({
                        accountId: actor.actorUser.accountId,
                        displayName: actor.displayName
                    });
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    throw new Error(`Something went wrong while retrieving project ${project.key} members: ${error.response?.data?.errorMessages.join(', ')}`);
                } else {
                    throw new Error(`Something went wrong while retrieving project ${project.key} members: ${error.message}`);
                }
            }
        }
        return members;
    }

    /**
     * Retrieves a Jira user by their domain and email.
     * @param domainId - Jira domain ID
     * @param email - User email
     * @returns A JiraShortUser object or null if failed
     */
    async getUserByDomainAndEmail(domainId: string, email: string): Promise<JiraShortUser> {
        try {
        const response = await axios.get<JiraShortUser>(
            this.buildJiraUrl(domainId, `3/user/search`),
            {
                headers: { Authorization: `Bearer ${this.token}` },
                params: { query: email },
            },
        );
        return response.data;
        } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Something went wrong while retrieving user ${email} in domain ${domainId}: ${error.response?.data?.errorMessages.join(', ')}`);
        } else {
            throw new Error(`Something went wrong while retrieving user ${email} in domain ${domainId}: ${error.message}`);
        }
        }
    }

    /**
     * Retrieves a Jira user by their email.
     * @param email - User email
     * @returns A JiraShortUser object or null if failed
     */
    async getUserByEmail(email: string): Promise<JiraShortUser | null> {
    for (const domain of this.domains) {
      try {
        return await this.getUserByDomainAndEmail(domain.id, email);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.error(`Failed to retrieve user ${email} in domain ${domain.id}: ${error.response?.data?.errorMessages.join(', ')}`);
        } else {
          console.error(`Failed to retrieve user ${email} in domain ${domain.id}: ${error.message}`);
        }
      }
    }
    return null;
  }
}
