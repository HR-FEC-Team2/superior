import React from 'react';
import {
  render, screen, cleanup, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Questions from '../Questions.jsx';
import exampleFeature from '../../../../../examples/products/product';
import exampleQuestions from '../../../../../examples/questions/questions';
import fetcherMock from '../../../fetchers/questions';

jest.mock('../../../fetchers/questions');

beforeEach(() => jest.clearAllMocks());
afterEach(cleanup);

describe('Questions & Answers Component', () => {
  beforeEach(async () => {
    fetcherMock.getQuestionsById.mockResolvedValueOnce({ data: exampleQuestions });
    render(<Questions feature={exampleFeature} />);
    await screen.findByRole('heading');
  });

  it('should render the Questions component', () => {
    const header = screen.getByRole('heading', { level: 2 });
    expect(header).toBeInTheDocument();
  });

  it('should fetch questions once on load', async () => {
    expect(fetcherMock.getQuestionsById).toHaveBeenCalledTimes(1);
    await screen.findAllByText('Q: ', { exact: false });
    expect(fetcherMock.getQuestionsById).toHaveBeenCalledTimes(1);
  });

  it('should only render 2 questions with answers on load', async () => {
    const questions = await screen.findAllByText('Q: ', { exact: false });
    expect(questions.length).toBe(2);
  });

  // extract this test into QuestionsList
  it('should render 2 more questions on button click', async () => {
    const button = screen.getByRole('button', {
      name: 'MORE ANSWERED QUESTIONS',
    });
    let questions = await screen.findAllByText('Q: ', { exact: false });
    expect(questions.length).toBe(2);
    await userEvent.click(button);
    questions = await screen.findAllByText('Q: ', { exact: false });
    expect(questions.length).toBe(4);
  });
});