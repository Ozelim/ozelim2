import ProfilePage from "./ProfilePage";

export const metadata = {
  title: "Профиль — OzElim",
  description: "Личный кабинет пользователя",
};

export default function Page() {
  return (
    <main className="profile-main min-h-screen">
      <ProfilePage />
    </main>
  );
}
