// utils/getUnsplashImage.ts

const UNSPLASH_ACCESS_KEY =
  import.meta.env.VITE_UNSPLASH_ACCESS_KEY ||
  "8nKBxIP0DNzALA_eLHtWbXJJk6rhrdhGhZuZ8eWErTI";
// or process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

export async function getUnsplashImage({ title, type = "illustrate" }) {
  try {
    // Better search query generation
    const query = type === "illustrate" ? title : title;

    const url = new URL("https://api.unsplash.com/search/photos");

    url.searchParams.set("query", query);
    url.searchParams.set("page", "1");
    url.searchParams.set("per_page", "10");
    // url.searchParams.set("orientation", "landscape");
    // url.searchParams.set("content_filter", "high");
    url.searchParams.set("order_by", "relevant");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        "Accept-Version": "v1",
      },
    });

    if (!response.ok) {
      throw new Error("Unsplash API failed");
    }

    const data = await response.json();

    const image = data?.results?.[0];

    if (!image) {
      return `https://picsum.photos/1280/720?random=${encodeURIComponent(
        title
      )}`;
    }

    // Return optimized image link
    return `${image.urls.raw}&w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80`;
  } catch (error) {
    console.error("Image fetch error:", error);

    return `https://picsum.photos/1280/720?random=${encodeURIComponent(title)}`;
  }
}
