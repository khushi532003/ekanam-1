import { Canvas } from "@react-three/fiber";
import Entrance from "./pages/Entrance";
import Loader from "./components/Loader";
import { Suspense, useState } from "react";
import Interface from "./pages/Interface";
import Progress from "./components/Progress/Progress";

function App() {
  const cameraSettings = {
    fov: 75,
    near: 0.1,
    // far: 200,
    position: [0, 2, 5]
  };

  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Loader setLoading={setLoading} />}

      {!loading && (
        <>
          <Canvas shadows camera={cameraSettings}>
            <Suspense fallback={<Progress />}>
              {!loading ? <Entrance /> : null}
            </Suspense>
          </Canvas>
          <Interface />
        </>
      )}
    </>
  );
}

export default App;