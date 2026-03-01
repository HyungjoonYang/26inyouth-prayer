import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from '../../components/Header'

describe('Header', () => {
  it('should render the title', () => {
    render(<Header />)
    expect(screen.getByText(/인유스 기도함/)).toBeInTheDocument()
  })

  it('should render the bible verse', () => {
    render(<Header />)
    expect(screen.getByText(/마태복음 18:20/)).toBeInTheDocument()
  })
})
