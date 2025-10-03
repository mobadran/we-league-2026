import NextMatch from "@/components/NextMatch";
import MatchList from "@/components/MatchList";
import { getMatches } from "@/repos/matches.repo";

export default async function Page() {
  const data = await getMatches();
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
