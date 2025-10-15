import dotenv from "dotenv";
dotenv.config();

export const GITHUB_API = "https://api.github.com";
export const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
