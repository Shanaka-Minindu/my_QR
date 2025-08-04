export const qrFunction = async (link) => {
  const data = {
    redirect_url: link,
  };

  try {
    const response = await fetch("http://localhost:3001/api/qrurl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return(response.json());
  } catch (err) {
    console.error("Error posting data:", err);
    throw err;
  }
};
