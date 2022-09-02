import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';
//Components
import { QuestionCard } from './components/QuestionCard';
// Types
import { QuestionState, Difficulty } from './API';
// Styles 
import { GlobalStyle, Wrapper } from './App.styles';
import { JsxFragment } from 'typescript';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const MAX_NUM_QUESTIONS: number = 50;

const App: React.FC = () => {

  const [numOfQuestions, setNumOfQuestions] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [showResults, setShowResults] = useState(false);

  const startTrivia = async () => {
    setLoading(true);
    setShowResults(false);
    setGameOver(false);
    const newQuestions = await fetchQuizQuestions(numOfQuestions, Difficulty.EASY);
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // Users answer
      const answer: string = e.currentTarget.value;
      // Check answer 
      const correct: boolean = questions[number].correct_answer === answer;
      // Add score if answer is correct
      if (correct) setScore(currentScore => currentScore + 1);
      // Save answer in the array for user answers
      const answerObject: AnswerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      }
      setUserAnswers(currentUserAnswers => [...currentUserAnswers, answerObject]);
      if(userAnswers.length === numOfQuestions -1) setShowResults(true);
    }
  }

  const nextQuestion = () => {
    const nextQuestion = number + 1;
    if (nextQuestion === numOfQuestions) {
      setGameOver(true);
    } else {
      setNumber(currentNumber => currentNumber + 1);
    }
  }

  const getPercOfCorrectAnswers = () : number => score / (numOfQuestions/100);

  const getValutation = () : string => {
    let valutation: string = '';
    let percOfCorrectAnswers: number = getPercOfCorrectAnswers();
    if(percOfCorrectAnswers <=30) {
      valutation = 'Too bad :(';
    } else if (percOfCorrectAnswers > 30 && percOfCorrectAnswers <=60) {
      valutation = 'You can do better :/';
    } else if (percOfCorrectAnswers > 60 && percOfCorrectAnswers <= 85) {
      valutation = 'Well done :)';
    } else if (percOfCorrectAnswers > 90) {
      valutation = 'Excellent !!!'
    }
    return valutation;

  }

  return (
    <>
      <GlobalStyle />
        <Wrapper>

        <h1>TRIVIA QUIZ</h1>

        {
          (gameOver || userAnswers.length === numOfQuestions) &&
          <>
          <sub style={{ color: 'white'}}>(Max: 50)</sub>
          <input type="number" placeholder='Number of questions' value={numOfQuestions} max={MAX_NUM_QUESTIONS} onChange={(e)=>setNumOfQuestions(Number.parseInt(e.target.value))} />
          <button className="start" disabled={!numOfQuestions || numOfQuestions <= 0 || numOfQuestions > MAX_NUM_QUESTIONS} onClick={startTrivia}>
            { showResults ? 'Restart' : 'Start' }
          </button>
          </>
          
        }

        {
          !gameOver && <p className="score">Score: {score}</p>
        }

        {
          loading && <p>Loading Questions...</p>
        }

        {
          !loading && !gameOver && !showResults && (
            <QuestionCard
              questionNr={number + 1}
              totalQuestions={numOfQuestions}
              question={questions[number].question}
              answers={questions[number].answers}
              userAnswer={userAnswers ? userAnswers[number] : undefined}
              callback={checkAnswer}
            />
          )
        }

        {
          showResults && 
          <>
            <p>{getValutation()}</p>
            <p>Correct answers: {getPercOfCorrectAnswers()}%</p>
          </>
        }

        {
          (!gameOver && !loading && userAnswers.length === number + 1 && number !== numOfQuestions - 1) &&
          <button className="next" onClick={nextQuestion}>
            Next Question
          </button>
        }

      </Wrapper>

    </>
  );
}

export default App;
