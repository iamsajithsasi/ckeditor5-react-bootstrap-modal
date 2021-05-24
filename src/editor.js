import React, { Component } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { localUrl } from "./config";

class TextEditorImage extends Component {
  componentDidMount() {
    // $("#modal-container").modal({
    //   focus: false,
    // });
  }
  render() {
    // const { text, data, index, readOnly } = this.props;
    const custom_config = {
      extraPlugins: [MyCustomUploadAdapterPlugin],
      toolbar: {
        items: [
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "link",
          "bulletedList",
          "numberedList",
          "|",
          "alignment",
          "outdent",
          "indent",
          "|",
          "imageInsert",
          "insertTable",
          "blockQuote",
          "undo",
          "redo"
        ]
      },
      language: "en",
      image: {
        toolbar: [
          "imageTextAlternative",
          "imageStyle:full",
          "imageStyle:side",
          "imageStyle:alignLeft",
          "imageStyle:alignCenter",
          "imageStyle:alignRight",
          "resizeImage",
          "linkImage"
        ],
        styles: ["full", "side", "alignLeft", "alignCenter", "alignRight"]
      },
      table: {
        contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"]
      },
      licenseKey: ""
    };

    return (
      <CKEditor
        required
        editor={ClassicEditor}
        config={custom_config}
        data=""
        onChange={(event, editor) => {
          const typedData = editor.getData();
          console.log(typedData);
          // data(typedData, index);
        }}
        onReady={(editor) => {
          console.log("Editor is ready to use!", editor);
        }}
        onFocus={(event, editor) => {
          console.log(editor);
          // editor.focus();
          editor.editing.view.focus();
          // event.preventDefault();
        }}
        // disabled={readOnly ? true : false}
      />
    );
  }
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;

    // change "environment.BASE_URL" key and API path
    this.url = `${localUrl}image_upload`;

    // change "token" value with your token
    this.token = localStorage.getItem("token");
  }

  upload() {
    return new Promise(async (resolve, reject) => {
      this.loader.file.then((file) => {
        this._initRequest();
        this._initListeners(resolve, reject, file);
        this._sendRequest(file);
      });
    });
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());
    xhr.open("POST", this.url, true);

    // change "Authorization" header with your header
    xhr.setRequestHeader("Authorization", `Bearer ${this.token}`);

    xhr.responseType = "json";
  }

  _initListeners(resolve, reject, file) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = "Couldn't upload file:" + ` ${file.name}.`;

    xhr.addEventListener("error", () => reject(genericErrorText));
    xhr.addEventListener("abort", () => reject());

    xhr.addEventListener("load", () => {
      const response = xhr.response;
      console.log("imag res", response);

      if (response.status == 0) {
        return reject(
          response && response.message
            ? genericErrorText + "." + response.message
            : genericErrorText
        );
      }

      // change "response.data.fullPaths[0]" with image URL
      resolve({
        default: response?.data?.image_url ? response.data.image_url : null
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener("progress", (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  _sendRequest(file) {
    const data = new FormData();

    // change "attachments" key
    data.append("image_url", file);

    this.xhr.send(data);
  }
}

export default TextEditorImage;
