// api/client.ts
const API_URL = "http://172.20.10.2:3000"; // your computer IP

export async function healthCheck() {
  try {
    const res = await fetch(`${API_URL}/health`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data; // { status: "ok" }
  } catch (error) {
    console.error("Error fetching backend:", error);
    return { status: "error" };
  }
}

export async function sayHello() {
  try {
    const res = await fetch(`${API_URL}/hello`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data; // { message: "Hello from backend!" }
  } catch (error) {
    console.error("Error fetching backend:", error);
    return { message: "error" };
  }
}
