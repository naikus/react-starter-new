import {useRef, useState} from "react";

function useAsyncCall(asyncCall) {
  const [busy, setBusy] = useState(false),
      [error, setError] = useState(null);
  return {
    busy,
    error,
    execute: async (...args) => {
      setBusy(true);
      try {
        return await asyncCall(...args);
      }catch(err) {
        setError(err);
      }finally {
        setBusy(false);
      }
    }
  };
}


function useAsyncCallImmediate(asyncCall, ...args) {
  const [busy, setBusy] = useState(false),
      [error, setError] = useState(null),
      [result, setResult] = useState(null),
      ref = useRef(),
      execute = async () => {
        if(ref.current) {
          return;
        }
        ref.current = true;
        setBusy(true);
        try {
          const res = await asyncCall(...args);
          setResult(res);
        }catch(err) {
          setError(err);
        }finally {
          setBusy(false);
        }
      };

  execute();

  return {
    busy,
    error,
    result
  };
}


export {
  useAsyncCall,
  useAsyncCallImmediate
};