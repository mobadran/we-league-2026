import { Match } from "@/types/match";
import Image from "next/image";

export default function NextMatch({ match }: { match: Match }) {
  if (!match) return <div className="card">لا توجد مباراة قريبة</div>;

  return (
    <div className="card flex flex-col md:flex-row items-center gap-4">
      {match.image && (
        <Image
          src={match.image.asset?.url}
          alt="banner"
          width={500}
          height={500}
          className="w-full md:w-1/3 rounded"
        />
      )}
      <div className="flex-1">
        <h1 className="text-2xl font-bold">المباراة القادمة</h1>
        <div className="mt-2 text-lg font-semibold">
          {match.team1?.name} vs {match.team2?.name}
        </div>
        <div className="mt-1 text-sm text-gray-600">
          {new Date(match.date).toLocaleString("ar-EG")}
        </div>
      </div>
    </div>
  );
}
