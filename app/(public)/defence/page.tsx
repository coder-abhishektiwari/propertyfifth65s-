import { Metadata } from "next";
import { getCommunityPosts } from "@/lib/actions/community-actions";
import { getCustomerIdentity } from "@/lib/actions/customer-actions";
import DefencePageClient from "@/components/defence/defence-page-client";

export const metadata: Metadata = {
  title: "Defence Community | Property Fifth",
  description:
    "A platform for the Indian defence community to connect, share, support and stay updated.",
};

export default async function DefencePage() {
  // Fetch posts + current user identity on the server
  const identityRes = await getCustomerIdentity();
  const customer = identityRes.success ? identityRes.customer ?? null : null;

  const postsRes = await getCommunityPosts({ customerId: customer?.id });

  const initialPosts = postsRes.success ? (postsRes.posts ?? []) : [];

  return <DefencePageClient initialPosts={initialPosts} customer={customer} />;
}