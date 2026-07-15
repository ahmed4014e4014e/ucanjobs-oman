import { useEffect, useState } from "react";
import { Button, Card } from "../ui";
import LessonQuiz from "../LessonQuiz";

const TYPE_META = {
  video: { label: "Video", icon: "▶" },
  article: { label: "Article", icon: "¶" },
  quiz: { label: "Quiz", icon: "?" },
  resources: { label: "Resources", icon: "📎" },
};

function lectureTypeMeta(type) {
  return TYPE_META[type] || TYPE_META.video;
}

function getEmbeddableVideoUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId = url.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }
    if (host === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }
    if (host === "vimeo.com") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : "";
    }
    if (host === "drive.google.com") {
      const pathParts = url.pathname.split("/").filter(Boolean);
      const fileIndex = pathParts.indexOf("d");
      const fileId = fileIndex >= 0 ? pathParts[fileIndex + 1] : url.searchParams.get("id");
      return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : "";
    }
  } catch {
    return "";
  }
  return "";
}

function isDirectVideoUrl(value) {
  if (!value) return false;
  try {
    const path = new URL(value).pathname.toLowerCase();
    return [".mp4", ".webm", ".ogg", ".mov", ".m4v"].some((ext) => path.endsWith(ext));
  } catch {
    return false;
  }
}

/**
 * Main content pane for learner / preview player.
 */
