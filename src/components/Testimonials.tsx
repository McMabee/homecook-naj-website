import GoldDiamond from './GoldDiamond'

interface Testimonial {
  quote: string
  name: string
  /** Occasion or service, shown under the name. */
  detail: string
  /** Longer reviews get a wider card and slightly smaller type so the strip stays even. */
  long?: boolean
}

/** Reviews left on the Home Cooking with Naj Facebook page, reproduced verbatim. */
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'I have had many experiences with Home Cooking with Naj and they have all been absolutely amazing. Her cooking, presentation and knowledge of cuisine are all outstanding! She has catered events for me. I have attended gatherings with her food presented across entire islands and devoured by guests! I highly recommend any experience your choose with Naj’s options Great cook. Great food. Great experience.',
    name: 'Tanya Pica Saleh',
    detail: 'Catered Events & Gatherings',
    long: true,
  },
  {
    quote:
      'Naj is an amazing cook who comes in and gives you a 5 star restaurant experience in your own home. She’s friendly, reliable and so talented. We always look forward to the meals she has prepared for our friends and family!',
    name: 'Chad Irwin',
    detail: 'Private In-Home Dinners',
  },
  {
    quote:
      'Fantastic interactive experience hosted by Naj. Cooked a delicious meal while educating us each step of the way! Love following her account for daily inspirations in the kitchen.',
    name: 'Christina Cagnin',
    detail: 'Interactive Cooking Experience',
  },
  {
    quote:
      'Naj was very personable and did not take long to make herself right at home in my kitchen!\nNot only did she share her mouth-watering creations with us but she also made us feel like a part of the whole process by explaining everything step-by-step and even took the time to provide us with invaluable cooking tips.\nHer deep love and appreciation of all foods and various types of cuisine is evident in every single delicious dish she prepared. 😋\nI would definitely recommend Naj for any type of personal chef experience because you are guaranteed to get high quality restaurant-worthy dishes at an excellent value that just can’t be beat!',
    name: 'Sabrina Batusic',
    detail: 'Personal Chef Experience',
    long: true,
  },
  {
    quote:
      'We had Naj cook at our house a few times for dinner parties and it was the most incredible experience!! She let us pick our desired menu, bought the best ingredients, cooked at our house (explaining each course) and cleaned up everything! It was absolutely delicious and so fun and my friends still talk about what a great evening it was! I loved how I could relax and enjoy the evening and how creative it made the evening! So so fun!!',
    name: 'Jan',
    detail: 'Catered Events & Gatherings',
    long: true,
  },
]

/** Seconds each card takes to cross the strip; one full loop is cards × this. */
const SECONDS_PER_CARD = 8

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="pt-20 pb-10 md:pt-28 md:pb-14 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 text-center mb-14">
        <p className="text-gold tracking-[0.35em] text-xs uppercase mb-5">Kind Words</p>
        <h2 id="testimonials-heading" className="font-display text-5xl md:text-6xl text-cream">
          What Guests <em>Are Saying</em>
        </h2>
        <div className="max-w-xs mx-auto mt-8">
          <GoldDiamond />
        </div>
      </div>

      {/*
        The strip is a focusable region so keyboard users can pause it too.
        Motion-safe: the track glides continuously and fades out at both edges.
        Motion-reduce: no animation; the same row scrolls by hand and the
        duplicate list is hidden.
      */}
      <div
        role="region"
        aria-label="Guest reviews"
        tabIndex={0}
        className="group relative overflow-hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-gold/50 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:overflow-x-auto motion-reduce:px-6 motion-reduce:[mask-image:none]"
      >
        <div
          className="flex w-max will-change-transform motion-safe:animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
          style={{ animationDuration: `${TESTIMONIALS.length * SECONDS_PER_CARD}s` }}
        >
          <TestimonialList />
          <TestimonialList duplicate />
        </div>
      </div>
    </section>
  )
}

function TestimonialList({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      aria-hidden={duplicate || undefined}
      className={`flex items-start sm:items-stretch shrink-0 gap-6 pr-6 ${duplicate ? 'motion-reduce:hidden' : ''}`}
    >
      {TESTIMONIALS.map((t) => (
        <li
          key={t.name}
          className={`shrink-0 flex bg-charcoal border border-gold/10 p-8 md:p-10 ${
            t.long ? 'w-[20rem] sm:w-[32rem]' : 'w-[20rem] sm:w-[24rem]'
          }`}
        >
          <figure className="flex flex-col w-full">
            <span className="font-display text-6xl leading-none text-gold/30 -mb-4 select-none" aria-hidden="true">
              “
            </span>
            <blockquote
              className={`font-display italic text-cream leading-relaxed whitespace-pre-line flex-1 ${
                t.long ? 'text-sm sm:text-base' : 'text-lg'
              }`}
            >
              {t.quote}
            </blockquote>
            <figcaption className="mt-8 pt-6 border-t border-gold/10">
              <p className="text-cream text-sm">{t.name}</p>
              <p className="text-gold text-[10px] tracking-[0.3em] uppercase mt-1">{t.detail}</p>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}
