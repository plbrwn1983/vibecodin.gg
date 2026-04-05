import { createClient } from "./server";

export async function getAuthState() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isAuthenticated: false, userVotes: new Set<string>() };
  }

  const { data } = await supabase
    .from("votes")
    .select("contribution_id")
    .eq("user_id", user.id);

  return {
    isAuthenticated: true,
    userVotes: new Set(data?.map((v) => v.contribution_id) ?? []),
  };
}
