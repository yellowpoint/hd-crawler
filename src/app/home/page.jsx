import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/google', { replace: true });
  }, []);

  return (
    <main className="relative flex h-full flex-col items-center justify-center"></main>
  );
}
