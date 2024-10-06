import * as React from 'react';

interface IHomeProps {

}
const Home: React.FunctionComponent<IHomeProps> = (props) =>{
    return (
        <div className="p-4">
          <h1 className="text-2xl font-bold">Welcome to Fresh and Frugal!</h1>
          <p className="mt-2">Manage your pantry and recipes efficiently.</p>
        </div>
      );
}

export default Home;