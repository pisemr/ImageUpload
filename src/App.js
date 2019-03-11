import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import './App.css';

const CLOUDINARY_UPLOAD_PRESET = 'hksmxwqk';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/madhurapi/image/upload';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFile: null,
      uploadedFileCloudinaryUrl: ''
    };
  }

  onImageDrop(files) {
    this.setState({
      uploadedFile: files[0]
    });
    console.log("chekcing what we get here");
    this.handleImageUpload(files[0]);
  }

  handleImageUpload(file) {
    console.log("tests", CLOUDINARY_UPLOAD_URL);
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
                     .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                     .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error("checkinf error",err);
      }

      if (response.body.secure_url !== '') {
        console.log("RESPONSE", response);
        this.setState({
          uploadedFileCloudinaryUrl: response.body.secure_url
        });
      }
    });
  }

  render() {
    console.log("check",this.state.uploadedFileCloudinaryUrl);
    return (
      <div><h2>Image Feed</h2>
      <form className="FormName">
        <div className="FileUpload">
        <Dropzone
        onDrop={this.onImageDrop.bind(this)}
        accept="image/*"
        multiple={false}>
          {({getRootProps, getInputProps}) => {
          return (
            <div
              {...getRootProps()}
              >
              <input {...getInputProps()} />
              {
                <p>Try dropping some files here, or click to select files to upload.</p>
              }
              </div>
            )
          }}
</Dropzone>
        </div>
        <div>
        <input type="text" placeholder="Enter Title" className="c2"/>
        <button className="button">New Post</button>
        </div>
        <div>
          {this.state.uploadedFileCloudinaryUrl === '' ? null :
          <div>
            <p>{this.state.uploadedFile.name}</p>
            <img src={this.state.uploadedFileCloudinaryUrl} />
          </div>}
        </div>
      </form>
      </div>
    )
  }
}
