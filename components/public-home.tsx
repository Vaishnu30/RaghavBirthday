'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Cake, Camera, ChevronDown, ChevronLeft, ChevronRight, Clock3, Heart, Image as ImageIcon, Lock, Menu, Play, Quote, Sparkles, Star, X } from 'lucide-react'

const baby = { name: 'Raghav', birthday: '20th October 2025', year: '2026', location: 'Dharashiv', parents: 'Pranjali Tambe, Amar Tambe' }

const milestones = [
  { icon: '01', title: 'You arrived', date: '20 October 2025', copy: 'Welcome to the world. You were tiny, and somehow, you filled every room.', tone: 'blue' },
  { icon: '02', title: 'Your first smile', date: '[Add date]', copy: 'The smile that changed everyone’s day. We tried everything to see it again.', tone: 'peach' },
  { icon: '03', title: 'Your first tooth', date: '[Add date]', copy: 'One tiny tooth. One very proud family. And many more on the way.', tone: 'sage' },
  { icon: '04', title: 'Your first steps', date: '[Add date]', copy: 'And suddenly, you were everywhere. The world got a little busier.', tone: 'blue' },
  { icon: '05', title: 'Your first big laugh', date: '[Add date]', copy: 'Our favorite sound. The kind of laugh that makes everyone join in.', tone: 'peach' },
  { icon: '06', title: 'Your favorite people', date: 'All year long', copy: 'The people who couldn’t stop taking pictures of you. We understand why.', tone: 'sage' },
]

