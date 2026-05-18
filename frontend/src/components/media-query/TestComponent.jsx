import useMatchMedia from "./useMatchMedia";

export const TestComponent = () => {
  const isMobile = useMatchMedia("(max-width: 400px)", false);

  return (
    <div>
      {isMobile ? "TELA MENOS LARGA QUE 400PX" : "TELA MAIS LARGA QUE 400PX"}
    </div>
  );
};
