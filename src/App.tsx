import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import { useSelection } from "./hooks/use-selection";
import { useState } from "react";
import file from "./assets/document.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function App() {
  const [scale, setScale] = useState(1);

  const { ref, scrollRef, area } = useSelection({
    borderWidth: 1,
    scale: scale,
  });

  console.log(area);

  return (
    <div style={{ display: "flex" }}>
      <main ref={scrollRef}>
        <div style={{ border: "2px solid red", width: "fit-content" }}>
          <div ref={ref}>
            <Document file={file}>
              <Page loading="22222" renderTextLayer={false} scale={scale} pageNumber={1} />
            </Document>
          </div>
        </div>
      </main>
      <div>
        <button onClick={() => setScale((state) => state + 1)}>Zoom In</button>
        <button onClick={() => setScale((state) => state - 1)}>Zoom Out</button>
      </div>
    </div>
  );
}

export default App;
