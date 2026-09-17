import { useEffect, useRef, useState } from 'react'
import type { ContactService } from '../types'
import heroImage from '../assets/naj-hero.jpg'
import portraitImage from '../assets/naj-portrait.jpg'
import dinnerImage from '../assets/naj-dinner.jpg'
import BrandPartners from '../components/BrandPartners'
import GoldDiamond from '../components/GoldDiamond'
import InstagramFeed from '../components/InstagramFeed'
import Testimonials from '../components/Testimonials'
import mealPrepImage from '../assets/meal-prep.png'
import charcuterieImage from '../assets/chacuterie-board.png'
import classImage from '../assets/FullSizeRender.jpeg'

interface HomeProps {
  /** Opens the contact page, optionally with a service already selected. */
  openContact: (service?: ContactService) => void
}

export default function Home({ openContact }: HomeProps) {
  const scrollToServices = () =>
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      {/* A flex column so the scroll cue always sits below the text, and the
          section simply grows on short viewports instead of overlapping. */}
      <section className="relative min-h-svh flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-charcoal">
          <img
            src={heroImage}
            alt="Naj slicing fresh tomatoes and vegetables on a wooden board"
            fetchPriority="high"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/30 to-obsidian" />
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center px-6 pt-24 md:pt-28 pb-8">
          <div className="w-full max-w-4xl text-center">
            <p className="text-gold tracking-[0.45em] text-xs uppercase mb-6">Elevated Home Cooking</p>
            <h1 className="font-display text-6xl sm:text-7xl md:text-9xl text-cream leading-[0.9] mb-6">
              Home Cooking
              <br />
              <em className="[word-spacing:-0.12em]">with Naj</em>
            </h1>
            <div className="max-w-xs mx-auto mb-6">
              <GoldDiamond />
            </div>
            <p className="text-cream-muted text-lg md:text-xl font-light max-w-lg mx-auto leading-relaxed mb-4">
              Bringing warmth, heritage, and elevated home cooking to your table, from Ancaster and Hamilton to Burlington and Oakville.
            </p>
            <p className="font-display text-cream text-lg md:text-xl max-w-lg mx-auto leading-relaxed mb-12">
              Private Home Chef Dinners · Family Meal Preps Culinary Experiences · Charcuterie Boards & Platters
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => openContact()}
                className="bg-gold text-obsidian px-10 py-4 text-xs tracking-[0.25em] uppercase font-medium hover:bg-gold-light transition-colors duration-300"
              >
                Book an Experience
              </button>
              <button
                onClick={scrollToServices}
                className="border border-cream/30 text-cream px-10 py-4 text-xs tracking-[0.25em] uppercase hover:border-gold hover:text-gold transition-colors duration-300"
              >
                View Services
              </button>
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="relative z-10 shrink-0 flex flex-col items-center gap-2 text-gold/50 pb-10">
          <span className="text-[10px] tracking-[0.4em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-gold/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────────────── */}
      <section id="about" className="pt-20 md:pt-28 pb-14 md:pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text */}
            <div className="order-2 md:order-1">
              <p className="text-gold tracking-[0.35em] text-xs uppercase mb-5">About Me</p>
              <h2 className="font-display text-5xl md:text-6xl text-cream leading-tight mb-8">
                Food Is How
                <br />
                <em>I Love People</em>
              </h2>
              <div className="mb-8">
                <GoldDiamond />
              </div>
              <p className="text-cream-muted leading-relaxed mb-5 text-[15px]">
                Hi, I’m Naj, a home cook, culinary creator, and private home chef based in Ancaster, Ontario. I grew up surrounded by the bold, fragrant flavours of my Jordanian and Palestinian family and fell even deeper in love with food after marrying into an Italian family. That beautiful blend of cultures influences so much of what I create today.
              </p>
              <p className="text-cream-muted leading-relaxed mb-5 text-[15px]">
                What started as a passion for feeding the people I love has grown into a culinary business I’m incredibly proud of. I competed on Flavour Network’s Wall of Chefs and have built a community of food lovers online. Most importantly, I’ve created memorable meals and experiences for families and guests throughout Ancaster, Hamilton, Burlington, Oakville, and the surrounding area.
              </p>
              <p className="text-cream-muted leading-relaxed mb-5 text-[15px]">
                Today, I offer private home chef experiences, intimate in-home dinners, family and individual meal prep, cooking workshops, and beautifully curated grazing platters and boards, all with a focus on good food, generous hospitality, and bringing people together.
              </p>
              <p className="text-cream-muted leading-relaxed mb-12 text-[15px]">
                Whether I’m creating a special dinner in your home, teaching a hands-on cooking experience, or filling your fridge with wholesome family meals, my goal is always the same: to make your table a place people never want to leave.
              </p>
              <button
                onClick={() => openContact()}
                className="inline-flex items-center gap-3 text-gold text-xs tracking-[0.3em] uppercase border-b border-gold pb-1 hover:gap-6 transition-all duration-300"
              >
                Get in touch <span aria-hidden>→</span>
              </button>
            </div>

            {/* Image */}
            <div className="order-1 md:order-2 relative">
              <div className="absolute -top-5 -left-5 right-8 bottom-8 border border-gold/15 pointer-events-none" />
              <img
                src={portraitImage}
                alt="Naj smiling at her kitchen island, surrounded by fresh produce"
                loading="lazy"
                className="w-full h-[580px] md:h-[680px] object-cover relative z-10"
              />
              <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-obsidian border border-gold/30 flex items-center justify-center z-20">
                <div className="text-center px-2">
                  <p className="font-display text-lg text-gold italic leading-tight">Flavour</p>
                  <p className="font-display text-lg text-gold italic leading-tight">Network</p>
                  <p className="text-gold-muted text-[9px] tracking-[0.15em] uppercase mt-1">Winner Of</p>
                  <p className="text-gold-muted text-[9px] tracking-[0.15em] uppercase mt-1">Wall of Chefs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pull quote */}
          <div className="max-w-2xl mx-auto text-center mt-20">
            <div className="w-10 h-px bg-gold mx-auto mb-8" />
            <blockquote className="font-display text-2xl md:text-3xl italic text-cream leading-relaxed">
              "Food doesn't need to be complicated to be extraordinary. It just needs to be made with love."
            </blockquote>
            <p className="text-gold text-xs tracking-[0.35em] uppercase mt-6">Naj</p>
          </div>
        </div>
      </section>

      {/* ── Television ───────────────────────────────────────────────── */}
      <AsSeenOn />

      {/* ── Brand partners ───────────────────────────────────────────── */}
      <BrandPartners onPartner={() => openContact('brand-partnership')} />

      {/* ── Services ─────────────────────────────────────────────────── */}
      <section id="services" className="py-20 md:py-28 px-6 bg-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-gold tracking-[0.35em] text-xs uppercase mb-5">What I Offer</p>
            <h2 className="font-display text-5xl md:text-6xl text-cream">
              Culinary <em>Services</em>
            </h2>
            <div className="max-w-xs mx-auto mt-8">
              <GoldDiamond />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-px p-px bg-gold/10">
            {SERVICES.map(({ service, ...s }, i) => (
              <ServiceCard key={s.title} {...s} index={i + 1} onBook={() => openContact(service)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <Testimonials />

      {/* ── Instagram ────────────────────────────────────────────────── */}
      <InstagramFeed />

      {/* ── Service area ─────────────────────────────────────────────── */}
      <ServiceArea />

      {/* ── Philosophy band ──────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-charcoal">
          <img
            src="https://images.unsplash.com/photo-1678572823447-45fc146df43c?w=1920&h=700&fit=crop&auto=format"
            alt="Elegant grazing table spread"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/70 to-obsidian" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="w-12 h-px bg-gold mx-auto mb-10" />
          <h2 className="font-display text-4xl md:text-5xl italic text-cream leading-snug mb-8">
            Every table deserves
            <br />
            a little magic.
          </h2>
          <p className="text-cream-muted text-lg font-light max-w-xl mx-auto leading-relaxed mb-12">
            From intimate private dinners to hands-on workshops, stunning tables and family meal prep, I bring beautiful food and genuine hospitality to your table.
          </p>
          <button
            onClick={() => openContact()}
            className="bg-gold text-obsidian px-12 py-4 text-xs tracking-[0.25em] uppercase font-medium hover:bg-gold-light transition-colors duration-300"
          >
            Let's Plan Something Together
          </button>
        </div>
      </section>
    </main>
  )
}

/* ── Service card ────────────────────────────────────────────────── */

interface ServiceCardProps {
  index: number
  title: string
  description: string
  image: string
  imageAlt: string
  /** Call to action revealed on hover. */
  cta: string
  onBook: () => void
}

function ServiceCard({ index, title, description, image, imageAlt, cta, onBook }: ServiceCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null)
  const [isScrollActive, setIsScrollActive] = useState(false)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const mobileQuery = window.matchMedia('(max-width: 767px)')
    let observer: IntersectionObserver | undefined

    const updateObserver = () => {
      observer?.disconnect()
      observer = undefined

      if (!mobileQuery.matches) {
        setIsScrollActive(false)
        return
      }

      observer = new IntersectionObserver(
        ([entry]) => setIsScrollActive(entry.isIntersecting),
        { rootMargin: '-35% 0px -35% 0px', threshold: 0 },
      )
      observer.observe(card)
    }

    updateObserver()
    mobileQuery.addEventListener('change', updateObserver)

    return () => {
      observer?.disconnect()
      mobileQuery.removeEventListener('change', updateObserver)
    }
  }, [])

  return (
    <button
      ref={cardRef}
      className="group relative overflow-hidden bg-charcoal hover:bg-obsidian transition-colors duration-500 text-left w-full"
      onClick={onBook}
    >
      {/* On phones the middle of the viewport acts like hover; pointer devices keep hover. */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isScrollActive ? 'opacity-100' : 'opacity-0'
        } md:opacity-0 md:group-hover:opacity-100`}
      >
        <img src={image} alt={imageAlt} className="w-full h-full object-cover opacity-35" />
      </div>
      <div className="relative z-10 p-10 md:p-12 h-full flex flex-col">
        <span
          className={`font-display text-7xl leading-none block mb-4 transition-colors duration-300 ${
            isScrollActive ? 'text-gold/50' : 'text-gold/30'
          } md:text-gold/30 md:group-hover:text-gold/50`}
        >
          0{index}
        </span>
        <h3
          className={`font-display text-2xl md:text-3xl mb-4 transition-colors duration-300 ${
            isScrollActive ? 'text-gold' : 'text-cream'
          } md:text-cream md:group-hover:text-gold`}
        >
          {title}
        </h3>
        <div className="w-8 h-px bg-gold mb-6" />
        <p className="text-cream-muted leading-relaxed text-[15px] flex-1">{description}</p>
        <span
          className={`inline-flex items-center gap-2 text-gold text-xs tracking-[0.25em] uppercase mt-10 transition-all duration-300 ${
            isScrollActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          } md:opacity-0 md:translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0`}
        >
          {cta} <span aria-hidden>→</span>
        </span>
      </div>
    </button>
  )
}

/* ── Data ────────────────────────────────────────────────────────── */

interface Service {
  title: string
  description: string
  image: string
  imageAlt: string
  /** Call to action shown on the card. */
  cta: string
  /** Option preselected on the contact form when the card is clicked. */
  service: ContactService
}

const SERVICES: Service[] = [
  {
    title: 'Private In-Home Dinners',
    description:
      'A beautiful dinner, without leaving home. From intimate gatherings to milestone celebrations, I create a custom menu, source the ingredients, cook and plate everything in your kitchen, and take care of the cleanup. You enjoy your guests, I\'ll take care of dinner.',
    image: dinnerImage,
    imageAlt: 'Bowl of homemade tomato sauce topped with fresh basil and parmesan, with garlic, tomatoes, and bread alongside',
    cta: 'Plan a private in-home dinner',
    service: 'private-dinner',
  },
  {
    title: 'Cooking Workshops & Demos',
    description:
      'From private cooking parties and demonstrations, to community cooking workshops, I create interactive food experiences designed to bring people together by nourishing connections through food.',
    image: classImage,
    imageAlt: 'Group cooking class in a kitchen',
    cta: 'Book a workshop today',
    service: 'cooking-workshop',
  },
  {
    title: 'Cocktail Party Platters & Charcuterie',
    description:
      'Made for gathering, sharing and lingering around the table. From abundant charcuterie boards and grazing platers to cocktail-style menues filled with beautiful, bite-sized favourites, I create spreads that make entertaining feel effortless. Perfect for birthdays, showers, celebrations and get-togethers.',
    image: charcuterieImage,
    imageAlt: 'Luxury grazing table spread',
    cta: 'Plan your spread',
    service: 'grazing-table',
  },
  {
    title: 'Custom Family Style Meal Preps',
    description:
      'Homemade dinners already taken care of. I come to your home and prepare a custom selection of fresh, family-style meals designed around your tastes, schedule and household. Your fridge is stocked, your kitchen is cleaned, and dinner is one less thing to think about. \n Individual meal preps, freezer meals and make-ahead marinades are also available.',
    image: mealPrepImage,
    imageAlt: 'Meal prep containers with healthy food',
    cta: 'Ask about custom meal preps',
    service: 'meal-prep-weekly',
  },
]

/* ── Television ──────────────────────────────────────────────────── */

const TV_APPEARANCES = [
  {
    network: 'Flavour Network',
    show: 'Wall of Chefs',
    detail: 'Winner · Season 2, Episode 6',
  },
  {
    network: 'CTV',
    show: 'The Good Stuff with Mary\u00A0Berg',
    detail: 'Featured Guest',
  },
]

function AsSeenOn() {
  return (
    <section id="television" aria-labelledby="television-heading" className="py-12 md:py-14 px-6 bg-charcoal">
      <div className="max-w-5xl mx-auto">
        <h2 id="television-heading" className="text-gold tracking-[0.35em] text-xs uppercase text-center mb-8">
          As Seen On TV
        </h2>
        <ul className="grid sm:grid-cols-2 gap-px p-px bg-gold/10">
          {TV_APPEARANCES.map((tv) => (
            <li key={tv.show} className="bg-charcoal px-8 py-8 md:py-10 text-center">
              <p className="text-cream-muted text-[10px] tracking-[0.3em] uppercase mb-3">{tv.network}</p>
              <p className="font-display text-2xl md:text-3xl italic text-cream leading-snug">{tv.show}</p>
              <p className="text-gold text-[11px] tracking-[0.25em] uppercase mt-3">{tv.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ── Service area ────────────────────────────────────────────────── */

const SERVICE_AREAS = ['Ancaster', 'Hamilton', 'Burlington', 'Oakville']

function ServiceArea() {
  return (
    <section id="service-area" className="py-16 md:py-24 px-6 bg-charcoal border-y border-gold/10">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-gold tracking-[0.35em] text-xs uppercase mb-5">Where I Cook</p>
        <h2 className="font-display text-4xl md:text-5xl text-cream leading-tight mb-8">
          Your Home Chef in Ancaster, Hamilton,
          <br />
          <em>Burlington &amp; Oakville</em>
        </h2>
        <p className="text-cream-muted leading-relaxed text-[15px] max-w-2xl mx-auto mb-10">
          Based in Ancaster, I bring private dinners, cooking workshops, charcuterie boards, and custom family meal preps to homes
          and venues across Ancaster, Hamilton, Burlington, Oakville, and the surrounding communities. Somewhere a little further
          out? Just ask.
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs tracking-[0.3em] uppercase text-cream-muted">
          {SERVICE_AREAS.map((city, i) => (
            <li key={city} className="flex items-center gap-6">
              {i > 0 && <span className="w-1.5 h-1.5 rotate-45 bg-gold/60" aria-hidden />}
              <span>{city}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
