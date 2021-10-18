import { useState } from 'react';
import { StyledDropZone } from 'react-drop-zone';
import { Link } from "react-router-dom";
import Select from "react-select";
import { Tabs } from 'antd';

import AddPinsModalWrapper from './AddPinsModal';

import './AddPost.css'

const { TabPane } = Tabs;

const NewPost = () => {
    const [addTagVar, setAddTagVar] = useState();
    const [searchValue, setSearchValue] = useState('');
    const [filesData, setFilesData] = useState([]);
    const [formData, setFormData] = useState('');
    const [singleCategory, setSingleCategory] = useState({});
    const [markersPosition, setMarkersPosition] = useState([]);
    const [targetImage, setTargetImage] = useState();

    const selectCategoryData = [
        { label: 'AAA', value: 'AAA' },
        { label: 'BBB', value: 'BBB' },
        { label: 'CCC', value: 'CCC' },
        { label: 'DDD', value: 'DDD' },
        { label: 'EEE', value: 'EEE' }
    ]

    const createCanvas = (multi) => {
        var canvas = document.getElementById(multi.class);
        var context = canvas.getContext("2d");

        var mapSprite = new Image();
        mapSprite.src = multi.image;


        var mouseClicked = function (mouse) {
            var rect = canvas.getBoundingClientRect();
            var mouseXPos = (mouse.x - rect.left);
            var mouseYPos = (mouse.y - rect.top);
            setAddTagVar(true);
            setMarkersPosition([mouseXPos, mouseYPos]);
            setTargetImage(multi.class)
        }

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
            context.fillStyle = "#000";
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.drawImage(mapSprite, 0, 0, 700, 700);

            for (var i = 0; i < multi.pin.length; i++) {
                var tempMarker = multi.pin[i];
                context.drawImage(tempMarker.Sprite, tempMarker.XPos, tempMarker.YPos, tempMarker.Width, tempMarker.Height);

                var a = document.createElement('a');
                var link = document.createTextNode(tempMarker.content.url);
                a.appendChild(link);
                a.title = tempMarker.content.url;
                a.href = tempMarker.content.url;
                var markerText = a;

                var textMeasurements = context.measureText(markerText);
                context.fillStyle = "#666";
                context.globalAlpha = 1.0;
                context.color = 'red'
                context.fillRect(tempMarker.XPos - (textMeasurements.width / 2), tempMarker.YPos - 15, textMeasurements.width, 20);
                context.globalAlpha = 1;

                context.fillStyle = "#000";
                context.fillText(markerText, tempMarker.XPos, tempMarker.YPos);
            }
        };

        setInterval(main, (1000 / 60));
    }

    const addFile = (files) => {
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
    }

    const removeFiles = (id) => {
        const a = [...filesData];
        let conf = window.confirm('Are you sure you want to remove this file?');
        if (conf === true) {
            a.splice(id, 1);
            setFilesData([...a])
        }
    }

    const closeModal = () => {
        setAddTagVar(false);
        setSearchValue('');
        setMarkersPosition([]);
    }

    const addTagFunction = () => {

        var Marker = function () {
            this.Sprite = new Image();
            this.Sprite.src = "http://www.clker.com/cliparts/w/O/e/P/x/i/map-marker-hi.png"
            this.Width = 12;
            this.Height = 20;
            this.XPos = markersPosition[0] - (this.Width / 2);
            this.YPos = markersPosition[1] - this.Height;
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
            <div className="topPortion">
                <div className="headerTitle">esther's</div>
                <div style={{ display: 'flex' }}>
                    <div className="barsIcon"><span className="fa fa-bars"></span></div>
                    <button className="addPostBtn">Create Posts</button>
                </div>
            </div>
            <div className="tabsContent">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Create posts" key="1">
                        <div className="bottomPortion">
                            <div className="formsContent">
                                <div className="textContent">
                                    <div>
                                        <input name="title"
                                            placeholder="Title of your post ..."
                                            autoComplete="off"
                                            className="titleInput"
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            name="main_body"
                                            placeholder="Max 150 characters describing your post ..."
                                            autoComplete="off"
                                            maxLength="150"
                                            className="textAreaInput" />
                                    </div>
                                </div>
                                <div style={{ width: '30%' }}>
                                    <Select
                                        name="categoryValue"
                                        value={selectCategoryData && selectCategoryData.filter(function (selectCategoryData) {
                                            return selectCategoryData.value.toString() === formData.toString();
                                        })}
                                        placeholder="Select Category"
                                        onChange={(e) => setFormData(e.value)}
                                        options={selectCategoryData}
                                    />
                                </div>
                            </div>
                            <div>
                                <StyledDropZone
                                    id="fileuploadModal"
                                    multiple={true}
                                    onDrop={addFile} >
                                    <div className="insideDropZone">
                                        <div className="cameraIcon"><span className="fa fa-camera"></span></div>
                                        <div>
                                            <div className="uploadPhotoText">Upload your photos</div>
                                            <div className="limitPhotoText">Add up to 12 photos to your post.</div>
                                        </div>
                                    </div>
                                </StyledDropZone>
                                <div className="filePreviewPortion">
                                    {filesData.map((ff, i) => (
                                        <div key={i} className="filesBox">
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
            {addTagVar && <AddPinsModalWrapper
                addTagVar={addTagVar}
                addTagFunction={addTagFunction}
                searchValue={searchValue}
                singleCategory={singleCategory}
                setSingleCategory={setSingleCategory}
                setSearchValue={setSearchValue}
                closeModal={() => closeModal()}
            />}
        </div>
    )
}

export default NewPost;