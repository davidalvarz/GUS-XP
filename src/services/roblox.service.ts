type RobloxResolveResponse = {
  data: Array<{ id: number; name: string; displayName: string }>;
};

type RobloxThumbResponse = {
  data: Array<{ imageUrl: string }>;
};

export async function resolveRobloxUser(input: string) {
  // Acepta username o ID numérico
  const maybeId = Number(input);
  if (Number.isFinite(maybeId) && Number.isInteger(maybeId) && maybeId > 0) {
    const userRes = await fetch(`https://users.roblox.com/v1/users/${maybeId}`);
    if (!userRes.ok) return null;
    const user = await userRes.json();
    return { id: String(user.id), name: user.name as string };
  }

  const res = await fetch("https://users.roblox.com/v1/usernames/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usernames: [input],
      excludeBannedUsers: false
    })
  });

  if (!res.ok) return null;
  const data = (await res.json()) as RobloxResolveResponse;
  if (!data.data?.length) return null;

  const u = data.data[0];
  return { id: String(u.id), name: u.name };
}

export async function getRobloxAvatarHeadshot(userId: string) {
  const url = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${encodeURIComponent(
    userId
  )}&size=420x420&format=Png&isCircular=false`;

  const res = await fetch(url);
  if (!res.ok) return null;
  const json = (await res.json()) as RobloxThumbResponse;

  const first = json.data?.[0];
  return first?.imageUrl ?? null;
}
