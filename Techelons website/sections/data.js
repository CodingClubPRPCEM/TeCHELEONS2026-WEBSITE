export const heroSlides = [
  {
    title: 'Main Stage Nights',
    subtitle: 'Headliners, campus anthems, lights, and midnight energy.',
    badge: 'Arena',
    cta: 'See lineup',
  },
  {
    title: 'Culture + Tech',
    subtitle: 'Dance, drama, fashion, maker alleys, and gaming domes.',
    badge: 'Campus-wide',
    cta: 'Tour the map',
  },
  {
    title: 'Food & Fairs',
    subtitle: 'Pop-up kitchens, student stalls, merch drops, and chill zones.',
    badge: 'Experience',
    cta: 'Plan your walk',
  },
];

export const quickFacts = [
  { time: 'Day 1 • Gates 9 AM', title: 'Opening Carnival', detail: 'Parade, club walk-through, and campus reveal.' },
  { time: 'Day 1 • Night', title: 'Headliner Show', detail: 'Main stage lights on, all zones active.' },
  { time: 'Day 2', title: 'Workshops & Showcases', detail: 'Design, esports, film, tech demos, and arts.' },
  { time: 'Day 3 • Evening', title: 'Grand Finale', detail: 'Awards, closing notes, and afterglow social.' },
];

export const pillars = [
  { title: 'Music & Stage', blurb: 'Live bands, DJs, campus artists.', theme: 'from-neon-green/50 to-neon-cyan/40' },
  { title: 'Culture & Arts', blurb: 'Dance, drama, film, fashion.', theme: 'from-neon-pink/50 to-neon-green/40' },
  { title: 'Tech & Expo', blurb: 'Showcases, hardware labs, start-ups.', theme: 'from-neon-cyan/50 to-neon-pink/40' },
  { title: 'Gaming & Esports', blurb: 'Arenas, show matches, VR.', theme: 'from-neon-green/50 to-neon-pink/40' },
  { title: 'Food & Fairs', blurb: 'Pop-ups, chill lounges, bazaars.', theme: 'from-neon-yellow/40 to-neon-cyan/40' },
];

export const chiefGuest = {
  name: 'Chief Guest Placeholder',
  title: 'Visionary & Cultural Icon',
  note: 'Add official bio, accolades, and spotlight message here.',
  imageLabel: 'Chief Guest Photo',
};

export const legacyGuests = [
  { name: 'Guest One', role: 'Performer • 2025', note: 'Headlined closing night.', badge: '2025' },
  { name: 'Guest Two', role: 'Speaker • 2024', note: 'Inspired campus makers.', badge: '2024' },
  { name: 'Guest Three', role: 'Artist • 2023', note: 'Lit the cultural lane.', badge: '2023' },
  { name: 'Guest Four', role: 'Mentor • 2022', note: 'Guided creator labs.', badge: '2022' },
  { name: 'Guest Five', role: 'Performer • 2021', note: 'Brought the encore.', badge: '2021' },
];

export const events = [
  {
    title: '01 Main Stage Concert',
    tag: 'Music',
    level: 'Open to all',
    desc: 'Flagship night with headline acts and campus bands.',
    detail: 'Soundchecks, light rehearsals, lineup rotations, and meet zones.',
    register: 'https://forms.gle/your-form-concert',
  },
  {
    title: '02 Cultural Showdown',
    tag: 'Culture',
    level: 'Teams',
    desc: 'Dance, drama, film, and fashion walk with judges panel.',
    detail: 'Slots by audition, staging support, AV crews on standby.',
    register: 'https://forms.gle/your-form-culture',
  },
  {
    title: '03 Tech Expo Street',
    tag: 'Expo',
    level: 'Showcase',
    desc: 'Student startups, hardware builds, and interactive demos.',
    detail: 'Tables, power, and Wi-Fi available; add your deck or poster.',
    register: 'https://forms.gle/your-form-expo',
  },
  {
    title: '04 Gaming & Esports Arena',
    tag: 'Esports',
    level: 'Competitive',
    desc: 'Show matches, brackets, casters, and highlight reels.',
    detail: 'Team brackets, casters, live screens, and highlight reels.',
    register: 'https://forms.gle/your-form-esports',
  },
  {
    title: '05 Workshops & Labs',
    tag: 'Labs',
    level: 'Limited seats',
    desc: 'Design, film-making, content, robotics, and maker jams.',
    detail: 'Pre-register to lock a seat; materials list shared ahead.',
    register: 'https://forms.gle/your-form-labs',
  },
  {
    title: '06 Food Fest & Flea',
    tag: 'Fair',
    level: 'Stalls',
    desc: 'Pop-up kitchens, merch, art, and campus brands.',
    detail: 'Apply for a stall; power and tables available on request.',
    register: 'https://forms.gle/your-form-fair',
  },
];

export const gallery = Array.from({ length: 12 }, (_, i) => ({
  title: `Placeholder ${i + 1}`,
  label: 'Drop your media here',
}));
