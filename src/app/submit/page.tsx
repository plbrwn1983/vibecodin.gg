import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SubmitForm } from "@/components/submit-form";

export const metadata = { title: "Submit a Contribution — vibecodin.gg" };

export default async function SubmitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const handle =
    user.user_metadata?.user_name ??
    user.user_metadata?.preferred_username ??
    "unknown";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Submit a Contribution
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Create a skill or agent for the vibecodin.gg community. Your submission
        will generate a GitHub pull request for review.
      </p>

      <SubmitForm author={handle} />
    </div>
  );
}
