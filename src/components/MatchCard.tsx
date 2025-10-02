import { Match } from "@/types/match";

export default function MatchCard({
  m,
  showScores = false,
}: {
  m: Match;
  showScores?: boolean;
}) {
  return (
    <article className="card flex items-center gap-4">
      <div className="flex-1">
        <div className="text-lg font-medium">
          {m.team1?.name} - {m.team2?.name}
        </div>
        <div className="text-sm text-gray-600">
          {new Date(m.date).toLocaleString("ar-EG")}
        </div>
      </div>
      {showScores &&
      (typeof m.scoreTeam1 === "number" || typeof m.scoreTeam2 === "number") ? (
        <div className="text-xl font-bold">
          {m.scoreTeam1 ?? "-"} : {m.scoreTeam2 ?? "-"}
        </div>
      ) : null}
    </article>
  );
}
