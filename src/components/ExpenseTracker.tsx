import { Progress } from "./ui/progress";
import box from "../assets/icons/box.png"
import flowerpot from "../assets/icons/flowerpot.png"
import { Button } from "./ui/button";

export default function ExpenseTracker() {
    return (
        <div className="bg-[#F9FAFC] h-[calc(95vh-1.5rem)] p-10 w-sm rounded-tr-lg rounded-br-lg">
            <h1 className="text-center font-medium text-md text-gray-700">Where did your money go?</h1>
            <div className="items-center">
                <div className="mt-8">
                    <div className="flex justify-between  text-sm">
                        <p className="text-gray-700 font-medium">Food and Drinks</p>
                        <p className="text-gray-700">872.400</p>
                    </div>
                    <div className="mt-4">
                        <Progress
                            value={30}
                            indicatorColor="bg-[#31BA96]" />
                    </div>
                    <div className="flex justify-between mt-5 text-sm">
                        <p className="text-gray-700 font-medium">Shopping</p>
                        <p className="text-gray-700">1.378.200</p>
                    </div>
                    <div className="mt-4">
                        <Progress
                            value={40}
                            indicatorColor="bg-[#31BA96]" />
                    </div>
                    <div className="flex justify-between mt-5  text-sm">
                        <p className="text-gray-700 font-medium">Housing</p>
                        <p className="text-gray-700">928.500</p>
                    </div>
                    <div className="mt-4">
                        <Progress
                            value={30}
                            indicatorColor="bg-[#31BA96]" />
                    </div>
                    <div className="flex justify-between mt-5 text-sm">
                        <p className="text-gray-700 font-medium">Transportation</p>
                        <p className="text-gray-700">420.700</p>
                    </div>
                    <div className="mt-4">
                        <Progress
                            value={50}
                            indicatorColor="bg-[#31BA96]" />
                    </div>
                </div>
                <div className="bg-[#EDF0F6] mt-10 p-6 rounded-xl h-70 shadow-md w-72 text-center relative">
                    {/* Images Positioned on Top */}
                    <div className="flex justify-center gap-x-12 absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <img src={box} alt="Box" className="w-20 h-20" />
                        <img src={flowerpot} alt="Flowerpot" className="w-16 h-20" />
                    </div>

                    {/* Content */}
                    <div className="mt-14">
                        <h2 className="text-lg font-semibold text-gray-900">Save more money</h2>
                        <p className="text-sm text-gray-600 mt-2">
                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.
                        </p>
                        <Button className="bg-black text-white w-full mt-4">
                            View Tips
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    )
}