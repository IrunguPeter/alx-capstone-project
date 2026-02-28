import { useState } from 'react';

//Function to show the build questions when New build is clicked
function Build () {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    return(
        <div>
            <h1>Answer some questions</h1>
        </div>
    );
    


};
  
export default Build;
  