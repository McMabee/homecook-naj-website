import type { Page } from '../types'
import heroImage from '../assets/naj-hero.jpg'
import portraitImage from '../assets/naj-portrait.jpg'
import dinnerImage from '../assets/naj-dinner.jpg'
import BrandPartners from '../components/BrandPartners'
import GoldDiamond from '../components/GoldDiamond'
import InstagramFeed from '../components/InstagramFeed'

interface HomeProps {
  setPage: (p: Page) => void
}

export default function Home({ setPage }: HomeProps) {
  const scrollToServices = () =>
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-charcoal">
          <img
            src={heroImage}
            alt="Naj slicing fresh tomatoes and vegetables on a wooden board"
            fetchPriority="high"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/30 to-obsidian" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-gold tracking-[0.45em] text-xs uppercase mb-8">Elevated Home Cooking</p>
          <h1 className="font-display text-6xl sm:text-7xl md:text-9xl text-cream leading-[0.9] mb-8">
            Home Cooking
            <br />
            <em>with Naj</em>
          </h1>
          <div className="max-w-xs mx-auto mb-8">
            <GoldDiamond />
          </div>
          <p className="text-cream-muted text-lg md:text-xl font-light max-w-lg mx-auto leading-relaxed mb-12">
            Bringing warmth, heritage, and restaurant-quality food to your table, from Ancaster and Hamilton to Burlington and Oakville.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setPage('contact')}
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

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gold/50">
          <span className="text-[10px] tracking-[0.4em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-gold/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────────────── */}
      <section id="about" className="py-28 md:py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
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
                Hi, I'm Naj, a home cook, culinary creator, and private chef based in Ancaster, Ontario. I grew up surrounded by the bold, fragrant cooking of my Jordanian and Palestinian family, and fell even deeper in love with food after marrying into an Italian one. That beautiful blend of cultures lives in everything I make.
              </p>
              <p className="text-cream-muted leading-relaxed mb-5 text-[15px]">
                What started as a passion for feeding the people I love has grown into a full culinary business. I've competed on the Food Network's <em className="text-cream">Wall of Chefs</em>, built a community of food lovers online, and, most importantly, cooked unforgettable meals in kitchens just like yours across Hamilton, Ancaster, Burlington, and Oakville.
              </p>
              <p className="text-cream-muted leading-relaxed mb-12 text-[15px]">
                Whether I'm curating a private dinner, teaching you to build the perfect grazing table, or stocking your freezer with wholesome family meals, my goal is always the same: to make your table a place people never want to leave.
              </p>
              <button
                onClick={() => setPage('contact')}
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
                className="w-full h-[580px] md:h-[680px] object-cover relative z-10 grayscale"
              />
              <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-obsidian border border-gold/30 flex items-center justify-center z-20">
                <div className="text-center px-2">
                  <p className="font-display text-lg text-gold italic leading-tight">Food</p>
                  <p className="font-display text-lg text-gold italic leading-tight">Network</p>
                  <p className="text-gold-muted text-[9px] tracking-[0.15em] uppercase mt-1">Wall of Chefs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pull quote */}
          <div className="max-w-2xl mx-auto text-center mt-28">
            <div className="w-10 h-px bg-gold mx-auto mb-8" />
            <blockquote className="font-display text-2xl md:text-3xl italic text-cream leading-relaxed">
              "Food doesn't need to be complicated to be extraordinary. It just needs to be made with love."
            </blockquote>
            <p className="text-gold text-xs tracking-[0.35em] uppercase mt-6">Naj</p>
          </div>
        </div>
      </section>

      {/* ── Brand partners ───────────────────────────────────────────── */}
      <BrandPartners />

      {/* ── Services ─────────────────────────────────────────────────── */}
      <section id="services" className="py-28 md:py-40 px-6 bg-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-gold tracking-[0.35em] text-xs uppercase mb-5">What I Offer</p>
            <h2 className="font-display text-5xl md:text-6xl text-cream">
              Culinary <em>Services</em>
            </h2>
            <div className="max-w-xs mx-auto mt-8">
              <GoldDiamond />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-gold/10">
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.title} {...s} index={i + 1} onBook={() => setPage('contact')} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Instagram ────────────────────────────────────────────────── */}
      <InstagramFeed />

      {/* ── Service area ─────────────────────────────────────────────── */}
      <ServiceArea />

      {/* ── Philosophy band ──────────────────────────────────────────── */}
      <section className="relative py-40 px-6 overflow-hidden">
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
            From intimate private dinners to hands-on workshops and stunning grazing tables, every experience I create is rooted in real food, real flavour, and genuine hospitality.
          </p>
          <button
            onClick={() => setPage('contact')}
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
  onBook: () => void
}

