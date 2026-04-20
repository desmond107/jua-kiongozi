import { Link } from 'react-router-dom'
import { Vote, Twitter, Facebook, Instagram, Youtube, Mail, MapPin, ArrowUpRight, ExternalLink } from 'lucide-react'

const LINKS = {
  Navigate: [['Home','/'],['Candidates','/candidates'],['Counties','/counties'],['Analytics','/analytics'],['Blog','/blog']],
  Election: [['Register to Vote','https://www.iebc.or.ke'],['IEBC Portal','https://www.iebc.or.ke'],['Election Guide','/blog/how-to-register-vote-kenya'],['County Info','/counties']],
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black border-t border-white/[0.05]">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 10% 100%, rgba(200,16,46,0.06) 0%, transparent 60%)',
      }} />

      {/* Flag bar */}
      <div className="flag-bar" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5 w-fit group">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg,#e8102a,#7c0015)' }}>
                <Vote className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-display font-bold text-white tracking-[0.1em] uppercase">Jua Kiongozi</div>
                <div className="text-[9px] font-bold text-kenya-red tracking-[0.3em] uppercase">2027</div>
              </div>
            </Link>
            <p className="text-sm text-urban-muted leading-relaxed mb-5">
              Kenya's premier political information platform. Know your leaders, engage with their vision, and make an informed vote in 2027.
            </p>
            <div className="flex gap-2">
              {[Twitter, Facebook, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-urban-muted hover:text-white border border-white/[0.07] hover:border-kenya-red/30 hover:bg-kenya-red/10 transition-all duration-200">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="text-[10px] font-bold text-urban-muted uppercase tracking-[0.2em] mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {items.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith('http') ? (
                      <a href={href} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-urban-muted hover:text-white transition-colors duration-200 group">
                        {label}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                      </a>
                    ) : (
                      <Link to={href}
                        className="text-sm text-urban-muted hover:text-white transition-colors duration-200">
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact + Movements */}
          <div>
            <h4 className="text-[10px] font-bold text-urban-muted uppercase tracking-[0.2em] mb-4">Contact</h4>
            <ul className="space-y-2.5 mb-6">
              <li className="flex items-center gap-2.5 text-sm text-urban-muted">
                <Mail className="w-3.5 h-3.5 text-kenya-red/60 shrink-0" />
                info@juakiongozi.co.ke
              </li>
              <li className="flex items-center gap-2.5 text-sm text-urban-muted">
                <MapPin className="w-3.5 h-3.5 text-urban-accent/60 shrink-0" />
                Nairobi, Kenya
              </li>
            </ul>
            <h4 className="text-[10px] font-bold text-urban-muted uppercase tracking-[0.2em] mb-3">Movements</h4>
            <div className="space-y-2">
              {[
                ['🔥 Niko Kadi', 'border-kenya-red/20 text-red-300/80'],
                ['⚡ Gen Z Unity', 'border-urban-accent/20 text-cyan-300/80'],
              ].map(([name, cls]) => (
                <div key={name} className={`px-3 py-2 rounded-lg border bg-white/[0.02] text-xs font-semibold ${cls}`}>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-6 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-urban-muted/60 text-center">
            © 2024 Jua Kiongozi 2027. Built for Kenyans, by Kenyans.
          </p>
          <div className="flex gap-5 text-xs text-urban-muted/60">
            {['Privacy Policy','Terms of Use','Disclaimer'].map((l) => (
              <a key={l} href="#" className="hover:text-urban-muted transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
