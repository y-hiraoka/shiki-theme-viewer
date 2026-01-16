import type { BundledLanguage, BundledTheme } from "shiki";

export const DEFAULT_THEME: BundledTheme = "github-dark";

export const DEFAULT_LANGUAGE: BundledLanguage = "typescript";

export const DEFAULT_CODE = `// Welcome to Shiki Theme Viewer!
// Edit this code to see syntax highlighting in action.

interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}

const users: User[] = [];

export { fetchUser, users };
`;
