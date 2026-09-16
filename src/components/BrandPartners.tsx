import GoldDiamond from './GoldDiamond'
import classicoLogo from '../assets/logos/classico.png'
import walmartLogo from '../assets/logos/walmart.svg'
import bushsLogo from '../assets/logos/bushs-best.svg'
import longosLogo from '../assets/logos/longos.svg'
import kraftLogo from '../assets/logos/kraft.svg'
import botticelliLogo from '../assets/logos/botticelli.png'

/**
 * Brands Naj has collaborated with, in display order. Every logo in
 * `src/assets/logos/` is a white, transparent-background version, so they sit
 * on the dark theme without any CSS filtering. `heightClass` balances the
 * visual weight of wide wordmarks against compact badges.
 */
const BRANDS = [
  { name: 'Classico', logo: classicoLogo, heightClass: 'h-11 md:h-12 lg:h-14' },
  { name: 'Walmart', logo: walmartLogo, heightClass: 'h-7 md:h-8 lg:h-9' },
  { name: "Bush's Beans", logo: bushsLogo, heightClass: 'h-12 md:h-14 lg:h-16' },
  { name: "Longo's", logo: longosLogo, heightClass: 'h-9 md:h-10 lg:h-12' },
  { name: 'Kraft', logo: kraftLogo, heightClass: 'h-8 md:h-9 lg:h-11' },
  { name: 'Botticelli', logo: botticelliLogo, heightClass: 'h-9 md:h-10 lg:h-12' },
]

interface BrandPartnersProps {
  /** Called when a brand clicks the partnership call to action. */
  onPartner: () => void
}

export default function BrandPartners({ onPartner }: BrandPartnersProps) {
  return (
    <section id="partners" aria-labelledby="partners-heading" className="py-16 md:py-20 px-6 border-y border-gold/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 md:mb-16">
          <p className="text-gold tracking-[0.35em] text-xs uppercase mb-4">Culinary Collaborations & Partnerships</p>
          <h2 id="partners-heading" className="font-display text-3xl md:text-4xl text-cream">
            Brands I've <em>Cooked With</em>
          </h2>
          <div className="max-w-[10rem] mx-auto mt-6">
            <GoldDiamond />
          </div>
          <p className="text-cream-muted text-[15px] font-light max-w-lg mx-auto leading-relaxed mt-6">
            A few names you all know and love.
          </p>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12 items-center justify-items-center">
          {BRANDS.map((brand) => (
            <li key={brand.name} className="flex items-center justify-center w-full">
              <img
                src={brand.logo}
                alt={brand.name}
                loading="lazy"
                className={`${brand.heightClass} w-auto max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-500`}
              />
            </li>
          ))}
        </ul>

        {/* Partnership call to action */}
        <div className="text-center mt-14 md:mt-16">
          <p className="text-cream-muted text-[15px] font-light max-w-lg mx-auto leading-relaxed mb-5">
            Have a brand or product that belongs at the table? I'm always open to sponsorships and partnerships.
          </p>
          <button
            type="button"
            onClick={onPartner}
            className="inline-flex items-center gap-3 text-gold text-xs tracking-[0.3em] uppercase border-b border-gold pb-1 hover:gap-6 transition-all duration-300"
          >
            Partner with Naj <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </section>
  )
}
