import { useState, useEffect } from 'react';
import { useAuth0 } from "../utils/react-auth0-spa";
import { useMessage } from "../utils/message";

export default function useInstanceList(friendID) {
  const [instanceList, setInstanceList] = useState(null);
  const { getTokenSilently } = useAuth0();
  const message = useMessage()

  useEffect(() => {
    async function callApi() {
      try {
        const token = await getTokenSilently();

        const response = await fetch("/api/sitl", { headers: { Authorization: `Bearer ${token}` }});
        if (!response.ok) throw await response.text()

        const {error, data} = await response.json();
        if (error) throw error

        setInstanceList(data)
      } catch (error) {
        if (error.includes('ECONNREFUSED')) message.error('Server not responding')
        else message.error(error)
      }
    }
    callApi();
  }, [getTokenSilently])

  return {instanceList, setInstanceList};
}
