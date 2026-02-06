import {type ComponentPropsWithoutRef, type ElementType, type ReactNode} from 'react'
import './Card.css'

type CardProps<T extends ElementType = 'div'> = {
  as?: T
  className?: string
  header?: ReactNode
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children' | 'header'>

const Card = <T extends ElementType = 'div'>({
                                               as,
                                               className = '',
                                               header,
                                               children,
                                               ...rest
                                             }: CardProps<T>) => {
  const Component = (as ?? 'div') as ElementType
  const classes = className ? `card ${className}` : 'card'
  return (
      <Component className={classes} {...rest}>
        {header}
        {children}
      </Component>
  )
}

export default Card
