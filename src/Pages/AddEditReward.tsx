import PageTitle from "../components/PageTitle";
import RewardForm from "../components/RewardForm";
import { useApi } from "../hooks/useApi"; 

export default function AddEditReward() {
    const { addReward } = useApi();

    return (
        <div className="bg-white h-[calc(95vh-1.5rem)] rounded-tl-lg rounded-bl-lg p-10 px-10 overflow-auto">
            <PageTitle title="Add Rewards"/>
            <div className="mt-8">
                <h1 className="text-2xl font-bold">Add New Reward</h1>
            </div>
            <div className="mt-4">
                <RewardForm onSubmit={addReward} />
            </div>
        </div>
    );
}
