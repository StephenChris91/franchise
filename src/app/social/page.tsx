import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = { title: "Community — Franchise Church" };

export default async function SocialPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/social");
  if (session.user.approvalStatus !== "approved") redirect("/auth/pending");

  return (
    <div className="min-h-screen bg-[#1b1b1b] text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#af601a]/20 mb-6">
          <Users size={40} className="text-[#af601a]" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Franchise Community</h1>
        <p className="text-white/60 text-sm leading-relaxed mb-8">
          The community feed is coming soon. Phase 4 will bring member
          posts, prayer requests, and group conversations.
        </p>
        <Link
          href="/profile"
          className="inline-block px-6 py-3 rounded-lg bg-[#af601a] text-white font-bold text-sm hover:bg-[#c47020] transition"
        >
          View my profile
        </Link>
      </div>
    </div>
  );
}
