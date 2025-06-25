'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { Category } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/store'

interface SidebarCategoriesProps {
  categories: Category[]
}

export function SidebarCategories({ categories }: SidebarCategoriesProps) {
  const { isCategoriesOpen, closeCategories } = useUiStore()

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    closeCategories()
  }

  return (
    <>
      {/* Background overlay (mobile only) */}
      <AnimatePresence>
        {
          isCategoriesOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }
              }
              exit={{ opacity: 0 }
              }
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={closeCategories}
            />
          )}
      </AnimatePresence>

      {/* Categories Sidebar */}
      <div
        className={
          cn(
            'fixed md:sticky top-0 left-0 h-full md:h-auto w-[250px] md:w-[190px] lg:w-full bg-card shadow-xl z-50 md:z-0 transform transition-transform duration-300 ease-in-out md:translate-x-0',
            isCategoriesOpen ? 'translate-x-0' : '-translate-x-full'
          )
        }
      >
        <div className="flex flex-col h-full md:h-auto" >
          {/* Header (mobile only) */}
          < div className="flex justify-between items-center p-4 border-b md:hidden" >
            <h2 className="text-lg font-semibold" > Categorías </h2>
            < button
              onClick={closeCategories}
              className="p-1 rounded-full hover:bg-muted transition-colors md:hidden"
              aria-label="Close categories"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Categories list */}
          <div className="overflow-y-auto overflow-x-hidden" >
            <motion.ul
              className="divide-y"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {
                categories.map((category, index) => (
                  <motion.li
                    key={category.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <motion.button
                      onClick={() => { scrollToCategory(category.id) }}
                      className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {category.name}
                    </motion.button>
                  </motion.li>
                ))}
            </motion.ul>
          </div>
        </div>
      </div >
    </>
  )
}
