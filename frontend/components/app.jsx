import React from 'react';
import { Link, hashHistory} from 'react-router';

const App = ({ children }) => (
  <div id="master-view">
    <div className="privacy-header">
      <h1>Owlie The Gift Bot</h1>
      <img src="assets/images/owl.png" alt="logo"/>
    </div>

    <div className="facebook-button">
      <div className="fb-messengermessageus"
        data-messenger_app_id="223589748119371"
        data-page_id="1816355725292778"
        data-color="blue"
        data-size="standard" >
      </div>
    </div>

    <div className="policy-link">
      <Link onClick={() => hashHistory.push('/privacy')}>Privacy Policy</Link>
    </div>
  </div>
);

export default App;
