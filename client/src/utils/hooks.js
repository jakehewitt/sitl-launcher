import { useState, useEffect } from 'react';
import { useAuth0 } from "./react-auth0-spa";
import { useMessage } from "./message";

export function useApi() {
  const { getTokenSilently } = useAuth0();
  const message = useMessage()

  const fetchData = async (url) => {
    try {
      const token = await getTokenSilently();
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }});
      const {error, data} = await response.json();
      if (error) message.error(error)
      return data
    } catch (error) {
      console.error(error)
      message.error('Server error')
      return error
    }
  }

  return {fetchData};
}

export function useInstanceList() {
  const [instanceList, setInstanceList] = useState(null);
  const { getTokenSilently } = useAuth0();
  const {fetchData} = useApi()

  useEffect(() => {
    const doThing = async () => {
      const data = await fetchData("/api/sitl")
      setInstanceList(data)
    }
    doThing()
  }, [getTokenSilently])

  return {instanceList, setInstanceList};
}

export function useLocationList() {
  const [locationList, setLocationList] = useState(null);
  const { getTokenSilently } = useAuth0();
  const {fetchData} = useApi()

  useEffect(() => {
    const doThing = async () => {
      const data = await fetchData("/api/locations")
      setLocationList(data)
    }
    doThing()
  }, [getTokenSilently])

  return {locationList, setLocationList};
}

