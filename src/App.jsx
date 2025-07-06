import Map from './components/map/Map';
import Sidebar from './components/sidebar/sidebar.component';

import './App.scss';

function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Map />
      </div>
    </div>
  );
}

export default App;
