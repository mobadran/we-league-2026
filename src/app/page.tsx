import { client } from "@/lib/sanity";
import NextMatch from "@/components/NextMatch";
import MatchList from "@/components/MatchList";

const query = `{
  "nextMatch": *[_type == "match" && dateTime(date) > now()] | order(date asc)[0]{..., "team1": team1->, "team2": team2->},
  "futureMatches": *[_type == "match" && dateTime(date) > now()] | order(date asc)[1..6]{..., "team1": team1->, "team2": team2->},
  "pastMatches": *[_type == "match" && dateTime(date) < now()] | order(date desc)[0..6]{..., "team1": team1->, "team2": team2->}
}`;

export default async function Page() {
  const data = await client.fetch(query);

  return (
    <div className="container mx-auto p-4">
      <NextMatch match={data.nextMatch} />

      <section className="mt-8">
        <h2 className="text-xl mb-4">مباريات قادمة</h2>
        <MatchList matches={data.futureMatches} />
      </section>

      <section className="mt-8">
        <h2 className="text-xl mb-4">نتائج سابقة</h2>
        <MatchList matches={data.pastMatches} showScores />
      </section>
    </div>
  );
}
