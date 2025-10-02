import MatchCard from "@/components/MatchCard";
import { Match } from "@/types/match";

export default function MatchList({
  matches,
  showScores = false,
}: {
  matches: Match[];
  showScores?: boolean;
}) {
  if (!matches || matches.length === 0)
    return <div className="card">لا توجد مباريات</div>;
  return (
    <div className="grid gap-3">
      {matches.map((m: Match) => (
        <MatchCard key={m._id} m={m} showScores={showScores} />
      ))}
    </div>
  );
}
