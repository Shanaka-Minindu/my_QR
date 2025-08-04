import { useEffect } from "react";
import { href, useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
const QrResult = () => {
          const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    autoRedirect();
  }, []);

  const autoRedirect = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/autoRedirect/"+ id , {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
       const data =await response.json()
 setTimeout(()=>{
     window.location.href =data.url;
    },5000)

    } catch (err) {
      console.log(err);
    }
  };

  return <>AD page</>;
};

export default QrResult;
