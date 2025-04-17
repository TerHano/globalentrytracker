const BASE_URL = "http://localhost:5145"; // Replace with your actual base URL

export async function fetchData<T = null>(
  endpoint: string,
  options: RequestInit = {
    cache: "no-cache",
  }
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }
  const data: ApiResponse<T> = await response.json();
  if (!data.success) {
    throw new Error(`Error fetching data: ${data.errorMessage}`);
  }
  return data.data as T;
}
