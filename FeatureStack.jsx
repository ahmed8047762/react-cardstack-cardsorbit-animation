import React, { useEffect, useRef } from 'react';
import { getAssetPath } from '../../utils/assetUtils';
import QuotesOrbit from './QuotesOrbit';

const FeatureStack = () => {
  const stackRef = useRef(null);
  const cardsRef = useRef([]);
  const lastLogRef = useRef({ sticky: -1, incoming: -1, next: -1 });
  const marginY = -40; // negative gap so cards overlap
  const CARD_HEIGHT = 520; // increased card height for more space
  // Calculate scrollbar width
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  const bgColors = [
    '#D81285', // magenta
    '#FF5733', // orange-red
    '#9249F2', // purple
    '#34A853', // green
    '#D9B8FF', // soft violet
    '#C7E0F3', // pale blue
    '#0D47A1', // dark blue
    '#1ABC9C', // teal
    '#E67E22', // deep orange
    '#2C3E50', // dark slate
  ];

  const cardData = [
    {
      title: 'Question Board',
      description: 'Get a steady stream of journalist questions tailored to your expertise—browse, pick, and share insights that get you featured.',
      image: getAssetPath('/assets/images/landing/image1.png')
    },
    {
      title: 'Question Generator',
      description: 'Journalists can instantly generate smart, niche-specific questions, while experts get fresh prompts tailored to their field so the right answers always find the right questions.',
      image: getAssetPath('/assets/images/landing/image2.png')
    },
    {
      title: 'RePitch',
      description: 'RePitch gives your past, rejected queries a second shot—automatically matching them with new, relevant questions so nothing valuable goes to waste.',
      image: getAssetPath('/assets/images/landing/image3.png')
    },
    {
      title: 'AI Detection',
      description: 'Built-in AI detection checks your pitch for originality and human tone. Get a quick score so your voice stays authentic and publish-ready. Requires AI credits.',
      image: getAssetPath('/assets/images/landing/image4.png')
    },
    {
      title: 'PitchCritic',
      description: 'Unlock AI-powered clarity and tone tweaks—keeping your voice authentic, confident, and media-ready. Say hello to polished perfection. (Paid add-on)',
      image: getAssetPath('/assets/images/landing/image1.png')
    },
    {
      title: 'PitchRank',
      description: "Stop guessing which pitches matter. PitchRank’s AI-driven scoring highlights your most relevant, high-impact answers so you can spend time where it counts.",
      image: getAssetPath('/assets/images/landing/image2.png')
    },
    {
      title: 'QuestionMatch',
      description: 'Your personal AI pitch assistant—from spotting the best questions to drafting winning replies and fine-tuning your language—respond faster, smarter, and stronger.',
      image: getAssetPath('/assets/images/landing/image3.png')
    },
    {
      title: '1:1 Chat',
      description: 'Built-in messaging lets experts and journalists connect instantly. Use credits to follow up, clarify briefs, or build lasting media relationships.',
      image: getAssetPath('/assets/images/landing/image4.png')
    },
    {
      title: 'Show Off Your Profile',
      description: 'Create detailed, professional profiles that highlight expertise, focus areas, and past work—helping others quickly see if you’re the right match.',
      image: getAssetPath('/assets/images/landing/image1.png')
    },
    {
      title: 'Daily Newsletters',
      description: 'Stay pitch-ready. Get recent journalist questions delivered to your inbox every day. Pick and reply in minutes.',
      image: getAssetPath('/assets/images/landing/image2.png')
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      animateStackCards();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    animateStackCards();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const animateStackCards = () => {
    if (!stackRef.current || cardsRef.current.length === 0) return;

    const stackElement = stackRef.current;
    const cards = cardsRef.current;
    const cardHeight = cards[0].offsetHeight;
    const step = cardHeight + marginY;
    const stackTop = stackElement.getBoundingClientRect().top + window.scrollY;
    const stackBottom = stackTop + stackElement.offsetHeight;
    const scrollY = window.scrollY;

    let activeIndex = 0;

    // Determine active card index, ensuring it stays within stack bounds
    cards.forEach((card, i) => {
      const start = stackTop + i * step;
      const end = start + cardHeight;
      if (scrollY >= start && scrollY < end) {
        activeIndex = i;
      }
    });

    const lastIndex = cards.length - 1;

    // Calculate scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Apply styles
    cards.forEach((card, i) => {
      const start = stackTop + i * step;

      const containerTopInViewport = Math.max(0, stackElement.getBoundingClientRect().top);
      const withinStackScroll = scrollY < stackBottom;
      const viewportTop = stackElement.getBoundingClientRect().top + i * step;

      // Determine if we're at the end-phase: when the last card is active or about to become sticky
      const lastViewportTop = stackElement.getBoundingClientRect().top + lastIndex * step;
      const peek = 24;
      const lastIncomingNearTop = lastViewportTop <= containerTopInViewport + peek;
      const endPhase = (activeIndex === lastIndex) || lastIncomingNearTop;

      if (endPhase) {
        // In end-phase, no card should be sticky/fixed. Lay everything out absolutely so next section is visible.
        if (i < activeIndex) {
          card.style.position = 'absolute';
          card.style.top = `${(i + 1) * step}px`;
          card.style.left = '0px';
          card.style.width = `calc(100vw - ${scrollbarWidth}px)`;
          card.style.zIndex = 200 + i;
        } else {
          card.style.position = 'absolute';
          card.style.top = `${i * step}px`;
          card.style.left = '0px';
          card.style.width = `calc(100vw - ${scrollbarWidth}px)`;
          card.style.zIndex = 300;
        }
      } else if (i === activeIndex && withinStackScroll) {
        // Active card sticks to top within stack (fixed to viewport top or container top until container reaches top)
        card.style.position = 'fixed';
        card.style.top = `${containerTopInViewport}px`;
        card.style.left = '0px';
        card.style.width = `calc(100vw - ${scrollbarWidth}px)`;
        card.style.zIndex = 500; // active above previous, below incoming
      } else if (i < activeIndex && withinStackScroll) {
        // All previously passed cards remain fixed behind the active card
        card.style.position = 'fixed';
        card.style.top = `${containerTopInViewport}px`;
        card.style.left = '0px';
        card.style.width = `calc(100vw - ${scrollbarWidth}px)`;
        card.style.zIndex = 400; // behind active
      } else if (i < activeIndex && !withinStackScroll) {
        // After the stack completes, previously passed cards rest at their final absolute positions
        card.style.position = 'absolute';
        card.style.top = `${(i + 1) * step}px`;
        card.style.left = '0px';
        card.style.width = `calc(100vw - ${scrollbarWidth}px)`;
        card.style.zIndex = 200 + i;
      } else if (i === activeIndex + 1 && withinStackScroll) {
        // Next incoming card: when it approaches the top, make it fixed just below active so header isn't clipped
        const peek = 24; // px offset to show header
        if (viewportTop <= containerTopInViewport + peek) {
          card.style.position = 'fixed';
          card.style.top = `${containerTopInViewport + peek}px`;
          card.style.left = '0px';
          card.style.width = `calc(100vw - ${scrollbarWidth}px)`;
          card.style.zIndex = 650; // above active (500), below next-after-incoming (660)
        } else {
          // Not near top yet: keep absolute and high z so it slides in front
          card.style.position = 'absolute';
          card.style.top = `${i * step}px`;
          card.style.left = '0px';
          card.style.width = `calc(100vw - ${scrollbarWidth}px)`;
          card.style.zIndex = 640; // keep below the next-after-incoming card's header
        }
      } else if (i === activeIndex + 2 && withinStackScroll) {
        // Next after incoming: let its header peek above the incoming card
        card.style.position = 'absolute';
        card.style.top = `${i * step}px`;
        card.style.left = '0px';
        card.style.width = `calc(100vw - ${scrollbarWidth}px)`;
        card.style.zIndex = 660; // above incoming (640) and active (500)
      } else if (i === activeIndex + 1 && withinStackScroll) {
        // Incoming card: keep just below the next-after-incoming so it doesn't hide that header
        card.style.position = 'absolute';
        card.style.top = `${i * step}px`;
        card.style.left = '0px';
        card.style.width = `calc(100vw - ${scrollbarWidth}px)`;
        card.style.zIndex = 640; // below next-after-incoming (660)
      } else {
        // Other cards not yet reached: keep behind to avoid odd overlaps
        card.style.position = 'absolute';
        card.style.top = `${i * step}px`;
        card.style.left = '0px';
        card.style.width = `calc(100vw - ${scrollbarWidth}px)`;
        card.style.zIndex = 300;
      }
    });

    // Set container height so scrolling works
    stackElement.style.height = `${step * (cards.length - 1) + cardHeight}px`;
  };

  return (
    <div id="feature-stack" className="container" style={{ width: '100vw', margin: 0, padding: '2rem 0', position: 'relative', zIndex: 1 }}>
      <div
        className="stack-cards-wrapper"
        style={{
          position: 'relative',
          minHeight: '100vh', // Ensure the section has enough height
          overflow: 'hidden', // Contain fixed positioning within this wrapper
          zIndex: 1,
          width: '100vw',
        }}
      >
        <div
          className="stack-cards"
          ref={stackRef}
          style={{
            position: 'relative',
            width: '100vw',
          }}
        >
          {cardData.map((card, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="stack-cards__item"
              style={{
                position: 'absolute',
                top: `${index * (CARD_HEIGHT + marginY)}px`,
                left: '0px',
                width: '100vw',
                borderTopLeftRadius: '36px',
                borderTopRightRadius: '36px',
                borderBottomLeftRadius: '0px',
                borderBottomRightRadius: '0px',
                // boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                backgroundColor: bgColors[index % bgColors.length],
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'row', height: `${CARD_HEIGHT}px` }}>
                <div
                  style={{
                    flex: '1',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'left',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ maxWidth: '38ch' }}>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '0.75rem', color: '#111' }}>{card.title}</h2>
                    <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#222', margin: 0 }}>{card.description}</p>
                  </div>
                </div>
                <div style={{ flex: '1', height: '100%' }}>
                  <img
                    src={card.image}
                    alt={card.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          width: `calc(100vw - ${scrollbarWidth}px)`,
          borderTopLeftRadius: '36px',
          borderTopRightRadius: '36px',
          overflow: 'hidden',
          background: '#ffffff',
          position: 'relative',
          zIndex: 1000,
          marginTop: '-34px',
          boxShadow: '0 -8px 24px rgba(0,0,0,0.06)',
        }}
      >
        <QuotesOrbit />
      </div>
    </div>
  );
};

export default FeatureStack;