function ServiceCard({ index, title, description, image, imageAlt, onBook }: ServiceCardProps) {
  return (
    <button
      className="group relative overflow-hidden bg-charcoal hover:bg-obsidian transition-colors duration-500 text-left w-full"
      onClick={onBook}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <img src={image} alt={imageAlt} className="w-full h-full object-cover opacity-15" />
      </div>
      <div className="relative z-10 p-10 md:p-12 h-full flex flex-col">
        <span className="font-display text-7xl text-gold/15 leading-none block mb-4">0{index}</span>
        <h3 className="font-display text-2xl md:text-3xl text-cream mb-4 group-hover:text-gold transition-colors duration-300">
          {title}
        </h3>
        <div className="w-8 h-px bg-gold mb-6" />
        <p className="text-cream-muted leading-relaxed text-[15px] flex-1">{description}</p>
        <span className="inline-flex items-center gap-2 text-gold text-xs tracking-[0.25em] uppercase mt-10 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
          Enquire <span aria-hidden>→</span>
        </span>
      </div>
    </button>
  )
}

/* ── Data ────────────────────────────────────────────────────────── */

const SERVICES = [
  {
    title: 'Private In-Home Dinners',
    description:
      'Restaurant-quality food in the comfort of your own home. From an intimate dinner for two to a celebration for twenty, I take care of everything: menu creation, grocery sourcing, cooking, plating, and clean-up. You just show up and enjoy.',
    image: dinnerImage,
    imageAlt: 'Bowl of homemade tomato sauce topped with fresh basil and parmesan, with garlic, tomatoes, and bread alongside',
  },
  {
    title: 'Cooking Workshops & Demos',
    description:
      'Get hands-on in the kitchen and learn the techniques behind elevated home cooking. Perfect for date nights, bachelorette parties, corporate events, and curious home cooks who want to level up. Fun, interactive, and genuinely delicious.',
    image: 'https://images.unsplash.com/photo-1683624328172-88fb24625ec1?w=800&h=600&fit=crop&auto=format',
    imageAlt: 'Group cooking class in a kitchen',
  },
  {
    title: 'Grazing Tables & Charcuterie',
    description:
      'Stunning grazing tables and boards that are as beautiful as they are delicious. Rooted in the Middle Eastern tradition of generous, abundant spreads, elevated with artisan cheeses, cured meats, seasonal fruit, and gorgeous presentation.',
    image: 'https://images.unsplash.com/photo-1678572823447-45fc146df43c?w=800&h=600&fit=crop&auto=format',
    imageAlt: 'Luxury grazing table spread',
  },
  {
    title: 'Custom Meal Prep',
    description:
      'Give your family the gift of real, nourishing meals without the weeknight scramble. I offer weekly family meal planning and freezer meal packages, all made from scratch with the same care and flavour as everything else I cook.',
    image: 'https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?w=800&h=600&fit=crop&auto=format',
    imageAlt: 'Meal prep containers with healthy food',
  },
]

/* ── Service area ────────────────────────────────────────────────── */

const SERVICE_AREAS = ['Hamilton', 'Ancaster', 'Burlington', 'Oakville']

function ServiceArea() {
  return (
    <section id="service-area" className="py-24 md:py-32 px-6 bg-charcoal border-y border-gold/10">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-gold tracking-[0.35em] text-xs uppercase mb-5">Where I Cook</p>
        <h2 className="font-display text-4xl md:text-5xl text-cream leading-tight mb-8">
          Your Private Chef in Hamilton, Ancaster,
          <br />
          <em>Burlington &amp; Oakville</em>
        </h2>
        <p className="text-cream-muted leading-relaxed text-[15px] max-w-2xl mx-auto mb-10">
          Based in Ancaster, I bring private dinners, cooking workshops, grazing tables, and custom meal prep to homes
          and venues across Hamilton, Burlington, Oakville, and the surrounding communities. Somewhere a little further
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
