import {useRef, useState, useEffect} from "react";

function useOnMount(callback) {
  const ref = useRef();
  useEffect(() => {
    const {current} = ref;
    if(!current) {
      ref.current = callback() || (() => {});
    }
    return current;
  }, []);
}

function useAsyncCall(asyncCall) {
  const [busy, setBusy] = useState(false),
      [error, setError] = useState(null);
  return [
    async (...args) => {
      setBusy(true);
      try {
        return await asyncCall(...args);
      }catch(err) {
        setError(err);
        // throw err;
      }finally {
        setBusy(false);
      }
    },
    busy,
    error
  ];
}


function useAsyncCallImmediate(asyncCall, ...args) {
  const [busy, setBusy] = useState(true),
      [error, setError] = useState(null),
      [result, setResult] = useState(null),
      ref = useRef(),
      execute = async () => {
        if(ref.current) {
          return;
        }
        ref.current = true;
        // setBusy(true);
        try {
          const res = await asyncCall(...args);
          setResult(res);
        }catch(err) {
          setError(err);
          // throw err;
        }finally {
          setBusy(false);
        }
      };

  // setTimeout(() => {
  execute();
  // }, 1000);

  return [
    result,
    busy,
    error
  ];
}


export {
  useOnMount,
  useAsyncCall,
  useAsyncCallImmediate
};