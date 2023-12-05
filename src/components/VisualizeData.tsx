import { useState } from "react";
import { weekwiseDataT } from "./GithubIssues";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";

const VisualizeData = ({
    weekWiseData: weekWiseData,
}: {
    weekWiseData: weekwiseDataT;
}) => {
    const [lock, setLock] = useState(true);

    const tableHeads = [
        "Week No:",
        "Issue Count",
        "Opened",
        "Closed",
        "Already Open",
        "Ratio (Opened/Closed)",
        "Weekly Closure Rate",
    ];

    // 2. Calculate the ratio for a week
    console.log(`Total issue: ${Object.keys(weekWiseData).length}`);

    const weekRatio = (opened: number, closed: number): number => {
        let result;
        // Avoid division by zero
        if (closed !== 0) {
            result = opened / closed;
        } else {
            result = opened;
        }
        result = parseFloat(result.toFixed(2));
        return result;
    };

    // 3. Calculate Weekly Closure Rate for a week
    const weekClosureRate = (
        opened: number,
        alreadyOpen: number,
        closed: number
    ): number => {
        let result;
        // Avoid division by zero
        const denominator = alreadyOpen + opened;
        if (denominator !== 0) {
            result = closed / denominator;
        } else {
            result = 0;
        }
        result = parseFloat(result.toFixed(2));
        return result;
    };

    // 4. Calculate Average Weekly Closure Rate

    const averageClosureRate = () => {
        let noOfWeeks = 0;
        let totalOfClosureRate = 0;

        let result;
        Object.keys(weekWiseData).map((week) => {
            totalOfClosureRate += weekClosureRate(
                weekWiseData[week].opened,
                weekWiseData[week].alreadyOpen,
                weekWiseData[week].closed
            );

            noOfWeeks += 1;
        });
        if (noOfWeeks != 0) {
            result = totalOfClosureRate / noOfWeeks;
            result = parseFloat(result.toFixed(2));
            return result;
        }
        return "N/A";
    };

    return (
        <div>
            <div className="flex justify-center items-center card mb-3 gap-10">
                <div className="font-bold items-center">Weekwise Issues</div>
                <button
                    type="button"
                    className="chip gap-2 flex"
                    onClick={(e) => setLock((prev) => !prev)}
                >
                    Cap table length to lastest 10 weeks{" "}
                    {!lock ? (
                        <LockOpenIcon className="h-5" />
                    ) : (
                        <LockClosedIcon className="h-5" />
                    )}
                </button>
            </div>
            <div>
                <table className="min-w-full bg-white border border-gray-300 border-r">
                    <thead className="rounded-t">
                        <tr className="rounded-t">
                            {tableHeads.map((head) => (
                                <th key={head} className="table-head">
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="">
                        {Object.keys(weekWiseData)
                            .slice(lock ? -10 : 0)
                            .map((week) => (
                                <tr key={week} className="border-b">
                                    <td className="table-cell">{week}</td>
                                    <td className="table-cell">
                                        {weekWiseData[week].count}
                                    </td>
                                    <td className="table-cell">
                                        {weekWiseData[week].opened}
                                    </td>
                                    <td className="table-cell">
                                        {weekWiseData[week].closed}
                                    </td>
                                    <td className="table-cell">
                                        {weekWiseData[week].alreadyOpen}
                                    </td>
                                    <td className="table-cell">
                                        {weekRatio(
                                            weekWiseData[week].opened,
                                            weekWiseData[week].closed
                                        )}
                                    </td>
                                    <td className="table-cell">
                                        {weekClosureRate(
                                            weekWiseData[week].opened,
                                            weekWiseData[week].alreadyOpen,
                                            weekWiseData[week].closed
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                <div className="m-3 px-4 flex justify-center items-center">
                    <div className="chip">
                        Average Weekly Closure rate (maxWeeks):{" "}
                        {averageClosureRate()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualizeData;
