import { useSelection } from "./hooks/use-selection";

function App() {
  const { ref, scrollRef, area } = useSelection();

  console.log(area);

  return (
    <div
      ref={scrollRef}
      style={{
        overflow: "auto",
        height: "100vh",
      }}
    >
      <div
        ref={ref}
        style={{
          backgroundColor: "#FFFFFFFF",
          height: "1584px",
          width: "1224px",
        }}
      />
    </div>
  );
}

export default App;
