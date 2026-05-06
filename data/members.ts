export type ClubMember = { id: number; name: string; role: string; group: 'core'|'technical'|'design'|'operations'; avatar: string | null; github: string; linkedin: string; };
export type Pod = { id: 'technical'|'design'|'operations'; name: string; leadName: string; memberIds: number[]; };

const names = Array.from({ length: 26 }, (_, i) => `Member ${String(i + 1).padStart(2, '0')}`);
export const members: ClubMember[] = names.map((name, i) => {
  const n = i + 1;
  const group = n <= 8 ? 'core' : n <= 14 ? 'technical' : n <= 20 ? 'design' : 'operations';
  return { id: n, name, role: `${group[0].toUpperCase()}${group.slice(1)} Contributor`, group, avatar: null, github: '#', linkedin: '#' };
});

export const pods: Pod[] = [
  { id: 'technical', name: 'Technical', leadName: 'Member 09', memberIds: members.filter((m) => m.group === 'technical').map((m) => m.id) },
  { id: 'design', name: 'Design', leadName: 'Member 15', memberIds: members.filter((m) => m.group === 'design').map((m) => m.id) },
  { id: 'operations', name: 'Operations', leadName: 'Member 21', memberIds: members.filter((m) => m.group === 'operations').map((m) => m.id) }
];

export const coreTeam = members.filter((m) => m.group === 'core');
export const getMembersByIds = (ids: number[]) => members.filter((member) => ids.includes(member.id));
