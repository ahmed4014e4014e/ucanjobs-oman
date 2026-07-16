import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DEFAULT_SECTION_ID,
  getSectionById,
  isValidSectionId,
} from "../profileSections";

export function useProfileSection() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeSectionId = useMemo(() => {
    const raw = searchParams.get("section") || DEFAULT_SECTION_ID;
    return isValidSectionId(raw) ? raw : DEFAULT_SECTION_ID;
  }, [searchParams]);

  const activeSection = useMemo(
    () => getSectionById(activeSectionId),
    [activeSectionId]
  );

  const setSection = useCallback(
    (sectionId) => {
      const nextId = isValidSectionId(sectionId) ? sectionId : DEFAULT_SECTION_ID;
      const next = new URLSearchParams(searchParams);
      if (nextId === DEFAULT_SECTION_ID) {
        next.delete("section");
      } else {
        next.set("section", nextId);
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  return { activeSectionId, activeSection, setSection };
}
