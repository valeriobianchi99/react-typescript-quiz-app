import React from 'react';
// Types
import { AnswerObject } from '../App';
// Styles
import { Wrapper, ButtonWrapper } from './QuestionCard.styles';

type QuestionCardProps = {
    question: string;
    answers: string[];
    callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
    userAnswer: AnswerObject | undefined;
    questionNr: number;
    totalQuestions: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, answers, callback, userAnswer, questionNr, totalQuestions }) => (
    <Wrapper>
        <p className="number">Question: {questionNr}/{totalQuestions}</p>
        <p dangerouslySetInnerHTML={{ __html: question}}/>
        <div>
            {
                answers.map((answer, index)=> (
                    <ButtonWrapper key={index} correct={userAnswer?.correctAnswer === answer} userClicked={userAnswer?.answer === answer}>
                        <button disabled={!!userAnswer} value={answer} onClick={callback}>
                            <span dangerouslySetInnerHTML={{ __html: answer }}/>
                        </button>
                    </ButtonWrapper>
                ))
            }
        </div>
    </Wrapper>
);