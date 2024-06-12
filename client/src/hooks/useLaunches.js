import { useCallback, useEffect, useState } from "react";

import {
  httpGetLaunches,
  httpPaginateLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
} from './requests';

function useLaunches(onSuccessSound, onAbortSound, onFailureSound) {
  const [launches, saveLaunches] = useState([]);
  const [isPendingLaunch, setPendingLaunch] = useState(false);

  const getLaunches = useCallback(async () => {
    const fetchedLaunches = await httpGetLaunches();
    saveLaunches(fetchedLaunches);
  }, []);

  const paginateLaunches = useCallback(async ({page, limit}) => {
    const fetchedLaunches = await httpPaginateLaunches({page, limit});
    return fetchedLaunches
  }, []);

  useEffect(() => {
    getLaunches();
  }, [getLaunches]);

  const submitLaunch = useCallback(async (e) => {
    e.preventDefault();
    setPendingLaunch(true);
    const data = new FormData(e.target);
    const launchDate = new Date(data.get("launch-day"));
    const mission = data.get("mission-name");
    const rocket = data.get("rocket-name");
    const target = data.get("planets-selector");
    const response = await httpSubmitLaunch({
      launchDate,
      mission,
      rocket,
      target,
    });

    const success = response.ok;
    if (success) {
      // getLaunches();
      setTimeout(() => {
        setPendingLaunch(false);
        onSuccessSound();
      }, 800);
    } else {
      onFailureSound();
    }
  }, [ onSuccessSound, onFailureSound]);

  const abortLaunch = useCallback(async (id) => {
    const response = await httpAbortLaunch(id);

    const success = response.ok;
    if (success) {
      getLaunches();
      onAbortSound();
    } else {
      onFailureSound();
    }
  }, [getLaunches, onAbortSound, onFailureSound]);

  return {
    launches,
    isPendingLaunch,
    paginateLaunches,
    submitLaunch,
    abortLaunch,
  };
}

export default useLaunches;