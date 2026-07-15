import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isMissingColumnError,
  isMissingRelationError,
  isSchemaCompatError,
  LESSON_COLUMNS_FULL,
  LESSON_COLUMNS_LEGACY,
} from "./curriculumDb.js";

describe("curriculumDb schema helpers (shipped)", () => {
  it("detects missing column errors (42703)", () => {
    assert.equal(
      isMissingColumnError({
        code: "42703",
        message: 'column course_lessons.section_id does not exist',
      }),
      true
    );
    assert.equal(isMissingColumnError({ code: "PGRST204", message: "column" }), true);
    assert.equal(isMissingColumnError({ code: "42501", message: "permission" }), false);
  });

  it("detects missing relation errors (PGRST205 / 42P01)", () => {
    assert.equal(
      isMissingRelationError({
        code: "PGRST205",
        message: "Could not find the table 'public.course_sections' in the schema cache",
      }),
      true
    );
    assert.equal(
      isMissingRelationError({ code: "42P01", message: "relation does not exist" }),
      true
    );
  });

  it("exposes full and legacy lesson column sets used by selectCourseLessons", () => {
    assert.match(LESSON_COLUMNS_FULL, /section_id/);
    assert.match(LESSON_COLUMNS_FULL, /lecture_type/);
    assert.doesNotMatch(LESSON_COLUMNS_LEGACY, /section_id/);
    assert.equal(isSchemaCompatError({ code: "42703", message: "x" }), true);
  });
});
