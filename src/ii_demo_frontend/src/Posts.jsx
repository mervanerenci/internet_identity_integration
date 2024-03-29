import { useEffect, useState } from 'react';
import { ii_demo_backend, createActor } from 'declarations/ii_demo_backend';
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";



function Posts() {
    const actor = ii_demo_backend;
    const [authenticated, setAuthenticated] = useState(false);
    const [postList, setPostList] = useState([]);

    async function authInit() {
        const authClient = await AuthClient.create();
        setAuthenticated(await authClient.isAuthenticated());
    }

    async function fetchPosts() {
        const posts = await actor.getPosts();
        console.log(posts);
        setPostList(posts);
    }

    useEffect(() => {
        authInit();
        fetchPosts();
    }, []);

    

    const showPosts = postList.map((post, index) => {
        if (!authenticated) {
            return (
                <div>
                    <p>Please login to see content..</p>
                </div>
            );
        }
        return (
            <div key={index}>
                <h3>{post.author.toString()}</h3>
                <p>{post.content}</p>
            </div>
        );
    });

    return (
        <div>
            {showPosts}
        </div>
    );





}

export default Posts;
