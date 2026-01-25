import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { describe, it, expect, vi } from 'vitest'

// Mock window.scrollTo to prevent errors in JSDOM
Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });

describe('App', () => {
    it('renders main content without crashing', () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        )
        // Check if the main element exists
        expect(screen.getByRole('main')).toBeInTheDocument()
    })
})
