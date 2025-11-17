import type { Provider } from "@supabase/supabase-js";
import { getSupabaseClient } from "./client";
import type { Database } from "../database.types";

// Re-export client
export const supabaseClient = getSupabaseClient();

// Tipo correto vindo direto do Supabase
type UserInsert = Database["public"]["Tables"]["users"]["Insert"];

// -----------------------------
// Types
// -----------------------------
export type AuthFormData = {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  userType?: string;
};

// -----------------------------
// SIGN UP
// -----------------------------
export async function signUp(formData: AuthFormData) {
  console.log("[Auth] Attempting to SIGN UP", {
    email: formData.email,
    name: formData.name,
  });

  const { email, password, name, phone, userType } = formData;

  try {
    // 1️⃣ Criar usuário no Auth
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    let userId = authData?.user?.id ?? null;

    // 2️⃣ Se já existe → login automático
    if (authError?.message === "User already registered") {
      console.warn("[Auth] User exists — logging in…");

      const { data: loginData, error: loginError } =
        await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) throw new Error(loginError.message);
      userId = loginData.user?.id ?? null;
    } else if (authError) {
      throw new Error(authError.message);
    }

    if (!userId) throw new Error("Could not determine user ID");

    console.log("[Auth] Auth user ready:", userId);

    // 3️⃣ Upsert no perfil
    const profile: UserInsert = {
      auth_id: userId,
      email,
      name: name || "",
      phone: phone || "",
      user_type: userType || "quality-user",
    };

    const { error: upsertError } = await supabaseClient
      .from("users")
      .upsert(profile, { onConflict: "auth_id" });

    if (upsertError) {
      console.error("[Auth] Profile upsert error:", upsertError);
      throw new Error(upsertError.message);
    }

    console.log("[Auth] Profile saved successfully");

    return { user: { id: userId } };
  } catch (error) {
    console.error("[Auth] SIGNUP fatal error:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown signup error");
  }
}

// -----------------------------
// SIGN IN
// -----------------------------
export async function signIn(formData: AuthFormData) {
  console.log("[Auth] Attempting to SIGN IN", {
    email: formData.email,
  });

  const { email, password } = formData;

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    if (!data.user) return data;

    const userId = data.user.id;

    console.log("[Auth] Signed in:", userId);

    // 1️⃣ Verificar se perfil existe
    const { data: profileExists } = await supabaseClient
      .from("users")
      .select("auth_id")
      .eq("auth_id", userId)
      .maybeSingle();

    // 2️⃣ Criar perfil caso não exista
    if (!profileExists) {
      console.log("[Auth] Creating missing profile…");

      const meta = data.user.user_metadata;

      const newUser: UserInsert = {
        auth_id: userId,
        email: data.user.email ?? "",
        name: meta?.name || data.user.email?.split("@")[0] || "Usuário",
        phone: meta?.phone || "",
        user_type: meta?.user_type || "quality-user",
      };

      const { error: upsertError } = await supabaseClient
        .from("users")
        .upsert(newUser, { onConflict: "auth_id" });

      if (upsertError) {
        console.error("[Auth] Error creating missing profile:", upsertError);
      } else {
        console.log("[Auth] Missing profile created");
      }
    }

    return data;
  } catch (err) {
    console.error("[Auth] Unexpected SIGN IN error:", err);
    throw err;
  }
}

// -----------------------------
// PROVIDERS
// -----------------------------
export async function signInWithProvider(provider: Provider) {
  console.log("[Auth] Signing in with provider", { provider });

  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw new Error(error.message);
  return data;
}

// -----------------------------
// PASSWORD RECOVERY
// -----------------------------
export async function resetPassword(email: string) {
  console.log("[Auth] Password reset for:", email);

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/redefinir-senha`,
  });

  if (error) throw new Error(error.message);
  return true;
}

export async function updatePassword(password: string) {
  console.log("[Auth] Updating password…");

  const { error } = await supabaseClient.auth.updateUser({ password });
  if (error) throw new Error(error.message);

  return true;
}

// -----------------------------
// SESSION / SIGN OUT
// -----------------------------
export async function signOut() {
  console.log("[Auth] Signing out…");

  const { error } = await supabaseClient.auth.signOut();
  if (error) throw new Error(error.message);

  try {
    localStorage.removeItem("supabase.auth.token");
  } catch {}

  return true;
}

export async function getCurrentUser() {
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) throw new Error(error.message);

  return data.session?.user ?? null;
}

export async function checkSession() {
  try {
    const { data } = await supabaseClient.auth.getSession();
    return !!data.session;
  } catch {
    return false;
  }
}
