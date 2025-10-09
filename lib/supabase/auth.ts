import type { Provider } from "@supabase/supabase-js"
import { getSupabaseClient } from "./client"

// Re-export the client for convenience
export const supabaseClient = getSupabaseClient()

export type AuthFormData = {
  email: string
  password: string
  name?: string
  phone?: string
  userType?: string
}

export async function signUp(formData: AuthFormData) {
  console.log("[Auth] Attempting to sign up user", { email: formData.email })
  const { email, password, name, phone, userType } = formData

  try {
    // First, create the user in authentication
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          user_type: userType,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error("[Auth] Sign up error:", error)
      throw new Error(`Authentication error: ${error.message}`)
    }

    if (!data.user) {
      throw new Error("User creation failed - no user data returned")
    }

    console.log("[Auth] User signed up successfully", { userId: data.user.id })

    // Check if the users table exists and create user profile
    try {
      const { error: tableCheckError } = await supabaseClient.from("users").select("id").limit(1)

      if (tableCheckError && tableCheckError.code === "42P01") {
        console.log("[Auth] Users table does not exist. User will be created by trigger when the table is created.")
        return data
      }

      // Create user profile in the users table
      console.log("[Auth] Creating user profile in users table")
      const { error: profileError } = await supabaseClient.from("users").insert({
        id: data.user.id,
        email,
        name: name || "",
        phone: phone || "",
        user_type: userType || "quality-user",
        created_at: new Date().toISOString(),
      })

      if (profileError) {
        if (profileError.code === "23505") {
          console.log("[Auth] User already exists in users table")
        } else {
          console.error("[Auth] Error creating user profile:", profileError)
          // Don't throw here to avoid breaking the signup flow
        }
      } else {
        console.log("[Auth] User profile created successfully")
      }
    } catch (err) {
      console.error("[Auth] Error with users table operations:", err)
      // Don't throw here to avoid breaking the signup flow
    }

    return data
  } catch (error) {
    console.error("[Auth] Unexpected error during sign up:", error)
    if (error instanceof Error) {
      throw new Error(`Database error saving new user: ${error.message}`)
    }
    throw new Error("Database error saving new user")
  }
}

export async function signIn(formData: AuthFormData) {
  console.log("[Auth] Attempting to sign in user", { email: formData.email })
  const { email, password } = formData

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("[Auth] Sign in error:", error)
      throw new Error(error.message)
    }

    console.log("[Auth] User signed in successfully", { userId: data.user?.id })

    // Check if the users table exists
    try {
      const { error: tableCheckError } = await supabaseClient.from("users").select("id").limit(1)

      // If the table doesn't exist, don't try to check or create the user
      if (tableCheckError) {
        console.error("[Auth] Table check error:", tableCheckError)
        if (tableCheckError.code === "42P01") {
          console.log("[Auth] Users table does not exist. User will be created by trigger when the table is created.")
          return data
        }
        throw tableCheckError
      }

      // Check if the user exists in the users table
      if (data.user) {
        const { data: userExists, error: userCheckError } = await supabaseClient
          .from("users")
          .select("id")
          .eq("id", data.user.id)
          .maybeSingle()

        if (userCheckError) {
          console.error("[Auth] Error checking if user exists:", userCheckError)
        }

        // If the user doesn't exist in the users table, create the record
        if (!userExists && !userCheckError) {
          console.log("[Auth] User not found in users table, creating profile")
          const { error: createError } = await supabaseClient.from("users").insert({
            id: data.user.id,
            email: data.user.email || "",
            name: data.user.user_metadata.name || data.user.email?.split("@")[0] || "Usuário",
            phone: data.user.user_metadata.phone || "",
            user_type: data.user.user_metadata.user_type || "quality-user",
          })

          if (createError) {
            if (createError.code === "23505") {
              // Ignore duplicate key error
              console.log("[Auth] User already exists in users table")
            } else {
              console.error("[Auth] Error creating user profile:", createError)
            }
          } else {
            console.log("[Auth] User profile created successfully")
          }
        } else {
          console.log("[Auth] User already exists in users table")
        }
      }
    } catch (err) {
      console.error("[Auth] Error checking or creating user:", err)
      // Don't throw the error here to not interrupt the login flow
    }

    return data
  } catch (error) {
    console.error("[Auth] Unexpected error during sign in:", error)
    throw error
  }
}

