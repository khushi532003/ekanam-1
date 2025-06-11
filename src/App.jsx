import { Canvas } from "@react-three/fiber";
import Entrance from "./pages/Entrance";
import Loader from "./components/Loader";
import { Suspense, useState } from "react";
import Interface from "./pages/Interface";

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
          <Canvas shadows camera={cameraSettings}
           fog={{ color: '#d0e0f0', near: 10, far: 2 }}
          >
            <Suspense fallback={null}>
              <Entrance />
            </Suspense>
          </Canvas>
          <Interface/>
        </>
     )} 
    </>
  );
}

export default App;