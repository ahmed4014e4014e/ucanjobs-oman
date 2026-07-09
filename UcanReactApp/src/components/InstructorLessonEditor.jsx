import { getStoredCourseMediaName } from "../lib/courseMediaApi";

function mediaLabel(value) {
  return getStoredCourseMediaName(value) || (value ? "External link attached" : "No file attached");
}

export default function InstructorLessonEditor({
  lesson,
  index,
  disabled,
  uploadingField,
  onChange,
  onRemove,
  onUpload,
}) {
  const updateQuiz = (field, value) => {
    onChange("quiz", { ...lesson.quiz, [field]: value });
  };

  const updateQuestion = (questionId, field, value) => {
    updateQuiz(
      "questions",
      lesson.quiz.questions.map((question) =>
        question.id === questionId ? { ...question, [field]: value } : question
      )
    );
  };

  const updateOption = (questionId, optionId, field, value) => {
    updateQuiz(
      "questions",
      lesson.quiz.questions.map((question) => {
        if (question.id !== questionId) return question;
        return {
          ...question,
          options: question.options.map((option) =>
            option.id === optionId
              ? {
                  ...option,
                  ...(field === "is_correct" && value
                    ? { is_correct: option.id === optionId }
                    : { [field]: value }),
                }
              : field === "is_correct" && value
                ? { ...option, is_correct: false }
                : option
          ),
        };
      })
    );
  };

  const addQuestion = () => {
    updateQuiz("questions", [
      ...lesson.quiz.questions,
      {
        id: crypto.randomUUID(),
        prompt_en: "",
        explanation_en: "",
        options: [
          { id: crypto.randomUUID(), option_en: "", is_correct: true },
          { id: crypto.randomUUID(), option_en: "", is_correct: false },
        ],
      },
    ]);
  };

  const addOption = (questionId) => {
    updateQuiz(
      "questions",
      lesson.quiz.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: [
                ...question.options,
                { id: crypto.randomUUID(), option_en: "", is_correct: false },
              ],
            }
          : question
      )
    );
  };

  return (
    <article className="oman-card rounded-[1.75rem] p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">Lesson {index + 1}</h3>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold ring-1 ring-[rgba(111,49,29,0.14)] disabled:opacity-50"
        >
          Remove
        </button>
      </div>

      <div className="mt-5 grid gap-4">
        <label>
          <span className="text-sm font-semibold">Lesson title *</span>
          <input
            value={lesson.title_en}
            onChange={(event) => onChange("title_en", event.target.value)}
            disabled={disabled}
            required
            className="mt-2 min-h-12 w-full rounded-2xl border bg-white px-4 py-3 disabled:opacity-60"
          />
        </label>

        <label>
          <span className="text-sm font-semibold">Lesson text</span>
          <textarea
            value={lesson.body_en}
            onChange={(event) => onChange("body_en", event.target.value)}
            disabled={disabled}
            rows={7}
            className="mt-2 w-full rounded-2xl border bg-white px-4 py-3 disabled:opacity-60"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border bg-white p-4">
            <label className="text-sm font-semibold" htmlFor={`video-${lesson.id}`}>
              Video recording
            </label>
            <input
              id={`video-${lesson.id}`}
              type="file"
              accept="video/*"
              disabled={disabled || uploadingField === "video_url"}
              onChange={(event) => onUpload("video_url", event.target.files?.[0] || null)}
              className="mt-3 block w-full text-sm"
            />
            <p className="mt-2 break-all text-xs text-[var(--oman-ink)]/60">
              {uploadingField === "video_url" ? "Uploading..." : mediaLabel(lesson.video_url)}
            </p>
            <input
              type="url"
              value={lesson.video_url.startsWith("storage://") ? "" : lesson.video_url}
              onChange={(event) => onChange("video_url", event.target.value)}
              disabled={disabled}
              placeholder="Or enter a video URL"
              className="mt-3 min-h-11 w-full rounded-xl border px-3 py-2"
            />
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <label className="text-sm font-semibold" htmlFor={`resource-${lesson.id}`}>
              Lesson attachment
            </label>
            <input
              id={`resource-${lesson.id}`}
              type="file"
              disabled={disabled || uploadingField === "resource_url"}
              onChange={(event) => onUpload("resource_url", event.target.files?.[0] || null)}
              className="mt-3 block w-full text-sm"
            />
            <p className="mt-2 break-all text-xs text-[var(--oman-ink)]/60">
              {uploadingField === "resource_url" ? "Uploading..." : mediaLabel(lesson.resource_url)}
            </p>
            <input
              type="url"
              value={lesson.resource_url.startsWith("storage://") ? "" : lesson.resource_url}
              onChange={(event) => onChange("resource_url", event.target.value)}
              disabled={disabled}
              placeholder="Or enter an attachment URL"
              className="mt-3 min-h-11 w-full rounded-xl border px-3 py-2"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-[rgba(111,49,29,0.1)]">
            <input
              type="checkbox"
              checked={lesson.is_preview}
              onChange={(event) => onChange("is_preview", event.target.checked)}
              disabled={disabled}
            />
            Free preview
          </label>
          <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-[rgba(111,49,29,0.1)]">
            <input
              type="checkbox"
              checked={lesson.is_published}
              onChange={(event) => onChange("is_published", event.target.checked)}
              disabled={disabled}
            />
            Include in course
          </label>
        </div>

        <section className="mt-2 border-t border-[rgba(111,49,29,0.12)] pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="font-semibold">Lesson quiz</h4>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange("quiz", lesson.quiz ? null : {
                id: crypto.randomUUID(),
                title_en: "Lesson Quiz",
                passing_score: 70,
                questions: [],
              })}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold ring-1 ring-[rgba(111,49,29,0.14)] disabled:opacity-50"
            >
              {lesson.quiz ? "Remove Quiz" : "Add Quiz"}
            </button>
          </div>

          {lesson.quiz ? (
            <div className="mt-5 grid gap-5">
              <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
                <label>
                  <span className="text-sm font-semibold">Quiz title</span>
                  <input
                    value={lesson.quiz.title_en}
                    onChange={(event) => updateQuiz("title_en", event.target.value)}
                    disabled={disabled}
                    className="mt-2 min-h-11 w-full rounded-xl border px-3 py-2"
                  />
                </label>
                <label>
                  <span className="text-sm font-semibold">Passing score</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={lesson.quiz.passing_score}
                    onChange={(event) => updateQuiz("passing_score", event.target.value)}
                    disabled={disabled}
                    className="mt-2 min-h-11 w-full rounded-xl border px-3 py-2"
                  />
                </label>
              </div>

              {lesson.quiz.questions.map((question, questionIndex) => (
                <fieldset key={question.id} className="rounded-2xl border bg-[rgba(255,252,247,0.7)] p-4">
                  <legend className="px-2 text-sm font-semibold">Question {questionIndex + 1}</legend>
                  <label>
                    <span className="text-sm font-semibold">Question text</span>
                    <input
                      value={question.prompt_en}
                      onChange={(event) => updateQuestion(question.id, "prompt_en", event.target.value)}
                      disabled={disabled}
                      className="mt-2 min-h-11 w-full rounded-xl border bg-white px-3 py-2"
                    />
                  </label>

                  <div className="mt-4 grid gap-3">
                    {question.options.map((option, optionIndex) => (
                      <div key={option.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={option.is_correct}
                          onChange={() => updateOption(question.id, option.id, "is_correct", true)}
                          disabled={disabled}
                          aria-label={`Mark answer ${optionIndex + 1} correct`}
                        />
                        <input
                          value={option.option_en}
                          onChange={(event) =>
                            updateOption(question.id, option.id, "option_en", event.target.value)
                          }
                          disabled={disabled}
                          placeholder={`Answer ${optionIndex + 1}`}
                          className="min-h-11 w-full rounded-xl border bg-white px-3 py-2"
                        />
                        <button
                          type="button"
                          disabled={disabled || question.options.length <= 2}
                          onClick={() =>
                            updateQuestion(
                              question.id,
                              "options",
                              question.options.filter((item) => item.id !== option.id)
                            )
                          }
                          className="rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-40"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => addOption(question.id)}
                      className="rounded-xl bg-white px-4 py-2 text-sm font-semibold ring-1 ring-[rgba(111,49,29,0.14)]"
                    >
                      Add Answer
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() =>
                        updateQuiz(
                          "questions",
                          lesson.quiz.questions.filter((item) => item.id !== question.id)
                        )
                      }
                      className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[var(--oman-terracotta-dark)] ring-1 ring-[rgba(111,49,29,0.14)]"
                    >
                      Remove Question
                    </button>
                  </div>
                </fieldset>
              ))}

              <button
                type="button"
                disabled={disabled}
                onClick={addQuestion}
                className="w-fit rounded-xl bg-white px-4 py-2 text-sm font-semibold ring-1 ring-[rgba(111,49,29,0.14)]"
              >
                Add Question
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </article>
  );
}
