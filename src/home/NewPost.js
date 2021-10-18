import { useState } from 'react';
import { Modal } from 'antd';
import { StyledDropZone } from 'react-drop-zone';
import { Link } from "react-router-dom";
import Select from "react-select";
import { Tabs } from 'antd';

import 'react-drop-zone/dist/styles.css'
import './Home.css'

const { TabPane } = Tabs;

const NewPost = () => {
    const [addTagVar, setAddTagVar] = useState();
    const [categoryData, setCategoryData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [filesData, setFilesData] = useState([]);
    const [formValue, setFormData] = useState('');
    const [singleCategory, setSingleCategory] = useState({});
    const [markersPos, setMarkersPos] = useState([]);
    const [targetImage, setTargetImage] = useState();

    const dropDownData = [
        { label: 'AAA', value: 'AAA' },
        { label: 'BBB', value: 'BBB' },
        { label: 'CCC', value: 'CCC' },
        { label: 'DDD', value: 'DDD' },
        { label: 'EEE', value: 'EEE' }
    ]

    const createCanvas = (multi) => {
        var canvas = document.getElementById(multi.class);
        var context = canvas.getContext("2d");

        // Map sprite
        var mapSprite = new Image();
        mapSprite.src = multi.image;


        var mouseClicked = function (mouse) {

            var rect = canvas.getBoundingClientRect();
            var mouseXPos = (mouse.x - rect.left);
            var mouseYPos = (mouse.y - rect.top);
            setAddTagVar(true);
            setMarkersPos([mouseXPos, mouseYPos]);
            setTargetImage(multi.class)
        }

        // Add mouse click event listener to canvas
        canvas.addEventListener("mousedown", mouseClicked, false);

        var firstLoad = function () {
            context.font = "15px Georgia";
            context.textAlign = "center";
        }

        firstLoad();

        var main = function () {
            draw();
        };

        var draw = function () {
            // Clear Canvas
            context.fillStyle = "#000";
            context.fillRect(0, 0, canvas.width, canvas.height);

            // Draw map
            // Sprite, X location, Y location, Image width, Image height
            // You can leave the image height and width off, if you do it will draw the image at default size
            context.drawImage(mapSprite, 0, 0, 700, 700);

            // Draw markers

            for (var i = 0; i < multi.pin.length; i++) {
                var tempMarker = multi.pin[i];
                // Draw marker
                context.drawImage(tempMarker.Sprite, tempMarker.XPos, tempMarker.YPos, tempMarker.Width, tempMarker.Height);

                var a = document.createElement('a');
                var link = document.createTextNode(tempMarker.content.url);
                a.appendChild(link);
                a.title = tempMarker.content.url;
                a.href = tempMarker.content.url;
                // Calculate postion text
                var markerText = a;
                // var markerText = contentRender(tempMarker.content);

                // Draw a simple box so you can see the position
                var textMeasurements = context.measureText(markerText);
                context.fillStyle = "#666";
                context.globalAlpha = 1.0;
                context.color = 'red'
                context.fillRect(tempMarker.XPos - (textMeasurements.width / 2), tempMarker.YPos - 15, textMeasurements.width, 20);
                context.globalAlpha = 1;

                // Draw position above
                context.fillStyle = "#000";
                context.fillText(markerText, tempMarker.XPos, tempMarker.YPos);
            }
        };

        setInterval(main, (1000 / 60));
    }

    const addFile = (files, text) => {
        let multiple = URL.createObjectURL(files[0]);
        let x = [...filesData]
        if (x.length <= 12) {
            let obj = { image: multiple, class: `imageCanvas${x.length}`, pin: [] }
            x.push(obj)
            setFilesData(x)
            setTimeout(() => {
                createCanvas(obj)
            }, 200);
        }
    };

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

    const removeFiles = (id) => {
        const a = [...filesData];
        let conf = window.confirm('Are you sure you want to remove this file?');
        if (conf === true) {
            a.splice(id, 1);
            setFilesData([...a])
        }
    }

    const callback = (key) => {
        console.log(key);
    }

    const closeModal = () => {
        setAddTagVar(false);
        setCategoryData([]);
        setSearchValue('');
        setMarkersPos([]);
    }

    const addTagFun = () => {

        var Marker = function () {
            this.Sprite = new Image();
            this.Sprite.src = "http://www.clker.com/cliparts/w/O/e/P/x/i/map-marker-hi.png"
            this.Width = 12;
            this.Height = 20;
            this.XPos = markersPos[0] - (this.Width / 2);
            this.YPos = markersPos[1] - this.Height;
            this.content = singleCategory;
        }
        let tempArr = [...filesData];
        let ind = tempArr.findIndex(x => x.class === targetImage);
        if (ind !== -1) {
            tempArr[ind].pin.push(new Marker());
            setFilesData(tempArr);
        }
        closeModal();
    }

    return (
        <div className="mainBox">
            <div className="firstDiv">
                <div className="headerTitle">esther's</div>
                <div style={{ display: 'flex' }}>
                    <div className="barsIconStyle"><span className="fa fa-bars"></span></div>
                    <button className="addPostBtn">Create Posts</button>
                </div>
            </div>
            <div className="tabsDiv">
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="Create posts" key="1">
                        <div className="secondDiv">
                            <div className="formsDiv">
                                <div className="textDiv">
                                    <div>
                                        <input name="title"
                                            placeholder="Title of your post ..."
                                            autoComplete="off"
                                            className="titleInputStyle"
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            name="main_body"
                                            placeholder="Max 150 characters describing your post ..."
                                            autoComplete="off"
                                            maxLength="150"
                                            className="textAreaStyle" />
                                    </div>
                                </div>
                                <div style={{ width: '30%' }}>
                                    <Select
                                        name="categoryValue"
                                        value={dropDownData && dropDownData.filter(function (dropDownData) {
                                            return dropDownData.value.toString() === formValue.toString();
                                        })}
                                        placeholder="Select Category"
                                        onChange={(e) => setFormData(e.value)}
                                        options={dropDownData}
                                    />
                                </div>
                            </div>
                            <div>
                                <StyledDropZone
                                    id="fileuploadModal"
                                    multiple={true}
                                    onDrop={addFile} >
                                    <div className="insideDropZone">
                                        <div className="cemeraIconStyle"><span className="fa fa-camera"></span></div>
                                        <div>
                                            <div className="uploadPhtText">Upload your photos</div>
                                            <div className="limitText">Add up to 12 photos to your post.</div>
                                        </div>
                                    </div>
                                </StyledDropZone>
                                <div className="filePreviewPortion">
                                    {filesData.map((ff, i) => (
                                        <div key={i} className="filesBox">
                                            {/* <img src={ff} alt="filePreview" className="imageDiv" onClick={() => setAddTagVar(!addTagVar)} /> */}
                                            <canvas id={ff.class} width="700" height="700"></canvas>
                                            <div className="fa fa-times-circle closeIconStyle" style={{ fontSize: '40px' }} onClick={() => removeFiles(i)}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="footerBtn">
                                <Link to='/'>
                                    <button className="savedraftBtn">Save Draft</button>
                                </Link>
                                <Link to='/'>
                                    <button className="publishBtn">Publish</button>
                                </Link>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="Create guide" key="2">
                        Content of Create Guid
                </TabPane>
                </Tabs>
            </div>
            <Modal
                title="Add Tags"
                visible={addTagVar}
                onOk={addTagFun}
                onCancel={closeModal}
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
                            className="inputStyle"
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
        </div>
    )
}

export default NewPost;