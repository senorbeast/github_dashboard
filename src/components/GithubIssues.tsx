"use client";

import React, { ChangeEventHandler, useEffect, useState } from "react";
import { Octokit } from "@octokit/rest";
import VisualizeData from "./VisualizeData";
import Link from "next/link";
import Modal from "./Modal";
import SortedTable from "./SortedTable";

// Define TypeScript types
export type Issue = {
    id: number;
    title: string;
    state: string;
    created_at: string;
    closed_at: string | null;
    number: number;
    html_url: string;
    updated_at: string;
    // Add other properties as needed
};

type GitHubIssuesProps = {
    repoUrl: string;
};

export type weekwiseDataT = {
    [week: string]: {
        count: number;
        opened: number;
        closed: number;
        alreadyOpen: number;
    };
};

// Function to get the ISO week number
function getISOWeek(date: Date): number {
    const dayOfWeek = date.getUTCDay() || 7; // Sunday is 7, not 0
    date.setUTCDate(date.getUTCDate() + 4 - dayOfWeek); // Set to Thursday of the current week
    const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil(
        ((date.getTime() - startOfYear.getTime()) / 86400000 + 1) / 7
    );
    return weekNumber;
}

const GitHubIssues: React.FC<GitHubIssuesProps> = ({ repoUrl }) => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [auth, setAuth] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lastWeeks, setLastWeeks] = useState(10);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const setNoOfWeeks = (e: { target: { value: any } }) => {
        let result = 10;
        result = parseInt(e.target.value);
        setLastWeeks(result);
    };

    console.log("GithubIssues rendered");

    useEffect(() => {
        // const accessToken = process.env["NEXT_PUBLIC_GITHUB_TOKEN"];

        const octokit = new Octokit({
            // auth: accessToken ? `token ${accessToken}` : undefined,
        });

        const fetchIssues = async () => {
            try {
                // Extract owner and repo from the repoUrl
                const matchResult = repoUrl.match(
                    /github\.com\/([^/]+)\/([^/?#]+)/
                );

                if (!matchResult) {
                    throw new Error("Invalid GitHub repository URL");
                }

                const [, owner, repo] = matchResult;

                const response = await octokit.issues.listForRepo({
                    owner,
                    repo,
                    state: "all",
                    per_page: 900,
                });

                setIssues(response.data);
                setLoading(false);
                setError(null);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error);
                }
                setLoading(false);
            }
        };

        if (octokit.auth.name) {
            setAuth(true);
        }

        fetchIssues();
    }, [repoUrl]);

    if (loading) {
        return (
            <div>
                <h1>GitHub Issues: {repoUrl}</h1>
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1>GitHub Issues: {repoUrl}</h1>
                Error: {error.message}
            </div>
        );
    }

    const circleClass = `w-3 h-3 rounded-full ${
        auth ? "bg-green-500" : "bg-red-500"
    }`;

    // Count opened and closed issues
    let opened = 0;
    let closed = 0;

    // Weekwise data
    const weekwiseData: weekwiseDataT = {};

    const currentDate = new Date();
    const tenWeeksAgo = new Date(
        currentDate.getTime() - (lastWeeks - 1) * 7 * 24 * 60 * 60 * 1000
    );

    issues.forEach((issue) => {
        if (issue.state === "open") {
            opened += 1;
        } else if (issue.state === "closed") {
            closed += 1;
        }
        const issueDate = new Date(issue.created_at);
        if (issueDate >= tenWeeksAgo) {
            const isoWeekNumber = getISOWeek(issueDate);
            const isoWeekKey = isoWeekNumber.toString();

            // Initialize week data if not exists
            if (!weekwiseData[isoWeekKey]) {
                weekwiseData[isoWeekKey] = {
                    count: 0,
                    opened: 0,
                    closed: 0,
                    alreadyOpen: 0,
                };
            }

            // Track week-wise issue count
            weekwiseData[isoWeekKey].count += 1;

            // Track opened and closed issues for each week
            if (issue.state === "open") {
                weekwiseData[isoWeekKey].opened += 1;
            } else if (issue.state === "closed") {
                weekwiseData[isoWeekKey].closed += 1;
            }

            // Track issues already open before the start of the week
            if (issueDate < currentDate) {
                weekwiseData[isoWeekKey].alreadyOpen += 1;
            }
        }
    });

    return (
        <div>
            <div className="flex gap-10 m-3">
                <Link className="chip" href={repoUrl} target="_blank">
                    Open Repo in new Tab
                </Link>
                {/* <div className="flex gap-3 chip">
                    Github Token Auth
                    <div className={circleClass}></div>
                </div> */}
                <div className="card justify-center items-center px-4 flex gap-3">
                    <div className="">All-time Issues:</div>
                    <div className="chip">Open: {opened}</div>
                    <div className="chip">Closed: {closed}</div>
                </div>
                <div className="flex card justify-center items-center gap-2 px-5">
                    Show Table For Last
                    <input
                        defaultValue={10}
                        onChange={setNoOfWeeks}
                        className="input w-20 justify-center flex py-2"
                    ></input>
                    Weeks
                </div>
            </div>
            <VisualizeData weekWiseData={weekwiseData}></VisualizeData>
            <button type="button" className="button" onClick={openModal}>
                List Issues
            </button>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {/* Content inside the modal */}
                <SortedTable issues={issues} />
                <div className="flex justify-center items-center">
                    <button
                        type="button"
                        className="button mt-4"
                        onClick={closeModal}
                    >
                        Close Modal
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default GitHubIssues;
