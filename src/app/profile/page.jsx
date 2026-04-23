import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ProfilePage from "./ProfilePage";

export const metadata = {
  title: "Профиль — OzElim",
  description: "Личный кабинет пользователя",
};

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main className="profile-main min-h-screen">
      <ProfilePage dbUser={user} />
    </main>
  );
}
