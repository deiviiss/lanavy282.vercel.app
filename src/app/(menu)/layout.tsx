import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { SidebarCart } from '@/components/sidebar-cart'

export default function MenuLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <SidebarCart />
      {children}
      <Footer />
    </>
  )
}
