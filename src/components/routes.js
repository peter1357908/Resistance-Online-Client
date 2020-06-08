import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Welcome from './welcome';
import JoinGame from './join-game';
import CreateGame from './create-game';
import Lobby from './lobby';
import InGame from './in-game';
import PostGame from './post-game';

const Routes = (props) => {
  return (
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route path="/join-game" component={JoinGame} />
      <Route path="/create-game" component={CreateGame} />
      <Route path="/lobby" component={Lobby} />
      <Route path="/in-game/:gameID" component={InGame} />
      <Route path="/post-game/:gameID" component={PostGame} />
      <Route render={() => (<a href="https://www.youtube.com/watch?v=_XR6dsy7ATE">Stop! You&apos;ve violated the law!</a>)} />
    </Switch>
  );
};

export default Routes;
