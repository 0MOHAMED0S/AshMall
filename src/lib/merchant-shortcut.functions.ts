import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

const SHORTCUT_ID = "01040459460";
const SHORTCUT_PASSWORD = "13532000";
const SHORTCUT_EMAIL = "merchant01040459460@ashmoun.local";

/**
 * If the provided identifier+password match the hardcoded merchant shortcut,
 * ensure a confirmed Supabase user exists with the synthetic email and the
 * store_owner role, then return the email for the client to sign in with.
 */
export const ensureMerchantShortcut = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({
      identifier: z.string().min(1).max(100),
      password: z.string().min(1).max(200),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    if (data.identifier.trim() !== SHORTCUT_ID || data.password !== SHORTCUT_PASSWORD) {
      return { matched: false as const };
    }

    // Find existing user
    const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (listErr) throw new Error(listErr.message);
    let user = list.users.find((u) => u.email === SHORTCUT_EMAIL);

    if (!user) {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: SHORTCUT_EMAIL,
        password: SHORTCUT_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: "تاجر آش مول", intended_role: "owner" },
      });
      if (createErr) throw new Error(createErr.message);
      user = created.user!;
    } else {
      // Make sure password is in sync
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: SHORTCUT_PASSWORD,
        email_confirm: true,
      });
    }

    // Grant admin role (idempotent) — full website admin access
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: user.id, role: "admin" }, { onConflict: "user_id,role" });

    return { matched: true as const, email: SHORTCUT_EMAIL, password: SHORTCUT_PASSWORD };
  });
