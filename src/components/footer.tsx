import { Clock, Facebook, Instagram, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
import { getBranches } from '@/actions/branches/get-branches'
import { formatPhoneNumber } from '@/lib/utils'

export async function Footer() {
  // const googleMapsUrl = 'https://maps.app.goo.gl/qAFDqDNZvYqwkaDG7'
  const branches = await getBranches()
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME

  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-xl font-bold mb-4">{companyName}</h3>
            <p className="text-gray-300">Panes y Sandwiches</p>
          </div>
          {/* Branches */}
          {branches.map((branch) => (
            <div key={branch.id}>
              <h3 className="text-xl font-bold mb-2">{branch.name}</h3>
              <div className="flex items-start gap-2 mb-2">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <Link href={branch.urlMap || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <span className="text-gray-300 text-sm whitespace-pre-line">
                    {branch.address}
                  </span>
                </Link>
              </div>
              {branch.hours && (
                <div className="flex items-start gap-2 mb-2">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm whitespace-pre-line">
                    {branch.hours}
                  </span>
                </div>
              )}
              <p className="text-red-300 text-sm mb-2">Cerrado los Domingos</p>
              {branch.phone && (
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="h-4 w-4 text-gray-400" />
                  <Link
                    href={`https://wa.me/+521${branch.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                  >
                    {formatPhoneNumber(branch.phone)}
                  </Link>
                </div>
              )}
            </div>
          ))}

          {/* Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/conditions" className="text-gray-300 hover:text-white transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="overflow-hidden">
            <h3 className="text-xl font-bold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/p/La-Navy-282-Panes-Y-Sandwiches-Campeche-100057488738576/?locale=es_LA"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 hover:bg-blue-600 p-2 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/lanavy282"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 hover:bg-pink-600 p-2 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href={'https://wa.me/+5219811339534'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 hover:bg-green-600 p-2 rounded-full transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="h-5 w-5" />
              </Link>
            </div>

            <div className="mt-4">
              <p className="text-gray-300 font-medium">Contáctanos:</p>
              <Link
                href={'tel:9811339534'}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 hover:text-green-400 transition-colors">
                  981 133 9534
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 mt-8 pt-6 pb-8 text-center text-gray-300">
          <p>© {new Date().getFullYear()} {companyName}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
