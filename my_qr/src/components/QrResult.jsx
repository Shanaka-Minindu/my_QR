import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const QrResult = () => {
  const { id } = useParams();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      autoRedirect();
    }
  }, [initialized]);

  const autoRedirect = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/autoRedirect/" + id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const interval = 0;
      if (data.results.advertisements) {
        interval = 5000;
      }
      console.log(data.results.advertisements);
      setTimeout(() => {
        window.location.href = data.results.url;
      }, interval);
    } catch (err) {
      console.log(err);
    }
  };

  return <h1>AD page</h1>;
};

export default QrResult;
