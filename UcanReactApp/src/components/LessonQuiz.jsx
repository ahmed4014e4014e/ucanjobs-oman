import { useState } from "react";

export default function LessonQuiz({ quiz, submitting, result, onSubmit }) {
  const [answers, setAnswers] = useState({});

  if (!quiz) return null;

  const allAnswered = quiz.questions.every((question) => Boolean(answers[question.id]));
  const visibleResult = result || quiz.latestAttempt;

  return (
    <section className="mt-6 rounded-3xl border border-[rgba(111,49,29,0.14)] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--oman-terracotta)]">
            Knowledge Check
          </p>
          <h3 className="mt-2 text-xl font-semibold">{quiz.title}</h3>
        </div>
        <span className="w-fit rounded-full bg-[rgba(197,154,68,0.14)] px-3 py-2 text-xs font-semibold">
          Pass: {quiz.passingScore}%
        </span>
      </div>

      <div className="mt-6 grid gap-6">
        {quiz.questions.map((question, questionIndex) => (
          <fieldset key={question.id}>
            <legend className="font-semibold">
              {questionIndex + 1}. {question.prompt}
            </legend>
            <div className="mt-3 grid gap-2">
              {question.options.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-start gap-3 rounded-2xl border bg-[rgba(255,252,247,0.75)] px-4 py-3"
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.id}
                    checked={answers[question.id] === option.id}
                    onChange={() =>
                      setAnswers((current) => ({ ...current, [question.id]: option.id }))
                    }
                    className="mt-1"
                  />
                  <span className="text-sm leading-6">{option.text}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      {visibleResult ? (
        <div
          className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${
            visibleResult.passed
              ? "bg-[rgba(70,125,89,0.14)] text-[#2f6f45]"
              : "bg-[rgba(155,77,49,0.12)] text-[var(--oman-terracotta-dark)]"
          }`}
        >
          Score: {visibleResult.scorePercent}% · {visibleResult.passed ? "Passed" : "Try again"}
        </div>
      ) : null}

      <button
        type="button"
        disabled={!allAnswered || submitting}
        onClick={() => onSubmit(answers)}
        className="oman-button-secondary mt-5 rounded-2xl px-5 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Scoring..." : visibleResult?.passed ? "Retake Quiz" : "Submit Quiz"}
      </button>
    </section>
  );
}
