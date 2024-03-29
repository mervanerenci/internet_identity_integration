import { useState, useEffect } from 'react';
import { ii_demo_backend, createActor } from 'declarations/ii_demo_backend';
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import Posts from './Posts.jsx';
import Navbar from './Navbar.jsx';
import Button from '@mui/material/Button';




function App() {
  const [who, setWho] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  let actor = ii_demo_backend;

  async function whoAmI(event)  {
    
    event.preventDefault();
    const principal = await actor.whoami();
    console.log(principal.toString());
    setWho(principal.toString());
    
    
  }

  const authClientPromise = AuthClient.create();


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

      const authClient = await authClientPromise;
      await authClient.logout();

  }

  return (
    <>
    <Navbar />
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      <h1>Internet Identity Integration Demo</h1>
      
      <Button variant="contained" onClick={login}>Login</Button>
      <Button variant="outlined" color="secondary"  onClick={logOut}>Logout</Button>
      <br />
  
      <Button variant="contained" onClick={whoAmI}>Click To See Principal ID!</Button>
      {/* PRINCIPAL ID/ WHO */}

      <h6>This is your Principal ID:</h6>

      <h5>{who}</h5>
      

      
      <Posts />
      <br />
      
      

      
      
    </main>
    </>
  );
}

export default App;
