// src/lib/usePosts.js
// One published article (or blog) by slug, for the public article page.
// Pass null to do nothing. `loading` is true only while nothing can be shown yet.
import { useEffect, useState } from "react";
import { publicContentApi } from "../api/publicContent";

export function usePost(slug) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return undefined;
    }
    let alive = true;
    setPost(null);
    setLoading(true);
    publicContentApi.getOne(slug).then((p) => {
      if (alive) {
        setPost(p);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [slug]);

  return { post, loading };
}
