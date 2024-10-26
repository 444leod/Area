import axios, { AxiosResponse } from "axios";

interface ReducedRepository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
  };
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  language: string | null;
  forks_count: number;
  stargazers_count: number;
  watchers_count: number;
  created_at: string;
  updated_at: string;
  visibility: string;
}

interface ReducedPullRequest {
  id: number;
  number: number;
  state: string;
  title: string;
  body: string | null;
  user: {
    id: number;
    login: string;
    avatar_url: string;
  };
  html_url: string;
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  mergeable: boolean | null;
}

export async function getRepositoryPullRequests(params: {
  owner: string;
  repo: string;
  token: string;
  since?: Date;
  state?: string;
  sort?: string;
  direction?: string;
}): Promise<ReducedPullRequest[] | null> {
  try {
    const response: AxiosResponse<ReducedPullRequest[]> = await axios.get(
      `https://api.github.com/repos/${params.owner}/${params.repo}/pulls`,
      {
        headers: {
          Authorization: `Bearer ${params.token}`,
        },
        params: {
          since: params.since?.toISOString(),
          state: params.state,
          sort: params.sort,
          direction: params.direction,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      `Error in getting repository pull requests: ${error.message}`,
    );
  }
}

export async function getUserRepositories(
  token: string,
): Promise<ReducedRepository[] | null> {
  try {
    const response: AxiosResponse<ReducedRepository[]> = await axios.get(
      "https://api.github.com/user/repos",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data as ReducedRepository[];
  } catch (error: any) {
    throw new Error(`Error in getting user repositories: ${error.message}`);
  }
}

export async function getSortedUserRepositoriesSince(
  token: string,
  since: Date,
  sortKey: string = "created",
  order: string = "asc",
): Promise<ReducedRepository[] | null> {
  try {
    const response: AxiosResponse<ReducedRepository[]> = await axios.get(
      "https://api.github.com/user/repos",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          since: since.toISOString(),
          sort: sortKey,
          direction: order,
        },
      },
    );

    return response.data as ReducedRepository[];
  } catch (error: any) {
    throw new Error(`Error in getting user repositories: ${error.message}`);
  }
}

export async function commentGithubIssue(
  token: string,
  owner: string,
  repository: string,
  issueNumber: number,
  body: string,
): Promise<void> {
  try {
    await axios.post(
      `https://api.github.com/repos/${owner}/${repository}/issues/${issueNumber}/comments`,
      { body },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error: any) {
    throw new Error(`Error in commenting on github issue: ${error.message}`);
  }
}
