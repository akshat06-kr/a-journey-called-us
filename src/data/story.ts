export interface MemoryNote {
  title?: string;
  text: string;
  date?: string;
}

export interface PhotoComparison {
  beforePhotoUrl: string;
  beforeLabel: string;
  afterPhotoUrl: string;
  afterLabel: string;
  caption: string;
}

export interface Chapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  timeframe: string;
  milestoneName: string; // Short name for timeline
  paragraphs: string[];
  highlightQuote?: string;
  photoUrl?: string; // User supplied personal photograph
  photoCaption?: string;
  atmosphere: 'evening' | 'intimate' | 'misty-rain' | 'mountain-cool' | 'dawn-warm' | 'sunrise';
  ambientLight: string; // hex or rgb for subtle glow
  memoryNote?: MemoryNote;
  comparison?: PhotoComparison;
}

export const storyChapters: Chapter[] = [
  {
    id: 'chapter-01',
    number: '01',
    title: 'Where It Began',
    subtitle: 'The First Year & The Kho-Kho Ground',
    timeframe: 'First Year — College Grounds',
    milestoneName: 'Kho-Kho Ground',
    paragraphs: [
      'It began in the unhurried calm of our first year, in a place neither of us could have planned to be so significant — the Kho-Kho ground.',
      'Between the dust, the running, and the quiet pauses between games, a simple introduction turned into something more familiar. There was an ease in how we spoke right from the start, a natural cadence that did not need to try too hard.',
      'Neither of us knew then that this ordinary sports ground would become the opening line of a journey that would carry so many memories forward.'
    ],
    highlightQuote: 'Some of the most meaningful chapters in life start in places you least expect.',
    photoUrl: '/images/firstimage.jpeg',
    photoCaption: 'First Year — Memories from where it all started',
    atmosphere: 'evening',
    ambientLight: '#1D3B2F',
    memoryNote: {
      title: 'A Memory of That Day',
      text: 'Neither of us realized that a random college sports ground introduction would turn into the most cherished bond in my life.',
      date: 'First Year, College Grounds'
    }
  },
  {
    id: 'chapter-02',
    number: '02',
    title: 'A Friendship That Grew',
    subtitle: 'Conversations, Laughter & Shared Days',
    timeframe: 'Second Year — The Days Between',
    milestoneName: 'Growing Friendship',
    paragraphs: [
      'As days turned into semesters, conversations grew longer and comfortable silences became easy to share.',
      'We found ourselves talking about everything and nothing — the mundane college routines, shared jokes, the everyday chaos, and the thoughts people usually keep to themselves. In a crowded campus, having someone who simply listened made all the difference.',
      'Friendship wasn’t something that was announced; it was built quietly, one honest conversation and one shared laugh at a time.'
    ],
    highlightQuote: 'A quiet understanding that grew without any rush.',
    photoUrl: '/images/secondimage.jpeg',
    photoCaption: 'The comfort of having a true friend in the middle of college chaos',
    atmosphere: 'intimate',
    ambientLight: '#102A23',
    memoryNote: {
      title: 'Late Night Chats',
      text: 'Talking about everything and nothing until hours melted away. Those ordinary college days became unforgettable because you were there.',
      date: 'Second Year'
    }
  },
  {
    id: 'chapter-03',
    number: '03',
    title: 'The Conversation',
    subtitle: 'Honesty, Clarity & Mutual Respect',
    timeframe: 'A Moment of Truth',
    milestoneName: 'The Conversation',
    paragraphs: [
      'There came a moment when feelings deepened on my side, and I chose to express what was in my heart.',
      'You listened with honesty and genuine grace. You were not ready for a relationship at that time, and you communicated that clearly and respectfully. What mattered most was how we handled that moment — without bitterness, without distance, and with an enduring respect for one another.',
      'Our bond was strong enough to hold truth without breaking. We chose to protect the friendship that had brought so much warmth to our lives.'
    ],
    highlightQuote: 'True respect is when honesty strengthens a bond rather than tearing it apart.',
    photoUrl: '/images/thirdimage.jpeg',
    photoCaption: 'A quiet moment that taught us maturity and respect',
    atmosphere: 'intimate',
    ambientLight: '#091712',
    memoryNote: {
      title: 'Mutual Respect',
      text: 'The maturity and honesty you showed that day made me admire and respect who you are even more deeply. Our friendship stayed unshakable.',
      date: 'Second Year'
    }
  },
  {
    id: 'chapter-04',
    number: '04',
    title: 'The Dongargarh Journey',
    subtitle: 'The Sangathan Closing & The Rainy Ride',
    timeframe: 'Third Year — The Mountain Road',
    milestoneName: 'Dongargarh Trip',
    paragraphs: [
      'In our third year, right after the Sangathan closing ceremony, Ashish Sir gathered five of us for what would become an unforgettable bike ride to Dongargarh.',
      'The sky was heavy with monsoon clouds, and soon the rain poured down over the highways and ghats. Everything was drenched, cold, and electric with life. Through the long ride, we shared moments that etched themselves permanently into memory.',
      'There was a point when frustration and anger got the best of me on the road. But you noticed, stepped in, and with calm, patient words, brought me back to peace. It was a side of your gentleness and maturity that I will never forget.'
    ],
    highlightQuote: 'Through the winding rain and sudden anger, your presence brought calm.',
    photoUrl: '/images/fourthimage.jpeg',
    photoCaption: 'Dongargarh trip — Rain, winding roads, and unforgettable company',
    atmosphere: 'misty-rain',
    ambientLight: '#1D3B2F',
    memoryNote: {
      title: 'In the Monsoon Rain',
      text: 'When anger overtook me on that long road, you didn’t walk away. You calmly spoke to me, calmed me down, and stayed right by my side.',
      date: 'Third Year — Dongargarh Ride'
    }
  },
  {
    id: 'chapter-05',
    number: '05',
    title: 'A Different Perspective',
    subtitle: 'Seeing You In A New Light',
    timeframe: 'Reflections After the Ride',
    milestoneName: 'New Perspective',
    paragraphs: [
      'That journey changed how I looked at things. In the middle of the rain, the climbs, and the shared fatigue, I saw the depth and grace in you with complete clarity.',
      'It wasn’t just about the scenic roads or the adventure. It was about how you carried yourself, how you cared for the people around you, and how easily you could turn an uncertain moment into a grounding memory.',
      'Sometimes, you need a long road and unexpected weather to appreciate someone for who they truly are.'
    ],
    highlightQuote: 'A long road that revealed the depth of a person I thought I already knew.',
    photoUrl: '/images/fifthimage.jpeg',
    photoCaption: 'The quiet beauty of seeing someone with newfound clarity',
    atmosphere: 'mountain-cool',
    ambientLight: '#102A23',
    memoryNote: {
      title: 'Clarity on the Road',
      text: 'That trip showed me a side of your personality that I will never forget — so patient, grounding, and full of quiet grace.',
      date: 'Post-Trip Reflections'
    }
  },
  {
    id: 'chapter-06',
    number: '06',
    title: 'One Year Later',
    subtitle: 'Returning & Remembering',
    timeframe: 'A Year Forward — Dongargarh Revisited',
    milestoneName: 'One Year Return',
    paragraphs: [
      'Approximately one year later, the road to Dongargarh called again.',
      'Retracing the same turns and seeing the familiar landscape brought a flood of nostalgia. Time had moved forward, we had grown, but the echoes of our previous ride were waiting at every turn.',
      'Looking at the hills once more, I realised that certain journeys don’t stay behind in the past. They travel with us, quietly shaping the gratitude we carry in our hearts.'
    ],
    highlightQuote: 'Some journeys stay with us long after the moment has passed.',
    photoUrl: '/images/WhatsApp Image 2026-10-14 at 04.55.13.jpeg',
    photoCaption: 'Returning to the same hills, holding the memories of what was',
    atmosphere: 'dawn-warm',
    ambientLight: '#A7B9A6',
    memoryNote: {
      title: 'Returning to the Hills',
      text: 'A whole year of memories, late night conversations, and laughter had passed. Returning to those hills felt like closing a circle with immense gratitude.',
      date: 'October 2026'
    }
  }
];
