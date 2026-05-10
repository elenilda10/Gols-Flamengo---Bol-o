import UserProfileClient from "./user-profile-client"

export default async function UserPage({
  params,
}: {
  params: Promise<{ uid: string }>
}) {
  const { uid } = await params

  return <UserProfileClient uid={uid} />
}
