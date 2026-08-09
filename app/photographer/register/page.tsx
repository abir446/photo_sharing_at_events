import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from 'next/navigation';
import RegisterClient from './RegisterClient';

export default async function Page() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  
  if (!(await isAuthenticated())) {
    redirect('/api/auth/login?post_login_redirect_url=/photographer/register');
  }

  const user = await getUser();
  if (!user || !user.email) {
    redirect('/api/auth/login?post_login_redirect_url=/photographer/register');
  }

  return (
    <RegisterClient 
      defaultName={user.given_name ? `${user.given_name} ${user.family_name || ''}`.trim() : ""}
      defaultEmail={user.email} 
    />
  );
}
