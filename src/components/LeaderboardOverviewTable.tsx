import { LeaderboardOverviewTableProps } from "../types/type"; 

export default function LeaderboardOverviewTable({ 
  leaderboard = [], 
  onSelectUser, 
  selectedUserId 
}: LeaderboardOverviewTableProps) {
  // If no data is provided, show a loading state or empty message
  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="w-full bg-[#EDF0F6] p-6 rounded-lg shadow-md">
        <p className="text-center text-gray-500">No leaderboard data available</p>
      </div>
    );
  }
  
  return (
    <div className="w-full bg-[#EDF0F6] p-6 rounded-lg shadow-md">
      <div className="max-h-80 overflow-y-auto rounded-lg">
        <div className="flex justify-between font-bold px-4 py-2 bg-[#D9E0EB] sticky top-0">
          <span className="text-[#094497]">Name</span>
          <span className="text-[#094497]">Points</span>
        </div>
        {leaderboard.map((player) => (
          <div
            key={player._id}
            className={`flex justify-between px-4 py-3 border-b last:border-none cursor-pointer transition-colors hover:bg-gray-100 ${
              selectedUserId === player._id ? "bg-blue-100" : ""
            }`}
            onClick={() => onSelectUser(player)}
          >
            <span className="text-[#094497] font-medium">{player.name}</span>
            <span className="text-gray-700 font-bold">{player.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}