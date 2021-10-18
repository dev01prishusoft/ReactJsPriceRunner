import { useState } from 'react';
import { Modal } from 'antd';

import './AddPinsModal.css';

const AddTagsModalWrapper = (props) => {
    const [categoryData, setCategoryData] = useState([]);

    const clickToSearchValue = () => {
        const requestOption = {
            method: "GET",
            headers: new Headers({
                "content-type": "application/json;charset=utf-8",
                tokenId: "5bb06ac3-9067-4ad6-b11d-965d8265e987"
            }),
        };
        fetch(`/api/public/v0/product/search/SE?q=${searchValue}&size=12`, requestOption)
            .then(response => response.json())
            .then(response => {
                setCategoryData(response.searchProducts)

            })
            .catch(err => {
                console.error(err);
            });
    }

    const { addTagVar, addTagFunction, closeModal, searchValue, setSearchValue, singleCategory, setSingleCategory } = props;
    return (
        <Modal
            title="Add Tags"
            visible={addTagVar}
            onOk={addTagFunction}
            onCancel={() => { closeModal(); setCategoryData([]); }}
            okText="Add Tag"
            cancelText="Cancle"
            centered={true}
        >
            <div className="modalBody">
                <div className="modalSearchDiv">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchValue ? searchValue : ''}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="searchInput"
                    />
                    <button className="addTagBtn" onClick={clickToSearchValue}>Search</button>
                </div>
                <div className="productDataRender">
                    {categoryData.map(cat => (
                        <div key={cat.id} className={singleCategory?.id === cat.id ? 'singleProduct selectedCategory' : 'singleProduct'} onClick={() => setSingleCategory(cat)}>
                            <div>{cat.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    )
}

export default AddTagsModalWrapper;