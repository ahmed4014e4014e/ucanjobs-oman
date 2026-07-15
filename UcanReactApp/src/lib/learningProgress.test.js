import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateCurriculumProgress,
  collectCurriculumResources,
  scoreQuizAnswers,
  serializeCurriculumForSave,
  roundTripCurriculum,
  curriculumSnapshot,
} from "./curriculumModel.js";

describe("learner progress + quiz scoring (shipped curriculumModel)", () => {
  it("increases progress when a lecture is completed via shipped calculator", () => {
    const lectures = [
      { id: "a", isComplete: false },
      { id: "b", isComplete: false },
      { id: "c", isComplete: false },
      { id: "d", isComplete: false },
    ];
    assert.equal(calculateCurriculumProgress(lectures), 0);

    const afterOne = lectures.map((lecture) =>
      lecture.id === "a" ? { ...lecture, isComplete: true } : lecture
    );
    assert.equal(calculateCurriculumProgress(afterOne), 25);

    const afterTwo = afterOne.map((lecture) =>
      lecture.id === "b" ? { ...lecture, isComplete: true } : lecture
    );
    assert.equal(calculateCurriculumProgress(afterTwo), 50);
  });

  it("scores pass and fail using shipped scoreQuizAnswers", () => {
    const questions = [
      {
        id: "q1",
        options: [
          { id: "o1", is_correct: true },
          { id: "o2", is_correct: false },
        ],
      },
      {
        id: "q2",
        options: [
          { id: "o3", is_correct: false },
          { id: "o4", is_correct: true },
        ],
      },
    ];
    const pass = scoreQuizAnswers(questions, { q1: "o1", q2: "o4" });
    const fail = scoreQuizAnswers(questions, { q1: "o2", q2: "o3" });
    assert.equal(pass, 100);
    assert.equal(fail, 0);
    assert.ok(pass >= 70);
    assert.ok(fail < 70);
  });

  it("collects multi resources via shipped collectCurriculumResources", () => {
    const sections = [
      {
        id: "s1",
        title: "Intro",
        lectures: [
          {
            id: "l1",
            title: "Welcome",
            resources: [
              { id: "r1", name: "a.pdf", file_url: "storage://x/a.pdf" },
              { id: "r2", name: "b.pdf", file_url: "storage://x/b.pdf" },
            ],
          },
        ],
      },
    ];
    const resources = collectCurriculumResources(sections);
    assert.equal(resources.length, 2);
    assert.equal(resources[0].lectureTitle, "Welcome");
    assert.equal(resources[0].sectionTitle, "Intro");
  });

  it("instructor save serialize preserves multi resources (shipped serializeCurriculumForSave)", () => {
    const original = [
      {
        id: "sec",
        title: "S",
        lectures: [
          {
            id: "lec",
            title_en: "L",
            type: "video",
            is_published: true,
            resources: [
              { id: "r1", name: "one.pdf", file_url: "storage://one" },
              { id: "r2", name: "two.pdf", file_url: "storage://two" },
            ],
          },
        ],
      },
    ];
    const { lessonPayload, resourcePayload } = serializeCurriculumForSave(original);
    assert.equal(lessonPayload.length, 1);
    assert.equal(resourcePayload.length, 2);
    assert.equal(resourcePayload[0].name, "one.pdf");
    assert.equal(resourcePayload[1].file_url, "storage://two");

    const rebuilt = roundTripCurriculum(original);
    assert.deepEqual(curriculumSnapshot(rebuilt), curriculumSnapshot(original));
  });
});
