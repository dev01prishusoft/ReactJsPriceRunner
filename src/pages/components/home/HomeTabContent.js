import postList from './PostList.json';

import './Home.css'

const TabContent = () => {

    return (
        <div className="homeBottomPortion">
            {postList.map(p => (
                <div className="productBox" key={p.id}>
                    <img src={p.imageURL} alt="productImage" height="400" width="300" />
                </div>
            ))}
        </div>
    )
}

export default TabContent;