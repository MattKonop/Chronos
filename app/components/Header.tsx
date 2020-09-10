import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import ListIcon from '@material-ui/icons/Search';
import { ApplicationContext } from '../context/ApplicationContext';
import '../stylesheets/Header.scss';
import '../stylesheets/Occupied.scss';

export interface HeaderProps {
  app: string[];
  service: string;
  live: boolean;
  setLive: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.SFC<HeaderProps> = ({ app, service, setLive, live }) => {
  const history = useHistory();

  const { servicesData } = useContext(ApplicationContext);

  return (
    <div className="microservice-header">
      <h1 className="microserviceTitle">{app}</h1>
      <select name="microservice" value={service} onChange={e => history.replace(e.target.value)}>
        {servicesData.map(({ _id, microservice }: any) => (
          <option key={_id} value={`${microservice}`} selected={service === microservice}>
            {microservice}
          </option>
        ))}
        <option value="communications" selected={service === 'communications'}>
          communications
        </option>
      </select>
      <div className="header-btns">
        <button onClick={() => history.goBack()}><ListIcon className="icon" id="returnToAppIcon" />Return to Applications</button>
        <button onClick={() => setLive(!live)}>
          {live ? (
            <div>
              <span className="dot"></span>Live
            </div>
          ) : (
            <div id="gatherLiveData">Gather Live Data</div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;
