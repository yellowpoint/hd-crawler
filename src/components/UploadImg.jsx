import React, { useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload, message } from 'antd';

import API from '@/lib/api';
import { baseImgURL, baseURL } from '@/lib/api/axios';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const UploadImg = ({ onChange, value, disabled, maxCount }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const defaultValue = value
    ? [
        {
          status: 'done',
          url: value,
        },
      ]
    : [];
  const [fileList, setFileList] = useState(defaultValue);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = (info) => {
    const { file, fileList: newFileList } = info;
    setFileList(newFileList);
    // onChange(newFileList);

    const { status } = file;
    if (status === 'done') {
      const res = info.file.response;
      if (res.code !== 0) {
        message.error(res.message);
        return;
      }
      const img = baseURL + res.data.url;
      console.log('img', img);
      onChange(img);
      message.success(`${info.file.name} file uploaded successfully.`);
    }

    if (status === 'removed') {
      onChange(undefined);
    }

    if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  return (
    <>
      <Upload
        action={baseURL + '/upload'}
        listType="picture-card"
        fileList={fileList}
        maxCount={maxCount}
        onPreview={handlePreview}
        onChange={handleChange}
        disabled={disabled}
        // beforeUpload={(file) => {
        //   const isLt = file.size / 1024 / 1024 < 2;
        //   if (!isLt) {
        //     message.error('Image must smaller than 2MB!');
        //   }
        //   return isLt || Upload.LIST_IGNORE;
        // }}
        accept=".png, .jpg, .jpeg, .webp"
        name="image"
        // beforeUpload={(file) => {
        //   return false;
        // }}
      >
        {fileList.length < maxCount && uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: 'none',
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
          // style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      )}
    </>
  );
};
export default UploadImg;
