type RobloxUserIdResponse = {
  data: Array<{ id: number; name: string; displayName: string }>;
};

type RobloxGroupsResponse = {
  data: Array<{
    group: {
      id: number;
      name: string;
      memberCount?: number;
    };
    role: {
      id: number;
      name: string;
      rank: number;
    };
    isPrimaryGroup?: boolean;
    isOwner?: boolean;
  }>;
};

export type RobloxGroupInfo = {
  groupId: number;
  groupName: string;
  roleName: string;
  roleRank: number;
  isPrimaryGroup?: boolean;
  isOwner?: boolean;
};

function withTimeout(ms: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return { controller, timeout };
}

export async function getRobloxUserIdByUsername(username: string): Promise<number | null> {
  const url = "https://users.roblox.com/v1/usernames/users";

  const { controller, timeout } = withTimeout(6000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: true
      })
    });

    if (!res.ok) return null;

    const json = (await res.json()) as RobloxUserIdResponse;
    const first = json?.data?.[0];

    if (!first?.id) return null;
    return first.id;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getRobloxGroupsByUserId(userId: number): Promise<RobloxGroupInfo[]> {
  const url = `https://groups.roblox.com/v1/users/${userId}/groups/roles`;

  const { controller, timeout } = withTimeout(6000);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal
    });

    if (!res.ok) return [];

    const json = (await res.json()) as RobloxGroupsResponse;
    const data = json?.data ?? [];

    return data.map((x) => ({
      groupId: x.group.id,
      groupName: x.group.name,
      roleName: x.role.name,
      roleRank: x.role.rank,
      isPrimaryGroup: x.isPrimaryGroup,
      isOwner: x.isOwner
    }));
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export function robloxAvatarHeadshotUrl(userId: number) {
  // Headshot (cara) de Roblox
  return `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`;
}
