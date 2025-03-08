//Login
export interface LoginCredentials {
  name: string;
  password: string;
}
export interface LoginResponse {
  token: string;
}

//messages
export interface FetchMessagesParams {
  senderId: string;
  receiverId: string;
}

export interface SendMessageParams {
  senderId: string | null;
  receiverId: string;
  message: string;
  senderType: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  senderType?: "testadmin" | "user-stas"; 
}

//rewards
export interface RewardData {
  rewardName: string;  
  pointsRequired: number;
  quantityAvailable: number;
  rewardImageURL: string | null;
}

