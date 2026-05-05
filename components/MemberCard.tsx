'use client';
import { Github, Linkedin, User } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ClubMember } from '@/data/members';

export default function MemberCard({ member, onOpen }: { member: ClubMember; onOpen?: (member: ClubMember) => void }) {
  let hoverTimer: ReturnType<typeof setTimeout> | undefined;
  return (
    <motion.article
      className="rounded-xl border border-zinc-200 bg-white p-4 shadow-subtle"
      onClick={() => onOpen?.(member)}
      onMouseEnter={() => { hoverTimer = setTimeout(() => onOpen?.(member), 1000); }}
      onMouseLeave={() => hoverTimer && clearTimeout(hoverTimer)}
      whileHover={{ y: -4 }}
    >
      <div className="aspect-square rounded-xl bg-[var(--accent-light)] flex items-center justify-center">
        <User className="h-12 w-12 text-[var(--accent)]" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[var(--heading)]">{member.name}</h3>
      <p className="font-mono text-xs text-[var(--muted)]">{member.role}</p>
      <div className="mt-4 flex gap-2">
        {[{Icon: Github, href: member.github, label: 'GitHub'}, {Icon: Linkedin, href: member.linkedin, label: 'LinkedIn'}].map(({Icon, href, label}) => (
          <a key={label} href={href} className="rounded-xl border border-zinc-200 p-2 transition-transform hover:scale-[1.06]" aria-label={label}><Icon className="h-4 w-4" /></a>
        ))}
      </div>
    </motion.article>
  );
}
