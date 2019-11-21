import React from "react";
import {Typography, Container} from '@material-ui/core';
import { useAuth0 } from "../utils/react-auth0-spa";
import Loading from "../components/Loading";
import StartInstance from "../components/StartInstance";
import InstanceList from "../components/InstanceList";
import {useInstanceList} from "../utils/hooks";

const Content = () => {
  const { loading } = useAuth0();
  const instances = useInstanceList()


  if (loading) return <Loading variant='component'/>

  return (
    <Container maxWidth="lg">
      <Typography variant="h5">Add New SITL Instance</Typography>
      <StartInstance instances={instances}/>
      <Typography variant="h5">Instance List</Typography>
      <InstanceList instances={instances}/>
    </Container>
  );
};

export default Content;