export default function LecturePlayerPanel({
  lecture,
  sectionTitle,
  onPrev,
  onNext,
  onToggleComplete,
  hasPrev,
  hasNext,
  showComplete = true,
  // Live quiz (production)
  quiz = null,
  quizResult = null,
  quizSubmitting = false,
  onQuizSubmit = null,
  mockMode = false,
}) {
  const [localQuizAnswers, setLocalQuizAnswers] = useState({});
  const [localQuizSubmitted, setLocalQuizSubmitted] = useState(false);
  const [videoPlaybackError, setVideoPlaybackError] = useState("");

  useEffect(() => {
    setLocalQuizAnswers({});
    setLocalQuizSubmitted(false);
    setVideoPlaybackError("");
  }, [lecture?.id]);

  if (!lecture) {
    return (
      <Card
        variant="default"
        padding="lg"
        rounded="xl"
        className="flex min-h-[24rem] items-center justify-center"
      >
        <p className="text-[var(--oman-ink)]/70">Select a lecture from the curriculum.</p>
      </Card>
    );
  }

  const type = lectureTypeMeta(lecture.type || lecture.lecture_type);
  const title = lecture.title || lecture.title_en || "Lecture";
  const body = lecture.body || lecture.body_en || "";
  const videoUrl = lecture.videoUrl || "";
  const videoIsUpload = Boolean(lecture.videoIsUpload);
  const embeddedVideoUrl = getEmbeddableVideoUrl(videoUrl);
  const canPlayInlineVideo =
    Boolean(videoUrl) && (videoIsUpload || isDirectVideoUrl(videoUrl) || Boolean(embeddedVideoUrl));
  const resources = lecture.resources || [];
  const mockQuiz = lecture.quiz;
  const questions = mockQuiz?.questions || [];

  const scoreMockQuiz = () => {
    if (!questions.length) return 0;
    let correct = 0;
    questions.forEach((q) => {
      const selected = localQuizAnswers[q.id];
      const right = q.options?.find((o) => o.correct || o.is_correct);
      if (selected && right && selected === right.id) correct += 1;
    });
    return Math.round((correct / questions.length) * 100);
  };

  return (
    <div className="flex min-h-0 flex-col gap-4">
      {(type.label === "Video" || videoUrl || lecture.videoLabel) &&
      (lecture.type || lecture.lecture_type) !== "quiz" ? (
        <div className="overflow-hidden rounded-[1.25rem] border border-[rgba(111,49,29,0.14)] bg-[#1a1410] shadow-lg">
          <div className="relative aspect-video w-full">
            {canPlayInlineVideo && embeddedVideoUrl ? (
              <iframe
                title={title}
                src={embeddedVideoUrl}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : canPlayInlineVideo ? (
              <video
                key={videoUrl}
                className="absolute inset-0 h-full w-full bg-black"
                controls
                playsInline
                src={videoUrl}
                onError={() => setVideoPlaybackError("Unable to play this video file.")}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#3a241c] via-[#2a211c] to-[#1a1410] text-center text-white">
                <span className="text-4xl opacity-80" aria-hidden="true">
                  ▶
                </span>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--oman-brass)]">
                  {mockMode ? "Video lecture (mock)" : "Video"}
                </p>
                <p className="max-w-md px-4 text-base font-medium">
                  {lecture.videoLabel || title}
                </p>
                {!mockMode && videoUrl ? (
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-[var(--oman-brass)] underline"
                  >
                    Open video link
                  </a>
                ) : null}
              </div>
            )}
          </div>
          {videoPlaybackError ? (
            <p className="border-t border-white/10 px-4 py-2 text-xs text-red-200">{videoPlaybackError}</p>
          ) : null}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-3 text-xs text-white/70">
            <span>{lecture.durationLabel || lecture.duration_label || "—"}</span>
            <span>{type.label}</span>
          </div>
        </div>
      ) : null}

      <Card variant="default" padding="lg" rounded="xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--oman-terracotta)]">
              {sectionTitle || "Course"} · {type.label}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--oman-ink)]">{title}</h2>
            {(lecture.durationLabel || lecture.duration_label) && (
              <p className="mt-1 text-sm text-[var(--oman-ink)]/65">
                {lecture.durationLabel || lecture.duration_label}
              </p>
            )}
          </div>
          {showComplete ? (
            <Button
              type="button"
              variant={lecture.isComplete ? "ghost" : "secondary"}
              size="sm"
              onClick={onToggleComplete}
            >
              {lecture.isComplete ? "Mark incomplete" : "Mark complete"}
            </Button>
          ) : null}
        </div>

        {body ? (
          <div className="mt-6 rounded-2xl bg-[rgba(244,232,214,0.35)] px-5 py-5 text-[var(--oman-ink)]/85">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
              Lesson content
            </p>
            <div className="mt-3 space-y-3 whitespace-pre-wrap text-base leading-7">{body}</div>
          </div>
        ) : null}

        {resources.length ? (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
              Downloads
            </p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {resources.map((file) => {
                const href = file.resolvedUrl || file.fileUrl || file.file_url || "#";
                return (
                  <li key={file.id}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      download={file.name}
                      className="flex w-full items-center gap-3 rounded-2xl border border-[rgba(111,49,29,0.12)] bg-white px-4 py-3 text-left text-sm font-medium transition hover:border-[var(--oman-brass)]"
                    >
                      <span aria-hidden="true">📎</span>
                      <span className="min-w-0 flex-1 truncate">{file.name}</span>
                      <span className="text-xs text-[var(--oman-terracotta)]">Download</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {/* Production quiz */}
        {quiz && onQuizSubmit ? (
          <div className="mt-6">
            <LessonQuiz
              quiz={quiz}
              submitting={quizSubmitting}
              result={quizResult}
              onSubmit={onQuizSubmit}
            />
          </div>
        ) : null}

        {/* Mock quiz */}
        {mockMode && (lecture.type === "quiz" || mockQuiz) && mockQuiz ? (
          <div className="mt-6 rounded-2xl border border-[rgba(111,49,29,0.12)] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--oman-terracotta)]">
                  Quiz
                </p>
                <h3 className="mt-1 text-lg font-semibold">{mockQuiz.title || mockQuiz.title_en}</h3>
              </div>
              <span className="rounded-full bg-[rgba(197,154,68,0.14)] px-3 py-1 text-xs font-semibold">
                Pass {mockQuiz.passingScore || mockQuiz.passing_score || 70}%
              </span>
            </div>
            <div className="mt-5 space-y-5">
              {questions.map((question, index) => (
                <fieldset key={question.id}>
                  <legend className="font-semibold text-[var(--oman-ink)]">
                    {index + 1}. {question.prompt || question.prompt_en}
                  </legend>
                  <div className="mt-2 grid gap-2">
                    {(question.options || []).map((option) => (
                      <label
                        key={option.id}
                        className="flex cursor-pointer items-start gap-3 rounded-xl border border-[rgba(111,49,29,0.1)] bg-[rgba(255,252,247,0.8)] px-4 py-3"
                      >
                        <input
                          type="radio"
                          name={`panel-q-${question.id}`}
                          checked={localQuizAnswers[question.id] === option.id}
                          onChange={() =>
                            setLocalQuizAnswers((current) => ({
                              ...current,
                              [question.id]: option.id,
                            }))
                          }
                          className="mt-1"
                        />
                        <span className="text-sm leading-6">{option.text || option.option_en}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            {localQuizSubmitted ? (
              <p className="mt-4 rounded-xl bg-[rgba(82,101,74,0.12)] px-4 py-3 text-sm font-semibold text-[var(--oman-olive)]">
                Score: {scoreMockQuiz()}%
              </p>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              className="mt-4"
              disabled={questions.some((q) => !localQuizAnswers[q.id])}
              onClick={() => setLocalQuizSubmitted(true)}
            >
              Submit quiz
            </Button>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 border-t border-[rgba(111,49,29,0.1)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="ghost" disabled={!hasPrev} onClick={onPrev}>
            ← Previous lecture
          </Button>
          <Button type="button" variant="primary" disabled={!hasNext} onClick={onNext}>
            Next lecture →
          </Button>
        </div>
      </Card>
    </div>
  );
}
