import fetch from "node-fetch";
import { GITHUB_API, GITHUB_USERNAME, GITHUB_TOKEN } from "../config/github.js";
import { WAKATIME_API, WAKATIME_KEY } from "../config/wakatime.js";

export const getActivity = async (req, res) => {
  try {
    const headers = {
      Authorization: `token ${GITHUB_TOKEN}`,
      "User-Agent": "Portfolio-Activity-App",
    };

    // --- 1️⃣ Fetch GitHub Profile ---
    const userResponse = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, { headers });
    const userData = await userResponse.json();

    // --- 2️⃣ Fetch GitHub Repositories (to count stars) ---
    const reposResponse = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100`, {
      headers,
    });
    const reposData = await reposResponse.json();

    const totalStars = Array.isArray(reposData)
      ? reposData.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)
      : 0;

    const githubUser = {
      username: userData.login,
      name: userData.name,
      avatar: userData.avatar_url,
      bio: userData.bio,
      location: userData.location,
      blog: userData.blog,
      followers: userData.followers,
      following: userData.following,
      public_repos: userData.public_repos,
      total_stars: totalStars,
    };

    // --- 3️⃣ Fetch GitHub Events ---
    const eventsResponse = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/events`, { headers });
    const eventsData = await eventsResponse.json();

    const githubEvents = Array.isArray(eventsData)
      ? eventsData
          .filter((e) => ["PushEvent", "PullRequestEvent", "CreateEvent"].includes(e.type))
          .slice(0, 10)
          .map((event) => ({
            type: event.type,
            repo: event.repo.name,
            date: event.created_at,
            message: event.payload?.commits?.[0]?.message || "",
            url: `https://github.com/${event.repo.name}`,
          }))
      : [];

    // --- 4️⃣ Fetch WakaTime Stats ---
    const wakatimeResponse = await fetch(
      `${WAKATIME_API}/users/current/stats/last_7_days?api_key=${WAKATIME_KEY}`
    );
    const wakatimeData = await wakatimeResponse.json();

    const wakatimeStats = wakatimeData?.data
      ? {
          total_hours: wakatimeData.data.human_readable_total,
          languages: wakatimeData.data.languages?.slice(0, 5).map((lang) => ({
            name: lang.name,
            percent: lang.percent,
            hours: lang.text,
          })),
          projects: wakatimeData.data.projects?.slice(0, 3),
        }
      : null;

    // --- 5️⃣ Combine and Respond ---
    res.json({
      github: {
        user: githubUser,
        events: githubEvents,
      },
      wakatime: wakatimeStats,
    });
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({ error: "Failed to fetch activity data" });
  }
};