const defaultGallery = [
  ['Tiny hands', 'BABY / 01', 'blue'], ['Tiny feet', 'BABY / 02', 'peach'], ['First smiles', 'BABY / 03', 'sage'], ['Family', 'FAMILY / 01', 'blue'], ['Adventures', 'ADVENTURE / 01', 'peach'], ['Mischief', 'MOMENTS / 01', 'sage'], ['Sleepy moments', 'BABY / 04', 'blue'], ['Celebrations', 'BIRTHDAY / 01', 'peach'],
]
const letters = ['From Mom', 'From Dad', 'From Grandma', 'From Grandpa', 'From Your Aunt', 'From Everyone Who Loves You']
const people = [
  ['Mom', 'Pranjali Tambe', 'Your safest place, your biggest cheerleader.'], ['Dad', 'Amar Tambe', 'Your adventure buddy from day one.'], ['Grandparents', '[Add name]', 'Already completely obsessed with you.'], ['Uncles & Aunts', '[Add names]', 'The fun people who always bring extra treats.'], ['Cousins', '[Add names]', 'Your first little team.'], ['Family friends', '[Add names]', 'A whole village cheering you on.'],
]
const ages = Array.from({ length: 18 }, (_, i) => ({ age: i + 1, year: 2026 + i }))

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => { const node = ref.current; if (!node) return; const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } }, { threshold: 0.12 }); observer.observe(node); return () => observer.disconnect() }, [])
  return { ref, visible }
}
function Reveal({ children, className = '' }: { children: React.ReactNode, className?: string }) { const { ref, visible } = useReveal(); return <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`}>{children}</div> }
function SectionHeading({ eyebrow, title, copy, light = false }: { eyebrow: string, title: string, copy: string, light?: boolean }) { return <div className={`section-heading ${light ? 'light' : ''}`}><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{copy}</p></div> }
function PhotoPlaceholder({ label, tone = 'blue', className = '' }: { label: string, tone?: string, className?: string }) { return <div className={`photo-placeholder ${tone} ${className}`}><Camera size={18} strokeWidth={1.4} /><span>{label}</span><small>Replace with photo</small></div> }

type PublicProfile = { name: string; birthday_label: string | null; location: string | null; parents: string | null }
type PublicChapter = { age: number; year: number; title: string; status: string }
type PublicPhoto = { title: string | null; category: string; public_url: string | null }

export default function Page({ initialProfile, initialChapter, initialPhotos = [] }: { initialProfile?: PublicProfile | null; initialChapter?: PublicChapter | null; initialPhotos?: PublicPhoto[] }) {
  const activeBaby = { ...baby, ...(initialProfile ?? {}), birthday: initialProfile?.birthday_label ?? baby.birthday, year: String(initialChapter?.year ?? baby.year) }
  const gallery = initialPhotos.length ? initialPhotos.map((photo, index) => [photo.category, photo.title ?? `MEMORY / 0${index + 1}`, ['blue', 'peach', 'sage'][index % 3]] as const) : defaultGallery
  const [menu, setMenu] = useState(false); const [lightbox, setLightbox] = useState<number | null>(null); const [letter, setLetter] = useState<number | null>(null); const [video, setVideo] = useState<string | null>(null); const [locked, setLocked] = useState<number | null>(null)
  const [confetti, setConfetti] = useState(false)
  return <main>
    <nav className="nav"><a className="brand" href="#home"><span>R</span><b>Raghav’s<br /><i>time capsule</i></b></a><div className={`nav-links ${menu ? 'open' : ''}`}>{[['#first-year','First year'],['#memories','Memories'],['#letters','Letters'],['#family','Family'],['#birthday','Birthday'],['#timeline','Timeline']].map(([href, label]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}</a>)} </div><button className="menu-btn" aria-label="Toggle menu" onClick={() => setMenu(!menu)}>{menu ? <X size={22}/> : <Menu size={22}/>}</button></nav>
    <section id="home" className="hero"><div className="grain"/><div className="stars"><Star size={12}/><Sparkles size={16}/><Star size={9}/></div><div className="hero-copy"><span className="chapter-pill"><span/> Chapter 01 <b>•</b> Age One</span><h1>Happy 1st<br /><em>Birthday,</em> Raghav</h1><p>One tiny human. One whole year.<br />A million little memories.</p></div><div className="hero-photo"><PhotoPlaceholder label="BABY / HERO" tone="blue"/><span className="photo-note">A year of you</span></div><a className="scroll-cue" href="#first-year">Scroll to begin <ArrowDown size={15}/></a><div className="hero-stamp">20<br /><small>OCT</small></div></section>

    <section id="first-year" className="section first-year"><Reveal><SectionHeading eyebrow="The beginning" title="Your First Year" copy="You won’t remember this year. But we’ll never forget it." /></Reveal><div className="milestone-list">{milestones.map((item, i) => <Reveal key={item.title} className="milestone-wrap"><article className={`milestone ${i % 2 ? 'reverse' : ''}`}><div className="milestone-number">{item.icon}</div><div className="milestone-visual"><PhotoPlaceholder label={`MILESTONE / 0${i + 1}`} tone={item.tone}/></div><div className="milestone-copy"><span>{item.date}</span><h3>{item.title}</h3><p>{item.copy}</p></div></article></Reveal>)}</div></section>

    <section id="memories" className="section memories"><Reveal><SectionHeading eyebrow="A visual diary" title="Little Moments" copy="Some moments were ordinary. We photographed them anyway." /></Reveal><div className="gallery">{gallery.map(([label, code, tone], i) => <button key={label} className={`gallery-item ${tone} g${i}`} onClick={() => setLightbox(i)}><PhotoPlaceholder label={code} tone={tone}/><span>{label}</span><ArrowUpRight size={16}/></button>)}</div></section>

    <section className="numbers-section"><Reveal><div className="numbers-intro"><span className="eyebrow">The year, in numbers</span><h2>A very small person<br /><em>made a very big year.</em></h2></div><div className="number-grid">{[['365','Days of being loved'],['12','Months of growing'],['∞','Smiles'],['100%','Loved']].map(([n, label]) => <div className="number" key={label}><strong>{n}</strong><span>{label}</span></div>)}</div></Reveal></section>

    <section className="section favorites"><Reveal><SectionHeading eyebrow="Right now" title="At Age One" copy="The little things that make you, you." /></Reveal><div className="favorite-grid">{[['Favorite food','[Favorite food]'],['Favorite toy','[Favorite toy]'],['Favorite song','[Favorite song]'],['Favorite person','[Favorite person]'],['Favorite expression','[Favorite expression]'],['Favorite activity','[Favorite activity]'],['Funniest habit','[Funniest habit]'],['Biggest mischief','[Biggest mischief]']].map(([a,b], i) => <div className="favorite-card" key={a}><span>0{i + 1}</span><h3>{a}</h3><p>{b}</p><div className="scribble"/></div>)}</div></section>

    <section id="letters" className="section letters"><Reveal><SectionHeading eyebrow="Words to keep" title="Letters You’ll Read Someday" copy="Maybe you won’t understand these words today. But someday, you will." /></Reveal><div className="letter-grid">{letters.map((name, i) => <button className={`letter-card ${i === 5 ? 'featured' : ''}`} key={name} onClick={() => setLetter(i)}><Quote size={20}/><span>{name}</span><small>Open letter <ArrowUpRight size={14}/></small></button>)}</div></section>

    <section className="section videos"><Reveal><SectionHeading eyebrow="From your people" title="Messages From Your People" copy="Little voices, big love, saved here for when you need them." /></Reveal><div className="video-row">{['Mom','Dad','Grandparents','Family & friends'].map((name, i) => <button className="video-card" key={name} onClick={() => setVideo(name)}><PhotoPlaceholder label={`VIDEO / 0${i + 1}`} tone={['peach','blue','sage','peach'][i]}/><span className="play"><Play size={17} fill="currentColor"/></span><div><b>{name}</b><small>{i === 2 ? 'Your biggest fans' : 'A message for you'}</small></div></button>)}</div></section>

    <section id="birthday" className="birthday-section" onMouseEnter={() => setConfetti(true)}><div className="birthday-inner"><Reveal><span className="eyebrow">The celebration</span><h2>Chapter One: <em>Your First Birthday</em></h2><p className="birthday-note">A little cake, a lot of love, and a room full of people who came just to celebrate you.</p></Reveal><div className="birthday-grid"><PhotoPlaceholder label="BIRTHDAY / CAKE" tone="peach"/><div className="birthday-details"><div><Cake size={19}/><span><b>{activeBaby.birthday}</b>Birthday date</span></div><div><Clock3 size={19}/><span><b>{activeBaby.location}</b>Birthday location</span></div><div><Heart size={19}/><span><b>[Birthday theme]</b>Birthday theme</span></div><p>Happy birthday, little one. May your life always be filled with gentle mornings, loud laughter, and people who show up for every chapter.</p></div></div>{confetti && <div className="confetti" aria-hidden="true">{Array.from({length: 16}).map((_,i)=><i key={i} style={{'--i': i} as React.CSSProperties}/>)}</div>}</div></section>

    <section id="family" className="section family"><Reveal><SectionHeading eyebrow="Your village" title="The People Who Love You" copy="It takes a village to raise a child. You already have the very best one." /></Reveal><div className="people-grid">{people.map(([role,name,copy], i) => <article className="person" key={role}><PhotoPlaceholder label={`FAMILY / 0${i + 1}`} tone={['peach','blue','sage','blue','peach','sage'][i]}/><div><h3>{role}</h3><b>{name}</b><p>{copy}</p></div></article>)}</div></section>

    <section className="locked-section"><Reveal><SectionHeading light eyebrow="A little further ahead" title="For You, Someday" copy="There are things we wrote for you that you aren’t meant to read yet." /></Reveal><div className="locked-grid">{[5,10,13,16,18].map((age, i) => <button key={age} className={`locked-card ${age === 18 ? 'special' : ''}`} onClick={() => setLocked(age)}><Lock size={18}/><span>Open when you’re <b>{age}</b></span><small>Locked with love</small></button>)}</div></section>

    <section id="timeline" className="section timeline-section"><Reveal><SectionHeading eyebrow="The story ahead" title="The Timeline of Your Life" copy="One chapter at a time. We’ll keep adding to this story." /></Reveal><div className="life-line">{ages.map(({age,year}) => <button key={age} className={`age ${age === 1 ? 'current' : ''}`} onClick={() => age !== 1 && setLocked(age)}><span>{age === 1 ? 'NOW' : `AGE ${age}`}</span><b>{year}</b></button>)}</div></section>

    <section className="closing"><div className="closing-mark"><Heart size={18} fill="currentColor"/></div><h2>And this is only<br /><em>the beginning.</em></h2><p>One day you’ll look back at this page and realize how many people were cheering for you before you even knew how to spell your own name.</p><strong>Happy 1st Birthday, Raghav. <Heart size={17} fill="currentColor"/></strong><span>Chapter 01 complete.</span></section>
    <footer><span>Made with love for {activeBaby.name}.</span><span>Chapter 01 • Age One • {activeBaby.year}</span><span>More memories coming...</span><a href="/admin">Private editor</a></footer>

    {lightbox !== null && <div className="modal" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}><button className="modal-close" aria-label="Close" onClick={() => setLightbox(null)}><X/></button><PhotoPlaceholder label={gallery[lightbox][1]} tone={gallery[lightbox][2]}/><p>{gallery[lightbox][0]} · replace this placeholder</p></div>}
    {letter !== null && <div className="modal" role="dialog" aria-modal="true" onClick={() => setLetter(null)}><button className="modal-close" aria-label="Close"><X/></button><article className="letter-paper" onClick={e => e.stopPropagation()}><span className="eyebrow">A letter</span><h2>{letters[letter]}</h2><p>Dear {activeBaby.name},</p><p>You probably won’t remember your first birthday. But we will remember everything. The way your little hands reached for us. The way your laugh filled the room. The tiny things you did that somehow became the biggest moments of our lives.</p><p>You were only one year old, but you had already taught us how much love a little person can bring into a family.</p><p>Love,<br />[NAME]</p></article></div>}
    {video && <div className="modal" role="dialog" aria-modal="true" onClick={() => setVideo(null)}><button className="modal-close" aria-label="Close"><X/></button><div className="video-modal"><PhotoPlaceholder label={`VIDEO / ${video.toUpperCase()}`} tone="blue"/><span className="play large"><Play size={24} fill="currentColor"/></span><h2>A message from {video}</h2><p>Placeholder video · add your family message here.</p></div></div>}
    {locked !== null && <div className="toast" role="status"><Lock size={16}/> Not yet. Some memories need time.<button onClick={() => setLocked(null)} aria-label="Close notification"><X size={15}/></button></div>}
  </main>
}
