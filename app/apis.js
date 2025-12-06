export async function getProducts() {
  // Fixed URL - removed double slash
  const apiUrl =
    "https://products.qikink.com/assetsroot/admin/mockups/all_products.json";
  
  // Try multiple CORS proxy options as fallback
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(apiUrl)}`,
  ];


  // Try each proxy until one works
  for (let i = 0; i < proxies.length; i++) {
    try {
      const response = await fetch(proxies[i], {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn(`Proxy ${i + 1} failed:`, error.message);
      
      // If this is the last proxy, throw the error
      if (i === proxies.length - 1) {
        throw new Error(
          `All CORS proxies failed. Last error: ${error.message}. Please check your network connection or try again later.`
        );
      }
      // Otherwise, try the next proxy
      continue;
    }
  }
}