export async function signInWithProvider(provider: Provider) {
  console.log("[Auth] Attempting to sign in with provider", { provider })

  try {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error("[Auth] Provider sign in error:", error)
      throw new Error(error.message)
    }

    console.log("[Auth] Provider sign in initiated successfully")
    return data
  } catch (error) {
    console.error("[Auth] Unexpected error during provider sign in:", error)
    throw error
  }
}

export async function resetPassword(email: string) {
  console.log("[Auth] Attempting to reset password", { email })

  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })

    if (error) {
      console.error("[Auth] Password reset error:", error)
      throw new Error(error.message)
    }

    console.log("[Auth] Password reset email sent successfully")
    return true
  } catch (error) {
    console.error("[Auth] Unexpected error during password reset:", error)
    throw error
  }
}

export async function updatePassword(password: string) {
  console.log("[Auth] Attempting to update password")

  try {
    const { error } = await supabaseClient.auth.updateUser({
      password,
    })

    if (error) {
      console.error("[Auth] Password update error:", error)
      throw new Error(error.message)
    }

    console.log("[Auth] Password updated successfully")
    return true
  } catch (error) {
    console.error("[Auth] Unexpected error during password update:", error)
    throw error
  }
}

export async function signOut() {
  console.log("[Auth] Attempting to sign out user")

  try {
    const { error } = await supabaseClient.auth.signOut()

    if (error) {
      console.error("[Auth] Sign out error:", error)
      throw new Error(error.message)
    }

    console.log("[Auth] User signed out successfully")

    // Clear any local storage or cookies that might be causing issues
    try {
      localStorage.removeItem("supabase.auth.token")
    } catch (e) {
      console.log("[Auth] No localStorage available")
    }

    return true
  } catch (error) {
    console.error("[Auth] Unexpected error during sign out:", error)
    throw error
  }
}

export async function getCurrentUser() {
  console.log("[Auth] Attempting to get current user")

  try {
    const {
      data: { session },
      error,
    } = await supabaseClient.auth.getSession()

    if (error) {
      console.error("[Auth] Get session error:", error)
      throw new Error(error.message)
    }

    console.log("[Auth] Session retrieved", { exists: !!session, userId: session?.user?.id })
    return session?.user || null
  } catch (error) {
    console.error("[Auth] Unexpected error getting current user:", error)
    throw error
  }
}

// Function to check if the session is valid
export async function checkSession() {
  console.log("[Auth] Checking session validity")

  try {
    // Get session first
    const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession()

    // If there's an error getting the session, log it but don't throw
    if (sessionError) {
      console.log("[Auth] Session error (this is normal if user is not logged in):", sessionError.message)
      return false
    }

    const session = sessionData?.session

    // If no session exists, that's normal for a logged-out user
    if (!session) {
      console.log("[Auth] No session found (user is not logged in)")
      return false
    }

    // If we have a session, verify the user
    const { data: userData, error: userError } = await supabaseClient.auth.getUser()

    if (userError) {
      console.log("[Auth] User verification error:", userError.message)
      return false
    }

    const user = userData?.user
    const isValid = !!session && !!user

    console.log("[Auth] Session check complete", {
      isValid,
      hasSession: !!session,
      hasUser: !!user,
      userId: user?.id,
      sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : "unknown",
    })

    // If we have a session but it's about to expire, refresh it
    if (session && session.expires_at) {
      const expiresInSeconds = session.expires_at - Math.floor(Date.now() / 1000)
      if (expiresInSeconds < 300) {
        // Less than 5 minutes remaining
        console.log("[Auth] Session expiring soon, refreshing")
        try {
          await supabaseClient.auth.refreshSession()
        } catch (refreshError) {
          console.log("[Auth] Session refresh failed:", refreshError)
        }
      }
    }

    return isValid
  } catch (error) {
    console.log("[Auth] Unexpected error checking session (this is normal if user is not logged in):", error)
    return false
  }
}
