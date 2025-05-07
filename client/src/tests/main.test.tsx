import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StrictMode } from 'react';
import App from '../App';
import { EmpProvider } from '../context/Empcontext';

describe('Main Application Render', () => {
  it('renders Login component through App without crashing', () => {
    render(
      <StrictMode>
        <EmpProvider>
          <App />
        </EmpProvider>
      </StrictMode>
    );

    const title = screen.getByRole('heading', { name: /login/i });
    expect(title).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /log in/i });
    expect(button).toBeInTheDocument();
  });
});
