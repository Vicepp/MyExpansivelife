import { Container, Button } from './primitives'
import Reveal from './Reveal'
import { COMMUNITY_URL } from '../lib/links'

const OUTCOMES = [
  "Real clarity on what you're building and why",
  'A weekly rhythm that turns ideas into action',
  'A stronger, more visible personal brand',
  'Practical financial literacy you can actually use',
  'A network of collaborators, mentors, and peers',
  'Permission to grow without burning out',
]

/**
 * Closing section of the community page: the promise on the left, the six
 * things a member walks away with on the right.
 */
export default function WhatChanges() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-gold">
                What changes for you
              </p>
              <h2 className="mt-4 max-w-[460px] font-display text-[30px] leading-[1.18] text-ink lg:text-[40px]">
                You&rsquo;ll leave with a plan, not just more to read.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 max-w-[480px] text-[14.5px] leading-relaxed text-ink/70">
                The Circle isn&rsquo;t measured by how much content you consume.
                It&rsquo;s measured by whether you&rsquo;re clearer, more visible,
                more financially confident, and better connected than you were the
                week you joined.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <Button variant="dark" to={COMMUNITY_URL} className="mt-9">
                Join the Circle Community
              </Button>
            </Reveal>
          </div>

          <ul className="border-t border-ink/12 lg:mt-2">
            {OUTCOMES.map((outcome, i) => (
              <Reveal
                as="li"
                key={outcome}
                delay={i * 70}
                className="flex gap-4 border-b border-ink/12 py-4 text-[14.5px] leading-relaxed text-ink/85"
              >
                <span aria-hidden="true" className="text-gold">
                  &mdash;
                </span>
                <span>{outcome}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
