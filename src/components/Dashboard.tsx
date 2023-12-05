"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GitHubIssues from "./GithubIssues";

const Dashboard = () => {
    const [githubRepoLink, setGithubRepoLink] = useState(
        "https://github.com/TorqueGameEngines/Torque3D"
    );
    const router = useRouter();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formElements = form.elements as typeof form.elements & {
            githubRepoLink: HTMLInputElement;
        };
        setGithubRepoLink(formElements.githubRepoLink.value);
    }
    console.log("Dashboard rendered");
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-center m-5 gap-5">
                    <input
                        id="githubRepoLink"
                        placeholder="Paste Github Repo Link ..."
                        className="flex h-10 px-5 py-6 input w-9/12"
                        defaultValue={githubRepoLink}
                    ></input>
                    <button type="submit" className="px-5 button">
                        Update
                    </button>
                </div>
            </form>
            <div className="flex flex-wrap justify-center w-auto m-5 mt-8 gap-5 rounded-3xl">
                <GitHubIssues repoUrl={githubRepoLink} />
            </div>
        </>
    );
};

export default Dashboard;
