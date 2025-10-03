export interface Match {
  _id: string;
  name: string;
  date: string;
  team1: {
    _id: string;
    name: string;
    logo: string;
  };
  team2: {
    _id: string;
    name: string;
    logo: string;
  };
  image: string;
  scoreTeam1: number;
  scoreTeam2: number;
}
