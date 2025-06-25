'use client'

import { motion } from 'framer-motion'
import ProductCard from '@/components/products/product-card'
import type { Product, Category } from '@/lib/types'
import { useBranchStore } from '@/store'

interface ProductListProps {
  products: Product[]
  categories: Category[]
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export function ProductList({ products, categories }: ProductListProps) {
  const { selectedBranch } = useBranchStore()

  return (
    <div className="space-y-12">
      {categories.map((category) => {
        const categoryProducts = products.filter((product) => {
          const belongsToBranch = selectedBranch
            ? product.branches?.some(branch => branch.id === selectedBranch.id)
            : true

          return product.categoryId === category.id && product.isAvailable && belongsToBranch
        })

        if (categoryProducts.length === 0) return null

        return (
          <section key={category.id} id={`category-${category.id}`} className="scroll-mt-20">
            <motion.h2
              className="text-2xl font-bold mb-6 pb-2 border-b-2 border-primary"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {category.name}
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </section>
        )
      })}
    </div>
  )
}
