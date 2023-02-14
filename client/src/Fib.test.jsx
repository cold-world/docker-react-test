import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import Fib from './Fib';

jest.mock('axios');

describe('Fib component', () => {
  test('renders the form and results', async () => {
    axios.get.mockResolvedValueOnce({ data: [1, 2, 3] });
    axios.get.mockResolvedValueOnce({ data: { 1: 1, 2: 1, 3: 2 } });

    render(<Fib />);

    const input = screen.getByLabelText('Enter your index');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    const seenIndexesHeader = screen.getByRole('heading', { name: 'Indexes i have seen:' });
    const calculatedValuesHeader = screen.getByRole('heading', { name: 'Calculated values:' });

    expect(input).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(seenIndexesHeader).toBeInTheDocument();
    expect(calculatedValuesHeader).toBeInTheDocument();

    expect(axios.get).toHaveBeenCalledWith('/api/values/all');
    expect(axios.get).toHaveBeenCalledWith('/api/values/current');

    const seenIndexes = await waitFor(() => screen.getByText('1, 2, 3'));
    const calculatedValues = await waitFor(() =>
      screen.getByText(
        'For index 1 I calculated 1For index 2 I calculated 1For index 3 I calculated 2'
      )
    );

    expect(seenIndexes).toBeInTheDocument();
    expect(calculatedValues).toBeInTheDocument();
  });

  test('handles form submission correctly', async () => {
    axios.post.mockResolvedValueOnce({});
    axios.get.mockResolvedValueOnce({ data: [4] });
    axios.get.mockResolvedValueOnce({ data: { 4: 3 } });

    render(<Fib />);

    const input = screen.getByLabelText('Enter your index');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(input, { target: { value: '4' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(input).toHaveValue(''));

    expect(axios.post).toHaveBeenCalledWith('/api/values', { index: '4' });
    expect(axios.get).toHaveBeenCalledWith('/api/values/all');
    expect(axios.get).toHaveBeenCalledWith('/api/values/current');

    const seenIndexes = await waitFor(() => screen.getByText('4'));
    const calculatedValues = await waitFor(() => screen.getByText('For index 4 I calculated 3'));

    expect(seenIndexes).toBeInTheDocument();
    expect(calculatedValues).toBeInTheDocument();
  });
});
