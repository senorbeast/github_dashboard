import React, { useState } from "react";
import { Issue } from "./GithubIssues";

const SortedTable = ({ issues }: { issues: Issue[] }) => {
    const [sortDirection, setSortDirection] = useState("asc");

    // Function to sort issues based on a specified property and sort direction
    const sortIssues = (property: keyof Issue) => {
        const sortedIssues = [...issues].sort((a, b) => {
            const aValue = a[property];
            const bValue = b[property];

            if (sortDirection === "asc") {
                return aValue! > bValue! ? 1 : -1;
            } else {
                return aValue! < bValue! ? 1 : -1;
            }
        });

        return sortedIssues;
    };

    // Handler for changing sort direction
    const handleSortToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    const sortedIssues = sortIssues("created_at");

    return (
        <div className="" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-lg gap-5 flex mb-10 items-center justify-center">
                Sorted Issues Table
                <button
                    type="button"
                    onClick={handleSortToggle}
                    className="button px-2 py-1 items-center justify-center"
                >
                    {sortDirection === "desc" ? "▼" : "▲"}
                </button>
            </h2>
            <table className="border-b">
                <thead>
                    <tr className="">
                        <th className="table-head">Issue Number</th>
                        <th className="table-head">Title</th>
                        <th className="table-head">Created At</th>
                        <th className="table-head">Last Updated</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedIssues.map((issue) => (
                        <tr key={issue.id} className="border-b">
                            <td className="table-cell">
                                <a
                                    href={issue.html_url}
                                    className="text-blue-400"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {issue.number}
                                </a>
                            </td>
                            <td className="whitespace-normal w-1/2">
                                {issue.title}
                            </td>
                            <td className="table-cell">
                                {new Date(issue.created_at).toLocaleString()}
                            </td>
                            <td className="table-cell">
                                {new Date(issue.updated_at).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SortedTable;
