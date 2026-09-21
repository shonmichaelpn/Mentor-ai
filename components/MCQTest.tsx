"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface MCQTestProps {
  questions: Question[];
  onPassed?: () => void;
  onContinue?: () => void;
}

export default function MCQTest({
  questions,
  onPassed,
  onContinue,
}: MCQTestProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [finished, setFinished] = useState(false);

  const scoreRef = useRef(0);
  const questionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const passingScore = 7;

  const resetTest = () => {
    if (questionTimerRef.current) {
      clearTimeout(questionTimerRef.current);
    }

    if (answerTimerRef.current) {
      clearTimeout(answerTimerRef.current);
    }

    setIsOpen(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(15);
    setFinished(false);

    scoreRef.current = 0;
  };

  const startTest = () => {
    if (questionTimerRef.current) {
      clearTimeout(questionTimerRef.current);
    }

    if (answerTimerRef.current) {
      clearTimeout(answerTimerRef.current);
    }

    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(15);
    setFinished(false);

    scoreRef.current = 0;

    setIsOpen(true);
  };

  const finishTest = useCallback(() => {
    const finalScore = scoreRef.current;

    setScore(finalScore);
    setFinished(true);

    if (finalScore >= passingScore) {
      onPassed?.();
    }
  }, [onPassed]);

  const moveToNextQuestion = useCallback(() => {
    if (currentQuestion >= questions.length - 1) {
      finishTest();
      return;
    }

    setCurrentQuestion((previous) => previous + 1);
    setSelectedAnswer(null);
    setTimeLeft(15);
  }, [currentQuestion, finishTest, questions.length]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null || finished) {
      return;
    }

    const isCorrect = index === questions[currentQuestion].answer;

    setSelectedAnswer(index);

    if (isCorrect) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
    }

    answerTimerRef.current = setTimeout(() => {
      moveToNextQuestion();
    }, 500);
  };

  /*
   * Question timer
   */
  useEffect(() => {
    if (!isOpen || finished || selectedAnswer !== null) {
      return;
    }

    questionTimerRef.current = setTimeout(() => {
      if (timeLeft === 0) {
        moveToNextQuestion();
      } else {
        setTimeLeft((previous) => previous - 1);
      }
    }, timeLeft === 0 ? 0 : 1000);

    return () => {
      if (questionTimerRef.current) {
        clearTimeout(questionTimerRef.current);
      }
    };
  }, [
    isOpen,
    finished,
    selectedAnswer,
    timeLeft,
    currentQuestion,
    moveToNextQuestion,
  ]);

  /*
   * Close and reset the test when the browser tab becomes hidden.
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isOpen) {
        resetTest();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [isOpen]);

  /*
   * Clean up timers when the component unmounts.
   */
  useEffect(() => {
    return () => {
      if (questionTimerRef.current) {
        clearTimeout(questionTimerRef.current);
      }

      if (answerTimerRef.current) {
        clearTimeout(answerTimerRef.current);
      }
    };
  }, []);

  /*
   * Safety check.
   *
   * MCQTest should always receive questions, but this prevents
   * the entire page from crashing if the data is temporarily missing.
   */
  if (!questions || questions.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8">
        <div className="text-sm font-medium text-accent">
          Knowledge Test
        </div>

        <h2 className="mt-2 font-display text-xl font-medium text-foreground">
          Test unavailable
        </h2>

        <p className="mt-2 text-sm text-muted">
          No questions are available for this chapter yet.
        </p>
      </div>
    );
  }

  const question = questions[currentQuestion];

  if (!isOpen) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8">
        <div className="text-sm font-medium text-accent">
          Knowledge Test
        </div>

        <h2 className="mt-2 font-display text-2xl font-medium text-foreground">
          Test your understanding
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Answer 10 questions to test your understanding of this
          chapter. You have 15 seconds for each question and need
          at least 7 correct answers to pass.
        </p>

        <button
          onClick={startTest}
          className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90"
        >
          Start Test
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <div className="text-sm font-medium text-accent">
              Knowledge Test
            </div>

            {!finished && (
              <div className="mt-1 text-xs text-muted">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            )}
          </div>

          <button
            onClick={resetTest}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-foreground"
            aria-label="Close test"
          >
            ✕
          </button>
        </div>

        {finished ? (
          /* Results */
          <div className="px-8 py-12 text-center">
            <div
              className={`text-sm font-medium ${
                score >= passingScore
                  ? "text-emerald-400"
                  : "text-accent"
              }`}
            >
              {score >= passingScore
                ? "Test Passed"
                : "Keep Practicing"}
            </div>

            <h2 className="mt-2 font-display text-3xl font-medium text-foreground">
              {score}/{questions.length}
            </h2>

            <p className="mt-2 text-sm text-muted">
              You scored{" "}
              {Math.round((score / questions.length) * 100)}%.
            </p>

            <p className="mt-5 text-sm text-muted">
              You need {passingScore} out of {questions.length}{" "}
              correct answers to pass.
            </p>

            <div className="mt-8 flex justify-center gap-3">
              <button
                onClick={startTest}
                className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90"
              >
                Retake Test
              </button>

              {score >= passingScore && (
                <button
                  onClick={() => {
                    setIsOpen(false)
                    onContinue?.();
                  }}
                  className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted transition hover:border-accent hover:text-foreground"
                >
                  Continue →
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Question */
          <div className="px-8 py-8">
            {/* Timer */}
            <div className="mb-8">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-muted">
                  Time remaining
                </span>

                <span
                  className={`font-semibold ${
                    timeLeft <= 5
                      ? "text-red-400"
                      : "text-foreground"
                  }`}
                >
                  {timeLeft}s
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div
                  className={`h-full transition-all duration-1000 ${
                    timeLeft <= 5
                      ? "bg-red-500"
                      : "bg-accent"
                  }`}
                  style={{
                    width: `${(timeLeft / 15) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <h2 className="font-display text-xl font-medium leading-8 text-foreground">
              {question.question}
            </h2>

            {/* Options */}
            <div className="mt-7 space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.answer;

                let optionClass =
                  "border-border bg-surface hover:border-accent/40";

                if (selectedAnswer !== null) {
                  if (isCorrect) {
                    optionClass =
                      "border-emerald-500/50 bg-emerald-500/10";
                  } else if (isSelected) {
                    optionClass =
                      "border-red-500/50 bg-red-500/10";
                  } else {
                    optionClass =
                      "border-border bg-surface opacity-50";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${optionClass}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-medium text-muted">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span className="text-sm leading-6 text-foreground">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}