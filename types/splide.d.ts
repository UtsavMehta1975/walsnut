declare module '@splidejs/react-splide' {
  import { ComponentType, ReactNode } from 'react'

  export interface SplideProps {
    options?: any
    children: ReactNode
    'aria-label'?: string
    className?: string
  }

  export interface SplideSlideProps {
    children: ReactNode
    className?: string
  }

  export const Splide: ComponentType<SplideProps>
  export const SplideSlide: ComponentType<SplideSlideProps>
}

