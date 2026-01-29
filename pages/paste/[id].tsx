"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PastePage() {
  const params = useParams();

  const id = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : null;

  const [paste, setPaste] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/pastes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPaste(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (!id) return <div>Loading...</div>;

  if (loading) return <div>Loading...</div>;

  if (!paste || paste.message) {
    return <div>Paste not found or expired</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Paste ID: {id}</h1>
      <pre>{paste.content}</pre>
      <p>Views: {paste.views}</p>
    </div>
  );
}
