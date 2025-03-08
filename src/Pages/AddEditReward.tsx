import PageTitle from "../components/PageTitle";
import RewardForm from "../components/RewardForm";
import { useApi } from "../hooks/useApi"; 

export default function AddEditReward() {
    const { addReward } = useApi();

    return (
        <div className="bg-white h-[95vh] rounded-tl-lg rounded-bl-lg p-10 px-30 w-[1220px]">
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
