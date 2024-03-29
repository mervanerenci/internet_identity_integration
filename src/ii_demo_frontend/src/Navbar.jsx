import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { ii_demo_backend, createActor } from 'declarations/ii_demo_backend';
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";

export default function Navbar() {
    const [who, setWho] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    let actor = ii_demo_backend;

    async function whoAmI(event)  {
      
      event.preventDefault();
      const principal = await actor.whoami();
      console.log(principal.toString());
      setWho(principal.toString());
      
      
    }
  
  
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
      console.log(identity);
      const agent = new HttpAgent({ identity });
      console.log(agent);
      actor = createActor(process.env.CANISTER_ID_II_DEMO_BACKEND, {
          agent,
      });
      setAuthenticated(await authClient.isAuthenticated());
      return false;
    };

    const loginButton = () => {
        if (!authenticated) {
            return <Button onClick={login} color="inherit">Login</Button>
        } else {
            return <Button onClick={whoAmI} color="inherit">Who Am I</Button>
        }
    }


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Internet Identity Integration
          </Typography>
          {who}
          {loginButton()}

        </Toolbar>
      </AppBar>
    </Box>
  );
}