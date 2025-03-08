//order
export type Order = {
  _id?: string;
  id?: string;
  orderId?: string;
  clientId?: {
    _id: string;
    name: string;
  };
  clientName?: string;
  products?: Array<{
    productId: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  totalAmount: number;
  status: "pending" | "completed" | "cancelled";
  createdAt?: string;
  orderDate?: string;
};

//messages
export type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  createdAt?: string;
};

//leaderboard
export interface Salesman {
  _id: string;
  name: string;
  rank?:string,
  points: number;
}
export interface LeaderboardResponse {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  leaderboard: Salesman[];
}

// Props type for LeaderboardOverviewTable component
export interface LeaderboardOverviewTableProps {
  leaderboard: Salesman[];
  onSelectUser: (user: Salesman) => void;
  selectedUserId?: string | null;
}

// Edit Salesman request payload
export interface EditSalesmanPayload {
  points?: number;
  name?: string;
}

// API hooks related to leaderboard
export interface LeaderboardApiHooks {
  fetchLeaderboard: () => Promise<LeaderboardResponse>;
  editSalesman: (id: string, data: EditSalesmanPayload) => Promise<any>;
}
