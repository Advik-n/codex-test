'use client';

import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import MemberCard from '@/components/MemberCard';
import { coreTeam, getMembersByIds, pods, type ClubMember } from '@/data/members';

export default function MembersPage() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const podRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 40, damping: 15 });
  const opacity = useTransform(smooth, [0, 1], [1, reduce ? 1 : 0]);
  const scale = useTransform(smooth, [0, 1], [1, reduce ? 1 : 0.95]);
  const blur = useTransform(smooth, [0, 1], ['blur(0px)', reduce ? 'blur(0px)' : 'blur(4px)']);
  const spacing = useTransform(smooth, [0, 1], ['0.18em', reduce ? '0.18em' : '0.02em']);
  const { scrollY } = useScroll();
  const ringRotation = useTransform(scrollY, (y) => y * 0.2);

  const [loaded, setLoaded] = useState(false);
  const [activeMember, setActiveMember] = useState<ClubMember | null>(null);
  const [activePod, setActivePod] = useState<string | null>(null);
  useEffect(() => { const timer = setTimeout(() => setLoaded(true), 1500); return () => clearTimeout(timer); }, []);

  const selectedPod = useMemo(() => pods.find((pod) => pod.id === activePod) ?? null, [activePod]);

  return <main className="min-h-screen">
    <AnimatePresence>{!loaded && <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--base)]" initial={{opacity:1}} exit={{opacity:0}}>
      <motion.div className="text-8xl font-bold text-[var(--accent)]" animate={{ scale: [1,1.1,1], opacity:[0.6,1,0.6] }} transition={{ duration: 1.5 }}>{'{ }'}</motion.div>
    </motion.div>}</AnimatePresence>

    <section ref={heroRef} className="h-[200vh]"><div className="sticky top-0 flex h-screen items-center justify-center px-6">
      <motion.div style={{ opacity, scale, filter: blur }} className="text-center max-w-6xl">
        <motion.h1 style={{ letterSpacing: spacing }} className="text-7xl sm:text-8xl font-black text-[var(--heading)]">ANVESHAN</motion.h1>
        <p className="mt-6 text-xl">Members Portal · AI/ML Student Club Showcase</p>
        <motion.div className="mt-12 text-4xl text-[var(--accent)]" animate={{ y:[0,10,0] }} transition={{repeat:Infinity, duration:1.2}}>{'{ }'}</motion.div>
      </motion.div></div></section>

    <section className="py-24 px-6"><div className="mx-auto max-w-6xl"><h2 className="mb-8 text-3xl font-semibold text-[var(--heading)]">Core Team</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{coreTeam.map((m)=><MemberCard key={m.id} member={m} onOpen={setActiveMember} />)}</div></div></section>

    <section ref={podRef} className="py-24 px-6" onClick={() => setActivePod(null)}><div className="mx-auto max-w-6xl"><h2 className="mb-12 text-3xl font-semibold text-[var(--heading)]">Pod Ring</h2>
      <div className="relative mx-auto h-80 w-full max-w-3xl" style={{ perspective: '1200px' }}>
        <motion.div style={{ rotateY: ringRotation, transformStyle: 'preserve-3d' }} className="relative h-full w-full">
          {pods.map((pod, i) => {
            const deg = i * 120;
            const rad = (deg * Math.PI) / 180;
            const z = Math.cos(rad);
            const isFront = z > 0.5;
            return <motion.button key={pod.id} whileHover={{ scale: 1.04 }} transition={{ type: 'spring' }}
              onClick={() => setActivePod(pod.id)} className="absolute left-1/2 top-1/2 w-48 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-200 bg-white p-6 shadow-subtle"
              style={{ transform: `rotateY(${deg}deg) translateZ(clamp(120px,25vw,240px))`, opacity: isFront ? 1 : 0.4, filter: isFront ? 'blur(0px)' : 'blur(2px)', zIndex: Math.round((z + 1) * 10), scale: isFront ? 1.2 : 0.8 }}>
              <h3 className="text-xl font-semibold text-[var(--heading)]">{pod.name}</h3><p className="font-mono text-xs text-[var(--muted)]">Lead: {pod.leadName}</p>
            </motion.button>;
          })}
        </motion.div>
      </div>
      <AnimatePresence>{selectedPod && <motion.div initial={{opacity:0,y:24,scale:0.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0}} transition={{duration:0.3}} className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 shadow-subtle" onClick={(e)=>e.stopPropagation()}>
        <button className="mb-4 inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2" onClick={() => setActivePod(null)}><ArrowLeft className="h-4 w-4"/>Back</button>
        <h3 className="text-2xl font-semibold text-[var(--heading)]">{selectedPod.name} Pod</h3><p className="font-mono text-xs text-[var(--muted)] mb-6">Lead: {selectedPod.leadName}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">{getMembersByIds(selectedPod.memberIds).map((m)=><MemberCard key={m.id} member={m} onOpen={setActiveMember} />)}</div>
      </motion.div>}</AnimatePresence>
    </div></section>

    <footer className="border-t border-zinc-200 py-24 px-6"><div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-3"><div><p className="text-sm tracking-wide text-[var(--muted)]">AI/ML CLUB · BUILD DOCUMENTATION</p></div><div><p className="font-semibold text-[var(--heading)]">Quick Links</p><a href="#">About</a><br/><a href="#">Events</a></div><div><p className="font-semibold text-[var(--heading)]">Social</p><a href="#">GitHub</a><br/><a href="#">LinkedIn</a></div></div></footer>

    <AnimatePresence>{activeMember && <motion.div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-6" onClick={() => setActiveMember(null)} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <motion.div className="rounded-xl bg-white p-6 max-w-md w-full" initial={{ scale: 0.94, y: 24 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95, y:10 }} onClick={(e) => e.stopPropagation()}>
        <h4 className="text-2xl font-semibold text-[var(--heading)]">{activeMember.name}</h4><p className="font-mono text-xs text-[var(--muted)]">{activeMember.role}</p>
      </motion.div></motion.div>}</AnimatePresence>
  </main>;
}
