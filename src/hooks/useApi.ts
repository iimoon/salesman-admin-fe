import axios from "axios";
import {
  LoginCredentials,
  LoginResponse,
  FetchMessagesParams,
  Message,
  RewardData,
  SendMessageParams,
} from "@/types/apiTypes";
import { UpdateRewardData } from "@/components/TableLight";
const API_BASE_URL = "https://salesman-tracking-app.onrender.com";

const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000;
    return expiryTime < Date.now();
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

export const useApi = () => {
  const token = localStorage.getItem("token");

  if (token && !isTokenExpired(token)) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }

  const login = async ({
    name,
    password,
  }: LoginCredentials): Promise<string> => {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_BASE_URL}/auth/admin/login`,
        {
          name,
          password,
        }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return token;
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Login failed. Please check your credentials.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  const fetchPerformanceData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/performance/dashboard`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching performance data:", error);
    }
  };

  //Salesman API
  const fetchSalesmen = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user`);
      return response.data;
    } catch (error) {
      console.error("Error fetching salesman list:", error);
      throw new Error("Failed to fetch salesman list. Please try again.");
    }
  };

  const editSalesman = async (id: string, updatedData: object) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/user/edit/${id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error editing salesman:", error);
      throw new Error("Failed to edit salesman. Please try again.");
    }
  };

  const deleteSalesman = async (id: string) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/user/delete/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error deleting salesman:", error);
      throw new Error("Failed to delete salesman. Please try again.");
    }
  };

  //Client API
  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/client`);
      return response.data;
    } catch (error) {
      console.error("Error fetching client list:", error);
      throw new Error("Failed to fetch client list. Please try again.");
    }
  };

  const addClient = async (clientData: object) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/client`,
        clientData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error adding client:", error);
      throw new Error("Failed to add client. Please try again.");
    }
  };

  const editClient = async (id: string, updatedData: object) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/client/${id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error editing client:", error);
      throw new Error("Failed to edit client. Please try again.");
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/client/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error deleting client:", error);
      throw new Error("Failed to delete client. Please try again.");
    }
  };

  //products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product list:", error);
      throw new Error("Failed to fetch product list. Please try again.");
    }
  };

  const addProduct = async (productData: object) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/products`,
        productData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error adding product:", error);
      throw new Error("Failed to add product. Please try again.");
    }
  };

  const editProduct = async (id: string, updatedData: any) => {
    try {
      const { name, price, stock } = updatedData;
      const cleanData = { name, price, stock };

      const response = await axios.put(
        `${API_BASE_URL}/api/products/${id}`,
        cleanData
      );

      return response.data;
    } catch (error: any) {
      console.error("Error editing product:", error.response?.data || error);
      throw new Error("Failed to edit product. Please try again.");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/products/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to delete product. Please try again.");
    }
  };

  //attendance
  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/attendance`);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to fetch attendance,try again");
    }
  };

  //tasklist
  const fetchTask = async () => {
    try {
      const respose = await axios.get(`${API_BASE_URL}/api/task`);
      return respose.data;
    } catch (error) {
      console.error("Error fetching task:", error);
      throw new Error("Failedto fetch tasks");
    }
  };

  const addTask = async (taskData: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/task`, taskData);
      console.log("Task added successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding task:", error);
      throw new Error("Failed to add task");
    }
  };

  //leaderboard
  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/leaderboard`);
      return response.data;
    } catch (error) {
      console.error("Error fetching leaderboard data.");
    }
  };

  //messages
  const fetchMessages = async ({
    senderId,
    receiverId,
  }: FetchMessagesParams): Promise<Message[]> => {
    try {
      const response = await axios.get<Message[]>(
        `${API_BASE_URL}/api/messages/getmsg`,
        {
          params: { senderId, receiverId },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return []; // Remove unreachable `return` after `throw`
    }
  };

  const sendMessage = async (messageData: SendMessageParams) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/messages/sendmsg`,
        messageData
      );
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  //rewards
  const addReward = async (rewardData: RewardData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/rewards`,
        rewardData
      );
      return response.data;
    } catch (error) {}
  };

  const getReward = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/rewards`);
      return response.data;
    } catch (error) {
      console.error("Error fetching rewards", error);
    }
  };

  const updateReward = async (
    rewardId: string,
    rewardData: UpdateRewardData
  ): Promise<any> => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/rewards/update/${rewardId}`,
        rewardData
      );
    } catch (error) {
      console.error("Error updating reward",error);
    }
  };

  const deleteReward = async (id:string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/rewards/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting reward", error);
    }
  };

  //redeem
  const getRedeemedRewards = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/redeem`);
      return response.data;
    } catch (error) {
      console.error("Error fetching redeemed rewards:", error);
      throw error;
    }
  };

  const approveReward = async (id:string) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/redeem/approve/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error approving reward:", error);
      throw error;
    }
  };

  const rejectReward = async (id:string) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/redeem/reject/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error rejecting reward:", error);
      throw error;
    }
  };

  //reports
  const generalReport = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/performance/dashboard`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching General Report");
    }
  };

  const rewardReports = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/redeem/reports`);
      return response.data;
    } catch (error) {
      console.error("Error fetching General Report");
    }
  };

  //orders

  const getOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/order`);
      return response.data;
    } catch (error) {
      console.error("Error fetching General Report");
    }
  };

  const editOrder = async (orderId:string, orderData:any) => {
    try {
      console.log(orderId)
      console.log(orderData)
      const response = await axios.put(
        `${API_BASE_URL}/api/order/editOrder/${orderId}`,
        orderData
      );
      return response.data;
    } catch (error) {
      console.error("Error editing order");
    }
  };

  const deleteOrder = async (orderId:string) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/order/${orderId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting order");
    }
  };

  //returns
  const getReturns = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/return`);
      return response.data;
    } catch (error) {
      console.error("Error deleting order");
    }
  };

  const approveReturn = async (id:string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/return/approve/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting order");
    }
  };

  const rejectReturn = async (id:string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/return/reject/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting order");
    }
  };

  return {
    login,
    logout,
    fetchPerformanceData,

    //salesman
    fetchSalesmen,
    editSalesman,
    deleteSalesman,

    //client
    fetchClients,
    addClient,
    editClient,
    deleteClient,

    //products
    fetchProducts,
    addProduct,
    editProduct,
    deleteProduct,

    //attendance
    fetchAttendance,

    //task
    fetchTask,
    addTask,

    //leaderboard
    fetchLeaderboard,

    //messages
    fetchMessages,
    sendMessage,

    //rewards
    addReward,
    getReward,
    updateReward,
    deleteReward,

    //redeem
    getRedeemedRewards,
    approveReward,
    rejectReward,

    //performance analytics
    generalReport,
    rewardReports,

    //orders
    getOrders,
    editOrder,
    deleteOrder,

    //returns
    getReturns,
    approveReturn,
    rejectReturn,
  };
};
