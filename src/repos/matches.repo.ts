import { client } from "@/lib/sanity";
import { Match } from "@/types/match";

export const getMatches = async () => {
  const query = `{
  "nextMatch": *[_type == "match" && date > now()] | order(date asc)[0]{..., "image": image.asset->url, "team1": team1->, "team2": team2->},
  "futureMatches": *[_type == "match" && date > now()] | order(date asc)[1..6]{..., "image": image.asset->url, "team1": team1->, "team2": team2->},
  "pastMatches": *[_type == "match" && date < now()] | order(date desc)[0..6]{..., "image": image.asset->url, "team1": team1->, "team2": team2->}
}`;
  const data = await client.fetch<{
    nextMatch: Match;
    futureMatches: Match[];
    pastMatches: Match[];
  }>(query);
  return data;
};
