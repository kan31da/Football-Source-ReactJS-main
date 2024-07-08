import { useParams } from "react-router-dom";

import Standing from "./Standing";

const StandingPage = () => {
    const { alias, type } = useParams();

    return (
        <div className='standing-page-section'>
            <Standing alias={alias} type={type} />
        </div>
    )
};

export default StandingPage;