// src/app/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const cookieStore = cookies();
  const isLoggedIn = (await cookieStore).get('loggedIn')?.value === 'true';

  if (!isLoggedIn) {
    redirect('/login');
  }
  redirect('/dashboard'); // or '/admin/dashboard' if preferred
}

