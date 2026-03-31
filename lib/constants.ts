export const PRESEEDED_ARTISTS = ["Josh Turner", "Tracy Lawrence", "Wiz Khalifa", "Alan Jackson"];

export const UNIVERSITY_MAP: Record<string, string> = {
  "Auburn University": "Auburn, Alabama",
  "University of Alabama": "Tuscaloosa, Alabama",
  "University of Tennessee": "Knoxville, Tennessee",
  "University of Georgia": "Athens, Georgia",
  "LSU": "Baton Rouge, Louisiana",
  "Ole Miss": "Oxford, Mississippi",
  "Vanderbilt University": "Nashville, Tennessee",
  "Mississippi State University": "Starkville, Mississippi",
  "University of Arkansas": "Fayetteville, Arkansas",
  "University of Florida": "Gainesville, Florida",
  "University of South Carolina": "Columbia, South Carolina",
  "Clemson University": "Clemson, South Carolina",
  "University of Kentucky": "Lexington, Kentucky",
  "Texas A&M University": "College Station, Texas",
};

export function resolveUniversity(input: string): string {
  if (UNIVERSITY_MAP[input]) return UNIVERSITY_MAP[input];
  // fuzzy: find closest key
  let best = "", bestScore = 0;
  const a = input.toLowerCase();
  for (const key of Object.keys(UNIVERSITY_MAP)) {
    const b = key.toLowerCase();
    const longer = Math.max(a.length, b.length);
    if (longer === 0) continue;
    const dist = levenshtein(a, b);
    const score = (longer - dist) / longer;
    if (score > bestScore) { bestScore = score; best = key; }
  }
  return bestScore >= 0.6 ? UNIVERSITY_MAP[best] : input;
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}
