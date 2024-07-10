import {
  BrowserRouter as Router,
} from "react-router-dom";
import {
  Arwes,
  SoundsProvider,
  ThemeProvider,
  createSounds,
  createTheme,
} from "arwes";

import AppLayout from "./pages/AppLayout";

import { theme, resources, sounds } from "./settings";
import { AuthProvider } from "./context/authContext";

const App = () => {
  return (
  <AuthProvider> 
    <ThemeProvider theme={createTheme(theme)}>
      <SoundsProvider sounds={createSounds(sounds)}>
        <Arwes animate background={resources.background.large} pattern={resources.pattern}>
          {anim => (
            <Router>
              <AppLayout show={anim.entered} />
            </Router>
          )}
        </Arwes>
      </SoundsProvider>
    </ThemeProvider>
  </AuthProvider>);
};

export default App;
