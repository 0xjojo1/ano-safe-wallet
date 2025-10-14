export default async function AccountPage({ params }: { params: Promise<{ account: string }> }) {
  const { account } = await params;
  return (
    <div>
      <h1>Account: {account}</h1>
    </div>
  );
}
