import { useState } from 'react';
import { ii_demo_backend, createActor } from 'declarations/ii_demo_backend';
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";






function App() {
  
  let actor = ii_demo_backend;



  async function login(event) {
    event.preventDefault();
    let authClient = await AuthClient.create();
    // start the login process and wait for it to finish
    await new Promise((resolve) => {
        authClient.login({
            identityProvider:
                process.env.DFX_NETWORK === "ic"
                    ? "https://identity.ic0.app"
                    : `http://be2us-64aaa-aaaaa-qaabq-cai.localhost:4943`,
            onSuccess: resolve,
        });
    });
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });
    actor = createActor(process.env.CANISTER_ID_II_DEMO_BACKEND, {
        agent,
    });
    return false;
  };

  async function logOut()  {

      const authClient = await AuthClient.create();
      await authClient.logout();

  }

  return (
    <>
    
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      <h1>Internet Identity Integration Demo</h1>
      
      <button onClick={login}>Login</button>
      <button onClick={logOut}>Logout</button>
      <br />
  

      
      

      
      
      <br />
      
      

      
      
    </main>
    </>
  );
}

export default App;
