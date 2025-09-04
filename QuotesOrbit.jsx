import React, { useEffect, useMemo, useRef, useState, forwardRef } from 'react';
import styled from 'styled-components';
import { getAssetPath } from '../../utils/assetUtils';

/*
  QuotesOrbit:
  - Shows a centered logo with multiple quote bubbles positioned radially around it.
  - As the user scrolls DOWN through this section, quotes move inward (contract).
  - As the user scrolls UP, quotes move outward (expand).
  - Progress is calculated based on scroll position within this section.
*/

const QUOTES = [
  "The biggest shift in marketing today is that customers no longer just buy products — they buy into the story you tell.",
  "AI won’t replace humans, but it will replace humans who don’t know how to use AI.",
  "In cybersecurity, your weakest link is almost always the employee who hasn’t been trained properly.",
  "When you automate a bad process, you just make bad things happen faster.",
  "Personalization is no longer optional — it’s the expectation of every customer.",
  "In investing, time in the market almost always beats timing the market.",
  "Sustainability is no longer a PR strategy — it’s a competitive advantage.",
  "In health, prevention will always be cheaper than treatment.",
  "Data without context is noise; data with context is strategy.",
  "Good leadership today is less about command and control, and more about coaching and enabling.",
  "Most startups don’t fail because of lack of ideas — they fail because they run out of cash or patience.",
];

const QuotesOrbit = forwardRef((props, forwardedRef) => {
  const sectionRef = useRef(null);
  const layerRef = useRef(null);
  const [progress, setProgress] = useState(0); // 0 -> fully expanded, 1 -> fully contracted

  // Pre-compute equal angles around a circle
  const angles = useMemo(() => {
    const count = QUOTES.length;
    return Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2);
  }, []);

  // Removed triangular pointer computation and observers
  // (Measure each bubble and compute an exact tail position on its rounded-rect edge,) --> Removed

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const rect = sectionEl.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height + vh; // start entering until fully passed
        const visibleProgress = Math.min(1, Math.max(0, (vh - rect.top) / total));
        // Map visibleProgress so that at the middle of section we're more contracted
        setProgress(visibleProgress);
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Radius contracts as progress increases
  // Increased spread so fully expanded quotes are farther from the logo
  const baseRadius = 900; // px when expanded
  const minRadius = 310;   // px when contracted
  const radius = useMemo(() => {
    return minRadius + (baseRadius - minRadius) * (1 - progress);
  }, [progress]);

  return (
    <Section
      id="quotes-orbit"
      ref={(el) => {
        sectionRef.current = el;
        if (typeof forwardedRef === 'function') forwardedRef(el);
        else if (forwardedRef) forwardedRef.current = el;
      }}
    >
      <Inner>
        <Header>
          <Title>Expert Requests from Verified Publishers</Title>
          <Subtitle>
            Stay in the loop with questions from publishers who genuinely want expert input. No spam and no fluff. Just real opportunities to share what you know, get featured, and build your credibility along the way.
          </Subtitle>
        </Header>
        <Center>
          <Logo src={getAssetPath('/assets/images/animation/logo.png')} alt="logo" />
        </Center>
        <QuotesLayer ref={layerRef}>
          {QUOTES.map((q, i) => {
            const angle = angles[i];
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const color = bubbleColors[i % bubbleColors.length];
            return (
              <QuoteBubble
                key={i}
                index={i}
                style={{ 
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  '--bubble-color': color,
                }}
              >
                <span className="open-quote">“</span>
                {q}
                <span className="close-quote">”</span>
              </QuoteBubble>
            );
          })}
        </QuotesLayer>
      </Inner>
    </Section>
  );
});

export default QuotesOrbit;

// Styled components
const Section = styled.section`
  position: relative;
  width: 100%;
  min-height: 140vh; /* extra space so scroll interaction is clear */
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-top-left-radius: 36px;
  border-top-right-radius: 36px;
  padding-bottom: 1120px; /* white space after the animation */

  @media (max-width: 768px) {
    padding-bottom: 80px;
  }
`;

const Inner = styled.div`
  position: sticky;
  top: 0; /* stick to top while user scrolls */
  width: 100%;
  height: 100vh;
  display: grid;
  place-items: center;
  /* ensure absolutely positioned children are centered relative to this */
  position: relative;
  /* push the orbit down so it doesn't overlap the heading */
  --orbit-offset: 700px;

  @media (max-width: 768px) {
    --orbit-offset: 80px;
  }
`;

const Header = styled.div`
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: min(1100px, 92%);
  text-align: center;
  z-index: 10;
  
  @media (max-width: 768px) {
    top: 12px;
  }
`;

const Title = styled.h2`
  margin: 0 0 10px 0;
  font-size: clamp(30px, 4.5vw, 54px);
  font-family: 'Playfair Display', serif;
  line-height: 1.2;
  font-weight: 800;
  color: #1f2a44; /* deep navy */
`;

const Subtitle = styled.p`
  margin: 0 auto;
  max-width: 820px;
  font-size: clamp(12px, 1.6vw, 16px);
  line-height: 1.6;
  color: #6b7280; /* slate/gray */
`;

const Center = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) translateY(var(--orbit-offset));
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  z-index: 2;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  background: #fff;
`;

const Logo = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
`;

const QuotesLayer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) translateY(var(--orbit-offset));
  width: 0px; /* origin at center */
  height: 0px;
  z-index: 1;
`;

const bubbleColors = [
  '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#e67e22', '#e74c3c',
  '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#d35400', '#c0392b', '#34495e'
];

const QuoteBubble = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(0, 0);
  transition: transform 0.25s ease-out;
  min-width: 320px;
  max-width: 480px;
  padding: 16px 26px;
  color: #fff;
  font-size: 15px;
  line-height: 1.4;
  border-radius: 18px;
  border: 1px solid rgb(0, 0, 0);
  background: var(--bubble-color, #3498db);

  /* Larger, bold visible quotes */
  .open-quote,
  .close-quote {
    font-weight: 800;
    font-size: 1.3em;
    line-height: 1;
  }
  .open-quote { margin-right: 6px; }
  .close-quote { margin-left: 6px; }

  @media (max-width: 768px) {
    min-width: 200px;
    max-width: 280px;
    font-size: 13.5px;
  }
`;
