export const metadata = { title: "Admin — vibecodin.gg" };

export default function AdminPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Admin Panel</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Moderator tools for managing contributions, verifying submissions, and
        hub administration. Requires hub moderator permissions.
      </p>
    </div>
  );
}
