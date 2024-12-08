import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* <Route
          path="/register"
          element={
            <PublicRoute redirectTo="/dashboard" component={<AuthPage />} />
          }
        /> */}
      </Route>
    </Routes>
  );
};

export default App;
