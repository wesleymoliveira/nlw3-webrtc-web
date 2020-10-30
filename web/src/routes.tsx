import React from 'react';
import {Switch, Route, Redirect } from 'react-router-dom';

import {useAuth} from './contexts/auths';

import Login from './pages/Login';
import Landing from './pages/Landing';
import OrphanagesMaps from './pages/OrphanagesMap';
import Orphanage from './pages/Orphanage';
import CreateOrphanage from './pages/CreateOrphanage';
import Orphanagecreated from './pages/OrphanageCreated';


function CustomRoute({ isPrivate=false, ...rest }) {
  const { signed }= useAuth();

  if (isPrivate && !signed) {
    return <Redirect to="/login" />
  }

  return <Route {...rest} />;
}

const Routes: React.FC = () => (
    <Switch>
      <CustomRoute path="/" exact component={Landing} />
      <CustomRoute path="/login" component={Login} /> 
      <CustomRoute isPrivate path="/map" component={OrphanagesMaps} />
      <CustomRoute isPrivate path="/ok" component={Orphanagecreated} />
      <CustomRoute isPrivate path="/orphanages/create" component={CreateOrphanage} />
      <CustomRoute isPrivate path="/orphanages/:id" component={Orphanage} />
    </Switch>
);

export default Routes;