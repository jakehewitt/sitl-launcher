import { useState, useEffect } from 'react';
import { useAuth0 } from "../utils/react-auth0-spa";

export default function useInstanceList(friendID) {
  const [instanceList, setInstanceList] = useState(null);
  const { getTokenSilently } = useAuth0();

  useEffect(() => {
    async function callApi() {
      try {
        const token = await getTokenSilently();
        const response = await fetch("/api/sitl", { headers: { Authorization: `Bearer ${token}` }});
        const responseData = await response.json();
        setInstanceList(responseData);
      } catch (error) {
        console.error(error);
      }
    }
    callApi();
  }, [getTokenSilently])

  return instanceList;
}
