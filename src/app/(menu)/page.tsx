import { Suspense } from 'react'
import Loading from '../loading'
import { getCategories } from '@/actions/categories/get-categories'
import { getProducts } from '@/actions/products/get-products'
import { ProductList } from '@/components/products/product-list'
import { SidebarCategories } from '@/components/sidebar-categories'

export default async function Home() {
  const products = await getProducts()

  const categories = await getCategories()

  return (
    <>
      <div className="md:hidden block">
        <SidebarCategories categories={categories} />
      </div>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-primary-gradient py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestro Menú</h1>
            <p className="text-xl mb-6">Panes, sandwiches y desayunos
              Navy</p>
          </div>
        </section>

        {
          products.length > 0 &&
          <div className="container mx-auto px-4 py-3 md:py-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar with categories */}
              <div className="md:w-1/4">
                <div className="sticky top-20 hidden md:block">
                  <SidebarCategories categories={categories} />
                </div>
              </div>

              {/* Main content with products */}
              <div className="md:w-3/4">
                <Suspense fallback={<Loading />}>
                  <ProductList products={products} categories={categories} />
                </Suspense>
              </div>
            </div>
          </div>
        }
      </main>
    </>
  )
}
