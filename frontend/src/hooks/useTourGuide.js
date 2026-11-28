import { useCallback, useContext, useEffect } from "react";
import { TourGuideContext } from "../components/tour-guide/TourGuideContext.js";

export default function useTourGuide(
  group,
  { onBeforeStepChange, onBeforeStart, onFinish } = {},
) {
  const tgRef = useContext(TourGuideContext);

  if (!tgRef) {
    throw new Error("useTutorial must be used within TourGuideProvider");
  }

  const registerStepEl = useCallback(
    ({ content, title = undefined, order = undefined }) => ({
      "data-tg-tour": content,
      "data-tg-title": title,
      "data-tg-order": order,
      "data-tg-group": group,
    }),
    [group],
  );

  useEffect(() => {
    const handleOnBeforeStepChange = (from, to) => {
      onBeforeStepChange?.(from, to);
      return true;
    };

    if (tgRef.current) {
      tgRef.current.onBeforeStepChange(handleOnBeforeStepChange);
      if (onFinish) tgRef.current.onFinish(onFinish);
    }

    return () => {
      const tg = tgRef.current;
      if (tg?.isVisible && tg.group === group) {
        void tg.exit();
      }
    };
  }, [group, tgRef]);

  const start = useCallback(async () => {
    const tg = tgRef.current;

    if (!tg) {
      throw new Error("TourGuideClient has not been initialized");
    }

    await onBeforeStart?.();
    await tg.start(group);
    await tg.refreshDialog();
  }, [group, tgRef, onBeforeStart]);

  return {
    start,
    registerStepEl,
  };
}
