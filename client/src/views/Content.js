import React from "react";
import {Typography, Container} from '@material-ui/core';
import { useAuth0 } from "../utils/react-auth0-spa";
import Loading from "../components/Loading";
import StartInstance from "../components/StartInstance";
import InstanceList from "../components/InstanceList";

const Content = () => {
  const { loading } = useAuth0();

  if (loading) return <Loading variant='component'/>

  return (
    <Container maxWidth="lg">
      <Typography variant="h5">Add New SITL Instance</Typography>
      <StartInstance/>
      <Typography variant="h5">Instance List</Typography>
      <InstanceList />
    </Container>
  );
};

export default Content;