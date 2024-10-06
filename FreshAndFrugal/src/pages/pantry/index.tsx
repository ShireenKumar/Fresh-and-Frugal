import * as React from 'react';
import PantryPage from '../../components/PantryPage.jsx';

interface IPantryProps {

}
const Pantry: React.FunctionComponent<IPantryProps> = (props) =>{
    return (
        <div className="p-4">
          <h1>My Pantry</h1>
          <PantryPage />
        </div>
      );
}

export default Pantry;